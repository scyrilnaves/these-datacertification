#!/bin/sh

cd "$(dirname "$0")"

rm -rf poa

apt-get update

apt-get install python3-venv -y

apt-get install python3 python-dev python3-dev libssl-dev libxml2-dev libxslt1-dev zlib1g-dev python3-pip wget curl nodejs npm -y


apt-get install build-essential automake pkg-config libtool libffi-dev libgmp-dev libsecp256k1-dev jq -y

wget https://github.com/ethereum/solidity/releases/download/v0.4.24/solc-static-linux

chmod 755 solc-static-linux

mv solc-static-linux /usr/local/bin/

rm usr/local/bin/solc

ln -s /usr/local/bin/solc-static-linux /usr/local/bin/solc

#pip3 install virtualenv

#virtualenv poa

#source poa/bin/activate

pip3 install -r requirement.txt

pip3 install --pre eth-utils --no-deps




