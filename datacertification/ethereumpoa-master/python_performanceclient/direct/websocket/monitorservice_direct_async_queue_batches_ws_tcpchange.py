from web3 import Web3,HTTPProvider

import json
import time
import csv

from websocket import create_connection
import socket
#requests library
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

geth_ws = "ws://10.214.226.142:2200"

maincontractaddress="0xc93be610629da04fcf22f04480f4cb239ab1adc7"

web3 = Web3(Web3.WebsocketProvider(geth_ws))
from web3._utils.abi import filter_by_name, abi_to_signature
from web3._utils.encoding import pad_hex

#threading
from threading import Thread

#queuing
from queue import Queue

#websocket
ws = create_connection(geth_ws,sockopt=((socket.IPPROTO_TCP,socket.TCP_NODELAY,3),))

def readAbiData():
  with open('../../main.json') as jsonfile:
    abidata = json.load(jsonfile)
    return abidata

def contract_method_ID(methodname, abi):
    
    """
    build the 4 byte ID, from abi & methodname
    """
    method_abi = filter_by_name(methodname, abi)
    assert(len(method_abi)==1)
    method_abi = method_abi[0]
    method_signature = abi_to_signature(method_abi) 
    method_signature_hash_bytes = web3.sha3(text=method_signature) 
    method_signature_hash_hex = web3.toHex(method_signature_hash_bytes)
    method_signature_hash_4bytes = method_signature_hash_hex[0:10]
    return method_signature_hash_4bytes

def argument_encoding(contract_method_ID, arg1,arg2):
    """
    concatenate method ID + padded parameter
    """
    arg1_hex = web3.toHex(str.encode(arg1))
    arg1_hex_padded = pad_hex ( arg1_hex, bit_size=256)

    arg2_hex = web3.toHex(str.encode(arg2))
    arg2_hex_padded = pad_hex ( arg2_hex, bit_size=256)

    data = contract_method_ID + arg1_hex_padded [2:]+ arg2_hex_padded [2:]
    return data
   
def sendTransaction():
   permissionedaddress="0xf9eae0f545c0d5b1f1538df4746e46bf2c90d381"
   metadata="test"
   account = web3.eth.accounts[0]
   walletnonce = web3.eth.getTransactionCount(account)
   contract = web3.eth.contract(address=Web3.toChecksumAddress(maincontractaddress),abi=readAbiData())
   maincontractfunctionabi=contract.encodeABI(fn_name="createParticipant",args=[Web3.toChecksumAddress(permissionedaddress), metadata])
   txpoolcontent = web3.geth.txpool.content()
   pendinglist = txpoolcontent.get('pending')
   totalnonce=0
   if(len(pendinglist)!=0):
    pendinglistlength = len(pendinglist.get(account))
    totalnonce=(walletnonce+pendinglistlength)
   else:
    totalnonce=walletnonce
   totalresult=[]
   method_ID = contract_method_ID("createParticipant", contract.abi) # TODO: make this "set" flexible for any method name
   data = argument_encoding(method_ID, permissionedaddress,metadata)
   gashex = web3.toHex(5000000)
   gaspricehex = web3.toHex(0)
   threadsarray=[]
   ws.connect(geth_ws)
   q = Queue()
   howManyLeft=100000
   batchSize=100000
   iter=0
   
   def worker():
        while True:
            item = q.get()
            threadfunction(item,account,maincontractaddress,totalnonce,gashex,gaspricehex,data,totalresult,ws)
            q.task_done()
    #num_worker_threads
   for i in range(10000):
         t = Thread(target=worker)
         t.daemon = True
         t.start()
    #print ("%d worker threads created." % 100)
   while howManyLeft>0:
    
    for i in range((iter*batchSize),(batchSize*(iter+1))):
        q.put (i)
    #print ("%d items queued." % 10)

    q.join()
    howManyLeft -= batchSize
    iter=iter+1
   return totalresult

#https://github.com/ethereum/wiki/wiki/JSON-RPC


def threadfunction(increment,account,maincontractaddress,totalnonce,gashex,gaspricehex,data,totalresult,ws):
  result=[]
  starttime=int(round(time.time()))

  txParameters = {'from': account, 
                    'to' : maincontractaddress,
                    'nonce':hex(totalnonce+increment),
                    'gas' : gashex,
                    'gasPrice':gaspricehex,
                    'data' : data} 
  method = 'eth_sendTransaction'
  request=dict(jsonrpc="2.0",
            method = method,
            params = [txParameters],
            id = 1)
  ws.send(json.dumps(request))
  response = ws.recv()

  endtime=int(round(time.time()))
  
  result.insert(0,json.loads(response)['result'])
  result.insert(1,starttime)
  result.insert(2,endtime)
  result.insert(3,endtime-starttime)
  totalresult.append(result)
  return result


def getTransaction():
   with open("direct_async_queue_batches_ws_3.csv","w") as csvfile:
    fieldname=['Transactionid','Start','End','Lapse']
    writer=csv.DictWriter(csvfile,fieldnames=fieldname)
    writer.writeheader()
    txarray=sendTransaction()
    for row in txarray:
      writer.writerow({'Transactionid':row[0],'Start':row[1],'End':row[2],'Lapse':row[3]})

getTransaction()

