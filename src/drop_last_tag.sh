#!/usr/bin/env bash

tag=$(git describe --abbrev=0 --tags)
dst=https://qiwibot:$RELEASE_GH_TOKEN@github.com/qiwi/uniconfig.git

echo -e current $tag

git remote add foobar $dst
git tag -d $tag
git push foobar --delete $tag

echo -e next $(git describe --abbrev=0 --tags)
