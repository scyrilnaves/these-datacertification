#!/bin/bash

#$1 is the rancher login token

./login.sh $1

./rancher kubectl delete --all pods --namespace=sim-sawtooth-net
