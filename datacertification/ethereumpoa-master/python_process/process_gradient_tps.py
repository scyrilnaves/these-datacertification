import pandas as pd
import csv

import math

# ,'web3_async_queue_batches_ws.csv' --not considered since webs.py async problem
# 'web3_async_queue_ws.csv',
# 'web3_async_ws.csv',

files=['direct_async_batches_http.csv','direct_async_batches_ws.csv','direct_async_http.csv','direct_asyncio_ws.csv','direct_async_queue_batches_http.csv','direct_async_queue_batches_ws.csv','direct_async_queue_http.csv','direct_async_queue_ws.csv','direct_async_ws.csv','direct_http.csv','direct_ws.csv','web3_async_batches.csv','web3_async.csv','web3_async_queue_batches.csv','web3_async_queue.csv','web3_blocking.csv','web3js_http_async.csv','web3js_http_batch_fast.csv','web3js_http_batch_slow.csv','web3js_ws_async.csv','web3js_ws_batch_fast.csv','web3js_ws_batch_slow.csv','web3_ws_normal.csv'];

totalresult=[];
for file in files:
    
    data = pd.read_csv("/home/renault/Documents/ethereumpoa/python_process/csv/"+file,low_memory=False);
    result = [];
    sorteddata=data.sort_values('Start');
    sorteddatalen=len(sorteddata);
    print(file)
    #Geth the first element
    firstelementstarttime=sorteddata.iloc[0].Start;
    firstelementendtime=sorteddata.iloc[0].End;
    
    #Get the First n elements
    first10kindex=math.floor(sorteddatalen/10)
    starttimefirst10k=sorteddata.iloc[first10kindex].Start;
    endtimefirst10k=sorteddata.iloc[first10kindex].End;
    if((starttimefirst10k-firstelementstarttime)==0):
     first10ktpsstart=math.floor(first10kindex);
    else:
     first10ktpsstart=math.floor(first10kindex/(starttimefirst10k-firstelementstarttime));
    if((endtimefirst10k-firstelementendtime)==0):
     first10ktpsend=math.floor(first10kindex);
    else:
      first10ktpsend=math.floor(first10kindex/(endtimefirst10k-firstelementendtime));
    
    first20kindex=math.floor(sorteddatalen/5)
    starttimefirst20k=sorteddata.iloc[first20kindex].Start;
    endtimefirst20k=sorteddata.iloc[first20kindex].End;
    if((starttimefirst20k-firstelementstarttime)==0):
     first20ktpsstart=math.floor(first20kindex);
    else:
     first20ktpsstart=math.floor(first20kindex/(starttimefirst20k-firstelementstarttime));
    if((endtimefirst20k-firstelementendtime)==0):
     first20ktpsend=math.floor(first20kindex);
    else: 
     first20ktpsend=math.floor(first20kindex/(endtimefirst20k-firstelementendtime));
    
    first50kindex=math.floor(sorteddatalen/2)
    starttimefirst50k=sorteddata.iloc[first50kindex].Start;
    endtimefirst50k=sorteddata.iloc[first50kindex].End;
    if((starttimefirst50k-firstelementstarttime)==0):
     first50ktpsstart=math.floor(first50kindex);
    else:
     first50ktpsstart=math.floor(first50kindex/(starttimefirst50k-firstelementstarttime));
    if((endtimefirst50k-firstelementendtime)==0):
     first50ktpsend=math.floor(first50kindex);
    else: 
     first50ktpsend=math.floor(first50kindex/(endtimefirst50k-firstelementendtime));
    
    first75kindex=math.floor(sorteddatalen*0.75)
    starttimefirst75k=sorteddata.iloc[first75kindex].Start;
    endtimefirst75k=sorteddata.iloc[first75kindex].End;
    if((starttimefirst75k-firstelementstarttime)==0):
     first75ktpsstart=math.floor(first75kindex);
    else:
     first75ktpsstart=math.floor(first75kindex/(starttimefirst75k-firstelementstarttime));
    if((endtimefirst75k-firstelementendtime)==0):
     first75ktpsend=math.floor(first75kindex);
    else: 
     first75ktpsend=math.floor(first75kindex/(endtimefirst75k-firstelementendtime));
    
    first100kindex=math.floor(sorteddatalen*1)
    starttimefirst100k=sorteddata.iloc[first100kindex-1].Start;
    endtimefirst100k=sorteddata.iloc[first100kindex-1].End;
    if((starttimefirst100k-firstelementstarttime)==0):
     first100ktpsstart=math.floor(first100kindex);
    else:
     first100ktpsstart=math.floor(first100kindex/(starttimefirst100k-firstelementstarttime));
    if((endtimefirst100k-firstelementendtime)==0):
     first100ktpsend=math.floor(first100kindex);
    else: 
     first100ktpsend=math.floor(first100kindex/(endtimefirst100k-firstelementendtime));

    result.insert(0, file);
    result.insert(1, first10ktpsstart);
    result.insert(2, first20ktpsstart);
    result.insert(3, first50ktpsstart);
    result.insert(4, first75ktpsstart);
    result.insert(5, first100ktpsstart);
    result.insert(6, first10ktpsend);
    result.insert(7, first20ktpsend);
    result.insert(8, first50ktpsend);
    result.insert(9, first75ktpsend);
    result.insert(10, first100ktpsend);

    totalresult.append(result);      

with open("/home/renault/Documents/ethereumpoa/python_process/results/processed.csv", 'w') as csvfile:
            fieldnames = ['file', 'first10_start_tps','first20_start_tps','first50_start_tps','first75_start_tps','first100_start_tps','first10_end_tps','first20_end_tps','first50_end_tps','first75_end_tps','first100_end_tps']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader();
            for row in totalresult:
              writer.writerow({'file':row[0], 'first10_start_tps':row[1],'first20_start_tps':row[2],'first50_start_tps':row[3],'first75_start_tps':row[4],'first100_start_tps':row[5],'first10_end_tps':row[6],'first20_end_tps':row[7],'first50_end_tps':row[8],'first75_end_tps':row[9],'first100_end_tps':row[10]})