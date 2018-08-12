#!/bin/bash

sh $( cd "$( dirname "${BASH_SOURCE[0]}" )" > /dev/null && pwd )"/git_prepare_remote.sh"

tag=$(git describe --abbrev=0 --tags)

git tag -d $tag
git push foobar --delete $tag

echo $tag
