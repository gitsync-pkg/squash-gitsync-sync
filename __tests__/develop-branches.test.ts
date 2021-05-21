import * as path from 'path';
import {
  changeDir,
  resetDir,
  clearMessage,
  createRepo, catchError
} from '@gitsync/test';
import Sync, {SyncOptions} from "..";
import git, {Git} from "git-cli-wrapper";
import log from '@gitsync/log';
import * as tmp from "tmp-promise";

const sync = async (source: Git, options: SyncOptions, instance: Sync = null) => {
  changeDir(source);
  const sync = instance || new Sync();
  options.yes = true;
  await sync.sync(options);
  resetDir();
};

async function cloneRepo(dir: string) {
  const repo = git((await tmp.dir()).path);
  await repo.run(['clone', dir, '.']);
  return repo;
}

describe('develop branches option', () => {
  afterEach(() => {
    clearMessage();
  });

  test('basic', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    await source.run(['checkout', '-b', 'develop']);
    await source.commitFile('test2.txt');

    const target = await createRepo();
    const targetDir = path.resolve(target.dir);
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
      developBranches: ['develop'],
    });
    expect(await target.run(['log', '-n', '1', 'develop'])).toContain('add test2.txt');

    // Remove the last commit
    await source.run(['reset', '--hard', 'HEAD~1']);

    await sync(source, {
      target: targetDir,
      sourceDir: '.',
      developBranches: ['develop'],
    });

    // Re-sync without the last commit
    expect(await target.run(['log', '-n', '1', 'develop'])).toContain('add test.txt');
  });

  test('micromatch', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    await source.run(['checkout', '-b', 'develop']);
    await source.commitFile('test2.txt');

    const target = await createRepo();
    const targetDir = path.resolve(target.dir);
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
      developBranches: ['develop/**'],
    });
    expect(await target.run(['log', '-n', '1', 'develop'])).toContain('add test2.txt');

    // Remove the last commit
    await source.run(['reset', '--hard', 'HEAD~1']);

    await sync(source, {
      target: targetDir,
      sourceDir: '.',
      developBranches: ['develop/**'],
    });

    // Re-sync without the last commit
    expect(await target.run(['log', '-n', '1', 'develop'])).toContain('add test.txt');
  });

  test('branch is checked out error', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    const target = await createRepo();
    const targetDir = path.resolve(target.dir);

    const error = await catchError(async () => {
      await sync(source, {
        target: targetDir,
        sourceDir: '.',
        developBranches: ['master'],
      });
    });

    expect(error).toEqual(new Error('Cannot delete develop branch "master" checked out in target repository.'));
  });

  test('branch will be add back', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    await source.run(['checkout', '-b', 'develop']);
    await source.commitFile('test2.txt');

    const target = await createRepo();
    const targetDir = path.resolve(target.dir);
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
      developBranches: ['develop'],
    });

    await source.run(['checkout', 'master']);
    await source.commitFile('test3.txt');
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
      developBranches: ['develop'],
    });

    expect(await target.run(['branch'])).toContain('develop');
  });

  test('old commit should not lost', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    await source.run(['checkout', '-b', 'develop']);
    await source.commitFile('test2.txt');

    const target = await createRepo();
    await sync(source, {
      target: target.dir,
      sourceDir: '.',
      developBranches: ['develop'],
    });

    // Push target to remote
    const targetBare = await createRepo(true);
    await target.run(['remote', 'add', 'origin', targetBare.dir]);
    await target.run(['push', 'origin', '--all']);

    // Sync new commit to new cloned target
    await source.commitFile('test3.txt');
    const target2 = await cloneRepo(targetBare.dir);
    await sync(source, {
      target: target2.dir,
      sourceDir: '.',
      developBranches: ['develop'],
    });

    // Old commit should not lost
    const log = await target2.run(['log', '--all']);
    expect(log).toContain('add test2.txt');
  });

  test('ignore target develop branch logs', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');
    const defaultBranch = await source.getBranch();

    await source.run(['checkout', '-b', 'develop']);
    await source.commitFile('test2.txt');

    const target = await createRepo();
    await sync(source, {
      target: target.dir,
      sourceDir: '.',
      developBranches: ['develop'],
    });

    // Push target to remote
    const targetBare = await createRepo(true);
    await target.run(['remote', 'add', 'origin', targetBare.dir]);
    await target.run(['push', 'origin', '--all']);

    // Simulate the release process:

    // 1. Rebase to the main branch
    await source.run(['rebase', 'develop', defaultBranch]);

    // 2. Commit a new record
    await source.commitFile('release.txt');

    // 3. Delete the develop branch
    // IMPORTANT: Target contains develop branch, while source does not contain develop branch
    await source.run(['branch', '-d', 'develop']);

    // 4. Sync to remote
    const target2 = await cloneRepo(targetBare.dir);

    await sync(source, {
      target: target2.dir,
      sourceDir: '.',
      developBranches: ['develop'],
    });

    const branches = await target2.run(['branch', '-a', '--merged', 'master']);
    expect(branches).toContain('origin/develop');
  });
});
