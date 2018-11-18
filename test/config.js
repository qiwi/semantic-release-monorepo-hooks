const config = require('../src/config')
const readPkg = require('read-pkg').sync

describe('config', () => {
  it('returns `release` config', () => {
    expect(config).toEqual(readPkg().release)
  })
})
