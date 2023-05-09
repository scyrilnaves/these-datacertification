from web3 import Web3,HTTPProvider
#Add Middleware for POA to transalate request between web3 py and Geth Node
#Ref: https://web3py.readthedocs.io/en/stable/middleware.html#geth-style-proof-of-authority
from web3.middleware import geth_poa_middleware
import json
import time
import csv
import pandas as pd

import rlp
from eth_utils import (
    keccak,
)

import requests

geth_http = "http://10.214.226.142:2000"

maincontractaddress="0xc93be610629da04fcf22f04480f4cb239ab1adc7"

web3 = Web3(HTTPProvider(geth_http))
# Add PoA middleware ==> web3.exceptions.ValidationError: The field extraData is 97 bytes, but should be 32
web3.middleware_onion.inject(geth_poa_middleware, layer=0)

def readfirstData():
  data = pd.read_csv("secondloop_python.csv",low_memory=False);
  totalresult=[]
  for index in range(0,1):
      result=[]
      blockdata=web3.eth.getBlock(int(data.iloc[index].BlockNo))
      result.insert(0,data.iloc[index].Transactionid)
      result.insert(1,data.iloc[index].Start)
      result.insert(2,data.iloc[index].End)
      result.insert(3,data.iloc[index].Lapse)
      result.insert(4,data.iloc[index].BlockNo)
      result.insert(5,blockdata.get('timestamp'))
      result.insert(6,blockdata.get('miner'))
      result.insert(7,blockdata.get('difficulty'))
      result.insert(8,blockdata.get('size'))
      result.insert(9,blockdata.get('gasLimit'))
      result.insert(10,blockdata.get('gasUsed'))
      result.insert(11,len(blockdata.get('transactions')))
      result.insert(12,len(blockdata.get('uncles')))
      result.insert(13,(blockdata.get('timestamp')-data.iloc[index].Start))
      totalresult.append(result)
  return totalresult

#https://ethereum.stackexchange.com/questions/73030/how-to-get-the-miner-address-of-a-block-with-infura-rinkeby-endpoint
#https://github.com/ethereum/go-ethereum/issues/17454
#https://github.com/ethereum/EIPs/issues/225
#https://github.com/ethereum/go-ethereum/issues/15651
def getBlockDetailforPoA_bak():
  blockdata=web3.eth.getBlock(4604)
  header=[blockdata.get('parentHash'),blockdata.get('sha3Uncles'),blockdata.get('miner'),blockdata.get('stateRoot'),blockdata.get('transactionsRoot'),blockdata.get('receiptsRoot'),blockdata.get('logsBloom'),blockdata.get('difficulty'),blockdata.get('number'),blockdata.get('gasLimit'),blockdata.get('gasUsed'),blockdata.get('timestamp'),(web3.toHex(blockdata.get('proofOfAuthorityData'))[0:130]).encode(),blockdata.get('mixHash'),blockdata.get('nonce')]
  message = rlp.encode(header)
  messagehash= keccak(message)
  #print(blockdata.get('logsBloom'))
  #print("********")
  #print((blockdata.get('proofOfAuthorityData')))
  signature=(web3.toHex(blockdata.get('proofOfAuthorityData'))[0:130])
  #print(signature.encode())
  #r="0x"+signature[0:64]
  #s="0x"+signature[64:128]
  #v="0x"+signature[128:130]
  #vint = int(v)+27
  #a=web3.geth.clique_getSignersAtHash(blockdata.get('hash'))
  #print(web3.HTTPProvider)
  hash=web3.toHex(blockdata.get('hash'))
  a = web3.HTTPProvider.make_request(method="clique_getSignersAtHash",params=[hash])
  print(a)
  #print(web3.eth.account.recoverHash(messagehash,signature))



""" 
Custom Call for Clique API
# https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/api.go
# 
#  """
def directrpc():
  account = web3.eth.accounts[0]
  blockdata=web3.eth.getBlock(1)
  hashe=web3.toHex(blockdata.get('hash'))
  method = 'clique_getSignersAtHash'
  payload= {"jsonrpc" : "2.0",
            "method" : method,
            "params" : [hashe],
            "id"     : 1}
  headers = {'Content-type' : 'application/json'}
  session = requests.Session()
  response = session.post(geth_http, json=payload, headers=headers)
    # print('raw json response: {}'.format(response.json()))
  tx = response.json()
        
  print ("[sent directly via RPC]", end=" ")
  print('raw json response: {}'.format(response.json()))
  print (tx)

def getTransaction():
   with open("finalloop_python.csv","w") as csvfile:
    fieldname=['Transactionid','Start','End','Lapse','BlockNo','BlockTimeStamp','Blockminer','Difficulty',
                        'Blocksize','BlockGasLimit','BlockGasUsed','BlockTransactions','BlockUncles','TotalTime']
    writer=csv.DictWriter(csvfile,fieldnames=fieldname)
    writer.writeheader()
    txarray=readfirstData()
    for row in txarray:
      writer.writerow({'Transactionid':row[0],'Start':row[1],'End':row[2],'Lapse':row[3],'BlockNo':row[4],'BlockTimeStamp':row[5],'Blockminer':row[6],'Difficulty':row[7],
                        'Blocksize':row[8],'BlockGasLimit':row[9],'BlockGasUsed':row[10],'BlockTransactions':row[11],'BlockUncles':row[12],'TotalTime':row[13]})

#getTransaction()
#getBlockDetailforPoA()
directrpc()

