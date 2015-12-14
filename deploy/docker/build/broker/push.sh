#! /bin/bash

build=$1
if [[ $build = "" ]];then
  echo "broker-build: build number required as first parameter"
  exit 1
fi


# get and control config
. ../../../config

if [[ $brokerContainer = "" ]];then
  echo "broker-build: container name required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMajor = "" ]];then
  echo "broker-build: major version required, fill in adaptivetrader/deploy/config"
  exit 1
fi
if [[ $vMinor = "" ]];then
  echo "broker-build: minor version required, fill in adaptivetrader/deploy/config"
  exit 1
fi


# push
docker push $brokerContainer:latest
docker push $brokerContainer:$vMajor.$vMinor.$build
