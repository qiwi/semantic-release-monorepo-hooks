const reqlib = require('app-root-path').require
const readPkg = require('read-pkg').sync
const releaserc = (() => {
  try {
    return reqlib('/.releaserc')
  } catch (e) {
    return readPkg().release
  }
})()

module.exports = releaserc
