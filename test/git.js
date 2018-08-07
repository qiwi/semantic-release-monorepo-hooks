const git = require('../src/git')

describe('git', () => {
  describe('getHighestReleaseVersion', () => {
    it('properly resolves the highest of set', () => {
      expect(git.getHighestReleaseVersion('1.0.1', '2.0.1', '2.1.0'))
    })
  })
})
