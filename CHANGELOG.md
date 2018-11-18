# [2.7.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.6.2...v2.7.0) (2018-11-18)


### Features

* add cmd runner ([b6ac16c](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/b6ac16c))
* add release config reader ([027e6e6](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/027e6e6))
* provide optional post-release command execution ([c8bc4fb](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/c8bc4fb))

## [2.6.2](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.6.1...v2.6.2) (2018-10-29)


### Performance Improvements

* fetch release notes from commit message instead of tag body ([da635a5](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/da635a5)), closes [#4](https://github.com/qiwi/semantic-release-monorepo-hooks/issues/4)

## [2.6.1](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.6.0...v2.6.1) (2018-09-09)


### Bug Fixes

* correct release header formatting & up dev deps ([4261773](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/4261773))

# [2.6.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.5.1...v2.6.0) (2018-08-31)


### Bug Fixes

* **test:** skip flanking test ([cd19a86](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/cd19a86))


### Features

* reformat github release comment ([6c79a77](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/6c79a77))

## [2.5.1](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.5.0...v2.5.1) (2018-08-26)


### Bug Fixes

* **sh:** quotes escaping ([13a52b9](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/13a52b9))

# [2.5.0](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.4.3...v2.5.0) (2018-08-26)


### Features

* **hookAfterAll:** add github release creation substep ([4554f5a](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/4554f5a))

## [2.4.3](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.4.2...v2.4.3) (2018-08-26)


### Bug Fixes

* **git:** add quotes to passed args ([9ed53c9](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/9ed53c9))

## [2.4.2](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.4.1...v2.4.2) (2018-08-26)


### Bug Fixes

* **sh:** add quotes for git tag message arg ([1da5121](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/1da5121))

## [2.4.1](https://github.com/qiwi/semantic-release-monorepo-hooks/compare/v2.4.0...v2.4.1) (2018-08-26)


### Bug Fixes

* handle extended `drop tag` sh response ([601fe59](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/601fe59))
* **sh:** fix subscript invocation path ([c4cb425](https://github.com/qiwi/semantic-release-monorepo-hooks/commit/c4cb425))

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
