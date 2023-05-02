#!/bin/bash

#$1 is the rancher login token
#$2 is the yaml file path

./login.sh $1

echo "Load Deployments"
./rancher kubectl -n sim-sawtooth-net apply -f $2 --validate=false

echo "Done"