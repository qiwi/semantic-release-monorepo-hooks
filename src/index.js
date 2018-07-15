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
  let count = isFirstRun
    ? +exec(`sh ${COUNT_PACKS_SH}`).toString()
    : +fs.readFileSync(COUNT, {encoding: 'utf8'})

  const isLastRun = count <= 1
  const left = count && (count - 1)

  log('is first run:', isFirstRun)
  log('is last run:', isLastRun)
  log('packages left:', left)

  if (!dryRun) {
    if (count > 0) {
      try {
        if (isFirstRun) {
          log(exec(`sh ${LOG_PACKS_SH}`))
        } else {
          tag = exec(`sh ${DROP_TAG_SH}`)
          log('drop tag', tag)
        }

        count -= 1
        fs.writeFileSync(COUNT, count + '')
      } catch (err) {
        log('[error]:', err)
      }
    }

    if (isLastRun && !isFirstRun) {
      fs.unlinkSync(COUNT)
    }
  }

  return {
    isLastRun,
    isFirstRun,
    packagesLeft: left,
    droppedTag: tag
  }
}
