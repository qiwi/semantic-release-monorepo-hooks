#!/bin/bash

message=$(git tag -l --format='%(contents)' $(git describe --abbrev=0 --tags))

echo $message
