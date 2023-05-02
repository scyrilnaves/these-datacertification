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

from config import RPCaddress, CLIENT_FUND_THREADS,NO_OF_NODES

geth_ws = RPCaddress

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
   nodedata = pd.read_csv("../utility/node_account.csv",low_memory=False);
   inputdata = pd.read_csv("account.csv",low_memory=False);
   no_of_transaction_per_node=int(len(inputdata)/NO_OF_NODES)
   remaining_transaction_per_node=int(len(inputdata)-(no_of_transaction_per_node*NO_OF_NODES))
   print(no_of_transaction_per_node)
   print(remaining_transaction_per_node)
   ws.connect(geth_ws)
   signed_tx_array=[]
   totalresult=[]
   gashex = web3.toHex(5000000)
   gaspricehex = web3.toHex(1)
   q=Queue()
   i=0
   remainingindex=0
   for k in range(0,NO_OF_NODES):
     if(i<len(inputdata)):
      #Leaving 0 for bootnode
      j=0
      account = Web3.toChecksumAddress(nodedata.iloc[k].Public_Key)
      walletnonce = web3.eth.getTransactionCount(account)
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
      while j<no_of_transaction_per_node:
       txparame={
       'chainId':123456,
       'from':str(account),
       'nonce':web3.toHex(totalnonce+j),
       'gas':gashex,
       'gasPrice':gaspricehex,
       'to':str(Web3.toChecksumAddress(inputdata.iloc[i].PublicKey)),
       'value':web3.toHex(9999999999)
       }
       sig=web3.eth.account.sign_transaction(txparame,nodedata.iloc[k].Private_Key)
       signed_tx_array.append(sig.rawTransaction)
       i=i+1
       j=j+1
      remainingindex = i;
      if(k==(NO_OF_NODES-1)):
         print(remainingindex)
         while remainingindex <len(inputdata):
          txparame={
           'chainId':123456,
           'from':str(account),
           'nonce':web3.toHex(totalnonce+j),
           'gas':gashex,
           'gasPrice':gaspricehex,
           'to':str(Web3.toChecksumAddress(inputdata.iloc[remainingindex].PublicKey)),
           'value':web3.toHex(9999999999)
          }
          sig=web3.eth.account.sign_transaction(txparame,nodedata.iloc[k].Private_Key)
          signed_tx_array.append(sig.rawTransaction)
          remainingindex=remainingindex+1
          j=j+1

   def worker():
     while True:
            item = q.get()
            threadfunction(signed_tx_array[item],totalresult,ws)
            q.task_done()
  #num_worker_threads
   #10,20
   for i in range(CLIENT_FUND_THREADS):
         t = Thread(target=worker)
         t.daemon = True
         t.start()
    #print ("%d worker threads created." % 100)

    
   for index in range(0,len(signed_tx_array)):
        q.put (index)
    #print ("%d items queued." % 10)
    
   q.join()
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

