# [2.4.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.3.0...v2.4.0) (2018-08-25)


### Features

* expose `postrelease` script to restore reverted tags (releases) as single highest ([94ce8b0](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/94ce8b0))

# [2.3.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.2.0...v2.3.0) (2018-08-14)


### Features

* add `protectTemp` option ([6bba734](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/6bba734))

# [2.2.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.1.1...v2.2.0) (2018-08-06)


### Features

* attach reverted tag message to temp data ([8b33ba2](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/8b33ba2))

## [2.1.1](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.1.0...v2.1.1) (2018-07-24)


### Bug Fixes

* **get_modified_packs:** should run from any dir ([163186c](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/163186c))

# [2.1.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.0.0...v2.1.0) (2018-07-24)


### Features

* add `isModified` field to result ([5542f1f](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/5542f1f))

# [2.0.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.1.6...v2.0.0) (2018-07-24)


### Features

* use package name instead of change index ([820968d](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/820968d))


### BREAKING CHANGES

* `isLastChanged` → `isLastModified`

## [1.1.6](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.1.5...v1.1.6) (2018-07-22)


### Bug Fixes

* handle `total equal changed` case ([230837e](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/230837e))

## [1.1.5](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.1.4...v1.1.5) (2018-07-18)


### Bug Fixes

* the last tag must be annotated ([806a70e](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/806a70e))

## [1.1.4](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.1.3...v1.1.4) (2018-07-17)


### Bug Fixes

* the last tag may optionally be not annotated ([a352183](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/a352183))

## [1.1.3](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.1.2...v1.1.3) (2018-07-16)


### Bug Fixes

* hold entire iterator state ([c6f6427](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/c6f6427)), closes [#1](https://github.com/qiwi/semantic-release-monorepo-hooks/issues/1)

## [1.1.2](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.1.1...v1.1.2) (2018-07-16)


### Performance Improvements

* tune up handler ([2a55cf4](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/2a55cf4))

## [1.1.1](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.1.0...v1.1.1) (2018-07-16)


### Bug Fixes

* define entry point ([cbd4758](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/cbd4758))

# [1.1.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v1.0.0...v1.1.0) (2018-07-15)


### Features

* add `dry-run` mode ([b2b0b84](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/b2b0b84))

# 1.0.0 (2018-07-15)


### Features

* support custom git username through env vars ([6812bd0](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/6812bd0))
* working draft ([03fd318](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/03fd318))
