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
from web3.middleware import geth_poa_middleware

from config import RPCaddress_miner1, NUMBER_OF_FACTORY_TRANSACTIONS, CONTRACT_ADDRESS_FILE, CLIENT_FACTORY_THREADS
from config import NODE_ACCOUNT,NODE_PRIVATE_KEY

geth_ws = RPCaddress_miner1



web3 = Web3(Web3.WebsocketProvider(geth_ws))
web3.middleware_onion.inject(geth_poa_middleware, layer=0)
from web3._utils.abi import filter_by_name, abi_to_signature
from web3._utils.encoding import pad_hex

#threading
from threading import Thread

#queuing
from queue import Queue

#websocket
ws = websocket.WebSocket()
ws.connect(geth_ws)
totalnonce=0
part=0

def readAbiData():
  with open('accident.json') as jsonfile:
    abidata = json.load(jsonfile)
    return abidata
   
def sendTransaction():
   account=Web3.toChecksumAddress(NODE_ACCOUNT)
   CONTRACT_ADDRESS_LOAD =  json.load(open(CONTRACT_ADDRESS_FILE, 'r'))
   CONTRACT_ADDRESS = CONTRACT_ADDRESS_LOAD["address"]
   contract = web3.eth.contract(address=Web3.toChecksumAddress(CONTRACT_ADDRESS),abi=readAbiData())
   #txpool.status gets general txpool not with account specific
   #txpool.inspect & txpool.content gets for particular account
   method_pen = 'eth_getTransactionCount'
   payload_pen= {"jsonrpc" : "2.0",
            "method" : method_pen,
            "params" : [account,'latest'],
            "id"     : 1}
   headers = {'Content-type' : 'application/json'}

   ws.send(json.dumps(payload_pen))
   response=ws.recv()
   jsonresponse = json.loads(response)
   totalnonce=Web3.toInt(hexstr=jsonresponse['result'])

   totalresult=[]
   gashex = web3.toHex(5000000)
   gaspricehex = web3.toHex(1)
   threadsarray=[]
   txparam=contract.functions.addFactory(account).buildTransaction({
    'chainId':123456,
    'from': account,
    'gas':gashex,
    'gasPrice':gaspricehex,
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


#Cannot Send eth_sendTransaction for Besu instead use eth_sendRawTransaction
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
  signedtx=web3.eth.account.signTransaction(txparame,NODE_PRIVATE_KEY)
  method = 'eth_sendRawTransaction'
  payload= {"jsonrpc" : "2.0",
            "method" : method,
            "params" : [web3.toHex(signedtx.rawTransaction)],
            "id"     : 1}
  headers = {'Content-type' : 'application/json'}
  ws.send(json.dumps(payload))
  response=ws.recv()
  print(response)
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

