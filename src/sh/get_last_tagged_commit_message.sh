#!/bin/bash

message=$(git --no-pager log $(git describe --abbrev=0 --tags) -1 --pretty=%B)

echo $message
