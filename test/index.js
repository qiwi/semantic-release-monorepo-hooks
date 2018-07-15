const mockFs = require('mock-fs')
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

    beforeAll(() => {
      if (fs.existsSync(PATH)) {
        fs.unlinkSync(PATH)
      }
    })

    afterEach(() => {
      exec.mockReset()
      mockFs.restore()
    })

    it('does nothing if no changes found', () => {
      exec
        .mockReturnValueOnce(0)

      const res = rh()

      expect(res.isFirstRun).toBeTruthy()
      expect(res.isLastRun).toBeTruthy()
      expect(res.packagesLeft).toBe(0)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_modified_packs.sh')}`)
    })

    it('detects the first run, gets modified packages count from `sh`, stores data to temp file', () => {
      exec
        .mockReturnValueOnce(10)
        .mockReturnValueOnce('file 1, file2')

      const res = rh()

      expect(res.isFirstRun).toBeTruthy()
      expect(res.isLastRun).toBeFalsy()
      expect(res.packagesLeft).toBe(9)
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/count_modified_packs.sh')}`)
    })

    it('detects 2nd and other runs, and triggers `drop tag sh`, updates temp file', () => {
      mockFs({[PATH]: '10'})
      exec
        .mockReturnValueOnce('v1.0.0')

      const res = rh()

      expect(res.isFirstRun).toBeFalsy()
      expect(res.packagesLeft).toBe(9)
      expect(res.droppedTag).toBe('v1.0.0')
      expect(exec).toHaveBeenCalledWith(`sh ${path.resolve(__dirname, '../src/drop_last_tag.sh')}`)

      expect(fs.readFileSync(PATH, {encoding: 'utf8'})).toBe('9')
    })

    it('when `dryRun` passed handler works as analyser', () => {
      mockFs({[PATH]: '10'})

      const res = rh(true)

      expect(res.isFirstRun).toBeFalsy()
      expect(res.packagesLeft).toBe(9)
      expect(res.droppedTag).toBeNull()
      expect(exec).not.toHaveBeenCalled()

      expect(fs.readFileSync(PATH, {encoding: 'utf8'})).toBe('10')
    })

    it('unlinks tempfile on the last run', () => {
      mockFs({[PATH]: '1'})

      expect(fs.existsSync(PATH)).toBeTruthy()
      expect(rh().isLastRun).toBeTruthy()
      expect(fs.existsSync(PATH)).toBeFalsy()
    })
  })
})
