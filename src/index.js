const readPkg = require('read-pkg')
const sh = require('./sh')
const store = require('./store')
const log = console.log.bind(console, '[release-hooks]:')

module.exports = function (dryRun) {
  const name = readPkg.sync().name
  const temp = store.get()
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

    handleRelease(temp, tag)
  }

  saveTemp(temp)
}

function saveTemp (temp) {
  if (temp.run === temp.total) {
    store.unlink()
  } else {
    store.save(temp)
  }
}

function dropLastTag () {
  const tag = sh.dropLastTag()
  log('drop tag', tag)

  return tag
}

function handleRelease (temp, currentTag) {
  if (temp.tag !== currentTag) {
    const message = sh.getLastTagMessage()
    const tag = sh.dropLastTag()

    temp.reverted.push({
      tag,
      message
    })

    log('drop redundant release', 'tag=', tag, 'message=', message)
  }
}
