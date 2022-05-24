const config = require('../../main/js/config')

describe('config', () => {
  it('returns `release` config', () => {
    expect(config).toMatchObject({
      branches: ['master']
    })
  })
})
