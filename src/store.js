const fs = require('fs')
const sh = require('./sh')
const {TEMP} = require('./path')

module.exports = {
  get () {
    if (fs.existsSync(TEMP)) {
      return JSON.parse(fs.readFileSync(TEMP, {encoding: 'utf8'}))
    }

    const tag = sh.getLastTag()
    const total = sh.countAllPacks()
    const _names = sh.getModifiedPacks()
    const names = _names.length
      ? _names.replace(/["\n]/g, '').split(' ')
      : []

    return {
      tag,
      modifiedPacks: names,
      modified: names.length,
      total,
      processed: 0,
      run: 0,
      reverted: []
    }
  },
  save (data) {
    fs.writeFileSync(TEMP, JSON.stringify(data))
  },
  unlink () {
    if (fs.existsSync(TEMP)) {
      fs.unlinkSync(TEMP)
    }
  }
}
