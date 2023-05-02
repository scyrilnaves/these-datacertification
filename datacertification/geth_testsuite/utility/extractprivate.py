from web3 import Web3,HTTPProvider
import json
import csv

from config import RPCaddress

geth_ws = RPCaddress

web3 = Web3(Web3.WebsocketProvider(geth_ws))

def extractprivatekey():
  with open("node_account.csv","w") as csvfile:
       fieldname=['Public_Key','Private_Key']
       writer=csv.DictWriter(csvfile,fieldnames=fieldname)
       writer.writeheader()  
  with open('keystorefile.txt') as inputfile:
    content = inputfile.readlines()
    for line in content:
      jsondata = json.loads(line)
      public_key=str('0x'+(jsondata['address']))
      private_key = web3.toHex(web3.eth.account.decrypt(line, '123'))
    
      with open("node_account.csv","a") as csvfile:
       fieldname=['Public_Key','Private_Key']
       writer=csv.DictWriter(csvfile,fieldnames=fieldname)
       writer.writerow({'Public_Key':public_key,'Private_Key':private_key})

extractprivatekey()