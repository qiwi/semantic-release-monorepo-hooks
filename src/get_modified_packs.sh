#!/bin/bash

echo $(jq '.name' $(git diff HEAD $(git rev-list -n 1 $(git describe --abbrev=0 --tags)) --name-only | grep packages | sed -E 's/^([^/]+\/[^/]+)\/.*$/\1\/package.json/' | sort | uniq))
