from web3 import Web3,HTTPProvider

import json
import time
import csv

import websocket
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
ws = websocket.WebSocket()

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
   
def getNonce():
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
   print ("totalnonce: ")
   print(totalnonce)
   print ("queued: ")
   print(len((txpoolcontent.get('queued'))))
   print ("pending: ")
   print((txpoolcontent.get('pending')))
  

getNonce()

