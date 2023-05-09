from web3 import Web3,HTTPProvider

import json
import time
import csv

geth_ws = "ws://10.214.226.142:2200"

maincontractaddress="0xc93be610629da04fcf22f04480f4cb239ab1adc7"

web3 = Web3(Web3.WebsocketProvider(geth_ws))

#threading
from threading import Thread

#queuing
from queue import Queue

def readAbiData():
  with open('../../main.json') as jsonfile:
    abidata = json.load(jsonfile)
    return abidata
   
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
   q = Queue()
    
   def worker():
        while True:
            item = q.get()
            threadfunction(item,account,maincontractaddress,totalnonce,maincontractfunctionabi,totalresult)
            q.task_done()
   #num_worker_threads
   for i in range(1000):
         t = Thread(target=worker)
         t.daemon = True
         t.start()
   #print ("%d worker threads created." % 100)

   for i in range(100000):
        q.put (i)
   #print ("%d items queued." % 10)

   q.join()
   return totalresult

def threadfunction(increment,account,maincontractaddress,totalnonce,maincontractfunctionabi,totalresult):
  result=[]
  starttime=int(round(time.time()))
  txhash=web3.eth.sendTransaction({
       'from': account,
       'gas': 5000000,
       'gasPrice': 0,
       'to':Web3.toChecksumAddress(maincontractaddress),
       'nonce':hex(totalnonce+increment),
       'data':maincontractfunctionabi
    })
  endtime=int(round(time.time()))
  result.insert(0,web3.toHex(txhash))
  result.insert(1,starttime)
  result.insert(2,endtime)
  result.insert(3,starttime-endtime)
  totalresult.append(result)
  return result

def getTransaction():
   with open("web3_async_queue_ws.csv","w") as csvfile:
    fieldname=['Transactionid','Start','End','Lapse']
    writer=csv.DictWriter(csvfile,fieldnames=fieldname)
    writer.writeheader()
    txarray=sendTransaction()
    for row in txarray:
      writer.writerow({'Transactionid':row[0],'Start':row[1],'End':row[2],'Lapse':row[3]})

getTransaction()

