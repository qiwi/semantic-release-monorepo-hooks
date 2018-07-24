const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const readPkg = require('read-pkg')
const log = console.log.bind(console, '[release-hooks]')
const resolve = path.resolve.bind(path, __dirname)

const TEMP = resolve('./count.tmp')
const COUNT_ALL_PACKS_SH = resolve('./count_all_packs.sh')
const GET_LAST_TAG_SH = resolve('./get_last_tag.sh')
const DROP_TAG_SH = resolve('./drop_last_tag.sh')
const MODIFIED_PACKS_NAMES = resolve('./get_modified_packs.sh')

module.exports = function (dryRun) {
  const name = readPkg.sync().name
  const exec = cp.execSync
  const temp = getTemp(exec)
  const tag = exec(`sh ${GET_LAST_TAG_SH}`).toString()
  const shouldRelease = temp.modifiedPacks.indexOf(name) !== -1

  if (!dryRun) {
    temp.run += 1

    try {
      if (shouldRelease) {
        temp.processed += 1

        if (tag !== temp.tag) {
          dropLastTag(exec)
        }
      }
    } catch (err) {
      log('[error]:', err)
    }

    if (temp.run === temp.total) {
      unlinkTemp()
    } else {
      storeTemp(temp)
    }
  }

  const res = {
    isLastModified: shouldRelease && temp.processed === temp.modified,
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

function unlinkTemp () {
  if (fs.existsSync(TEMP)) {
    fs.unlinkSync(TEMP)
  }
}

function dropLastTag (exec) {
  const tag = exec(`sh ${DROP_TAG_SH}`).toString()
  log('drop tag', tag)

  return tag
}

function getTemp (exec) {
  if (fs.existsSync(TEMP)) {
    return JSON.parse(fs.readFileSync(TEMP, {encoding: 'utf8'}))
  }

  const tag = exec(`sh ${GET_LAST_TAG_SH}`).toString()
  const total = +exec(`sh ${COUNT_ALL_PACKS_SH}`).toString()
  const _names = exec(`sh ${MODIFIED_PACKS_NAMES}`).toString()
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
