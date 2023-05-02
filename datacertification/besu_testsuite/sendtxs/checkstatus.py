from web3 import Web3,HTTPProvider
#CHECK ULIMIT
#e.g: ulimit -n 10000
import json
import time
import csv

#requests library
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry


from config import RPCaddress_http,CONTRACT_ADDRESS_FILE

geth_http = RPCaddress_http

web3 = Web3(HTTPProvider(geth_http))
from web3._utils.abi import filter_by_name, abi_to_signature
from web3._utils.encoding import pad_hex

#MongoDB
from pymongo import MongoClient,errors

#threading
from threading import Thread

#queuing
from queue import Queue

import sys

iteration_value=1


def readAbiData():
  with open('accident.json') as jsonfile:
    abidata = json.load(jsonfile)
    return abidata
   
def sendTransaction():
   permissionedaddress="0xf9eae0f545c0d5b1f1538df4746e46bf2c90d381"
   metadata="test"
   CONTRACT_ADDRESS_LOAD =  json.load(open(CONTRACT_ADDRESS_FILE, 'r'))
   CONTRACT_ADDRESS = CONTRACT_ADDRESS_LOAD["address"]
   contract = web3.eth.contract(address=Web3.toChecksumAddress(CONTRACT_ADDRESS),abi=readAbiData())
  
   totalresult=[]
   gashex = web3.toHex(5000000)
   gaspricehex = web3.toHex(0)
   threadsarray=[]
   session = requests.Session()
   retry = Retry(connect=3, backoff_factor=0.5)
   adapter = HTTPAdapter(max_retries=retry)
   session.mount('http://', adapter)
   session.mount('https://', adapter)
   
   q = Queue()
   howManyLeft=1
   batchSize=1
   iter=0
    
   def worker():
        while True:
            item = q.get()
            threadfunction(item,contract,gashex,gaspricehex,totalresult,session)
            q.task_done()
   #num_worker_threads
   for i in range(1):
         t = Thread(target=worker)
         t.daemon = True
         t.start()
   #print ("%d worker threads created." % 100)

  
   #print ("%d items queued." % 10)
   while howManyLeft>0:

    for index in range((iter*batchSize),(batchSize*(iter+1))):
        q.put (index)
    #print ("%d items queued." % 10)

    q.join()
    howManyLeft -= batchSize
    iter=iter+1
    
   return totalresult

#https://github.com/ethereum/wiki/wiki/JSON-RPC


def threadfunction(increment,contract,gashex,gaspricehex,totalresult,session):
  result=[]
  starttime=int(round(time.time()))
  admin_counter= contract.functions.admin_counter().call()
  print('admin_counter:')
  print(admin_counter)
  factory_counter=contract.functions.factory_counter().call()
  print('factory_counter:')
  print(factory_counter)
  storage_counter=contract.functions.car_storage_counter().call()
  print('car_counter:')
  print(storage_counter)
  accident_counter=contract.functions.accidents_storage_counter().call()
  print('accident_counter:')
  print(accident_counter)


sendTransaction()

