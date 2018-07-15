const fs = require('fs')
const path = require('path')
const exec = require('child_process').execSync;
const log = console.log.bind(console, '[release-hooks]')
const resolve = path.resolve.bind(path, __dirname)

const COUNT = resolve('./count.tmp')
const LOG_PACKS_SH = resolve('./log_modified_packs.sh')
const COUNT_PACKS_SH = resolve('./count_modified_packs.sh')
const DROP_TAG_SH = resolve('./drop_last_tag.sh')

module.exports = function () {
  const isFirstRun = !fs.existsSync(COUNT)
  let tag = null
  let count = isFirstRun
    ? +exec(`sh ${COUNT_PACKS_SH}`).toString()
    : +fs.readFileSync(COUNT)

  const isLastRun = count <= 1
  const left = count && count - 1

  log('is first run:', isFirstRun)
  log('is last run:', isLastRun)
  log('packages left:', left)

  if (count > 0) {
    try {
      if (isFirstRun) {
        log(exec(`sh ${LOG_PACKS_SH}`).toString())
      } else {
        tag = exec(`sh ${DROP_TAG_SH}`).toString()
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

  return {
    isLastRun,
    isFirstRun,
    packagesLeft: left,
    droppedTag: tag
  }
}
