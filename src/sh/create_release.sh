#!/bin/bash

user=$GH_USER
token=$GH_TOKEN
auth="Authorization: token $token"
repo=$(git config --get remote.origin.url | sed -E 's/^.+[\/:]([^/]+\/[^/]+).git$/\1/')
dst=https://@api.github.com/repos/$repo/releases
tag=$1
message=$2
data="{\"tag_name\": \""$tag"\", \"name\": \""$tag"\", \"body\": \""$message"\", \"target_commitish\": \"master\", \"draft\": false, \"prerelease\": false}"

res=$(curl -v X=POST -H "$auth" -H "Content-Type: application/json" -d "$data" "$dst")

echo $res
