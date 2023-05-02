#!/bin/sh

nohup ./besu/bin/besu --data-path=datadir --genesis-file=genesis.json --network-id 26 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT,WEB3,ADMIN,TXPOOL --host-whitelist="*" --rpc-http-cors-origins="all" --rpc-http-port=2000 --rpc-http-host="0.0.0.0" --rpc-ws-enabled --rpc-ws-host="0.0.0.0" --rpc-ws-port=2200 --rpc-ws-api=ETH,NET,IBFT,WEB3,ADMIN,TXPOOL --min-gas-price=1 --target-gas-limit=250000000 --tx-pool-max-size=80000000 --tx-pool-hashes-max-size=80000000 &
