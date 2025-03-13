## [0.6.11](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.10...@gitsync/sync@0.6.11) (2025-02-28)


### Features

* **sync:** add option to disable filtering for target repository ([47b099b](https://github.com/twinh/gitsync/commit/47b099bbd1d58d0a34ad2a2f0f63d5642694e6ad))

## [0.6.10](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.9...@gitsync/sync@0.6.10) (2022-07-01)


### Features

* support custom remote name (not "origin") ([73aa6d8](https://github.com/twinh/gitsync/commit/73aa6d8d453d579940eac070f87d748e55770898))

## [0.6.9](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.8...@gitsync/sync@0.6.9) (2021-09-17)





### Dependencies

* **@gitsync/config:** upgrade from `0.6.4` to `0.6.5`
* **git-cli-wrapper:** upgrade from `0.3.2` to `0.3.3`
* **@gitsync/test:** upgrade from `0.5.1` to `0.5.2`

## [0.6.8](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.7...@gitsync/sync@0.6.8) (2021-05-21)


### Bug Fixes

* **sync:** ignore target develop branch logs ([2adcf3c](https://github.com/twinh/gitsync/commit/2adcf3ce256274fff16fa1d4f04ddc28df5dded3))


### Features

* log warning message when source repository does not contain repository ([fbff9d3](https://github.com/twinh/gitsync/commit/fbff9d37796e28caa87ce4cb45077edd27c77bc5))

## [0.6.7](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.6...@gitsync/sync@0.6.7) (2021-05-13)


### Features

* add `skipEvenBranch` option, which is use to not create new branch that have no commits ([4e9974b](https://github.com/twinh/gitsync/commit/4e9974bde695e3d70d6c433d936378f495039730))





### Dependencies

* **@gitsync/config:** upgrade from `0.6.3` to `0.6.4`

## [0.6.6](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.5...@gitsync/sync@0.6.6) (2021-03-29)


### Bug Fixes

* **develop-branches:** ignore history in origin branches to avoid old commit lost ([0a255a1](https://github.com/twinh/gitsync/commit/0a255a1bf10c284bdd1bda2f4581617f6b192e19))





### Dependencies

* **@gitsync/config:** upgrade from `0.6.2` to `0.6.3`
* **@gitsync/test:** upgrade from `0.5.0` to `0.5.1`

## [0.6.5](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.4...@gitsync/sync@0.6.5) (2021-03-25)


### Features

* add `developBranches` option, specify the name of the branch, matching the given glob, to be deleted and resynchronized ([fe3ab0e](https://github.com/twinh/gitsync/commit/fe3ab0ef971ed1f28c103d78bb21b1f16fec0eb3))





### Dependencies

* **@gitsync/config:** upgrade from 0.6.1 to 0.6.2

## [0.6.4](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.3...@gitsync/sync@0.6.4) (2021-03-24)


### Bug Fixes

* **sync:** update branch should ignore non-existent branch ([478ff46](https://github.com/twinh/gitsync/commit/478ff46821b656c1d736438923b84c69c39a4c51))

## [0.6.3](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.2...@gitsync/sync@0.6.3) (2021-03-23)


### Bug Fixes

* **sync:** Checkout remote branch at remote hash, instead of HEAD(master) ([47a35e7](https://github.com/twinh/gitsync/commit/47a35e783e83e0aa5588f2a9aca0de1c94fdfb5d))

## [0.6.2](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.1...@gitsync/sync@0.6.2) (2020-08-08)


### Bug Fixes

* sync fail when dir's last commit contains tag but not repo HEAD ([d2733cb](https://github.com/twinh/gitsync/commit/d2733cb03397cf04b8275f80593dd7b47c63fff9))

## [0.6.1](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.6.0...@gitsync/sync@0.6.1) (2020-08-06)





### Dependencies

* **@gitsync/config:** upgrade from 0.6.0 to 0.6.1

# [0.6.0](https://github.com/twinh/gitsync/compare/@gitsync/sync@0.5.1...@gitsync/sync@0.6.0) (2020-07-21)


### Bug Fixes

* add default value for plugin config ([61a1c99](https://github.com/twinh/gitsync/commit/61a1c99e5ef45776539b77c4922389a44338b89b))


### Features

* add plugin system ([cfab810](https://github.com/twinh/gitsync/commit/cfab8106437e6f6df4c80d9664c91decd6d89211))





### Dependencies

* **@gitsync/config:** upgrade from 0.5.0 to 0.6.0
