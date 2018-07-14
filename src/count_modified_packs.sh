#!/bin/bash

value=$(git diff HEAD $(git rev-list -n 1 $(git describe --abbrev=0 --tags)) --name-only | grep packages | sed -E 's/^[^/]+\/([^/]+)\/.*$/\1/' | sort | uniq | wc -l)
((value=value + 0))

export RH_TOTAL=$value
export RH_COUNT=$value

echo "changed packages: "$RH_TOTAL
