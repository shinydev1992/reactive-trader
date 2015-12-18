#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "broker-build: build number required as first parameter"
  exit 1
fi

set -euo pipefail

# get and control config
. ../../../config


# push
docker push $brokerContainer:latest
docker push $brokerContainer:$vMajor.$vMinor.$build
