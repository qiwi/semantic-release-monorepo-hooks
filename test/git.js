const git = require('../src/git')

describe('git', () => {
  describe('getHighestReleaseVersion', () => {
    it('properly resolves the highest of set', () => {
      expect(git.getHighestReleaseVersion('1.0.1', '2.0.1', '2.1.0', '2.0.1')).toBe('2.1.0')
    })
  })

  describe('joinMessages', () => {
    it('returns concatenated string', () => {
      expect(git.joinMessages('foo', 'bar', 'baz')).toBe(`foo  bar  baz`)
    })
  })

  describe('joinReleases', () => {
    it('squashes several releases to single one', () => {
      expect(git.joinReleases([
        {tag: '1.0.1', message: 'foo'},
        {tag: '2.1.0', message: 'bar'},
        {tag: '2.0.1', message: 'baz'}
      ])).toEqual({
        tag: '2.1.0',
        message: 'foo  bar  baz'
      })
    })
  })
})
