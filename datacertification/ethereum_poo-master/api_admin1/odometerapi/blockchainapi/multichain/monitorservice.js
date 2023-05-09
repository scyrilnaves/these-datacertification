require('dotenv').config();
var fs = require('fs');
var multconfig = require('../multichain/config');

var input_port = process.env.multichain_port;

var input_host = process.env.multichain_host;

var input_user = process.env.multichain_user;

var input_pass = process.env.multichain_pass;

var loop_iteration = process.env.loop_iteration;


const csvwriterlibrary = require('csv-writer').createObjectCsvWriter;

var csvWriter = require('csv-write-stream');
var writer = csvWriter();
const csv = require('csv-parser');

var clearassettrasnfertimer = process.env.test_timer_admin_multi_monitorservice_clearassettransfer;

var getalliedtimer = process.env.test_timer_admin_multi_monitorservice_getallied;

var firstexecute=true;

var secondexecute=true;

var thirdexecute=true;

//montioring
//sudo npm install -S appmetrics-dash --unsafe-perm=true --allow-root
//require('appmetrics-dash').monitor();

//////////////////Timer Details:
//Timer Interval //3600000 milliseconds = 60 minutes

//For Test we Keep 2 minutes
//120000

setInterval(function () {
    clearMultichainAssetTransferTransaction(function (response) {
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
    for (let i = 0; i < Object.keys(generalassettransfer).length; i++) {
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
        for (let i = (Object.keys(generalassettransfer).length - 1); i >= (Object.keys(generalassettransfer).length - 10); i--) {
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
    if (Object.keys(multichainassettransfer).length > 0) {
        for (let i = 0; i < Object.keys(multichainassettransfer).length; i++) {
            multichainassettransfer[i]=multichainassettransfer[i];
            if (multichainassettransfer[i]!=undefined && multichainassettransfer[i][2] == false) {
                clearMultiChainRequest(multichainassettransfer[i][0],i, function (response,retindex) {
                    if (response != null && response == true) {
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
}


function loopFirstTransaction(){
    if(firstexecute){
    if (fs.existsSync(loop_iteration+"loopfirst.csv")) {
    fs.unlinkSync(loop_iteration+"loopfirst.csv");
    }
        createtransaction(function(responsecreate){
    
        })
        firstexecute = false;
    }
}


function createtransaction(callback){

    web3createtransaction();

}

function web3createtransaction(){
    var multichain = initiateMultichain();
    if (!fs.existsSync(loop_iteration+"loopfirst.csv")){
        writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
   }
       else{
           writer = csvWriter({sendHeaders: false});
          }

    for(let i=0,p=Promise.resolve();i<loop_iteration;i++){
        p =p.then (_=> new Promise(resolve => {
        var starttime = Math.floor((new Date()).getTime()/1000);
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
            var endtime = Math.floor((new Date()).getTime()/1000);
            if (fs.existsSync(loop_iteration+"loopfirst.csv")){
                writer = csvWriter({sendHeaders: false});
           }
           else{
            writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
           }
            writer.pipe(fs.createWriteStream(loop_iteration+"loopfirst.csv", {flags: 'a'}));
            writer.write({
               Transactionid:publishinfo,
               Start:starttime,
               End:endtime,
               Lapse:Math.floor(endtime - starttime)
            })
            writer.end();
            resolve();
        }
    })
}))
}
}
//}
function checkarray(arraysvalues){
    var iteration=100;
    if(arraysvalues.length < iteration){
        return false;
    }
for(let i = 0;i<iteration;i++){
    if(arraysvalues[i] ==null || arraysvalues[i] ==undefined || arraysvalues[i] ==''){
        return false;
    }
}
return true;
}

function loopSecondTransaction(responsecreate){
 if(secondexecute){
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
            p = p.then (_=> new Promise(resolve =>{
               
            getBlockTimestamps(data.Transactionid,function(blocktimestampresponse){
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
                   BlockNo:blocktimestampresponse
                })
                writer.end();
                resolve();
            })
        }))
            
        })
        secondexecute =false;
 }

    }


function getBlockTimestamps(transactionids,callback){

        tranexecute(transactionids,function(response){

return callback(response);
        })
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
        return callback(publishinfo.blockhash);
        }
    })
}

function loopThirdTransaction(responsecreate){
if(thirdexecute){
    if (fs.existsSync(loop_iteration+"loopthird.csv")) {
        fs.unlinkSync(loop_iteration+"loopthird.csv");
        }
        if (!fs.existsSync(loop_iteration+"loopthird.csv")){
            writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo","BlockTimeStamp","Blockminer","Difficulty",
            "Blocksize","Confirmations","BlockTransactions","Height","TotalTime"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
        fs.createReadStream(loop_iteration+"loopsecond.csv").pipe(csv()).on('data',function(data){
            p =Promise.resolve();
            p = p.then(_=> new Promise(resolve => {
            getBlockDetails(data.BlockNo,function(blocktimeresponse){
                if (fs.existsSync(loop_iteration+"loopthird.csv")){
                    writer = csvWriter({sendHeaders: false});
               }
               else{
                writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo","BlockTimeStamp","Blockminer","Difficulty",
                "Blocksize","Confirmations","BlockTransactions","Height","TotalTime"]});
               }
                writer.pipe(fs.createWriteStream(loop_iteration+"loopthird.csv", {flags: 'a'}));
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
                writer.end();
                resolve();
            }
            )
            }))
            
        })
        thirdexecute = false;
}
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
                return callback(publishinfo);
                }
            })
        }

function checkarray(arraysvalues){
    var iteration=100;
for(let i = 0;i< iteration;i++){
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