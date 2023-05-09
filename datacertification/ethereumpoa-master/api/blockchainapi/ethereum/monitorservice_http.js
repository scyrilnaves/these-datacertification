
require('dotenv').config();
var fs = require('fs');

var ethcommon = require('../ethereum/commonservice');

const Web3 = require('web3');

const net = require('net');

let web3 = undefined;

let web3http = undefined;

const csvwriterlibrary = require('csv-writer').createObjectCsvWriter;

var csvWriter = require('csv-write-stream');
var writer = csvWriter();
const csv = require('csv-parser');
var utiljs = require('../ethereum/util');

//montioring
// In case of Node Error: npm rebuild
//sudo npm install -S appmetrics-dash --unsafe-perm=true --allow-root
//require('appmetrics-dash').monitor();
var provider_url = process.env.ethereum_host;
var provider_event_url=process.env.ethereum_wshost;
var transactioncontractaddress = process.env.ethereum_transactioncontract;
var maincontractaddress = process.env.ethereum_maincontract;
var loop_iteration = process.env.loop_iteration;

var transactionabi = "blockchainapi/ethereum/abi/transaction.json";
var transactionabiparsed = JSON.parse(fs.readFileSync(transactionabi));

var mainabi = "blockchainapi/ethereum/abi/main.json";
var mainabiparsed = JSON.parse(fs.readFileSync(mainabi));
var exec=true;
let transactioncontract = undefined;

var listfinaltimer=process.env.test_timer_admin_ether_monitorservice_listfinal;
var lookconfirmationtimer=process.env.test_timer_admin_ether_monitorservice_lookconfirmation;
var getalliedtimer=process.env.test_timer_admin_ether_monitorservice_getallied;
var looptimer = process.env.test_timer_admin_ether_monitorservice_looptimer;


//////////////////Timer Details:
//Timer Interval //3600000 milliseconds = 60 minutes

//For Test we Keep 2 minutes
//120000

setInterval(listenfinaliserevents, listfinaltimer);
setInterval(lookforConfirmation, lookconfirmationtimer);
setInterval(getAlliedDetails, getalliedtimer);
//setInterval(loopTransaction, looptimer);


function init() {
    const options={
        transactionConfirmationBlocks:1
    }
  let eventProvider = new Web3.providers.WebsocketProvider(provider_event_url);
  web3 = new Web3(eventProvider,null,options);
  web3.transactionConfirmationBlocks = 0;
  let provider = new Web3.providers.HttpProvider(provider_url);
  web3http = new Web3(provider,null,options);
  web3http.transactionConfirmationBlocks = 0;

  transactioncontract = new web3.eth.Contract(transactionabiparsed,transactioncontractaddress);
  maincontract = new web3http.eth.Contract(mainabiparsed, maincontractaddress);

};

var createevents=[];

var createeventcounter=0;

//Time array for Entire lifecycle of event
var completedevents=[];

var completeeventcounter=0;

const statuscsvwriter = csvwriterlibrary({
    path:"assetstatus.csv",
    header:[
        {id:'Request',title:'Request'},
        {id:'Time',title:'Time'},
        {id:'Date',title:'Date'},
        {id:'Balance',title:'Balance'}
    ]
});

const entirecsvwriter = csvwriterlibrary({
    path:"assetentire.csv",
    header:[
        {id:'Time',title:'Time'}
    ]
});

const firstloopcsvwriter = csvwriterlibrary({
    path:"loopfirst.csv",
    header:[
        {id:'Transactionid',title:'transactionid'},
        {id:'Created',title:'Transaction_Loop_start'},
        {id:'Ended',title:'Transaction_loop_end'},
        {id:'CreationTime',title:'Transaction_Creation_Time'}
    ]
});

