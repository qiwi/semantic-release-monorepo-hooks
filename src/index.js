const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const log = console.log.bind(console, '[release-hooks]')
const resolve = path.resolve.bind(path, __dirname)

const COUNT = resolve('./count.tmp')
const LOG_PACKS_SH = resolve('./log_modified_packs.sh')
const COUNT_PACKS_SH = resolve('./count_modified_packs.sh')
const DROP_TAG_SH = resolve('./drop_last_tag.sh')

module.exports = function (dryRun) {
  const exec = cp.execSync
  const isFirstRun = !fs.existsSync(COUNT)
  let tag = null
  let count = getCount(exec, isFirstRun)
  const isLastRun = count <= 1

  if (!dryRun) {
    if (count > 0) {
      try {
        count = decrement(count)
        tag = dropTag(exec, isFirstRun)
      } catch (err) {
        log('[error]:', err)
      }
    }
    unlink(isFirstRun, isLastRun)
  }

  log('is first run:', isFirstRun)
  log('is last run:', isLastRun)
  log('packages left:', count)

  return {
    isLastRun,
    isFirstRun,
    packagesLeft: count,
    droppedTag: tag
  }
}

function unlink (isFirstRun, isLastRun) {
  if (isLastRun && !isFirstRun) {
    fs.unlinkSync(COUNT)
  }
}

function decrement (count) {
  count -= 1
  fs.writeFileSync(COUNT, count + '')

  return count
}

function dropTag (exec, isFirstRun) {
  if (isFirstRun) {
    log(exec(`sh ${LOG_PACKS_SH}`).toString())
    return null
  }

  const tag = exec(`sh ${DROP_TAG_SH}`).toString()
  log('drop tag', tag)

  return tag
}

function getCount (exec, isFirstRun) {
  return isFirstRun
    ? +exec(`sh ${COUNT_PACKS_SH}`).toString()
    : +fs.readFileSync(COUNT, {encoding: 'utf8'})
}
