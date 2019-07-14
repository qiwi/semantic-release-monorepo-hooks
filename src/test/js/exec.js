const exec = require('../../main/js/exec')
const cp = require('child_process')

describe('exec', () => {
  const execSync = jest.spyOn(cp, 'execSync')
  execSync
    .mockReturnValueOnce('foobar')
    .mockImplementationOnce(() => {
      throw new Error('/bin/sh: foo: command not found')
    })

  it('runs cmd, returns result', () => {
    expect(exec.run('echo "foobar"')).toBe('foobar')
  })

  it('catches error otherwise', () => {
    expect(exec.run('foo bar --baz')).toBeUndefined()
  })
})
