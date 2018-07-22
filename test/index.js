const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const rh = require('../src')
const PATH = path.resolve(__dirname, '../src/count.tmp')

describe('lib', () => {
  it('exposes function as entry point', () => {
    expect(rh).toEqual(expect.any(Function))
  })

  describe('hooks `semantic release monorepo` flow', () => {
    const exec = jest.spyOn(cp, 'execSync')
    const unlink = () => {
      if (fs.existsSync(PATH)) {
        fs.unlinkSync(PATH)
      }
    }

    beforeAll(unlink)
    afterEach(() => {
      exec.mockClear()
      unlink()
    })

    it('does nothing if no changes found', () => {
      exec
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('0')
        .mockReturnValueOnce('4')

      const res = rh()

      expect(res.isLastChanged).toBeTruthy()
      expect(res.isLastRun).toBeFalsy()
      expect(res.processed).toBe(0)
      expect(res.changed).toBe(0)
      expect(res.total).toBe(4)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/log_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_all_packs.sh')}`)
    })

    it('handles `1 of 1` case', () => {
      exec
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('package/foo/bar.js')
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('1')

      const res = rh()

      expect(res.isLastChanged).toBeTruthy()
      expect(res.isLastRun).toBeTruthy()
      expect(res.processed).toBe(1)
      expect(res.changed).toBe(1)
      expect(res.total).toBe(1)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/log_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_all_packs.sh')}`)
      expect(fs.existsSync(PATH)).toBeFalsy()
    })

    it('handles `total` equals `changed`', () => {
      exec
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('package/foo/bar.js package/bar/qux.js')
        .mockReturnValueOnce('v1.0.0')
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('2')
        .mockReturnValueOnce('v1.1.0')
        .mockReturnValueOnce('v1.1.0') // drop tag

      const [res1, res2] = [rh(), rh()]

      expect(res1).toEqual({
        isLastChanged: false,
        isLastRun: false,
        processed: 0,
        changed: 2,
        total: 2,
        tag: 'v1.0.0'
      })

      expect(res2).toEqual({
        isLastChanged: true,
        isLastRun: true,
        processed: 2,
        changed: 2,
        total: 2,
        tag: 'v1.1.0'
      })

      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/log_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_modified_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_all_packs.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/get_last_tag.sh')}`)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/drop_last_tag.sh')}`)
      expect(fs.existsSync(PATH)).toBeFalsy()
    })

    it('detects 2nd and other runs, and triggers `drop tag sh`, updates temp file', () => {
      fs.writeFileSync(PATH, JSON.stringify({
        tag: 'v1.0.0',
        changed: 2,
        total: 6,
        processed: 0,
        run: 1
      }))

      exec
        .mockReturnValueOnce('v1.0.1') // run #2
        .mockReturnValueOnce('v1.0.1') // drop tag
        .mockReturnValueOnce('v1.0.0') // run #3
        .mockReturnValueOnce('v1.0.0') // run #4
        .mockReturnValueOnce('v1.0.1') // run #5
        .mockReturnValueOnce('v1.0.1') // drop tag
        .mockReturnValueOnce('v1.0.1') // run #6

      const [res2, res3, res4, res5, res6] = [rh(), rh(), rh(), rh(), rh()]

      expect(res2.processed).toBe(1)
      expect(res3.processed).toBe(1)
      expect(res4.processed).toBe(1)
      expect(res5.processed).toBe(2)
      expect(res6.processed).toBe(2)
    })

    it('when `dryRun` passed handler works as analyser', () => {
      const temp = {
        tag: 'v1.0.0',
        changed: 2,
        total: 6,
        processed: 0,
        run: 1
      }
      fs.writeFileSync(PATH, JSON.stringify(temp))

      exec
        .mockReturnValueOnce('v1.0.1') // run #2

      const res = rh(true)

      expect(res.isLastChanged).toBeFalsy()
      expect(res.isLastRun).toBeFalsy()
      expect(res.processed).toBe(0)
      expect(res.tag).toBe('v1.0.1')

      expect(fs.readFileSync(PATH, {encoding: 'utf8'})).toBe(JSON.stringify(temp))
    })

    it('unlinks tempfile on the last run', () => {
      fs.writeFileSync(PATH, JSON.stringify({
        tag: 'v1.0.0',
        changed: 2,
        total: 6,
        processed: 2,
        run: 5
      }))

      expect(fs.existsSync(PATH)).toBeTruthy()
      expect(rh().isLastRun).toBeTruthy()
      expect(fs.existsSync(PATH)).toBeFalsy()
    })
  })
})
