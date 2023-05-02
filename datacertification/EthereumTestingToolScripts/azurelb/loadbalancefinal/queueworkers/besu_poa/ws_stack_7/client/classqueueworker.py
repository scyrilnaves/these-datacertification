import pika

import time

import redis

from web3 import Web3,HTTPProvider
from time import sleep
import json
import time
import csv
import threading
import websocket
#requests library
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

#MongoDB
from pymongo import MongoClient,errors

from web3._utils.abi import filter_by_name, abi_to_signature
from web3._utils.encoding import pad_hex

#threading
from threading import Thread

#queuing
from queue import Queue

#redislock
#pip install python-redis-lock
import redis_lock

import sys

class QueueWorker(threading.Thread):
       
    def threadfunction(self,redisnonce,channel,method, properties, body,mileage):
     self.nws = websocket.WebSocket()
     self.nws.connect(self.geth_ws)
     starttime=int(round(time.time()))
     txparam=self.contract.functions.addTest(100).buildTransaction({
      'chainId':int(26),
      'from': self.account,
      'nonce':self.web3.toHex(redisnonce),
      'gas':self.gashex,
      'gasPrice':self.gaspricehex
       })
     signedtx=self.web3.eth.account.signTransaction(txparam,self.privkey)
     method = 'eth_sendRawTransaction'
     payload= {"jsonrpc" : "2.0",
            "method" : method,
            "params" : [self.web3.toHex(signedtx.rawTransaction)],
            "id"     : 1}

     self.nws.send(json.dumps(payload))
     response = self.nws.recv()
     self.nws.close()
     endtime=int(round(time.time()))
     lapse=endtime-starttime
     jsonresponse = json.loads(response)
     #print(jsonresponse)
     
     if 'result' not in jsonresponse:
        resulterror={'Transactionid':jsonresponse['error'],'Start':starttime,'End':endtime,'Lapse':lapse,'Iteration':mileage}
        try:
         self.errors.insert_one(resulterror)
        except errors.ServerSelectionTimeoutError as err:
         # catch pymongo.errors.ServerSelectionTimeoutError
         print ("pymongo ERROR:", err)
     else:
        resultdocument={'Transactionid':str(jsonresponse['result']),'Start':starttime,'End':endtime,'Lapse':lapse,'Iteration':mileage}
        try:
         self.results.insert_one(resultdocument)
        except errors.ServerSelectionTimeoutError as err:
         # catch pymongo.errors.ServerSelectionTimeoutError
         print ("pymongo ERROR:", err)

    def readAbiData(self):
     with open('main.json') as jsonfile:
       abidata = json.load(jsonfile)
       return abidata

    def callback(self,channel,method, properties, body):
      mileage = body.decode()
      try:
          with redis_lock.Lock(self.redisserver,"noncelock") as lock:
            noncevar = int(self.redisserver.get('nonce').decode('utf-8'))
            self.redisserver.set('nonce',noncevar+1)
      except Exception as e:
          print('lock wasnt acquired'+str(e))
      self.threadfunction(noncevar,channel,method,properties,body,mileage)
      channel.basic_ack(delivery_tag=method.delivery_tag)

        
    def __init__(self):
        threading.Thread.__init__(self)
        
        #Dynamic Params
        self.geth_ws = str(sys.argv[1])
        #"ws://10.214.226.142:2200"
        self.host= str(sys.argv[2])
        #"10.214.226.36"
        self.workertype="A"
        self.nodetype="Node1"

        self.maincontractaddress="0x37C710580ac69727706588e91b216E47681718B3"
        self.mongodbhost='10.0.2.11'
        self.mongodbport=str(sys.argv[3])
        #'27017'
        self.redishost='172.25.0.1'
        self.redisinstance=[(self.redishost,6379)]
        self.rabbithost=str(sys.argv[4])
        #'172.25.0.102'
        self.rabbitport='5672'
        self.nonce=0
        self.account=Web3.toChecksumAddress(str(sys.argv[5]))
        self.privkey=str(sys.argv[6])

        #websocket
        self.ws = websocket.WebSocket()
        #threadqueue
        self.totalresult=[] 
        self.web3 = Web3(Web3.WebsocketProvider(self.geth_ws))
        self.contract = self.web3.eth.contract(address=Web3.toChecksumAddress(self.maincontractaddress),abi=self.readAbiData())
        self.gashex = self.web3.toHex(5000000)
        self.gaspricehex = self.web3.toHex(1)
        self.ws.connect(self.geth_ws)

        
        self.pool = redis.ConnectionPool(host=self.redishost, port=6379, db=0)
        self.redisserver = redis.Redis(connection_pool=self.pool)
        if self.redisserver.get('nonce')==None:
          try:
           with redis_lock.Lock(self.redisserver,"noncelock") as lock:
            method_pen = 'eth_getTransactionCount'
            payload_pen= {"jsonrpc" : "2.0",
            "method" : method_pen,
            "params" : [self.account,'latest'],
            "id"     : 1}
            headers = {'Content-type' : 'application/json'}

            self.ws.send(json.dumps(payload_pen))
            response=self.ws.recv()
            jsonresponse = json.loads(response)
            walletnonce=Web3.toInt(hexstr=jsonresponse['result'])
            self.redisserver.set('nonce',walletnonce)
          except Exception as e:
            print('lock wasnt acquired'+str(e))       
        
        #print mongodb
        try:
         self.client=MongoClient(host=[str(self.mongodbhost)+':'+str(self.mongodbport)],serverSelectionTimeoutMS=3000,username='guest',password='guest')
         self.db = self.client.resultdb
         self.results = self.db.results
         self.errors = self.db.errors
        except errors.ServerSelectionTimeoutError as err:
         # catch pymongo.errors.ServerSelectionTimeoutError
         print ("pymongo ERROR:", err)
    

        self.credentials = pika.PlainCredentials('guest', 'guest')
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(self.rabbithost,self.rabbitport,'/',self.credentials))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue='transactionqueue', durable=True)
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue='transactionqueue',on_message_callback=self.callback)

        
        
    def run(self):
      self.channel.start_consuming()
      

for i in range(2):
    t = QueueWorker()
    t.start()





