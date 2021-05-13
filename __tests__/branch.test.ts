import * as path from 'path';
import {
  changeDir,
  resetDir,
  clearMessage,
  createRepo, logMessage
} from '@gitsync/test';
import Sync, {SyncOptions} from "..";
import {Git} from "git-cli-wrapper";

const sync = async (source: Git, options: SyncOptions, instance: Sync = null) => {
  changeDir(source);
  const sync = instance || new Sync();
  options.yes = true;
  await sync.sync(options);
  resetDir();
};

describe('branch', () => {
  afterEach(() => {
    clearMessage();
  });

  test('Prioritize sync from existing branch', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    const target = await createRepo();
    const targetDir = path.resolve(target.dir);
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
    });

    await source.commitFile('test2.txt');
    await source.run(['checkout', '-b', 'develop']);

    // "develop" is the first found branch
    // but both contain the "master" branch
    // so sync from the "master" branch

    const result = await source.log(['--format=%D', '-1', 'HEAD']);
    expect(result).toBe('HEAD -> develop, master');

    const result2 = await target.log(['--format=%D', '-1', 'HEAD']);
    expect(result2).toBe('HEAD -> master');

    clearMessage();
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
    });

    const message = logMessage();
    expect(message).toContain('Sync target from branch: master');
    expect(message).not.toContain('Sync target from branch: develop');
  });

  test('Sync new repo will use first found branch', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    await source.run(['checkout', '-b', 'develop']);

    const target = await createRepo();
    const targetDir = path.resolve(target.dir);
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
    });

    const message = logMessage();
    expect(message).toContain('Sync target from branch: develop');
  });

  test('skipEvenBranch', async () => {
    const source = await createRepo();
    await source.commitFile('test.txt');

    const target = await createRepo();
    const targetDir = path.resolve(target.dir);
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
    });

    await source.run(['checkout', '-b', 'develop']);

    clearMessage();
    await sync(source, {
      target: targetDir,
      sourceDir: '.',
      skipEvenBranch: true,
    });

    expect(await target.run(['branch', '-l'])).not.toContain('develop');

    expect(logMessage()).toContain('Skip creating branch "develop", which is even with: master');
  });
});
