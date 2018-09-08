const sh = require('./sh')
const semver = require('semver')
const log = require('./log')

module.exports = {
  addTag,
  getLastTag,
  getLastTagMessage,
  getLastRelease,
  dropLastRelease,
  getHighestReleaseVersion,
  joinMessages,
  joinReleases,
  createRelease,
  reformat
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

function reformat (message) {
  try {
    const re = /(Performance Improvements|Features|Bug Fixes)(.+)/i
    const [commit, link, ...details] = message.split(/#+/g)
    const changes = details.map(detail => {
      return re.exec(detail).slice(1).map((v, i) => {
        return i % 2 === 0
          ? '### ' + v
          : v
      }).join('\n')
    }).join('\n')

    if (!link) {
      return message
    }

    return `#${link}
${changes}
`
  } catch (e) {
    return message
  }
}

function getHighestReleaseVersion () {
  return [].slice.call(arguments).sort(semver.rcompare)[0]
}

function joinMessages () {
  return [].slice.call(arguments).map(reformat).join('  \n') // NOTE markdown break
}

function createRelease(tag, message) {
  const data = JSON.stringify({
    "tag_name": tag,
    "target_commitish": "master",
    "name": tag,
    "body": message,
    "draft": false,
    "prerelease": false
  })

  log('create github release', data)

  return sh.createRelease(data)
}
