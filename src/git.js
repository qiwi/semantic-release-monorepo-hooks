const sh = require('./sh')
const semver = require('semver')

module.exports = {
  addTag,
  dropLastTag,
  getHighestReleaseVersion,
  joinMessages,
  joinReleases
}

function addTag (commit, tag, message) {

}

function dropLastTag () {
  const message = sh.getLastTagMessage()
  const tag = sh.dropLastTag()

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
