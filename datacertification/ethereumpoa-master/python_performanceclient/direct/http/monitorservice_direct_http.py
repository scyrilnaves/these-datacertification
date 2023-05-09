from web3 import Web3,HTTPProvider
#CHECK ULIMIT
#e.g: ulimit -n 10000
import json
import time
import csv

import requests

geth_http = "http://10.214.226.142:2000"

maincontractaddress="0xc93be610629da04fcf22f04480f4cb239ab1adc7"

web3 = Web3(HTTPProvider(geth_http))
#import web3
from web3._utils.abi import filter_by_name, abi_to_signature
from web3._utils.encoding import pad_hex

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
   for i in range (0,100000):
    result=[]
    starttime=int(round(time.time()))

    txParameters = {'from': account, 
                    'to' : maincontractaddress,
                    'nonce':hex(totalnonce+i),
                    'gas' : gashex,
                    'gasPrice':gaspricehex,
                    'data' : data} 
    method = 'eth_sendTransaction'
    payload= {"jsonrpc" : "2.0",
            "method" : method,
            "params" : [txParameters],
            "id"     : 1}
    headers = {'Content-type' : 'application/json'}
    #session = requests.Session()
    response = requests.post(geth_http, json=payload, headers=headers)
    # print('raw json response: {}'.format(response.json()))
    #tx = response.json()
    #print(response.json().get('result'))   
    #print ("[sent directly via RPC]", end=" ")
    #print('raw json response: {}'.format(response.json()))
    #print (tx)

    endtime=int(round(time.time()))
    result.insert(0,response.json().get('result'))
    result.insert(1,starttime)
    result.insert(2,endtime)
    result.insert(3,starttime-endtime)
    totalresult.append(result)
   return totalresult

#https://github.com/ethereum/wiki/wiki/JSON-RPC


def getTransaction():
   with open("direct_http.csv","w") as csvfile:
    fieldname=['Transactionid','Start','End','Lapse']
    writer=csv.DictWriter(csvfile,fieldnames=fieldname)
    writer.writeheader()
    txarray=sendTransaction()
    for row in txarray:
      writer.writerow({'Transactionid':row[0],'Start':row[1],'End':row[2],'Lapse':row[3]})

getTransaction()

