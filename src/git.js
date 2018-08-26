const sh = require('./sh')
const semver = require('semver')

module.exports = {
  addTag,
  getLastTag,
  getLastTagMessage,
  getLastRelease,
  dropLastRelease,
  getHighestReleaseVersion,
  joinMessages,
  joinReleases,
  createRelease
}

function addTag (tag, message) {
  return sh.addTag(tag, message)
}

function getLastTag () {
  return sh.getLastTag()
}

function getLastTagMessage () {
  return sh.getLastTagMessage()
}

function getLastRelease () {
  return {
    tag: getLastTag(),
    message: getLastTagMessage()
  }
}

function dropLastRelease () {
  const message = sh.getLastTagMessage()
  const re = /.*(v\d+\.\d+\.\d+).*/
  const tag = re.exec(sh.dropLastTag())[1]

  return {
    tag,
    message
  }
}

function joinReleases (releases) {
  const tag = getHighestReleaseVersion.apply(null, releases.map(r => r.tag))
  const message = joinMessages.apply(null, releases.map(r => r.message))
  
  return {
    tag,
    message
  }
}

function getHighestReleaseVersion () {
  return [].slice.call(arguments).sort(semver.rcompare)[0]
}

function joinMessages () {
  return [].slice.call(arguments).join('  ') // NOTE markdown break
}

function createRelease(tag, message) {
  return sh.createRelease(tag, message)
}
