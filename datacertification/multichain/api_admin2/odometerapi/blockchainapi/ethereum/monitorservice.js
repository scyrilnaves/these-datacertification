
require('dotenv').config();
var fs = require('fs');

var ethcommon = require('../ethereum/commonservice');

const Web3 = require('web3');

let web3 = undefined;

let web3http = undefined;

const csvwriterlibrary = require('csv-writer').createObjectCsvWriter;

var csvWriter = require('csv-write-stream');
var writer = csvWriter();
const csv = require('csv-parser');

var provider_url = process.env.ethereum_host;
var provider_event_url=process.env.ethereum_wshost;
var transactioncontractaddress = process.env.ethereum_transactioncontract;
var maincontractaddress = process.env.ethereum_maincontract;

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
  let eventProvider = new Web3.providers.WebsocketProvider(provider_event_url);
  web3 = new Web3(eventProvider);
  let provider = new Web3.providers.HttpProvider(provider_url);
  web3http = new Web3(provider);

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
        console.log("Creation"+result );
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
            for(var i=0;i<Object.keys(createevents).length;i++){
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
 * Get events when transction are finalised and calculate the difference between creation and finalisation
 */
/* function listenfinaliserevents(callback){
    transactioncontract.FinaliseTransactionEvent(function(err,result){
        if(err){
            return "Error Occured";
        }
        return callback(result);
    })
}
 */
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
    console.log("called");
    print();
    for(var i=0;i<Object.keys(transactionarray).length;i++){
        transactionarray[i]=transactionarray[i];
        console.log("wechck"+transactionarray[i]);
        if(transactionarray[i][2]==false){
            //transactionarray[i][0]=transactionarray[i][0];
        ethcommon.getTransactionReceipt(transactionarray[i][0],i,function(response,retindex){
            if(response !=null || response!= undefined){
                transactionarray[retindex]=transactionarray[retindex];
                console.log("checkundef"+transactionarray[retindex])
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

    console.log(createevents);

    console.log(completedevents);

    console.log(transactionarray);

    console.log(completedetherevents);

    console.log(AlliedDetailsArray);


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
    //TO_DO UNCOMMENT
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
    completedeventwritearray=[];
    completedeventetherwritearray=[];
    completedDetailsArray=[];
    //Write Asset Transfer confirmation
    for(var i=0;i<Object.keys(completedevents).length;i++){
       var completedeventwrite= {
        'Time':completedevents[i]
        }
        completedeventwritearray[i]=completedeventwrite;
    }
    //Write Transaction confirmation
    for(var j=0;j<Object.keys(completedetherevents).length;j++){
        var completedethereventwrite= {
         'Time':completedetherevents[j]
         }
         completedeventetherwritearray[j]=completedethereventwrite;
     }

     for(var k=0;k<Object.keys(AlliedDetailsArray).length;k++){
        var AlliedDetailwrite= {
            'Peercount':AlliedDetailsArray[k][0],
            'HashRate':AlliedDetailsArray[k][1],
            'GasPrice':AlliedDetailsArray[k][2],
            'BlockNo':AlliedDetailsArray[k][3],
            'PendingTxPool':AlliedDetailsArray[k][4],
            'QueuedTxPool':AlliedDetailsArray[k][5],
            'MemStat':AlliedDetailsArray[k][6],
            'Time':AlliedDetailsArray[k][7]
         }
         completedDetailsArray[k]=AlliedDetailwrite;
     }
     
     entirecsvwriter.writeRecords(completedeventwritearray).then(()=>console.log("First written"));

     entireethercsvwriter.writeRecords(completedeventetherwritearray).then(()=>console.log("Second written"));

     etherdetailscsvwriter.writeRecords(completedDetailsArray).then(()=>console.log("Third written"));

     statuscsvwriter.writeRecords(statusarray).then(()=>console.log("Fourth written"));

     return callback("Monitor Result Written Successfully"); */


}

/**
 * Store all the transaction when they are called from Asset Service For Asset Transfer passing the transaction hash
 * @param {*} txhash 
 */
function getRecentClearedTransaction(callback){
    var clearedtrasnfers =[];
    var clearedtrasnferscounter =0;
    if(transactionarray.length>5){
    for(var i=(Object.keys(transactionarray).length-1);i>=(Object.keys(transactionarray).length-5);i--){
        console.log(transactionarray);
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
    console.log('called');
    console.log(arraysvalues);
    var iteration=10;
for(var i = 0;i< iteration;i++){
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
    if(exec){
        exec =false;
    init();
    
    if (fs.existsSync("loopfirst.csv")) {
        fs.unlinkSync("loopfirst.csv");
        }

        
    var loopwritearray=[];
    var iteration=10;
    //To initiate the transaction

        console.log("FIRST")
        createtransaction(function(responsecreate){
     /* 
            if(responsecreate[0].length==10 &&responsecreate[1].length==10 &&responsecreate[2].length==10){
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
             var waitTill = new Date(new Date().getTime() + 5*60 * 1000);
             while(waitTill > new Date()){}
             secondlooptransaction(responsecreate);
    } */
    
        })
    }
}
    

function createtransaction(callback){
    var resultarray=[];
    var transactionids =[];
    var timestampstart=[];
    var timestampend=[];
    var iteration =10;
    var i=0;
    //while(i<iteration){
    console.log('errorstrt');
    //timestampstart[i] = (new Date()).getTime();
    web3createtransaction(i,function(result) {
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
     } })
     i++; */

    //}
});
}

function web3createtransaction(i,callback){
    var permissionedaddress = '0xf9eae0f545c0d5b1f1538df4746e46bf2c90d381';
    var metadata='test';
    web3http.eth.getAccounts(function (error, accounts) {
        if (error) {
            console.log('errorfunc1');
            console.log(error);
            //return callback("Account is needed to make the transaction")
        }
        if (!fs.existsSync("loopfirst.csv")){
            writer = csvWriter({ headers: ["Transactionid", "Start","End","Lapse"]});
       }
           else{
               writer = csvWriter({sendHeaders: false});
              }
        var starttime = Math.floor((new Date()).getTime()/1000);
        for(var i=0;i<10;i++){
        maincontract.methods.createParticipant(permissionedaddress, metadata).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, response) {
            console.log('response');
            console.log(response);
            if (error) {
                //callback(error);
                console.log('errorfunc');
                console.log(error);
            }
            else if(response) {
                    /* var AlliedDetailwrite= {
                        Transactionid:response,
                        Start:starttime,
                        End:(new Date()).getTime(),
                        lapse:((new Date()).getTime() - starttime)/60000
                     } */
                     writer.pipe(fs.createWriteStream("loopfirst.csv", {flags: 'a'}));
                     writer.write({
                        Transactionid:response,
                        Start:starttime,
                        End:Math.floor((new Date()).getTime()/1000),
                        Lapse:(Math.floor((new Date()).getTime()/1000) - starttime)
                     })
                     //writer.end();
                  // firstloopcsvwriter.writeRecords(AlliedDetailwrite).then(()=>console.log(i+"written"));

                    return callback(response);
                }
            })
        }
       
        });
}


function loopSecondTransaction(responsecreate){
    var finaltransactioncreationtime=[];
    var transactionconfirmationtime=[];
    var entiretransactionlifecycletime=[]
    var transactionids=responsecreate[0];
    var timestampstart = responsecreate[1];
    var timestampend= responsecreate[2];
    var loopwritearray=[];
    var iteration=10;
    init();
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
            console.log(data.Transactionid);
            console.log(data.Start);
            console.log(data.End);
            console.log(data.Lapse);
            getBlocknos(data.Transactionid,function(blocknoresponse){
                writer.pipe(fs.createWriteStream("loopsecond.csv", {flags: 'a'}));
                writer.write({
                   Transactionid:data.Transactionid,
                   Start:data.Start,
                   End:data.End,
                   Lapse:data.Lapse,
                   BlockNo:blocknoresponse
                })
            })
            
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
            init();
            if (fs.existsSync("loopthird.csv")) {
                fs.unlinkSync("loopthird.csv");
                }
                if (!fs.existsSync("loopthird.csv")){
                    writer = csvWriter({ headers: ["Transactionid","Start","End","Lapse","BlockNo","BlockTimeStamp","Blockminer","Difficulty",
                    "Blocksize","BlockGasLimit","BlockTransactions","BlockUncles","TotalTime"]});
               }
                   else{
                       writer = csvWriter({sendHeaders: false});
                      }
                fs.createReadStream("loopsecond.csv").pipe(csv()).on('data',function(data){
                    getBlockTimestamps(data.BlockNo,function(blocktimeresponse){
                        writer.pipe(fs.createWriteStream("loopthird.csv", {flags: 'a'}));
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
                           BlockTransactions:blocktimeresponse.transactions.length,
                           BlockUncles:blocktimeresponse.uncles.length,
                           TotalTime:blocktimeresponse.time-data.Start
                        })
                    })
                    
                })

       
    /* getBlocknos(transactionids,function(blocknoresponse){
        if(blocknoresponse!=10){
        var blocknos = blocknoresponse;

        getBlockTimestamps(blocknos,function(blocktimestampresponse){
            if(blocktimestampresponse.length=10){
           var blocktimestamps = blocktimestampresponse;
         for(var l=0;l<iteration;l++){
          finaltransactioncreationtime[l] = (timestampend[l]-timestampstart[l])/(60000);
          transactionconfirmationtime[l] = (blocktimestamps[l]-timestampend[l])/60000;
          entiretransactionlifecycletime[l]=(blocktimestamps[l]-timestampstart[l])/60000;
           }

           for(var m=0;m<iteration;m++){
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
         console.log(loopwritearray)
         secondloopcsvwriter.writeRecords(loopwritearray).then(()=>console.log("Third written"));
        }})
    }
}) */
}
           
function getBlocknos(transactionid,callback){
    var iteration =10;
    var blocknos=[];
    //for(var j=0;j<iteration && transactionids[j]!=undefined;j++){

        web3http.eth.getTransaction(transactionid,function(error,response){
            if(error){
                console.log('errorsecblockno');
                console.log(error);
            }
            else if(response) {
                return callback(response.blockNumber);
        }
        });
    //}
}

function secondloopTransaction(responsecreate){
    
    if (fs.existsSync("loopsecond.csv")) {
        fs.unlinkSync("loopsecond.csv");
        }
    getBlocknos(transactionids,function(blocknoresponse){
        if(blocknoresponse.length=10){
        var blocknos = blocknoresponse;

        getBlockTimestamps(blocknos,function(blocktimestampresponse){
            if(blocktimestampresponse.length=10){
           var blocktimestamps = blocktimestampresponse;
         for(var l=0;l<iteration;l++){
          finaltransactioncreationtime[l] = (timestampend[l]-timestampstart[l])/(60000);
          transactionconfirmationtime[l] = (blocktimestamps[l]-timestampend[l])/60000;
          entiretransactionlifecycletime[l]=(blocktimestamps[l]-timestampstart[l])/60000;
           }

           for(var m=0;m<iteration;m++){
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
         console.log(loopwritearray)
         secondloopcsvwriter.writeRecords(loopwritearray).then(()=>console.log("Third written"));
        }})
    }
})
} 



function getBlockTimestamps(blocknos,callback){
    var iteration =10;
    var blocktimestamps=[];
    //console.log(blocknos);
    //for(var k=0;k<iteration && blocknos[k]!=undefined;k++){
        //console.log('blocknos[k]');
        //console.log(blocknos[k])
    web3http.eth.getBlock(blocknos,function(error,response){
        if(error){
            console.log('errorsecblocktimestamp');
            console.log(error);
        }
        else if(response) {
        //blocktimestamps[k] = response.timestamp;
            return callback(response);
    }
    });
    //}
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
