#!/bin/bash

sh $( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"./git_prepare_remote.sh"

tag=$(git tag -a $1 -m "$2")
git push foobar --tags

echo tag
