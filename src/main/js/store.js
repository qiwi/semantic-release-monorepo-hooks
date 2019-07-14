const fs = require('fs')
const sh = require('../sh')
const { TEMP } = require('./path')

module.exports = {
  ready () {
    return fs.existsSync(TEMP)
  },
  init () {
    if (this.ready()) {
      throw new Error('Temp file is already exists')
    }

    const tag = sh.getLastTag()
    const total = sh.countAllPacks()
    const _names = sh.getModifiedPacks()
    const names = _names.length
      ? _names.replace(/["\n]/g, '').split(' ')
      : []
    const data = {
      tag,
      modifiedPacks: names,
      modified: names.length,
      total,
      processed: 0,
      run: 0,
      reverted: []
    }

    this.save(data)

    return data
  },
  get () {
    if (this.ready()) {
      return JSON.parse(fs.readFileSync(TEMP, { encoding: 'utf8' }))
    }

    throw new Error('Temp storage is not initialized. Trigger `hookBeforeAll` before the current step')
  },
  save (data) {
    fs.writeFileSync(TEMP, JSON.stringify(data))
  },
  unlink () {
    if (this.ready()) {
      fs.unlinkSync(TEMP)
    }
  }
}
