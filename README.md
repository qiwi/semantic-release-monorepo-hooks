# semantic-release-monorepo-hooks
Workaround to force `semantic-release-monorepo` multipublishing.

## Problem
1) `semantic-release` does not support `lerna`-based repos aka `monorepos`
2) `semantic-release-monorepo` can not release several packages at once: after the first sub-release it appends a new git version tag, so any next run finds no changes.
```bash
[Semantic release]: Found 0 commits for package *** since last release
``` 

## Install
```bash
  npm i -D semantic-release
  npm i -D semantic-release-monorepo
  npm i -D semantic-release-monorepo-hooks
```

## Configure .releaserc.js
```javascript
  const hooks = require('semantic-release-monorepo-hooks')
  const output = hooks()
  
  const publish = output.isLastRun
    ? [
      '@semantic-release/github',
      '@semantic-release/npm'
    ]
    : [
      '@semantic-release/npm'
    ]
  
  module.exports = {
    branch: 'master',
    tagFormat: 'v${version}',
    prepare: [
      '@semantic-release/changelog',
      '@semantic-release/npm',
      '@semantic-release/git'
    ],
    publish: publish,
    verifyConditions: ['@semantic-release/npm', '@semantic-release/github'],
    /* verifyRelease: ['@semantic-release/npm', '@semantic-release/github']
      .map(require)
      .map(x => x.verifyConditions), */
  };
```

## Configure .travis.yml
```yaml

deploy:
  provider: script
  skip_cleanup: true
  script:
    - yarn lerna exec --concurrency 1 "npx --no-install semantic-release -e semantic-release-monorepo"
```

