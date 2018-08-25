const hooks = require('./hooks')
const log = require('./log')

const legacy = function (dryRun, protectTemp) {
  log(`
    WARNING legacy "combohooks" will be dropped in next major release.
    Use more specific steps instead: hookBeforeAll, hookBeforeEach, hookAfterEach, hookAfterAll
  `)

  return hooks.hookBeforeEach(dryRun, protectTemp)
}

module.exports = Object.assign(legacy, hooks)
