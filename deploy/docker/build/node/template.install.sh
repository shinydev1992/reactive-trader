#! /bin/bash

set -euo pipefail

# prerequisite
apt-get update
apt-get install curl build-essential -y

# node
# Install manually to easily choose the version
curl -L -O https://nodejs.org/dist/v__VNODE__/node-v__VNODE__-linux-x64.tar.gz
tar -zxvf node-v__VNODE__-linux-x64.tar.gz
rm -r node-v__VNODE__-linux-x64.tar.gz
mv node-v__VNODE__-linux-x64 /node

# python
# Dependency for some node components
apt-get install python -y

# clean
apt-get remove curl -y
apt-get autoremove -y
