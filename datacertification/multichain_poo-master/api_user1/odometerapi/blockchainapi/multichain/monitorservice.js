require('dotenv').config();
var fs = require('fs');
var multconfig = require('../multichain/config');

var input_port = process.env.multichain_port;

var input_host = process.env.multichain_host;

var input_user = process.env.multichain_user;

var input_pass = process.env.multichain_pass;

const csvwriterlibrary = require('csv-writer').createObjectCsvWriter;

var csvWriter = require('csv-write-stream');
var writer = csvWriter();
const csv = require('csv-parser');

var clearassettrasnfertimer = process.env.test_timer_admin_multi_monitorservice_clearassettransfer;

var getalliedtimer = process.env.test_timer_admin_multi_monitorservice_getallied;


//////////////////Timer Details:
//Timer Interval //3600000 milliseconds = 60 minutes

//For Test we Keep 2 minutes
//120000

setInterval(function () {
    clearMultichainAssetTransferTransaction(function (response) {
        console.log(response);
    })
}, clearassettrasnfertimer);
setInterval(getAlliedDetails, getalliedtimer);

initiateMultichain = function () {
    let multichain = require("multichain-node")({

        port: input_port,
        host: input_host,
        user: input_user,
        pass: input_pass
    });

    return multichain;
}

var generalassettransfer = [];
var exec=true;
var generalassettrasnfercounter = 0;

//Final Time Value for Asset Transfer Lifecycle
var generalassettransferarray = [];

var generalassettransferarraycounter = 0;

const entirecsvwriter = csvwriterlibrary({
    path: "multassetentire.csv",
    header: [
        { id: 'Time', title: 'Time' }
    ]
});

var multichainassettransfer = [];

var multichainassettransfercounter = 0;

//Final Time Value for Asset Transfer Multichain
var multichainassettransferarray = [];

var multichainassettransferarraycounter = 0;

const entiremulticsvwriter = csvwriterlibrary({
    path: "multassetmultientire.csv",
    header: [
        { id: 'Time', title: 'Time' }
    ]
});

//Other Details Array
var AlliedDetailsArray = [];

var AliedDetailsArrayCounter = 0;

var statusarray=[];

var statusarraycounter=0;

const multidetailscsvwriter = csvwriterlibrary({
    path: "multidetails.csv",
    header: [
        { id: 'MemPool', title: 'MemPool' },
        { id: 'WalletInfo', title: 'WalletInfo' },
        { id: 'BlockNo', title: 'BlockNo' },
        { id: 'HashRate', title: 'HashRate' },
        { id: 'TxPool', title: 'TxPool' },
        { id: 'Time', title: 'Time' }
    ]
});

