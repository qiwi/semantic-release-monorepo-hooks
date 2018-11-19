const log = require('./log')
const cp = require('child_process')

module.exports = {
  run(cmd) {
    log('cmd=', cmd)

    try {
      const res = cp.execSync('' + cmd).toString().trim()
      log('res=', res)
      return res
    } catch (err) {
      log('execution failed')
      log('err=', err)
    }
  }
}
