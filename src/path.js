const path = require('path')
const resolve = path.resolve.bind(path, __dirname)

module.exports = {
  TEMP: resolve('./count.tmp'),
  COUNT_ALL_PACKS_SH: resolve('./sh/count_all_packs.sh'),
  GET_LAST_TAG_SH: resolve('./sh/get_last_tag.sh'),
  ADD_TAG_SH: resolve('./sh/add_tag.sh'),
  CREATE_RELEASE_SH: resolve('./sh/create_release.sh'),
  DROP_TAG_SH: resolve('./sh/drop_last_tag.sh'),
  LAST_TAG_MESSAGE_SH: resolve('./sh/get_last_tag_message.sh'),
  LAST_TAGGED_COMMIT_MESSAGE_SH: resolve('./sh/get_last_tagged_commit_message.sh'),
  MODIFIED_PACKS_NAMES_SH: resolve('./sh/get_modified_packs.sh')
}
