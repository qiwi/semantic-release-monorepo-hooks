#!/bin/bash

value=$(git diff HEAD $(git rev-list --max-parents=0 HEAD) --name-only | grep packages | sed -E 's/^[^/]+\/([^/]+)\/.*$/\1/' | sort | uniq | wc -l)
((value=value + 0))

echo $value
