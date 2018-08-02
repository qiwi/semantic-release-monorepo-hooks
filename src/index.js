const fs = require('fs')
const readPkg = require('read-pkg')
const sh = require('./sh')
const {TEMP} = require('./path')
const log = console.log.bind(console, '[release-hooks]:')

module.exports = function (dryRun) {
  const name = readPkg.sync().name
  const temp = getTemp()
  const tag = sh.getLastTag()
  const isModified = temp.modifiedPacks.indexOf(name) !== -1

  if (!dryRun) {
    process(temp, tag, isModified)
  }

  const res = {
    isModified,
    isLastModified: isModified && temp.processed === temp.modified,
    isLastRun: temp.run === temp.total,
    total: temp.total,
    processed: temp.processed,
    modified: temp.modified,
    modifiedPacks: temp.modifiedPacks,
    package: name,
    tag,
    run: temp.run
  }

  log(res)

  return res
}

function process (temp, tag, isModified) {
  temp.run += 1

  if (isModified) {
    temp.processed += 1

    if (tag !== temp.tag) {
      dropLastTag()
    }
  }

  saveTemp(temp)
}

function saveTemp (temp) {
  if (temp.run === temp.total) {
    unlinkTemp()
  } else {
    storeTemp(temp)
  }
}

function unlinkTemp () {
  if (fs.existsSync(TEMP)) {
    fs.unlinkSync(TEMP)
  }
}

function dropLastTag () {
  const tag = sh.dropLastTag()
  log('drop tag', tag)

  return tag
}

function getTemp () {
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
    run: 0
  }
}

function storeTemp (data) {
  fs.writeFileSync(TEMP, JSON.stringify(data))
}
