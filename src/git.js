const sh = require('./sh')
const semver = require('semver')

module.exports = {
  addTag,
  dropLastTag,
  getHighestReleaseVersion
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

function mergeRelease () {

}

function getHighestReleaseVersion () {

}