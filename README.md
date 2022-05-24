# semantic-release-monorepo-hooks
Workaround to handle `semantic-release-monorepo` multipublishing

[![CI](https://github.com/qiwi/semantic-release-monorepo-hooks/workflows/CI/badge.svg)](https://github.com/qiwi/semantic-release-monorepo-hooks/actions)
[![npm (tag)](https://img.shields.io/npm/v/semantic-release-monorepo-hooks/latest.svg)](https://www.npmjs.com/package/semantic-release-monorepo-hooks)
[![Maintainability](https://api.codeclimate.com/v1/badges/74c25847a6bffa1223a4/maintainability)](https://codeclimate.com/github/qiwi/semantic-release-monorepo-hooks/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/74c25847a6bffa1223a4/test_coverage)](https://codeclimate.com/github/qiwi/semantic-release-monorepo-hooks/test_coverage)

## Migration proposal
This project provided invaluable experience in understanding how **lerna** and **semantic-release** work.
Along with this came the realization that approach of combining needed to be changed.
I wrote [a short note](https://dev.to/antongolub/the-chronicles-of-semantic-release-and-monorepos-5cfc) on the evolution of these ideas.
In my opinion, the best solution today is [multi-semantic-release](https://github.com/dhoulb/multi-semantic-release):
* Much more robust and predictable.
* Simple and maintainable.
* Compatible with the latest versions of **semrel** and its plugins.
* Supports parallel release flow (faster).
* Brings an automatic update of cross-packages dependencies.
* Project is used and supported as part of QIWI in-house development infrastructure (not sure if this is a positive point :-).

Thank you all for your feedback, PRs, downloads and stars.

## Problem
1) [semantic-release](https://github.com/semantic-release/semantic-release) does not support `lerna`-based repos aka `monorepos` out of box.
2) [semantic-release-monorepo](https://github.com/Updater/semantic-release-monorepo) can not release several packages at once: after the first sub-release it appends a new git version tag, so any next run finds no changes.
```bash
[Semantic release]: Found 0 commits for package *** since last release
``` 

## Install
```bash
  npm i -D semantic-release
  npm i -D semantic-release-monorepo
  npm i -D semantic-release-monorepo-hooks
```

and plugins:
```json
{
  "devDependencies": {
    "@semantic-release/changelog": "^3.0.1",
    "@semantic-release/commit-analyzer": "^6.1.0",
    "@semantic-release/git": "7.0.5",
    "@semantic-release/github": "5.2.1",
    "@semantic-release/npm": "5.0.5",
    "@semantic-release/release-notes-generator": "7.1.2",
    "lerna": "^3.4.3",
    "semantic-release": "15.10.6",
    "semantic-release-monorepo": "6.1.1",
    "semantic-release-monorepo-hooks": "2.6.2",
    "semantic-release-plugin-decorators": "^2.0.0"
  }
}
```

## Configure
##### 1. Configure `.releaserc.js`
```javascript
  const hooks = require('semantic-release-monorepo-hooks')
  const output = hooks()
  
  module.exports = {
    branch: 'master',
    tagFormat: 'v${version}',
    prepare: [
      '@semantic-release/changelog',
      '@semantic-release/npm',
      {
        'path': '@semantic-release/git',
        'message': 'chore(' + output.package + '): release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    publish: [
      '@semantic-release/npm'
    ],
    verifyConditions: [
      '@semantic-release/npm',
      '@semantic-release/git'
    ],
    monorepo: {
      analyzeCommits: [
        '@semantic-release/commit-analyzer'
      ],
      generateNotes: [
        '@semantic-release/release-notes-generator'
      ]
    }
  };
```

##### 2. Configure `.travis.yml`
```yaml
deploy:
  provider: script
  skip_cleanup: true
  script:
    - yarn lerna exec --concurrency 1 "npx --no-install semantic-release -e semantic-release-monorepo" && node -e "require('semantic-release-monorepo-hooks').hookAfterAll()"
```

##### 3. Configure `env` vars
`GH_TOKEN` and `GH_USER` must be declared for `git push`. See [drop_last_tag.sh](./src/drop_last_tag.sh) for details.

## hooks()
Hooks reverts some effects of previous `semantic-release` run and returns info map as a result:
```javascript
  {
    isModified: true,
    isLastModified: false,
    isLastRun: false,
    total: 5,
    processed: 1,
    modified: 2,
    modifiedPacks: [ '@qiwi/pijma-core', '@qiwi/pijma-desktop' ],
    package: '@qiwi/pijma-core',
    tag: 'v1.5.0\n',
    run: 1
  }
```

## Alternatives

Take a look at [multi-semantic-release](https://github.com/dhoulb/multi-semantic-release). With [`--execasync`](https://github.com/dhoulb/multi-semantic-release/pull/2) flag it produces the same effect but in a different way.
