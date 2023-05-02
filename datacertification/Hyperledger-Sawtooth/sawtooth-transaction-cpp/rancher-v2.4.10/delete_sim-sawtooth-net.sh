#!/bin/bash

#$1 is the rancher login token

./login.sh $1

echo "Delete Deployments"
./rancher kubectl -n sim-sawtooth-net delete deployments --all

echo "Delete PVC"
./rancher kubectl -n sim-sawtooth-net delete pvc --all

echo "Delete PV"

./rancher kubectl -n sim-sawtooth-net get pv | awk '/sawtooth-/{print $1}' | xargs ./rancher kubectl -n sim-sawtooth-net delete pv

# ./rancher kubectl -n sim-sawtooth-net delete pv --all

echo "Done"