const statuscsvwriter = csvwriterlibrary({
    path:"assetstatus.csv",
    header:[
        {id:'Request',title:'Request'},
        {id:'Time',title:'Time'},
        {id:'Date',title:'Date'},
        {id:'Balance',title:'Balance'}
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


/**
 * Store all the transaction when they are called from Asset Service For Asset Transfer passing the transaction hash
 * @param {*} txhash 
 */
function storeAssetTransferTransaction(txhash) {
    var currenttransaction = [];
    currenttransaction[0] = txhash;
    currenttransaction[1] = (new Date()).getTime();
    currenttransaction[2] = false;
    generalassettransfer[generalassettrasnfercounter] = currenttransaction;
    generalassettrasnfercounter = ++generalassettrasnfercounter;
}

/**
 * Store all the transaction when they are called from Asset Service For Asset Transfer passing the transaction hash
 * @param {*} txhash 
 */
function clearAssetTransferTransaction(txhash) {
    for (var i = 0; i < Object.keys(generalassettransfer).length; i++) {
        generalassettransfer[i] = generalassettransfer[i];
        if (generalassettransfer[i][2] == false && generalassettransfer[i][0] == txhash) {
            generalassettransfer[i][2] = true;
            var difference = Math.abs(generalassettransfer[i][1] - (new Date()).getTime());
            generalassettransferarray[generalassettransferarraycounter] = difference;
            generalassettransferarraycounter = ++generalassettransferarraycounter;
        }
    }
}

/**
 * Store all the transaction when they are called from Asset Service For Asset Transfer passing the transaction hash
 * @param {*} txhash 
 */
function getRecentClearedTransaction(callback) {
    var clearedtrasnfers = [];
    var clearedtrasnferscounter = 0;
    if (Object.keys(generalassettransfer).length > 0) {
        for (var i = (Object.keys(generalassettransfer).length - 1); i >= (Object.keys(generalassettransfer).length - 10); i--) {
            console.log(Object.keys(generalassettransfer).length);
            var currenttransfer = [];
            generalassettransfer[i]=generalassettransfer[i];
            if (generalassettransfer[i]!=undefined && generalassettransfer[i][2] == true) {
                currenttransfer[0] = generalassettransfer[i][0];
                currenttransfer[1] = generalassettransfer[i][1];
                clearedtrasnfers[clearedtrasnferscounter] = currenttransfer;
                clearedtrasnferscounter = ++clearedtrasnferscounter;
            }
        }
    }
    return callback(clearedtrasnfers);
}

/**
 * Store all the transaction when they are called from Asset Service For Asset Transfer passing the transaction hash
 * @param {*} txhash 
 */
function storeMultichainAssetTransferTransaction(txhash) {
    var currenttransaction = [];
    currenttransaction[0] = txhash;
    currenttransaction[1] = (new Date()).getTime();
    currenttransaction[2] = false;
    multichainassettransfer[multichainassettransfercounter] = currenttransaction;
    multichainassettransfercounter = ++multichainassettransfercounter;
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
 * Store all the transaction when they are called from Asset Service For Asset Transfer passing the transaction hash
 * @param {*} txhash 
 */
function clearMultichainAssetTransferTransaction() {
    console.log(multichainassettransfer);
    if (Object.keys(multichainassettransfer).length > 0) {
        for (var i = 0; i < Object.keys(multichainassettransfer).length; i++) {
            multichainassettransfer[i]=multichainassettransfer[i];
            if (multichainassettransfer[i]!=undefined && multichainassettransfer[i][2] == false) {
                clearMultiChainRequest(multichainassettransfer[i][0],i, function (response,retindex) {
                    if (response != null && response == true) {
                        console.log(multichainassettransfer);
                        multichainassettransfer[retindex]=multichainassettransfer[retindex]
                        multichainassettransfer[retindex][2] = true;
                        var difference = Math.abs(multichainassettransfer[retindex][1] - (new Date()).getTime());
                        multichainassettransferarray[multichainassettransferarraycounter] = difference;
                        multichainassettransferarraycounter = ++multichainassettransferarraycounter;
                    }
                })
            }
        }
    }
}


function clearMultiChainRequest(txhash,index, callback) {
    var multichain = initiateMultichain();
    multichain.getWalletTransaction({
        txid: txhash
    }, (err, info) => {
        if (err) {
            console.log("error" + err.errorcode);
            console.log("error" + err.message);
            return callback(null)

        } else {
            if (info.confirmations > 0 || info.valid == true) {
                return callback(true,index);
            }
            else {
                return callback(false,index);
            }

        }
    })
}

/**
 * Get all the Details for the Network
 */
function getAlliedDetails() {

    var currentdetail = [];
    multconfig.getMempoolInfo(function (response) {
        currentdetail[0] = response;
    });
    multconfig.getWalletInfo(function (response) {
        currentdetail[1] = response;
    });

    multconfig.getmininginfo(function (response) {
        if (response != null || response != undefined) {
            currentdetail[2] = response.blocks;
            currentdetail[3] = response.networkhashps;
            currentdetail[4] = response.pooledtx;
        }
    })

    currentdetail[5] = (new Date());
    AlliedDetailsArray[AliedDetailsArrayCounter] = currentdetail;
    AliedDetailsArrayCounter = ++AliedDetailsArrayCounter;
}

/**
 * Print All Logs into CSV
 */
function writeAllDetails(callback) {
    loopThirdTransaction(function(response){
        return callback(response);
    })

    //To-Do UnCOMMENT

   /*  if (fs.existsSync("assetstatus.csv")) {
    fs.unlinkSync("assetstatus.csv");
    }
    if (fs.existsSync("multassetentire.csv")) {
    fs.unlinkSync("multassetentire.csv");
    }
    if (fs.existsSync("multassetmultientire.csv")) {
    fs.unlinkSync("multassetmultientire.csv");
    }
    if (fs.existsSync("multidetails.csv")) {
    fs.unlinkSync("multidetails.csv");
    }
    completedeventwritearray = [];
    completedeventmultiwritearray = [];
    completedDetailsArray = [];
    //Write Asset Transfer confirmation
    for (var i = 0; i < Object.keys(generalassettransfer).length; i++) {
        var completedeventwrite = {
            'Time': generalassettransfer[i]
        }
        completedeventwritearray[i] = completedeventwrite;
    }
    //Write Transaction confirmation
    for (var j = 0; i < Object.keys(generalassettransferarray).length; j++) {
        var completedethereventwrite = {
            'Time': generalassettransferarray[j]
        }
        completedeventmultiwritearray[j] = completedethereventwrite;
    }

    for (var k = 0; k < Object.keys(AlliedDetailsArray).length; k++) {
        var AlliedDetailwrite = {
            'MemPool': AlliedDetailsArray[k][0],
            'WalletInfo': AlliedDetailsArray[k][1],
            'BlockNo': AlliedDetailsArray[k][2],
            'HashRate': AlliedDetailsArray[k][3],
            'TxPool': AlliedDetailsArray[k][4],
            'Time': AlliedDetailsArray[k][5]
        }
        completedDetailsArray[k] = AlliedDetailwrite;
    }

    entirecsvwriter.writeRecords(completedeventwritearray).then(() => console.log("First written"));

    entiremulticsvwriter.writeRecords(completedeventmultiwritearray).then(() => console.log("Second written"));

    multidetailscsvwriter.writeRecords(completedDetailsArray).then(() => console.log("Third written"));

    statuscsvwriter.writeRecords(statusarray).then(()=>console.log("Fourth written"));

    return callback("Monitor Result Written Successfully"); */


}


function loopFirstTransaction(){
    if (fs.existsSync("loopfirst.csv")) {
    fs.unlinkSync("loopfirst.csv");
    }
    //var loopwritearray=[];
    //var iteration=100;
    //To initiate the transaction

       // console.log("FIRST")
        createtransaction(function(responsecreate){
     
          /*   if(responsecreate[0].length==100 &&responsecreate[1].length==100 &&responsecreate[2].length==100){
            console.log('responsecreate');
            console.log(responsecreate);
            var transactionids=responsecreate[0];
            var timestampstart = responsecreate[1];
            var timestampend= responsecreate[2];
            for(var m=0;m<iteration;m++){
                var AlliedDetailwrite= {
                    'Transactionid':transactionids[m],
                    'Created':timestampstart[m],
                    'Ended':timestampend[m],
                    'CreationTime':(timestampend[m] - timestampstart[m])/60000
                 }
                 loopwritearray[m]=AlliedDetailwrite;
             }
             firstloopcsvwriter.writeRecords(loopwritearray).then(()=>console.log("Third written"));
             var waitTill = new Date(new Date().getTime() + 1*60 * 1000);
             while(waitTill > new Date()){}
             secondlooptransaction(responsecreate);
    } */
    
        })
}


function createtransaction(callback){
    var resultarray=[];
    var transactionids =[];
    var timestampstart=[];
    var timestampend=[];
    var iteration =100;
    var i=0;
    //while(i<iteration){
    //console.log('errorstrt');
    //timestampstart[i] = (new Date()).getTime();
    web3createtransaction(function(result) {
        /* if(result){
            var j=result[0];
                transactionids[j]=result[1];
                timestampend[j] = (new Date()).getTime();
                if(checkarray(transactionids) && checkarray(timestampstart) && checkarray(timestampend)){
                    resultarray[0]=transactionids;
                    resultarray[1]=timestampstart;
                    resultarray[2]=timestampend;
                    return callback(resultarray);
                }
     } */ })
     //i++;

    //}
}

function web3createtransaction(callback){
    var multichain = initiateMultichain();
    if (!fs.existsSync("loopfirst.csv")){
        writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
   }
       else{
           writer = csvWriter({sendHeaders: false});
          }
    var starttime = Math.floor((new Date()).getTime()/1000);

    for(var i=0;i<10;i++){
    multichain.publish({
        stream: 'teststream',
        key: 'testtransaction',
        data: {
            "json": {
                'iteration':i ,
                'comment': 'test performance'
            }
        }
    }, (publisherr, publishinfo) => {
        if (publisherr) {
            console.log("error" + publisherr.errorcode);
            console.log("error" + publisherr.message);

        }
        else if(publishinfo){
            writer.pipe(fs.createWriteStream("loopfirst.csv", {flags: 'a'}));
            writer.write({
               Transactionid:publishinfo,
               Start:starttime,
               End:Math.floor((new Date()).getTime()/1000),
               Lapse:(Math.floor((new Date()).getTime()/1000) - starttime)
            })
        }
        return callback(publishinfo);
    })
}
}
//}
function checkarray(arraysvalues){
    console.log('called');
    console.log(arraysvalues);
    var iteration=100;
    if(arraysvalues.length < iteration){
        return false;
    }
for(var i = 0;i<iteration;i++){
    if(arraysvalues[i] ==null || arraysvalues[i] ==undefined || arraysvalues[i] ==''){
        return false;
    }
}
return true;
}

function loopSecondTransaction(responsecreate){
    var finaltransactioncreationtime=[];
    var transactionconfirmationtime=[];
    var entiretransactionlifecycletime=[]
    var transactionids=responsecreate[0];
    var timestampstart = responsecreate[1];
    var timestampend= responsecreate[2];
    var loopwritearray=[];
    var iteration=100;
    if (fs.existsSync("loopsecond.csv")) {
    fs.unlinkSync("loopsecond.csv");
    }

    if (!fs.existsSync("loopsecond.csv")){
        writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo"]});
   }
       else{
           writer = csvWriter({sendHeaders: false});
          }
          fs.createReadStream("loopfirst.csv").pipe(csv()).on('data',function(data){
            //console.log(data.Transactionid);
            //console.log(data.Start);
            //console.log(data.End);
            //console.log(data.Lapse);
            getBlockTimestamps(data.Transactionid,function(blocktimestampresponse){
            //getBlocknos(data.Transactionid,function(blocknoresponse){
                console.log(blocktimestampresponse);
                writer.pipe(fs.createWriteStream("loopsecond.csv", {flags: 'a'}));
                writer.write({
                   Transactionid:data.Transactionid,
                   Start:data.Start,
                   End:data.End,
                   Lapse:data.Lapse,
                   BlockNo:blocktimestampresponse
                })
            })
            
        })
        //if(checkarray(transactionids)){
       
           /*  if(blocktimestampresponse.length=100 && checkarray(blocktimestampresponse)){
           console.log("chck");

         for(var l=0;l<iteration && checkarray(blocktimestampresponse[l]) ;l++){
            var blockdet=blocktimestampresponse[l];
            console.log('blockdet');
            console.log(blockdet);
            if(blockdet!=null || blockdet !=undefined){
            var blocktimestamps = blockdet[1];
          finaltransactioncreationtime[l] = (timestampend[l]-timestampstart[l])/(60000);
          transactionconfirmationtime[l] = (blocktimestamps[l]*1000-timestampend[l])/60000;
          entiretransactionlifecycletime[l]=(blocktimestamps[l]*1000-timestampstart[l])/60000;
            }
           }
           for(var m=0;m<iteration;m++){
            var blockdet=blocktimestampresponse[m];
            console.log('-------k');
            console.log(blockdet);
            if(blockdet!=null || blockdet !=undefined){
            var blockno = blockdet[0];
            var blocktime = blockdet[1];
            var AlliedDetailwrite= {
                'Transactionid':transactionids[m],
                'BlockNo':blockno,
                'Created':timestampstart[m],
                'Ended':timestampend[m],
                'Confirmation':blocktime*1000,
                'Transaction_seen_time':finaltransactioncreationtime[m], 
                'Transaction_block_time':transactionconfirmationtime[m],
                'EntireLifecycletime':entiretransactionlifecycletime[m]
             }
             loopwritearray[m]=AlliedDetailwrite;
            }
         }

         console.log(loopwritearray)
         secondloopcsvwriter.writeRecords(loopwritearray).then(()=>console.log("Third written"));
        } */
    //})
    }
    //}


function getBlockTimestamps(transactionids,callback){
    var iteration =100;
    var blocktimestamps=[];
    
    var k=0
    //if(checkarray(transactionids)){
    //while(k<iteration && transactionids[k]!=undefined){
        //var i=k;
        //console.log('blocknos[k]');
        //console.log(transactionids[i]);
        tranexecute(transactionids,function(response){
          /*   if(response){
            blocktimestamps[response[2]]=response;
            if(i==iteration-1 && checkarray(blocktimestamps) ){
                console.log("------------");
                console.log(blocktimestamps);
                console.log("------------");
                return callback(blocktimestamps);
    }
} */
return callback(response);
        })
        //k++;

       // }
        
    //}
    //return callback(blocktimestamps);
}

function tranexecute(transactionid,callback){
    var multichain = initiateMultichain();
    multichain.getWalletTransaction({
        txid: transactionid
    }, (publisherr, publishinfo) => {
        if (publisherr) {
            console.log("error" + publisherr.errorcode);
            console.log("error" + publisherr.message);

        }
        if(publishinfo){
        //console.log('Response:' + JSON.stringify(publishinfo));
        //var blockdet=[];
        //blockdet[0]=publishinfo.blockhash,
        //blockdet[1]=publishinfo.blocktime,
        //blockdet[2]=i
       
        //console.log(JSON.stringify(blockdet));
        return callback(publishinfo.blockhash);
        }
    })
}

function loopThirdTransaction(responsecreate){
    var finaltransactioncreationtime=[];
    var transactionconfirmationtime=[];
    var entiretransactionlifecycletime=[]
    var transactionids=responsecreate[0];
    var timestampstart = responsecreate[1];
    var timestampend= responsecreate[2];
    var loopwritearray=[];
    var iteration=10;
    if (fs.existsSync("loopthird.csv")) {
        fs.unlinkSync("loopthird.csv");
        }
        if (!fs.existsSync("loopthird.csv")){
            writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo","BlockTimeStamp","Blockminer","Difficulty",
            "Blocksize","Confirmations","BlockTransactions","Height","TotalTime"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
        fs.createReadStream("loopsecond.csv").pipe(csv()).on('data',function(data){
            getBlockDetails(data.BlockNo,function(blocktimeresponse){
                writer.pipe(fs.createWriteStream("loopthird.csv", {flags: 'a'}));
                writer.write({
                   Transactionid:data.Transactionid,
                   Start:data.Start,
                   End:data.End,
                   Lapse:data.Lapse,
                   BlockNo:data.BlockNo,
                   BlockTimeStamp:blocktimeresponse.time,
                   Blockminer:blocktimeresponse.miner,
                   Difficulty:blocktimeresponse.difficulty,
                   Blocksize:blocktimeresponse.size,
                   Confirmations:blocktimeresponse.confirmations,
                   BlockTransactions:blocktimeresponse.tx.length,
                   Height:blocktimeresponse.height,
                   TotalTime:blocktimeresponse.time-data.Start

                })
            })
            
        })
    }

        function getBlockDetails(blockhash,callback){
            var multichain = initiateMultichain();
            multichain.getBlock({
                hash: blockhash
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
        
                }
                if(publishinfo){
                //console.log('Response:' + JSON.stringify(publishinfo));
                //var blockdet=[];
                //blockdet[0]=publishinfo.blockhash,
                //blockdet[1]=publishinfo.blocktime,
                //blockdet[2]=i
               
                //console.log(JSON.stringify(blockdet));
                console.log(publishinfo);
                return callback(publishinfo);
                }
            })
        }

function checkarray(arraysvalues){
    console.log('called');
    console.log(arraysvalues);
    var iteration=100;
for(var i = 0;i< iteration;i++){
    if(arraysvalues[i] ==undefined){
        return false;
    }
}
return true;
}




let monitorserviceexports = {
    storeAssetTransferTransaction: storeAssetTransferTransaction,
    clearAssetTransferTransaction: clearAssetTransferTransaction,
    storeMultichainAssetTransferTransaction: storeMultichainAssetTransferTransaction,
    clearMultichainAssetTransferTransaction: clearMultichainAssetTransferTransaction,
    clearMultiChainRequest: clearMultiChainRequest,
    getAlliedDetails: getAlliedDetails,
    writeAllDetails: writeAllDetails,
    getRecentClearedTransaction: getRecentClearedTransaction,
    loopFirstTransaction:loopFirstTransaction,
    loopSecondTransaction:loopSecondTransaction,
    loopThirdTransaction:loopThirdTransaction,
    setStatus:setStatus


};

module.exports = monitorserviceexports;