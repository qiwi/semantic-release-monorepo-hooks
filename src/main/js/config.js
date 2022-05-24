const path = require('path')
const { gitRootSync } = require('@antongolub/git-root')
const log = require('./log')

const ROOT = path.resolve(gitRootSync())
const RELEASERC = '.releaserc.js'
const PACKAGEJSON = 'package.json'

const releaserc = (() => {
  const releasercPath = path.resolve(ROOT, RELEASERC)
  const packageJsonPath = path.resolve(ROOT, PACKAGEJSON)

  try {
    return require(releasercPath)
  } catch (err) {
    log(`'${RELEASERC}' is not found, so '${PACKAGEJSON}#release' will be used instead`)
    log('err=', err)

    const pkg = require(packageJsonPath)

    return pkg.release || pkg
  }
})()

module.exports = releaserc
