from web3 import Web3,HTTPProvider

import json
import time
import csv
import pandas as pd

geth_http = "http://10.214.226.142:2000"

maincontractaddress="0xc93be610629da04fcf22f04480f4cb239ab1adc7"

web3 = Web3(HTTPProvider(geth_http))

def readfirstData():
  data = pd.read_csv("firstloop_python.csv",low_memory=False);
  totalresult=[]
  for index in range(0,len(data)):
      result=[]
      transactiondata=web3.eth.getTransaction(data.iloc[index].Transactionid)
      result.insert(0,data.iloc[index].Transactionid)
      result.insert(1,data.iloc[index].Start)
      result.insert(2,data.iloc[index].End)
      result.insert(3,data.iloc[index].Lapse)
      result.insert(4,transactiondata.get('blockNumber'))
      totalresult.append(result)
  return totalresult

def getTransaction():
   with open("secondloop_python.csv","w") as csvfile:
    fieldname=['Transactionid','Start','End','Lapse','BlockNo']
    writer=csv.DictWriter(csvfile,fieldnames=fieldname)
    writer.writeheader()
    txarray=readfirstData()
    for row in txarray:
      writer.writerow({'Transactionid':row[0],'Start':row[1],'End':row[2],'Lapse':row[3],'BlockNo':row[4]})

getTransaction()

