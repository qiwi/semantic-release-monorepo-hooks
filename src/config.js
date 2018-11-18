const reqlib = require('app-root-path').require
const readPkg = require('read-pkg').sync
const log = require('./log')
const releaserc = (() => {
  try {
    return reqlib('/.releaserc.js')
  } catch (e) {
    log('`.releaserc.js` is not found, so `package.json#release` is used instead')
    return readPkg().release
  }
})()

module.exports = releaserc
