const exec = require('../src/exec')

describe('exec', () => {
  it('runs cmd, returns result', () => {
    expect(exec.run('echo "foo"')).toBe('foo')
  })

  it('catches error otherwise', () => {
    expect(exec.run('foo bar --baz')).toBeUndefined()
  })
})
