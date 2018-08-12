const path = require('../path')
const cp = require('child_process')

module.exports = {
  addTag (tag, message) { return cp.execSync(`sh ${path.ADD_TAG_SH} ${tag} ${message}`).toString() },
  getLastTag () { return cp.execSync(`sh ${path.GET_LAST_TAG_SH}`).toString() },
  getLastTagMessage () { return cp.execSync(`sh ${path.LAST_TAG_MESSAGE_SH}`).toString() },
  dropLastTag () { return cp.execSync(`sh ${path.DROP_TAG_SH}`).toString() },
  countAllPacks () { return +cp.execSync(`sh ${path.COUNT_ALL_PACKS_SH}`).toString() },
  getModifiedPacks () { return cp.execSync(`sh ${path.MODIFIED_PACKS_NAMES_SH}`).toString() }
}
