const git = require('../src/git')

describe('git', () => {
  describe('getHighestReleaseVersion', () => {
    it('properly resolves the highest of set', () => {
      expect(git.getHighestReleaseVersion('1.0.1', '2.0.1', '2.1.0', '2.0.1')).toBe('2.1.0')
    })
  })

  describe('joinMessages', () => {
    it('returns concatenated string', () => {
      expect(git.joinMessages('foo', 'bar', 'baz')).toBe(`foo  \nbar  \nbaz`)
    })

    it('reformats if possible', () => {
      const messages = [
        'chore(@qiwi/uniconfig): release 1.13.8 [skip ci] # [@qiwi/uniconfig-v1.13.8](https://github.com/qiwi/uniconfig/compare/v1.13.7...v1.13.8) (2018-08-26) ### Bug Fixes CHANGELOG.md2 README.md dist package.json src **build:** some fixes ([cd38287](https://github.com/qiwi/uniconfig/commit/cd38287)) ### Performance Improvements CHANGELOG.md README.md dist package.json src **build:** tech release ([cd38287](https://github.com/qiwi/uniconfig/commit/cd38287))',
        'chore(@qiwi/uniconfig-plugin-yaml): release 1.13.8 [skip ci] # [@qiwi/uniconfig-plugin-yaml-v1.13.8](https://github.com/qiwi/uniconfig/compare/v1.13.7...v1.13.8) (2018-08-26) ### Performance Improvements LICENSE2 README.md coverage docma.json flow-coverage flow-typed jest.config.json lerna.json node_modules package.json packages scripts yarn.lock **build:** tech release ([cd38287](https://github.com/qiwi/uniconfig/commit/cd38287))'
      ]

      expect(git.joinMessages(...messages)).toBe(`# [@qiwi/uniconfig-v1.13.8](https://github.com/qiwi/uniconfig/compare/v1.13.7...v1.13.8) (2018-08-26) 
###Bug Fixes
 CHANGELOG.md2 README.md dist package.json src **build:** some fixes ([cd38287](https://github.com/qiwi/uniconfig/commit/cd38287)) 
###Performance Improvements
 CHANGELOG.md README.md dist package.json src **build:** tech release ([cd38287](https://github.com/qiwi/uniconfig/commit/cd38287))
  
# [@qiwi/uniconfig-plugin-yaml-v1.13.8](https://github.com/qiwi/uniconfig/compare/v1.13.7...v1.13.8) (2018-08-26) 
###Performance Improvements
 LICENSE2 README.md coverage docma.json flow-coverage flow-typed jest.config.json lerna.json node_modules package.json packages scripts yarn.lock **build:** tech release ([cd38287](https://github.com/qiwi/uniconfig/commit/cd38287))
`)
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
        message: 'foo  \nbar  \nbaz'
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
