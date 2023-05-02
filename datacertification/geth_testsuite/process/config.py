#!/usr/bin/env python3

RPCaddress = 'ws://ethereum-ws.unice.cust.tasfrance.com'

RPCaddress_http = 'http://ethereum-http.unice.cust.tasfrance.com'

RPCaddress_miner1 = 'ws://ethereum-ws1.unice.cust.tasfrance.com'

RPCaddress_http_miner1 = 'http://ethereum-http1.unice.cust.tasfrance.com'

RPCaddress_http_miner1 = 'http://ethereum-http1.unice.cust.tasfrance.com'

#To change
RPCaddress_direct_miner1='ws://10.42.2.41:8546' 

# how many tx to send in send.py
NUMBER_OF_FACTORY_TRANSACTIONS = 1
NUMBER_OF_CAR_TRANSACTIONS = 1
NUMBER_OF_ACCIDENT_TRANSACTIONS = 30000

MONGO_DB = "10.42.2.37:27017"

CONTRACT_ADDRESS_FILE="../deploy/contract-address.json"

CLIENT_FACTORY_THREADS=20

CLIENT_CAR_THREADS=20

CLIENT_ACCIDENT_THREADS=100

TPS = 100


# We actually start iteration from 1 as we leave 0 for Boot Node, and communicate with other 24 Nodes (<25)
NO_OF_NODES=25

if __name__ == '__main__':
    print ("Do not run this. Like you just did. Don't.")
    
    