const secondloopcsvwriter = csvwriterlibrary({
    path:"loopsecond.csv",
    header:[
        {id:'Transactionid',title:'transactionid'},
        {id:'BlockNo',title:'blockno'},
        {id:'Created',title:'Transaction_Loop_start'},
        {id:'Ended',title:'Transaction_loop_end'},
        {id:'Confirmation',title:'confirmation'},
        {id:'Transaction_seen_time',title:'Transaction_seen_time'}, 
        {id:'Transaction_block_time',title:'Transaction_block_time'},
        {id:'EntireLifecycletime',title:'EntirelifecycleTime'}

    ]
});

var transactionarray=[];

var transactionarraycounter=0;

//Time Array in Ethereum Network
var completedetherevents=[];

var completedethereventcounter=0;

const entireethercsvwriter = csvwriterlibrary({
    path:"assetetherentire.csv",
    header:[
        {id:'Time',title:'Time'}
    ]
});

//Other Details Array
var AlliedDetailsArray  =[];

var AliedDetailsArrayCounter=0;

var statusarray=[];

var statusarraycounter=0;

var firstexecute=true;

var secondexecute=true;

var thirdexecute=true;

const etherdetailscsvwriter = csvwriterlibrary({
    path:"etherdetails.csv",
    header:[
        {id:'Peercount',title:'Peercount'},
        {id:'HashRate',title:'HashRate'},
        {id:'GasPrice',title:'GasPrice'},
        {id:'BlockNo',title:'BlockNo'},
        {id:'PendingTxPool',title:'PendingTxPool'},
        {id:'QueuedTxPool',title:'QueuedTxPool'},
        {id:'MemStat',title:'MemStat'},
        {id:'Time',title:'Time'}
    ]
});

/**
 * Get Events when transaction are created
 */
function listencreaterevents(){
    init();
    
    transactioncontract.events.CreateTransactionEvent(function(err,result){
        if(err){
            return "Error Occured";
        }
        if(result.args.transactiontype==14){
            var transactiondetail=[];
            transactiondetail[0]=result.args.eventAddress;
            transactiondetails[1]=(new Date()).getTime();
            transactiondetails[2]=false;
            createevents[createeventcounter]=transactiondetail;
            createeventcounter = ++createeventcounter;
        }
    })

}

/**
 * Get events when transction are finalised and calculate the difference between creation and finalisation
 */
function listenfinaliserevents(){
    init();
    transactioncontract.events.FinaliseTransactionEvent(function(err,result){
        if(err){
            return "Error Occured";
        }
        if(result.args.transactiontype==14){
            for(let i=0;i<Object.keys(createevents).length;i++){
                createevents[i] = createevents[i];
                if(createevents[i][2]==false && createevents[i][0]==result.args.eventAddress){
                    createevents[i][2]=true;
                    var difference = Math.abs(createevents[i][1] - (new Date()).getTime());
                    completedevents[completeeventcounter] = difference;
                    completeeventcounter = ++completeeventcounter;
                }
            }
            
        }
    })
}

/**
 * Set the Status of all the requests
 */
function setStatus(assetbalance){
var status ={
    'Request':statusarraycounter,
    'Time':(new Date()).getTime(),
    'Date':new Date(),
    'Balance':assetbalance
}
statusarray[statusarraycounter] = status;
statusarraycounter = ++statusarraycounter;
}


/**
 * Store all the tranloopThirdTransactionr passing the transaction hash
 * @param {*} txhash loopThirdTransaction
 */
function storeAssetTransferTransaction(txhash){
    var currenttransaction=[];
    currenttransaction[0]=txhash;
    currenttransaction[1]=(new Date()).getTime();
    currenttransaction[2]=false;
    transactionarray[transactionarraycounter]=currenttransaction;
    transactionarraycounter = ++transactionarraycounter;
    
}

/**
 * Poll with the Transaction and Look if they are confirmed
 */
