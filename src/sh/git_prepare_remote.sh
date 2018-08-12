#!/bin/bash

user=$GH_USER
token=$GH_TOKEN
repo=$(git config --get remote.origin.url | sed -E 's/^.+[\/:]([^/]+\/[^/]+.git)$/\1/')
dst=https://$user:$token@github.com/$repo

git remote add foobar $dst
