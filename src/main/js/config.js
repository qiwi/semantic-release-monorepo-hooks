const path = require('path')
const { cosmiconfigSync } = require('cosmiconfig')
const { gitRootSync } = require('@antongolub/git-root')

const ROOT = path.resolve(gitRootSync())
// Copied from get-config.js in semantic-release
const CONFIG_NAME = 'release'
const CONFIG_FILES = [
  'package.json',
  `.${CONFIG_NAME}rc`,
  `.${CONFIG_NAME}rc.json`,
  `.${CONFIG_NAME}rc.yaml`,
  `.${CONFIG_NAME}rc.yml`,
  `.${CONFIG_NAME}rc.js`,
  `.${CONFIG_NAME}rc.cjs`,
  `${CONFIG_NAME}.config.js`
]

module.exports = cosmiconfigSync(CONFIG_NAME, { searchPlaces: CONFIG_FILES }).search(ROOT).config