function lookforConfirmation(){
    print();
    for(let i=0;i<Object.keys(transactionarray).length;i++){
        transactionarray[i]=transactionarray[i];
        if(transactionarray[i][2]==false){
            //transactionarray[i][0]=transactionarray[i][0];
        ethcommon.getTransactionReceipt(transactionarray[i][0],i,function(response,retindex){
            if(response !=null || response!= undefined){
                transactionarray[retindex]=transactionarray[retindex];
                if(response.blockNumber!=0){
                    transactionarray[retindex][2]=true;
                    var difference = Math.abs(transactionarray[retindex][1] - (new Date()).getTime());
                    completedetherevents[completedethereventcounter] = difference;
                    completedethereventcounter = ++completedethereventcounter;
                }
            }
        })
        }
    }
}

function print(){

 /*    console.log(createevents);

    console.log(completedevents);

    console.log(transactionarray);

    console.log(completedetherevents);

    console.log(AlliedDetailsArray); */


}

/**
 * Get all the Details for the Network
 */
function getAlliedDetails(){

var currentdetail=[];
ethcommon.getPeerCount(function(response){
    currentdetail[0]= response;
});
ethcommon.getHashRate(function(response){
    currentdetail[1]= response;
});

ethcommon.getGasPrice(function(response){
    currentdetail[2]= response;
});

ethcommon.getCurrentBlockNo(function(response){
    currentdetail[3]= response;
});

ethcommon.getTxPoolNo(function(response){
    currentdetail[4]= response[0];
});

ethcommon.getTxPoolNo(function(response){
    currentdetail[5]= response[1];
});

ethcommon.getMemStats(function(response){
    currentdetail[6]= response;
});

    currentdetail[7]= (new Date()).getTime();
    AlliedDetailsArray[AliedDetailsArrayCounter] = currentdetail;
    AliedDetailsArrayCounter =++AliedDetailsArrayCounter;
}

/**
 * Print All Logs into CSV
 */
//TO_DO CHANGE TO WRITE ALL DETAILS
function writeAllDetails(callback){
    loopThirdTransaction(function(response){
        return callback(response);
    })
    
}

/**
 * Store all the transaction when they are called from Asset Service For Asset Transfer passing the transaction hash
 * @param {*} txhash 
 */
function getRecentClearedTransaction(callback){
    var clearedtrasnfers =[];
    var clearedtrasnferscounter =0;
    if(transactionarray.length>5){
    for(let i=(Object.keys(transactionarray).length-1);i>=(Object.keys(transactionarray).length-5);i--){
        var currenttransfer=[];
        transactionarray[i]=transactionarray[i];
        if(transactionarray[i]!=undefined && transactionarray[i][2]==true){
            currenttransfer[0]=transactionarray[i][0];
            currenttransfer[1]=transactionarray[i][1];
            clearedtrasnfers[clearedtrasnferscounter] = currenttransfer;
            clearedtrasnferscounter =++clearedtrasnferscounter;

        }
    }
    return callback(clearedtrasnfers);
}
else{
    return callback("Not enough transactions");
}
}


function checkarray(arraysvalues){
    var iteration=10;
for(let i = 0;i< iteration;i++){
    if(arraysvalues[i] ==undefined){
        return false;
    }
}
return true;
}

/**
 * Function to get the No of Transaction possible for a Node to Generate
 * @param {*} callback 
 */
  function loopFirstTransaction(){
    if(firstexecute){
        firstexecute =false;
    init();
    
    if (fs.existsSync(loop_iteration+"loopfirst.csv")) {
        fs.unlinkSync(loop_iteration+"loopfirst.csv");
        }

    //To initiate the transaction
        createtransaction(function(responsecreate){
        })
    }
}
    

  function createtransaction(callback){
    web3createtransaction() ;
}

