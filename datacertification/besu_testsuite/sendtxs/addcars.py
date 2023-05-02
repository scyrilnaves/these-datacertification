from web3 import Web3,HTTPProvider
from time import sleep
import json
import time
import csv

import websocket
import pandas as pd
#requests library
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from web3.middleware import geth_poa_middleware
from config import RPCaddress,CONTRACT_ADDRESS_FILE, CLIENT_CAR_THREADS,NO_OF_NODES

geth_ws = RPCaddress

web3 = Web3(Web3.WebsocketProvider(geth_ws))
from web3._utils.abi import filter_by_name, abi_to_signature
from web3._utils.encoding import pad_hex

#threading
from threading import Thread

#queuing
from queue import Queue

#MongoDB
from pymongo import MongoClient,errors

#websocket
ws = websocket.WebSocket()
totalnonce=0
part=0
web3.middleware_onion.inject(geth_poa_middleware, layer=0)
def readAbiData():
  with open('accident.json') as jsonfile:
    abidata = json.load(jsonfile)
    return abidata
   
def sendTransaction():
   nodedata = pd.read_csv("../utility/node_account.csv",low_memory=False);
   inputdata = pd.read_csv("../bootstrap/account.csv",low_memory=False);
   ws.connect(geth_ws,timeout=1000)

   CONTRACT_ADDRESS_LOAD =  json.load(open(CONTRACT_ADDRESS_FILE, 'r'))
   CONTRACT_ADDRESS = CONTRACT_ADDRESS_LOAD["address"]
   contract = web3.eth.contract(address=Web3.toChecksumAddress(CONTRACT_ADDRESS),abi=readAbiData())
   #txpool.status gets general txpool not with account specific
   #txpool.inspect & txpool.content gets for particular account
  
   totalresult=[]
   gashex = web3.toHex(5000000)
   gaspricehex = web3.toHex(1)
   signed_tx_array=[]
   q=Queue()
   for i in range (0, 1):
    #Leaving 0 for bootnode
    account = Web3.toChecksumAddress(nodedata.iloc[i].Public_Key)
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
    for k in range(0,len(inputdata)):
      tx=contract.functions.addCar(Web3.toChecksumAddress(inputdata.iloc[k].PublicKey)).buildTransaction({
       'chainId':123456,
       'from': account,
       'gas':gashex,
       'gasPrice':gaspricehex,
       })
      txparame={
      'chainId':web3.toHex(tx.get('chainId')),
      'from':str(tx.get('from')),
      'nonce':web3.toHex(totalnonce+k),
      'gas':gashex,
      'gasPrice':gaspricehex,
      'to':str(tx.get('to')),
      'data':str(tx.get('data'))
      }
      sig=web3.eth.account.sign_transaction(txparame,nodedata.iloc[i].Private_Key)
      signed_tx_array.append(sig.rawTransaction)
   howManyLeft=len(inputdata)
   batchSize=int(howManyLeft/2)
   iter=0
   #websocket.enableTrace(True)
   #ws = websocket.WebSocketApp(geth_ws)
   #ws.run_forever()
   def worker():
    while True:
            item = q.get()
            threadfunction(signed_tx_array[item],totalresult,ws)
            q.task_done()
   #num_worker_threads
   #10,20
   for i in range(CLIENT_CAR_THREADS):
         t = Thread(target=worker)
         t.daemon = True
         t.start()
    #print ("%d worker threads created." % 100)
   while howManyLeft>0:
    
    for index in range(0,len(inputdata)):
        q.put (index)
    #print ("%d items queued." % 10)
    
    q.join()
    howManyLeft -= batchSize
    iter=iter+1
    #q.join()
   return totalresult

#https://github.com/ethereum/wiki/wiki/JSON-RPC


def threadfunction(sig_tx,totalresult,ws):
  result=[]
  starttime=int(round(time.time()))
  txparam=web3.toHex(sig_tx)
  method = 'eth_sendRawTransaction'
  request=dict(jsonrpc="2.0",
            method = method,
            params = [txparam],
            id = 1)
  ws.send(json.dumps(request))
  response = ws.recv()
  endtime=int(round(time.time()))
  jsonresponse = json.loads(response)
  print(jsonresponse)
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

