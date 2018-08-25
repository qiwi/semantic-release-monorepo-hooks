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
        {tag: 'v1.0.1\n', message: 'foo'},
        {tag: 'v2.1.0', message: 'bar'},
        {tag: 'v2.0.1\r\n', message: 'baz'}
      ])).toEqual({
        tag: 'v2.1.0',
        message: 'foo  bar  baz'
      })
    })
  })

  xdescribe('addTag', () => {
    it('attaches a new tag to the last commit', () => {
      git.addTag('v1111.0.0', 'foo')

      expect(git.getLastRelease()).toEqual({
        tag: 'v1111.0.0\n',
        message: 'foo\n'
      })

      git.dropLastRelease()
    })
  })
})
