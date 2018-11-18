const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const readPkg = require('read-pkg')
const rh = require('../src')
const {
  hookBeforeAll,
  hookBeforeEach,
  hookAfterAll,
  hookAfterEach
} = rh
const PATH = path.resolve(__dirname, '../src/count.tmp')

describe('lib', () => {
  afterAll(() => jest.resetAllMocks())

  it('exposes helpers', () => {
    expect(rh).toEqual(expect.any(Function))
    expect(hookBeforeAll).toEqual(expect.any(Function))
    expect(hookBeforeEach).toEqual(expect.any(Function))
    expect(hookAfterAll).toEqual(expect.any(Function))
    expect(hookAfterEach).toEqual(expect.any(Function))
  })

  describe('hooks `semantic release monorepo` flow', () => {
    const exec = jest.spyOn(cp, 'execSync')
    const pack = jest.spyOn(readPkg, 'sync')
    const unlink = () => {
      if (fs.existsSync(PATH)) {
        fs.unlinkSync(PATH)
      }
    }

    beforeAll(unlink)
    afterEach(() => {
      exec.mockClear()
      pack.mockClear()
      unlink()
    })

    it('does nothing if no changes found', () => {
      exec
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('4')
        .mockReturnValueOnce('')
        // .mockReturnValueOnce('v1.0.0')

      pack
        .mockReturnValueOnce({ name: 'foo' })

      const res = rh()

      expect(res).toEqual({
        modifiedPacks: [],
        modified: 0,
        total: 4,
        processed: 0,
        run: 1,
        isLastModified: false,
        isLastRun: false,
        isModified: false,
        package: 'foo'
      })
    })

    it('handles `1 of 1` case', () => {
      exec
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('@qiwi/pijma-core')
        // .mockReturnValueOnce('v1.0.0')

      pack
        .mockReturnValueOnce({ name: '@qiwi/pijma-core' })

      const res = rh()

      expect(res).toEqual({
        modifiedPacks: ['@qiwi/pijma-core'],
        modified: 1,
        total: 1,
        processed: 1,
        run: 1,
        isLastModified: true,
        isLastRun: true,
        isModified: true,
        package: '@qiwi/pijma-core'
      })

      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/count_all_packs.sh')}`)
      // expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)
      // expect(fs.existsSync(PATH)).toBeFalsy()
    })

    it('triggers `drop tag sh`, updates temp file', () => {
      exec
        .mockReturnValueOnce('v1.0.0') // run 1 beforeAll
        .mockReturnValueOnce('5') // beforeAll
        .mockReturnValueOnce('@qiwi/pijma-core @qiwi/pijma-mobile') // beforeAll
        // .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('v1.0.0') // run 2 afterEach
        .mockReturnValueOnce('v1.1.0') // run 3 afterEach
        .mockReturnValueOnce('chore(foo): bar release') // get last tag message
        .mockReturnValueOnce('v1.1.0') // drop tag
        .mockReturnValueOnce('v1.0.1') // run 4
        .mockReturnValueOnce('chore(baz): qux release') // get last tag message
        .mockReturnValueOnce(`Deleted tag 'v1.0.1' (was 17f16b0)
v1.0.1`) // drop tag
        .mockReturnValueOnce('v1.0.0') // run 5

      pack
        .mockReturnValueOnce({ name: '@qiwi/pijma-desktop' })
        .mockReturnValueOnce({ name: '@qiwi/pijma-core' })
        .mockReturnValueOnce({ name: '@qiwi/pijma-mobile' })
        .mockReturnValueOnce({ name: '@qiwi/pijma-app' })
        .mockReturnValueOnce({ name: 'pijma' }) // landing

      const modifiedPacks = ['@qiwi/pijma-core', '@qiwi/pijma-mobile']
      const [res1, res2, res3, res4] = [rh(), rh(), rh(), rh()]

      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/count_all_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tagged_commit_message.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/drop_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)

      expect(res1).toEqual({
        modifiedPacks,
        modified: 2,
        total: 5,
        processed: 0,
        run: 1,
        isLastModified: false,
        isLastRun: false,
        isModified: false,
        package: '@qiwi/pijma-desktop'
      })

      expect(res2).toEqual({
        modifiedPacks,
        modified: 2,
        total: 5,
        processed: 1,
        run: 2,
        isLastModified: false,
        isLastRun: false,
        isModified: true,
        package: '@qiwi/pijma-core'
      })

      expect(res3).toEqual({
        modifiedPacks,
        modified: 2,
        total: 5,
        processed: 2,
        run: 3,
        isLastModified: true,
        isLastRun: false,
        isModified: true,
        package: '@qiwi/pijma-mobile'
      })

      expect(res4).toEqual({
        modifiedPacks,
        modified: 2,
        total: 5,
        processed: 2,
        run: 4,
        isLastModified: false,
        isLastRun: false,
        isModified: false,
        package: '@qiwi/pijma-app'
      })

      expect(fs.readFileSync(PATH, { encoding: 'utf8' })).toBe(JSON.stringify({
        tag: 'v1.0.0',
        modifiedPacks,
        modified: 2,
        total: 5,
        processed: 2,
        run: 4,
        reverted: [{
          tag: 'v1.1.0',
          message: 'chore(foo): bar release'
        }, {
          tag: 'v1.0.1',
          message: 'chore(baz): qux release'
        }]
      }))

      expect(rh()).toEqual({
        modifiedPacks,
        modified: 2,
        total: 5,
        processed: 2,
        run: 5,
        isLastModified: false,
        isLastRun: true,
        isModified: false,
        package: 'pijma'
      })

      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/sh/get_last_tag.sh')}`)
      // expect(fs.existsSync(PATH)).toBeFalsy()
    })

    it('when `dryRun` passed handler works as analyser', () => {
      const temp = {
        tag: 'v1.0.0',
        modifiedPacks: ['foo', 'bar'],
        modified: 2,
        total: 6,
        processed: 0,
        run: 1,
        reverted: []
      }
      fs.writeFileSync(PATH, JSON.stringify(temp))

      pack
        .mockReturnValueOnce({ name: 'foo' })

      exec
        .mockReturnValueOnce('v1.0.1')

      const res = rh(true)

      expect(res.isLastModified).toBeFalsy()
      expect(res.isModified).toBeTruthy()
      expect(res.isLastRun).toBeFalsy()
      expect(res.processed).toBe(0)

      expect(fs.readFileSync(PATH, { encoding: 'utf8' })).toBe(JSON.stringify(temp))
    })

    xit('unlinks tempfile on the last run', () => {
      fs.writeFileSync(PATH, JSON.stringify({
        tag: 'v1.0.0',
        modifiedPacks: ['foo', 'bar'],
        modified: 2,
        total: 6,
        processed: 2,
        run: 5,
        reverted: [
          { tag: 'v1.1.0', message: 'Foo release' },
          { tag: 'v1.0.1', message: 'Bar release' }
        ]
      }))

      pack
        .mockReturnValueOnce({ name: 'baz' })

      exec
        .mockReturnValueOnce('v1.0.0')

      expect(fs.existsSync(PATH)).toBeTruthy()
      expect(rh().isLastRun).toBeTruthy()
      // expect(fs.existsSync(PATH)).toBeFalsy()
    })
  })
})
