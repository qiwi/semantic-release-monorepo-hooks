# semantic-release-monorepo-hooks
Workaround to force `semantic-release-monorepo` multipublishing.

## Problem
1) `semantic-release` does not support `lerna`-based repos aka `monorepos` out of box.
2) `semantic-release-monorepo` can not release several packages at once: after the first sub-release it appends a new git version tag, so any next run finds no changes.
```bash
[Semantic release]: Found 0 commits for package *** since last release
``` 

## Install
```bash
  npm i -D semantic-release@15.6.3
  npm i -D semantic-release-monorepo
  npm i -D semantic-release-monorepo-hooks
```
##### Note
It's necessary to lock version due to incompatibility issue of `semantic-release-plugin-decorators`: it looks to be broken on the latest `semantic-release`.
```bash
[Semantic release]: An error occurred while running semantic-release: { TypeError: Expected `moduleId` to be of type `string`, got `object`
 at resolveFrom (/home/travis/build/qiwi/travis-toolkit/node_modules/resolve-from/index.js:11:9)
 at module.exports (/home/travis/build/qiwi/travis-toolkit/node_modules/resolve-from/index.js:34:41)
 at module.exports (/home/travis/build/qiwi/travis-toolkit/node_modules/import-from/index.js:4:49)
 at requirePlugin (/home/travis/build/qiwi/travis-toolkit/node_modules/semantic-release-plugin-decorators/src/index.js:4:33)
 at resolvePluginFn (/home/travis/build/qiwi/travis-toolkit/node_modules/semantic-release-plugin-decorators/src/index.js:18:18)
```

## Configure
##### 1. Configure `.releaserc.js`
```javascript
  const hooks = require('semantic-release-monorepo-hooks')
  const output = hooks()
  
  const publish = output.isLastModified
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

##### 2. Configure `.travis.yml`
```yaml
deploy:
  provider: script
  skip_cleanup: true
  script
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