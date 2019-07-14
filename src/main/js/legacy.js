const hooks = require('./hooks')
const log = require('./log')
const store = require('./store')

const legacy = function (dryRun, protectTemp) {
  log(`
    WARNING legacy "combohooks" will be dropped in next major release.
    Use more specific steps instead: hookBeforeAll, hookBeforeEach, hookAfterEach, hookAfterAll
  `)

  if (store.ready()) {
    hooks.hookAfterEach(dryRun)
  } else {
    hooks.hookBeforeAll()
  }

  return hooks.hookBeforeEach(dryRun, protectTemp)
}

module.exports = Object.assign(legacy, hooks)
