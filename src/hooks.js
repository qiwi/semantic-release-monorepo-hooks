const readPkg = require('read-pkg')
const git = require('./git')
const store = require('./store')
const log = require('./log')
const config = require('./config')
const exec = require('./exec')
const {get} = require('lodash')

function process (temp, tag, isModified, protectTemp) {
  temp.run += 1

  if (isModified) {
    temp.processed += 1

    handleRelease(temp, tag)
  }

  saveTemp(temp, protectTemp)
}

function saveTemp (temp, protectTemp) {
  store.save(temp)

  if (temp.run === temp.total && !protectTemp) {
    store.unlink()
  }
}

function handleRelease (temp, currentTag) {
  if (temp.tag !== currentTag) {
    const release = git.dropLastRelease()

    temp.reverted.push(release)

    log('drop release', 'tag=', release.tag, 'message=', release.message)
  }
}

const hookBeforeAll = function(force) {
  log('hook `before all` thrown')

  return store.init(force)
}

const hookBeforeEach = function(dryRun, protectTemp) {
  log('hook `before each` thrown')

  const name = readPkg.sync().name
  const temp = store.get()
  const isModified = temp.modifiedPacks.indexOf(name) !== -1

  if (!dryRun) {
    temp.run += 1

    if (isModified) {
      temp.processed += 1
    }
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
    run: temp.run
  }

  log(res)

  store.save(temp)

  return res
}

const hookAfterEach = function(dryRun) {
  log('hook `after each` thrown')

  if (dryRun) {
    return
  }

  const temp = store.get()
  const tag = git.getLastTag()

  if (temp.tag !== tag) {
    const release = git.dropLastRelease()

    temp.reverted.push(release)

    log('drop release', 'tag=', release.tag, 'message=', release.message)
  }

  store.save(temp)
}

const hookAfterAll = function(dryRun) {
  log('hook `after all` thrown')

  if (store.ready()) {
    hookAfterEach(dryRun)
    const temp = store.get()

    if (temp.reverted.length > 0) {
      const {tag, message} = git.joinReleases(temp.reverted)

      git.addTag(tag, message)
      git.createRelease(tag, message)

      // Post release steps. For example, `gh-pages`
      get(config, 'monorepoHooks.afterAll.cmd', []).forEach(exec.run)
    }
  }

  store.unlink()
}

module.exports = {
  hookBeforeAll,
  hookBeforeEach,
  hookAfterEach,
  hookAfterAll
}
