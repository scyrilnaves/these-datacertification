import pandas as pd
import statistics as st
import csv
import numpy as np

types=['first','second'];
machines=['dockercontainer','rpi'];
TransactionNos=['100','500','1000','3000','6000','100000'];
admin1='0x0000000000000000000000000000000000000000';
admin2='0x0000000000000000000000000000000000000000';

totalresult=[];
for type in types:
    for machine in machines:
        for TransactionNo in TransactionNos:
           data = pd.read_csv("C:\\Users\\az02713\\OneDrive - Alliance\\Documents\\Python\\logs\\logs"+"\\"+str(type)+"\\"+str(machine)+"\\"+str(TransactionNo)+"loopthird.csv",low_memory=False);
           result = [];
           Mean_transaction_time = float(np.mean(data[['Lapse']]));
           Median_transaction_time = np.median(data[['Lapse']]);
           sorteddata=data.sort_values('Start');
           sorteddatalen=len(sorteddata);
           Total_Transaction_Time=sorteddata.iloc[sorteddatalen-1].Start-sorteddata.iloc[0].Start;
           Transaction_per_sec=len(data[data.Lapse==0]);
           Transaction_exceeding_per_sec=len(data[data.Lapse!=0]);
           Totalblocks=len(data.BlockNo.unique());
           admin1validatedtransactions=len(data[data.Blockminer==admin1]);
           admin2validatedtransactions=len(data[data.Blockminer==admin2]);

           blockdata = data.drop_duplicates('BlockNo');
           sortedblockdata = blockdata.sort_values('BlockNo');

           sortedblockdatalen = len(sortedblockdata);
           previousblocktimestamp=0;
           firstsortedblockdata=0;
           iteration=0;
           blocktimesincefirstblock=[];
           txpersecarray=[];
           totalblocksize = 0;
           #changetimeperiod
           timeperiod=15;
           for index in range(0,len(sortedblockdata)):
            #print(index);
            txpersec=sortedblockdata.iloc[index].BlockTransactions/timeperiod;
            txpersecarray.append(txpersec);

           meantxpersec=float(np.mean(txpersecarray));
           mediantxpersec=float(np.median(txpersecarray))
           admin1minedblocks=len(sortedblockdata[sortedblockdata.Blockminer==admin1]);
           admin2minedblocks=len(sortedblockdata[sortedblockdata.Blockminer==admin2]);
           if (len(blocktimesincefirstblock)==0):
             meanblocktimesincefirstblock=0;
             medianblocktimesincefirstblock=0;
           else:
             meanblocktimesincefirstblock = st.mean(blocktimesincefirstblock);
             medianblocktimesincefirstblock = st.median(blocktimesincefirstblock);
           if(len(blocktimesincefirstblock)!=0):  
            totalblocktimesincefirstblock=blocktimesincefirstblock[len(blocktimesincefirstblock)-1]
           else:
             totalblocktimesincefirstblock=0;
           meandiffficulty=int(np.mean(sortedblockdata[['Difficulty']]));
           mediandifficulty=int(np.median(sortedblockdata[['Difficulty']]));

           meanblocksize=int(np.mean(sortedblockdata[['Blocksize']]));
           medianblocksize=int(np.median(sortedblockdata[['Blocksize']]));
           totalblocksize = int(np.sum(sortedblockdata[['Blocksize']]));

           meanblockgaslimit=int(np.mean(sortedblockdata[['BlockGasLimit']]));
           medianblockgaslimit=int(np.median(sortedblockdata[['BlockGasLimit']]));

           meanblockgasused=int(np.mean(sortedblockdata[['BlockGasUsed']]));
           medianblockgasused=int(np.median(sortedblockdata[['BlockGasUsed']]));

           meanblocktransactions=int(np.mean(sortedblockdata[['BlockTransactions']]));
           medianblocktransactions=int(np.median(sortedblockdata[['BlockTransactions']]));
           result.insert(0, type);
           result.insert(1, machine);
           result.insert(2, TransactionNo);
           result.insert(3, Mean_transaction_time);
           result.insert(4, Median_transaction_time);
           result.insert(5, Total_Transaction_Time);
           result.insert(6, Transaction_per_sec);
           result.insert(7, Transaction_exceeding_per_sec);
           result.insert(8, Totalblocks);
           result.insert(9, admin1validatedtransactions);
           result.insert(10, admin2validatedtransactions);
           result.insert(11, timeperiod);
           result.insert(12, timeperiod);
           result.insert(13, admin1minedblocks);
           result.insert(14, admin2minedblocks);
           result.insert(15, meanblocktimesincefirstblock);
           result.insert(16, medianblocktimesincefirstblock);
           result.insert(17, totalblocktimesincefirstblock);
           result.insert(18, meandiffficulty);
           result.insert(19, mediandifficulty);
           result.insert(20, meanblocksize);
           result.insert(21, medianblocksize);
           result.insert(22, meanblockgaslimit);
           result.insert(23, medianblockgaslimit);
           result.insert(24, meanblockgasused);
           result.insert(25, medianblockgasused);
           result.insert(26, meanblocktransactions);
           result.insert(27, medianblocktransactions);
           result.insert(28, meantxpersec);
           result.insert(29, mediantxpersec);
           result.insert(30, totalblocksize);
           totalresult.append(result);

with open("C:\\Users\\az02713\\OneDrive - Alliance\\Documents\\Python\\logs\\processed\\procether.csv", 'w') as csvfile:
            fieldnames = ['type', 'machine','TransactionNo','Mean_transaction_time','Median_transaction_time','Total_Transaction_Time','Transaction_per_sec','Transaction_exceeding_per_sec','Totalblocks','admin1validatedtransactions','admin2validatedtransactions','meaninterleavingblocktime','medianinterleavingblocktime','admin1minedblocks','admin2minedblocks','meanblocktimesincefirstblock','medianblocktimesincefirstblock','totalblocktimesincefirstblock','meandiffficulty','mediandifficulty','meanblocksize','medianblocksize','meanblockgaslimit','medianblockgaslimit','meanblockgasused','medianblockgasused','meanblocktransactions','medianblocktransactions','meantxpersec','mediantxpersec','totalblocksize']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader();
            for row in totalresult:
              writer.writerow({'type':row[0], 'machine':row[1],'TransactionNo':row[2],'Mean_transaction_time':row[3],'Median_transaction_time':row[4],'Total_Transaction_Time':row[5],'Transaction_per_sec':row[6],'Transaction_exceeding_per_sec':row[7],'Totalblocks':row[8],'admin1validatedtransactions':row[9],'admin2validatedtransactions':row[10],'meaninterleavingblocktime':row[11],'medianinterleavingblocktime':row[12],'admin1minedblocks':row[13],'admin2minedblocks':row[14],'meanblocktimesincefirstblock':row[15],'medianblocktimesincefirstblock':row[16],'totalblocktimesincefirstblock':row[17],'meandiffficulty':row[18],'mediandifficulty':row[19],'meanblocksize':row[20],'medianblocksize':row[21],'meanblockgaslimit':row[22],'medianblockgaslimit':row[23],'meanblockgasused':row[24],'medianblockgasused':row[25],'meanblocktransactions':row[26],'medianblocktransactions':row[27],'meantxpersec':row[28],'mediantxpersec':row[29],'totalblocksize':row[30]})