/**
 * Web 3 Send Transaction in batches in slow mode
 * web3createtransaction_batchslow
 */
  function web3createtransaction_batchslow(){
    var permissionedaddress = '0xf9eae0f545c0d5b1f1538df4746e46bf2c90d381';
    var metadata='test';
    var batch = new web3http.BatchRequest();
    web3http.eth.getAccounts( function (error, accounts) {
        if (error) {
            console.log(error);
            //return callback("Account is needed to make the transaction")
        }
        if (!fs.existsSync(loop_iteration+"loopfirst.csv")){
            writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
            const maincontractfunction =  maincontract.methods.createParticipant(permissionedaddress, metadata);
            const maincontractfunctionabi = maincontractfunction.encodeABI();
               utiljs.getNonce(accounts[0],function(walletnonce){
                   //Start of main iteration
                   var promisearray=[];
                for(let i=0, p =Promise.resolve();i<loop_iteration;i++){

                p =p.then (_=> new Promise(resolve => {
                    var starttime = Math.floor((new Date()).getTime()/1000);
/*             
                   maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
                      if(gasAmount>5000000){
                          return callback("Gas Supplied is less, Required is"+gasAmount);
                      }})
        */
                   const maintxparams ={
                       from: accounts[0],
                       gas: 5000000,
                       gasPrice: 0,
                       to:maincontractaddress,
                       nonce:'0x'+(walletnonce+i).toString(16),
                       data:maincontractfunctionabi
                   }
                   promisearray.push(batch.add(web3http.eth.sendTransaction(maintxparams,function(error,txHash){
                       if(error){
                           console.log(error);
                       }
                       if(txHash){
                        var endtime = Math.floor((new Date()).getTime()/1000);
                        if (fs.existsSync(loop_iteration+"loopfirst.csv")){
                            writer = csvWriter({sendHeaders: false});
                       }
                       else{
                        writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
                       }
                         
                         writer.pipe(fs.createWriteStream(loop_iteration+"loopfirst.csv", {flags: 'a'}));
                                 writer.write({
                                    Transactionid:txHash,
                                    Start:starttime,
                                    End:endtime,
                                    Lapse:Math.floor(endtime - starttime)
                                 }) 
                                 writer.end();
                                 resolve();
                       }
                   })))
               })
               )}
               Promise.all(promisearray).then(function(values){
                   // Issue by method.beforeexecution https://github.com/ethereum/web3.js/issues/2748
                   batch.execute().then(
                       console.log("done")
                   
                    );
               })
            })
    })
 }
/**
 * Web 3 Send Transaction in batches in fast mode
 * Dont wait for All promise to complete and exeecute batch
 * web3createtransaction_batchfast
 */

 function web3createtransaction(){
    var permissionedaddress = '0xf9eae0f545c0d5b1f1538df4746e46bf2c90d381';
    var metadata='test';
    var batch = new web3http.BatchRequest();
    web3http.eth.getAccounts( function (error, accounts) {
        if (error) {
            console.log(error);
            //return callback("Account is needed to make the transaction")
        }
        if (!fs.existsSync(loop_iteration+"loopfirst.csv")){
            writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
            const maincontractfunction =  maincontract.methods.createParticipant(permissionedaddress, metadata);
            const maincontractfunctionabi = maincontractfunction.encodeABI();
               utiljs.getNonce(accounts[0],function(walletnonce){
                   //Start of main iteration
                   var promisearray=[];
                for(let i=0, p =Promise.resolve();i<loop_iteration;i++){

                p =p.then (_=> new Promise(resolve => {
                    var starttime = Math.floor((new Date()).getTime()/1000);
/*             
                   maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
                      if(gasAmount>5000000){
                          return callback("Gas Supplied is less, Required is"+gasAmount);
                      }})
        */
                   const maintxparams ={
                       from: accounts[0],
                       gas: 5000000,
                       gasPrice: 0,
                       to:maincontractaddress,
                       nonce:'0x'+(walletnonce+i).toString(16),
                       data:maincontractfunctionabi
                   }
                   promisearray.push(batch.add(web3http.eth.sendTransaction(maintxparams,function(error,txHash){
                       if(error){
                           console.log(error);
                       }
                       if(txHash){
                        var endtime = Math.floor((new Date()).getTime()/1000);
                        if (fs.existsSync(loop_iteration+"loopfirst.csv")){
                            writer = csvWriter({sendHeaders: false});
                       }
                       else{
                        writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
                       }
                         
                         writer.pipe(fs.createWriteStream(loop_iteration+"loopfirst.csv", {flags: 'a'}));
                                 writer.write({
                                    Transactionid:txHash,
                                    Start:starttime,
                                    End:endtime,
                                    Lapse:Math.floor(endtime - starttime)
                                 }) 
                                 writer.end();
                                 resolve();
                       }
                   })))
               })
               )}
                     // Issue by method.beforeexecution https://github.com/ethereum/web3.js/issues/2748
                         batch.execute().then(
                           console.log("done")

                           );
            })
    })
 }

 /**
  * Custom Call for Clique API
  *  # https://github.com/ethereum/go-ethereum/blob/master/consensus/clique/api.go
  */
function cliquecustomcall(){
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const main = async () => {
    test = await web3http.currentProvider.send("clique_getSignersAtHash",['block hash value']);
    console.log(test);
};}

/**
 * Normal mode of creation of transaction
 */
 function web3createtransaction_normal(){
    var permissionedaddress = '0xf9eae0f545c0d5b1f1538df4746e46bf2c90d381';
    var metadata='test';
    web3http.eth.getAccounts( function (error, accounts) {
        if (error) {
            console.log(error);
            //return callback("Account is needed to make the transaction")
        }
        if (!fs.existsSync(loop_iteration+"loopfirst.csv")){
            writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
            const maincontractfunction =  maincontract.methods.createParticipant(permissionedaddress, metadata);
            const maincontractfunctionabi = maincontractfunction.encodeABI();
               utiljs.getNonce(accounts[0],function(walletnonce){
                   //Start of main iteration
                for(let i=0, p =Promise.resolve();i<loop_iteration;i++){

                p =p.then (_=> new Promise(resolve => {
                    var starttime = Math.floor((new Date()).getTime()/1000);
/*             
                   maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
                      if(gasAmount>5000000){
                          return callback("Gas Supplied is less, Required is"+gasAmount);
                      }})
        */
                   const maintxparams ={
                       from: accounts[0],
                       gas: 5000000,
                       gasPrice: 0,
                       to:maincontractaddress,
                       nonce:'0x'+(walletnonce+i).toString(16),
                       data:maincontractfunctionabi
                   }
                   web3http.eth.sendTransaction(maintxparams,function(error,txHash){
                       if(error){
                           console.log(error);
                       }
                       if(txHash){
                        var endtime = Math.floor((new Date()).getTime()/1000);
                        if (fs.existsSync(loop_iteration+"loopfirst.csv")){
                            writer = csvWriter({sendHeaders: false});
                       }
                       else{
                        writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
                       }
                         
                         writer.pipe(fs.createWriteStream(loop_iteration+"loopfirst.csv", {flags: 'a'}));
                                 writer.write({
                                    Transactionid:txHash,
                                    Start:starttime,
                                    End:endtime,
                                    Lapse:Math.floor(endtime - starttime)
                                 }) 
                                 writer.end();
                                 resolve();
                       }
                   })
               })
               )}
            })
    })
 }


 /**
 * Normal mode of creation of transaction
 */
function web3createtransaction_normalasyncmode(){
    var permissionedaddress = '0xf9eae0f545c0d5b1f1538df4746e46bf2c90d381';
    var metadata='test';
    web3http.eth.getAccounts( function (error, accounts) {
        if (error) {
            console.log(error);
            //return callback("Account is needed to make the transaction")
        }
        if (!fs.existsSync(loop_iteration+"loopfirst.csv")){
            writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
            const maincontractfunction =  maincontract.methods.createParticipant(permissionedaddress, metadata);
            const maincontractfunctionabi = maincontractfunction.encodeABI();
               utiljs.getNonce(accounts[0],function(walletnonce){
                   //Start of main iteration
                for(let i=0, p =Promise.resolve();i<loop_iteration;i++){

                p =p.then (_=> new Promise(resolve => {
                    var starttime = Math.floor((new Date()).getTime()/1000);
/*             
                   maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
                      if(gasAmount>5000000){
                          return callback("Gas Supplied is less, Required is"+gasAmount);
                      }})
        */
                   const maintxparams ={
                       from: accounts[0],
                       gas: 5000000,
                       gasPrice: 0,
                       to:maincontractaddress,
                       nonce:'0x'+(walletnonce+i).toString(16),
                       data:maincontractfunctionabi
                   }
                   web3http.eth.sendTransaction(maintxparams,function(error,txHash){
                       if(error){
                           console.log(error);
                       }
                       if(txHash){
                        var endtime = Math.floor((new Date()).getTime()/1000);
                        if (fs.existsSync(loop_iteration+"loopfirst.csv")){
                            writer = csvWriter({sendHeaders: false});
                       }
                       else{
                        writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
                       }
                         
                         writer.pipe(fs.createWriteStream(loop_iteration+"loopfirst.csv", {flags: 'a'}));
                                 writer.write({
                                    Transactionid:txHash,
                                    Start:starttime,
                                    End:endtime,
                                    Lapse:Math.floor(endtime - starttime)
                                 }) 
                                 writer.end();
                                 resolve();
                       }
                   })
               })
               )}
            })
    })
 }

 

 


 /**
  * 
  * @param {*} responsecreate 
  */
 function loopSecondTransaction(){
     if(secondexecute){
        secondexecute =false;
    init();
    if (fs.existsSync(loop_iteration+"loopsecond.csv")) {
        fs.unlinkSync(loop_iteration+"loopsecond.csv");
        }
        if (!fs.existsSync(loop_iteration+"loopsecond.csv")){
            writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
        fs.createReadStream(loop_iteration+"loopfirst.csv").pipe(csv()).on('data',function(data){ 
           p = Promise.resolve();
           p =p.then (_=> new Promise(resolve => { getBlocknos(data.Transactionid,function(blocknoresponse){
            if (fs.existsSync(loop_iteration+"loopsecond.csv")){
                writer = csvWriter({sendHeaders: false});
           }
           else{
            writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo"]});
           }
                writer.pipe(fs.createWriteStream(loop_iteration+"loopsecond.csv", {flags: 'a'}));
                writer.write({
                   Transactionid:data.Transactionid,
                   Start:data.Start,
                   End:data.End,
                   Lapse:data.Lapse,
                   BlockNo:blocknoresponse
                })
                writer.end();
            resolve();
           })
        }))
            
        })
     }
    }

  
function getBlocknos(transactionid,callback){

        web3http.eth.getTransaction(transactionid,function(error,response){
            if(error){
                console.log(error);
            }
            else if(response) {
                return callback(response.blockNumber);
        }
        });
}

        function loopThirdTransaction(responsecreate){
             if(thirdexecute){
        thirdexecute =false;
            init();
            if (fs.existsSync(loop_iteration+"loopthird.csv")) {
                fs.unlinkSync(loop_iteration+"loopthird.csv");
                }
                if (!fs.existsSync(loop_iteration+"loopthird.csv")){
                    writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo","BlockTimeStamp","Blockminer","Difficulty",
                    "Blocksize","BlockGasLimit","BlockGasUsed","BlockTransactions","BlockUncles","TotalTime"]});
               }
                   else{
                       writer = csvWriter({sendHeaders: false});
                      }
                fs.createReadStream(loop_iteration+"loopsecond.csv").pipe(csv()).on('data',function(data){
                     p =Promise.resolve();
                     p = p.then(_=> new Promise(resolve => 
                    getBlockTimestamps(data.BlockNo,function(blocktimeresponse){
                        if (fs.existsSync(loop_iteration+"loopthird.csv")){
                            writer = csvWriter({sendHeaders: false});
                       }
                       else{
                        writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo","BlockTimeStamp","Blockminer","Difficulty",
                        "Blocksize","BlockGasLimit","BlockGasUsed","BlockTransactions","BlockUncles","TotalTime"]});
                       }
                        writer.pipe(fs.createWriteStream(loop_iteration+"loopthird.csv", {flags: 'a'}));
                        writer.write({
                           Transactionid:data.Transactionid,
                           Start:data.Start,
                           End:data.End,
                           Lapse:data.Lapse,
                           BlockNo:data.BlockNo,
                           BlockTimeStamp:blocktimeresponse.timestamp,
                           Blockminer:blocktimeresponse.miner,
                           Difficulty:blocktimeresponse.difficulty,
                           Blocksize:blocktimeresponse.size,
                           BlockGasLimit:blocktimeresponse.gasLimit,
                           BlockGasUsed:blocktimeresponse.gasUsed,
                           BlockTransactions:blocktimeresponse.transactions.length,
                           BlockUncles:blocktimeresponse.uncles.length,
                           TotalTime:blocktimeresponse.timestamp-data.Start
                        })
                        writer.end();
                        resolve();
                    })
                    ))
                    
                })
             }
}
           


