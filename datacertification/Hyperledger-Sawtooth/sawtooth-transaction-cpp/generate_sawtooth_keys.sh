#!/bin/bash


#Use it with docker compose shell:
#docker-compose -f docker-compose-shell.yaml up
#docker-compose -f docker-compose-shell.yaml down
#
# Don't forget to add "[" and "]" in the JSON files !!
#docker exec -it sawtooth-shell-default bash /sawtooth-transaction-cpp/generate_sawtooth_keys.sh > drivers_keys.json
#docker exec -it sawtooth-shell-default bash /sawtooth-transaction-cpp/generate_sawtooth_keys.sh > cars_keys.json

for i in `seq 1 1000`; do sawtooth keygen --force -q && printf "{\n\"priv\":\"" && cat /root/.sawtooth/keys/root.priv | tr -d '\n' && printf "\",\n\"pub\":\"" && cat /root/.sawtooth/keys/root.pub | tr -d '\n' && printf "\"\n},\n" ; done