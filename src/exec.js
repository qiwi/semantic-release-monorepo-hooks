const log = require('./log')
const cp = require('child_process')

module.exports = {
  run(cmd) {
    try {
      return cp.execSync('' + cmd).toString().trim()

    } catch (err) {
      log('execution failed')
      log('cmd=', cmd)
      log('err=', err)
    }
  }
}
