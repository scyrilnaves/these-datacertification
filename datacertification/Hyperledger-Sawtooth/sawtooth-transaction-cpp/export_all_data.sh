#!/bin/bash
echo "Remove previous results"
rm -r ./datas_csv/*

echo "Start compiling all results"

echo "6_nodes"
./export_influxdb_data.sh 1618648510089 1618662753248 #start end timestamps (13 digits)
./build_data.py "5tps|6_nodes" #name the test

./export_influxdb_data.sh 1618662934316 1618671949158
./build_data.py "10tps|6_nodes"

./export_influxdb_data.sh 1618672104227 1618678876449
./build_data.py "17tps|6_nodes"

./export_influxdb_data.sh 1618914242555 1618915137266
./build_data.py "20tps|6_nodes"

./export_influxdb_data.sh 1618915318532 1618916041273
./build_data.py "25tps|6_nodes"

#max_batches_per_block=1200
./export_influxdb_data.sh 1618928118662 1618930060338
./build_data.py "40tps|6_nodes|bpb_1200|bpd=1k"

#max_batches_per_block=500
./export_influxdb_data.sh 1618932582700 1618933251701
./build_data.py "40tps|6_nodes|bpb_500|bpd=1k"

#max_batches_per_block=500
#block_publishing_delay=200
./export_influxdb_data.sh 1618933586200 1618934255201
./build_data.py "40tps|6_nodes|bpb_500|bpd=200"

#max_batches_per_block=1000
# ./export_influxdb_data.sh 1619437034420 1619437832701
# ./build_data.py "30tps|6_nodes|bpb_1k"
#max_batches_per_block=100000
# ./export_influxdb_data.sh 1619438237587 1619438818601
# ./build_data.py "30tps|6_nodes|bpb_100k"



./export_influxdb_data.sh 1619547035575 1619548556350
./build_data.py "20tps|6_nodes|new_setup"
./export_influxdb_data.sh 1619549060238 1619550535218
./build_data.py "30tps|6_nodes|new_setup"
./export_influxdb_data.sh 1619551012861 1619552687170
./build_data.py "40tps|6_nodes|new_setup"
./export_influxdb_data.sh 1619553103193 1619554825714
./build_data.py "50tps|6_nodes|new_setup"
./export_influxdb_data.sh 1619556642345 1619557923786
./build_data.py "60tps|6_nodes|new_setup"


./export_influxdb_data.sh 1619885713903 1619886815395
./build_data.py "40tps|6_nodes|rust|bpb_300"
./export_influxdb_data.sh 1619887409927 1619888341365
./build_data.py "40tps|6_nodes|rust|bpb_100"
./export_influxdb_data.sh 1619950582635 1619951688235
./build_data.py "40tps|6_nodes|rust|bpb_50"


echo "12_nodes"
./export_influxdb_data.sh 1618781571866 1618795969900
./build_data.py "5tps|12_nodes"

./export_influxdb_data.sh 1618796191242 1618805497211
./build_data.py "10tps|12_nodes"

./export_influxdb_data.sh 1618805807010 1618812658269
./build_data.py "20tps|12_nodes"

echo "18_nodes"
# ./export_influxdb_data.sh 1618946501490 1618957272765
# ./build_data.py "5tps|18_nodes"

# ./export_influxdb_data.sh 1618960306976 1618968577377
# ./build_data.py "10tps|18_nodes"

# ./export_influxdb_data.sh 1618968799807 1618974623463
# ./build_data.py "20tps|18_nodes"
./export_influxdb_data.sh 1619510166969 1619512401181
./build_data.py "5tps|18_nodes|new_setup"

./export_influxdb_data.sh 1619512831161 1619514168878
./build_data.py "10tps|18_nodes|new_setup"

./export_influxdb_data.sh 1619518794173 1619519574575
./build_data.py "20tps|18_nodes|new_setup"



echo "24_nodes"
./export_influxdb_data.sh 1619087487723 1619100641339
./build_data.py "5tps|24_nodes"

./export_influxdb_data.sh 1619100882542 1619108858328
./build_data.py "10tps|24_nodes"

./export_influxdb_data.sh 1619114864543 1619118072408
./build_data.py "20tps|24_nodes"

./export_influxdb_data.sh 1619533556102 1619535874761
./build_data.py "5tps|24_nodes|new_setup"

./export_influxdb_data.sh 1619536279826 1619537684371
./build_data.py "10tps|24_nodes|new_setup"

./export_influxdb_data.sh 1619538056512 1619538874596
./build_data.py "20tps|24_nodes|new_setup"

echo "End compiling all results"