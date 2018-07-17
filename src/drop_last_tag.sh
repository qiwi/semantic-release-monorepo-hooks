#!/bin/bash
user=$GH_USER
token=$GH_TOKEN
repo=$(git config --get remote.origin.url | sed -E 's/^.+[\/:]([^/]+\/[^/]+.git)$/\1/')
tag=$(git describe --tags)
dst=https://$user:$token@github.com/$repo

git remote add foobar $dst
git tag -d $tag
git push foobar --delete $tag

echo $tag
