const reqlib = require('app-root-path').require
const log = require('./log')
const releaserc = (() => {
  try {
    return reqlib('/.releaserc.js')

  } catch (err) {
    log('`.releaserc.js` is not found, so `package.json#release` is used instead')
    log('err=', err)

    const pkg = reqlib('/package.json')

    return pkg.release || pkg
  }
})()

module.exports = releaserc
