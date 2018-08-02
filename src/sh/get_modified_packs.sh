#!/bin/bash

root=$(git rev-parse --show-toplevel | sed 's/\//\\\//g')
sedarg="s/^([^/]+\/[^/]+)\/.*$/"$root"\/\1\/package.json/"

echo $(jq '.name' $(git diff HEAD $(git rev-list -n 1 $(git describe --abbrev=0 --tags)) --name-only | grep packages | sed -E ${sedarg} | sort | uniq))
