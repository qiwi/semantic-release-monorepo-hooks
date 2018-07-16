const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const log = console.log.bind(console, '[release-hooks]')
const resolve = path.resolve.bind(path, __dirname)

const TEMP = resolve('./count.tmp')
const LOG_PACKS_SH = resolve('./log_modified_packs.sh')
const COUNT_MOD_PACKS_SH = resolve('./count_modified_packs.sh')
const COUNT_ALL_PACKS_SH = resolve('./count_all_packs.sh')
const GET_LAST_TAG_SH = resolve('./get_last_tag.sh')
const DROP_TAG_SH = resolve('./drop_last_tag.sh')

module.exports = function (dryRun) {
  const exec = cp.execSync
  const tag = exec(`sh ${GET_LAST_TAG_SH}`).toString()
  const temp = getTemp(exec)

  if (!dryRun) {
    temp.run += 1

    try {
      if (temp.total === temp.changed) {
        temp.processed += 1
      } else if (tag !== temp.tag && temp.changed > temp.processed) {
        temp.processed += 1
        dropLastTag(exec)
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

  log(temp)

  return {
    isLastChanged: temp.processed === temp.changed,
    isLastRun: temp.run === temp.total,
    processed: temp.processed,
    changed: temp.changed,
    total: temp.total,
    tag
  }
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

  log(exec(`sh ${LOG_PACKS_SH}`).toString())

  return {
    tag: exec(`sh ${GET_LAST_TAG_SH}`).toString(),
    changed: +exec(`sh ${COUNT_MOD_PACKS_SH}`).toString(),
    total: +exec(`sh ${COUNT_ALL_PACKS_SH}`).toString(),
    processed: 0,
    run: 0
  }
}

function storeTemp (data) {
  fs.writeFileSync(TEMP, JSON.stringify(data))
}
