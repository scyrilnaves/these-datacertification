from web3 import Web3,HTTPProvider
import json
import csv
import time

import websocket
#requests library
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

#Set the Websocket link
geth_ws = "ws://10.0.0.1:2000"
#Set the contract address
maincontractaddress="0x0000000"
#Set the no of threads
clientthreads=10000
#Totaltransaction
totaltxs=200000

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
  with open('main.json') as jsonfile:
    abidata = json.load(jsonfile)
    return abidata
   
def sendTransaction():
   account = web3.eth.accounts[0]
   walletnonce = web3.eth.getTransactionCount(account)
   contract = web3.eth.contract(address=Web3.toChecksumAddress(maincontractaddress),abi=readAbiData())
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
   txparam=contract.functions.createTest(100).buildTransaction({
    'from': account
    })
   q=Queue()
   howManyLeft=totaltxs
   batchSize=50000
   iter=0
   
   def worker():
    while True:
            item = q.get()
            threadfunction(item,txparam,totalnonce,gashex,gaspricehex,totalresult,ws)
            q.task_done()
   #num_worker_threads
   for i in range(clientthreads):
         t = Thread(target=worker)
         t.daemon = True
         t.start()

   while howManyLeft>0:
    
    for index in range((iter*batchSize),(batchSize*(iter+1))):
        q.put (index)
    
    q.join()
    howManyLeft -= batchSize
    iter=iter+1
   return totalresult

#https://github.com/ethereum/wiki/wiki/JSON-RPC


def threadfunction(increment,txparam,totalnonce,gashex,gaspricehex,totalresult,ws):
  result=[]
  starttime=int(round(time.time()))
  txparame={
    'chainId':int(txparam.get('chainId')),
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


def getTransaction():
   with open("result.csv","w") as csvfile:
    fieldname=['Transactionid','Start','End','Lapse']
    writer=csv.DictWriter(csvfile,fieldnames=fieldname)
    writer.writeheader()
    txarray=sendTransaction()
    for row in txarray:
      writer.writerow({'Transactionid':row[0],'Start':row[1],'End':row[2],'Lapse':row[3]})

getTransaction()

