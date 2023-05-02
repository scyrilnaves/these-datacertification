
Refer: https://github.com/distributedledgerexperiments/EthereumTestingTool/blob/master/azure/workspace/transfer/backend/node3/besu_ibft/ws_stack/client1/firstmapwsclient.py

1) Get Shell to execute the scripts

./rancher kubectl exec -it -n ethereum-net $(./rancher kubectl -n ethereum-net get pods | awk '/ubuntu-/{printf $1}') -- bash -c ""

./rancher kubectl -n ethereum-net exec --stdin --tty $(./rancher kubectl -n ethereum-net get pods | awk '/ubuntu-/{printf $1}') -- /bin/bash

./rancher kubectl -n ethereum-net exec --stdin --tty $(./rancher kubectl -n ethereum-net get pods | awk '/ubuntu2-/{printf $1}') -- /bin/bash

2) Install VI editor

apt-get update

apt-get install vim git -y

3) Change /etc/hosts for redirecting to TAS

185.52.32.4 rancher.unice.cust.tasfrance.com
185.52.32.4 grafana.unice.cust.tasfrance.com
185.52.32.4 ethereum-ws.unice.cust.tasfrance.com
185.52.32.4 ethereum-http.unice.cust.tasfrance.com
185.52.32.4 ethmonitor.unice.cust.tasfrance.com
185.52.32.4 ethereum-ws1.unice.cust.tasfrance.com
185.52.32.4 ethereum-http1.unice.cust.tasfrance.com
185.52.32.4 ethereum-http-mongodb.unice.cust.tasfrance.com

4) Clone the repo 
Old Repo
git clone https://cyrilnavessamuel@bitbucket.org/lucgerrits/ethereum_sim.git

Geth Repo:
git clone https://cyrilnavessamuel@bitbucket.org/cyrilnavessamuel/geth.git

Besu Repo:
git clone https://cyrilnavessamuel@bitbucket.org/cyrilnavessamuel/besu.git 

5) Install the dependencies on the Ubuntu VM for running solidity transactions

cd ethereum_sim/clients/clique/bootstrap

./createnenv.sh

6) For generating new accouts and funding them

 cd besu/bootstrap/
 
 npm install .

 node genkeys.js

 8) Fund the account of cars with ethers

 cd ethereum_sim/clients/clique/bootstrap/
 python3 fundaccounts.py

 9) Deploy the smart contract main.sol

 cd ethereum_sim/clients/clique/deploy

 python3 deploy.py

 contractAddress=0xaec36f4f8D417a5e2987F26AA0a1831965c001CC

 10) Change config.py

-----------------------
TEST OUTLAY:

Nodes: 4, 6, 12, 18 ,24

TPS: 500, 800, 1000, 1500

Consensus: Clique, IBFT2.0, QBFT

No of Accident Tests
5* (4*3) * 3 = 180


Link: 

Grafana:
http://grafana.unice.cust.tasfrance.com/d/QC1Arp5Wk/geth-dashboard?orgId=1&from=now-12h&to=now&refresh=30s 

TAS:
https://rancher.unice.cust.tasfrance.com/g/clusters

Eth_NetStats:
http://ethmonitor.unice.cust.tasfrance.com

BitBucket:
https://bitbucket.org/edge-team-leat/sim-tas-group-tests/src/main/

---------------------------------------------
 7) Extract Private Key
 cd /geth/utility

 python3 extractprivate.py
----------------------------------------------