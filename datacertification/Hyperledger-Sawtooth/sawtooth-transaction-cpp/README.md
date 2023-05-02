# Benchmark pour sawtooth

## Requirements

- Python 3
- Docker + docker-compose


For python requirements:
```bash
pip install -r requirements.txt
```

## How to ?

First:
```bash
cd ./Hyperledger-Sawtooth/sawtooth-transaction-cpp/
```

<!-- 1. Init new_car et new_owner une 1er fois lorsque la blockchain est "fresh" avec:
```bash
docker-compose -f docker-compose-sender.yaml down
docker-compose -f docker-compose-sender.yaml up send-init-cartp
docker-compose -f docker-compose-sender.yaml down
``` -->

1. Make sure the blockchain is fresh !!! i.e. no cars or drivers registered.

2. modifier `benchmark.py` pour le test désiré, exemple:
```json
    {
        "sender_parameters": {
            "limit": "1000",
            "js_nb_parallele": "3",
            "js_wait_time": "1"
        }
    },
```

3. executer `RANCHER_BEARER_TOKEN=token-XXXX ./benchmark.py`

## Visualize results


1. Do multiple tests with benchmark.py

2. Collect `start` and `end` timestamps (13 digits timestamp) of one configuration (example start="1618648510089", end="1618662753248", name="5tps|6_nodes")

3. Edit `./export_all_data.sh` to get all the tests in CSV files, example:
```bash
echo "6_nodes"
./export_influxdb_data.sh 1618648510089 1618662753248
./build_data.py "5tps|6_nodes"

./export_influxdb_data.sh 1618662934316 1618671949158
./build_data.py "10tps|6_nodes"

#.....
```

4. Visualize the merged data of all tests with `./build_data_merged.py`




<!-- kubectl exec -it -n sim-sawtooth-net node-0-66c7cddb4b-9xctj --container sawtooth-validator -- bash -c "du -sh /var/lib/sawtooth/" -->