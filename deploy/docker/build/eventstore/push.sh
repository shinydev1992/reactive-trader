#! /bin/bash

set -euo pipefail

# get and control config
. ../../../config

# push
docker push $eventstoreContainer:$vEventstore
