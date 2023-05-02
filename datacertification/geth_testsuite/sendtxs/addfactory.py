from web3 import Web3,HTTPProvider
from time import sleep
import json
import time
import csv

import websocket
#requests library
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

from config import RPCaddress_miner1, NUMBER_OF_FACTORY_TRANSACTIONS, CONTRACT_ADDRESS_FILE, CLIENT_FACTORY_THREADS

geth_ws = RPCaddress_miner1



web3 = Web3(Web3.WebsocketProvider(geth_ws))
from web3._utils.abi import filter_by_name, abi_to_signature
from web3._utils.encoding import pad_hex

#threading
from threading import Thread

#queuing
from queue import Queue

#websocket
ws = websocket.WebSocket()
totalnonce=0
part=0

def readAbiData():
  with open('accident.json') as jsonfile:
    abidata = json.load(jsonfile)
    return abidata
   
def sendTransaction():
   account = web3.eth.accounts[0]
   walletnonce = web3.eth.getTransactionCount(account)
   CONTRACT_ADDRESS_LOAD =  json.load(open(CONTRACT_ADDRESS_FILE, 'r'))
   CONTRACT_ADDRESS = CONTRACT_ADDRESS_LOAD["address"]
   contract = web3.eth.contract(address=Web3.toChecksumAddress(CONTRACT_ADDRESS),abi=readAbiData())
   #txpool.status gets general txpool not with account specific
   #txpool.inspect & txpool.content gets for particular account
   txpoolpending = web3.geth.txpool.inspect().get('pending').get(account)
   pendinglist=0
   if(txpoolpending==None):
    pendinglist=0
   else:
    pendinglist=len(txpoolpending)
   totalnonce=0
   if(pendinglist!=0):
    totalnonce=(walletnonce+pendinglist)
   else:
    totalnonce=walletnonce
   totalresult=[]
   gashex = web3.toHex(5000000)
   gaspricehex = web3.toHex(1)
   threadsarray=[]
   ws.connect(geth_ws)
   txparam=contract.functions.addFactory(Web3.toChecksumAddress(account)).buildTransaction({
    'from': account
    })
   q=Queue()
   howManyLeft=NUMBER_OF_FACTORY_TRANSACTIONS
   batchSize=int(NUMBER_OF_FACTORY_TRANSACTIONS)
   iter=0
   
   def worker():
    while True:
            item = q.get()
            threadfunction(item,txparam,totalnonce,gashex,gaspricehex,totalresult,ws)
            q.task_done()
   #num_worker_threads
   #10,20
   for i in range(CLIENT_FACTORY_THREADS):
         t = Thread(target=worker)
         t.daemon = True
         t.start()
    #print ("%d worker threads created." % 100)
   while howManyLeft>0:
    
    for index in range((iter*batchSize),(batchSize*(iter+1))):
        q.put (index)
    #print ("%d items queued." % 10)
    
    q.join()
    howManyLeft -= batchSize
    iter=iter+1
    #q.join()
   return totalresult

#https://github.com/ethereum/wiki/wiki/JSON-RPC


def threadfunction(increment,txparam,totalnonce,gashex,gaspricehex,totalresult,ws):
  result=[]
  starttime=int(round(time.time()))
  txparame={
    'chainId':web3.toHex(txparam.get('chainId')),
    'from':str(txparam.get('from')),
    'nonce':web3.toHex(totalnonce+increment),
    'gas':gashex,
    'gasPrice':gaspricehex,
    'to':str(txparam.get('to')),
    'data':str(txparam.get('data'))
    }
  method = 'eth_sendTransaction'
  request=dict(jsonrpc="2.0",
            method = method,
            params = [txparame],
            id = 1)
  ws.send(json.dumps(request))
  response = ws.recv()

  endtime=int(round(time.time()))
  jsonresponse = json.loads(response)
  if 'result' not in jsonresponse:
        result.insert(0,jsonresponse['error'])
  else:
        result.insert(0,jsonresponse['result'])
        result.insert(1,starttime)
        result.insert(2,endtime)
        result.insert(3,endtime-starttime)
        totalresult.append(result)
  return result

sendTransaction()

