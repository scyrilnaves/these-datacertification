from web3 import Web3,HTTPProvider
from time import sleep
import json
import time
import csv
import sys
import websocket
import pandas as pd
#requests library
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from web3.middleware import geth_poa_middleware

from time import sleep

from config import RPCaddress_direct_miner1,CONTRACT_ADDRESS_FILE, CLIENT_ACCIDENT_THREADS,NUMBER_OF_ACCIDENT_TRANSACTIONS,TPS,MONGO_DB

geth_ws = RPCaddress_direct_miner1
iteration_value=str(sys.argv[1])
#geth_ws = RPCaddress

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
   
   CONTRACT_ADDRESS_LOAD =  json.load(open(CONTRACT_ADDRESS_FILE, 'r'))
   CONTRACT_ADDRESS = CONTRACT_ADDRESS_LOAD["address"]
   contract = web3.eth.contract(address=Web3.toChecksumAddress(CONTRACT_ADDRESS),abi= readAbiData())
   #txpool.status gets general txpool not with account specific
   #txpool.inspect & txpool.content gets for particular account
   sleepTime = (CLIENT_ACCIDENT_THREADS)/ TPS
   totalresult=[]
   gashex = web3.toHex(5000000)
   gaspricehex = web3.toHex(1)
   threadsarray=[]
   ws.connect(geth_ws,timeout=1000)
   q=Queue()
   inputdata = pd.read_csv("../bootstrap/account.csv",low_memory=False);
   txperaccount = int(NUMBER_OF_ACCIDENT_TRANSACTIONS/len(inputdata))
   signedtxarray=[]
   accidenthash="0X589d3d368d6df58f9e8d72b8c5b409fa29a32147c10799b24f60d2985e8bccbd"
   for i in range (0, len(inputdata)):
      account = inputdata.iloc[i].PublicKey
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
      tx=contract.functions.declareAccident(accidenthash).buildTransaction({
          'from': inputdata.iloc[i].PublicKey,
          'chainId':123456,
          'gas':gashex,
          'gasPrice':gaspricehex,
          })
      for j in range (0,txperaccount):
         txparame={
         'chainId':int(tx.get('chainId')),
         'gas':gashex,
         'nonce':web3.toHex(totalnonce+j),
         'gasPrice':gaspricehex,
         'from':str(tx.get('from')),
         'to':str(tx.get('to')),
         'data':str(tx.get('data'))
        }
         sig=web3.eth.account.sign_transaction(txparame,inputdata.iloc[i].PrivateKey)
         signedtxarray.append(sig.rawTransaction)
   howManyLeft=NUMBER_OF_ACCIDENT_TRANSACTIONS
   batchSize=int(NUMBER_OF_ACCIDENT_TRANSACTIONS/2)
   iter=0
   
   def worker():
    while True:
            item = q.get()
            threadfunction(signedtxarray[item],totalresult,sleepTime,ws)
            q.task_done()
   #num_worker_threads
   #10,20
   for i in range(CLIENT_ACCIDENT_THREADS):
         t =  Thread(target=worker)
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

def threadfunction(sig_tx,totalresult,sleepTime,ws):
  result=[]
  starttime=int(round(time.time()))
  txparame=web3.toHex(sig_tx)
  method = 'eth_sendRawTransaction'
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
  time.sleep(sleepTime)
  return result

def getTransaction():
   txarray=sendTransaction()
   try:
         client=MongoClient(host=[str(MONGO_DB)],serverSelectionTimeoutMS=3000,username='guest',password='guest')
         db = client.resultdb
         results = db.results
         errorsd = db.errors
   except errors.ServerSelectionTimeoutError as err:
         # catch pymongo.errors.ServerSelectionTimeoutError
         print ("pymongo ERROR:", err)

   mongoresults=[]
   for row in txarray:
        resultvalue={'Transactionid':row[0],'Start':row[1],'End':row[2],'Lapse':row[3],'Iteration':iteration_value}
        mongoresults.append(resultvalue)
   try:
     results.insert_many(mongoresults)
   except errors.ServerSelectionTimeoutError as err:
     # catch pymongo.errors.ServerSelectionTimeoutError
     print ("pymongo ERROR:", err)

getTransaction()

