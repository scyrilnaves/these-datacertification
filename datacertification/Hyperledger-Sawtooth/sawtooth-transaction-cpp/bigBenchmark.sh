#!/bin/bash

#$1 is the rancher login token

export RANCHER_BEARER_TOKEN=token-r2wmr:v2n9mrdvvc4gvnjhp5hh74lg2gzjdjwwcnpcb7jqxft5x7rxcpxzgw

echo "Start big benchmark"

cd rancher-v2.4.10/

for file in ./../../cloud-deployments/*-nodes.yaml;
do
    echo "Start test with config of $file"
    ./delete_sim-sawtooth-net.sh $RANCHER_BEARER_TOKEN

    sleep 10

    ./load_sim-sawtooth-net.sh $RANCHER_BEARER_TOKEN $file
    # break
    
    sleep 300

    cd ../

    ./benchmark.py

    cd rancher-v2.4.10/

    echo "End test with config of $file"
done

echo "Done ALL TESTS :)"