function secondloopTransaction(responsecreate){
    
    if (fs.existsSync(loop_iteration+"loopsecond.csv")) {
        fs.unlinkSync(loop_iteration+"loopsecond.csv");
        }
    getBlocknos(transactionids,function(blocknoresponse){
        if(blocknoresponse.length=10){
        var blocknos = blocknoresponse;

        getBlockTimestamps(blocknos,function(blocktimestampresponse){
            if(blocktimestampresponse.length=10){
           var blocktimestamps = blocktimestampresponse;
         for(let l=0;l<iteration;l++){
          finaltransactioncreationtime[l] = (timestampend[l]-timestampstart[l])/(60000);
          transactionconfirmationtime[l] = (blocktimestamps[l]-timestampend[l])/60000;
          entiretransactionlifecycletime[l]=(blocktimestamps[l]-timestampstart[l])/60000;
           }

           for(let m=0;m<iteration;m++){
            var AlliedDetailwrite= {
                'Transactionid':transactionids[m],
                'BlockNo':blocknos[m],
                'Created':timestampstart[m],
                'Ended':timestampend[m],
                'Confirmation':blocktimestamps[m],
                'Transaction_seen_time':finaltransactioncreationtime[m], 
                'Transaction_block_time':transactionconfirmationtime[m],
                'EntireLifecycletime':entiretransactionlifecycletime[m]
             }
             loopwritearray[m]=AlliedDetailwrite;
         }
         secondloopcsvwriter.writeRecords(loopwritearray).then(()=>console.log("Third written"));
        }})
    }
})
} 



function getBlockTimestamps(blocknos,callback){
    web3http.eth.getBlock(blocknos,function(error,response){
        if(error){
            console.log(error);
        }
        else if(response) {
            return callback(response);
    }
    });
}       
         


let monitorserviceexports = {
    listencreaterevents:listencreaterevents,
    listenfinaliserevents:listenfinaliserevents,
    storeAssetTransferTransaction:storeAssetTransferTransaction,
    lookforConfirmation:lookforConfirmation,
    getAlliedDetails:getAlliedDetails,
    writeAllDetails:writeAllDetails,
    getRecentClearedTransaction:getRecentClearedTransaction,
    loopFirstTransaction:loopFirstTransaction,
    loopSecondTransaction:loopSecondTransaction,
    loopThirdTransaction:loopThirdTransaction,
    setStatus:setStatus,


};

module.exports = monitorserviceexports;



