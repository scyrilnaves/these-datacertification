var ethadmin = require('../../../blockchainapi/ethereum/adminservice');
var ethuser = require('../../../blockchainapi/ethereum/userservice');
var ethcommon = require('../../../blockchainapi/ethereum/commonservice');
var ethmonitor = require('../../../blockchainapi/ethereum/monitorservice');


function isLeader(data,callback){
    ethcommon.isLeader(data.permissionedAddress,function(response){
        return callback("Leader Status is:"+response);
    })
}

function isParticipant(data,callback){
    ethcommon.isParticipant(data.permissionedAddress,function(response){
        return callback("Participant Status is:"+response);
    })
} 

function isFollower(data,callback){
    ethcommon.isFollower(data.permissionedAddress,function(response){
        return callback("Follower Status is:"+response);
    })
} 


function getLeaders(callback){
    ethcommon.getLeaders(function(response){
        return callback(response);
    })
} 


function getNoofLeaders(callback){
    ethcommon.getNoofLeaders(function(response){
        return callback(response);
    })
} 


function getFollowers(callback){
    ethcommon.getFollowers(function(response){
        return callback(response);
    })
} 

function getParticipants(callback){
    console.log('called');
    ethcommon.getParticipants(function(response){
        return callback(response);
    })
} 

function getParticipantDetails(data,callback){
    ethcommon.getParticipantDetails(data.permissionedAddress,function(response){
        return callback("Participant Detail is:"+response);
    })
} 

function getAssetBalance(callback){
    ethcommon.getAssetBalance(function(response){
        return callback(response);
    })
} 

function getOtherAssetBalance(data,callback){
    ethcommon.getOtherAssetBalance(data.permissionedAddress,function(response){
        return callback(response);
    })
} 


function getPeerCount(callback){
    ethcommon.getPeerCount(function(response){
        return callback(response);
    })
}

function getPeers(callback){
    ethcommon.getPeers(function(response){
        return callback(response);
    })
}

function getNodeInfo(callback){
    ethcommon.getNodeInfo(function(response){
        return callback(response);
    })
}

function getHashRate(callback){
    ethcommon.getHashRate(function(response){
        return callback(response);
    })
}

function getGasPrice(callback){
    ethcommon.getGasPrice(function(response){
        return callback(response);
    })
}


function getCurrentBlockNo(callback){
    ethcommon.getCurrentBlockNo(function(response){
        return callback(response);
    })
}

function getEthereumTransactionDetails(data,callback){
    ethcommon.getCurrentBlockNo(data.transactionid,function(response){
        return callback(response);
    })
}

function getPendingTransactions(callback){
    ethcommon.getPendingTransactions(function(response){
        return callback(response);
    })
}

function getTransactionReceipt(data,callback){
    ethcommon.getTransactionReceipt(data.transactionid,function(response){
        return callback(response);
    })
}

function getTxPoolContent(callback){
    ethcommon.getTxPoolContent(function(response){
        return callback(response);
    })
}

function getInspectionoftxPool(callback){
    ethcommon.getInspectionoftxPool(function(response){
        return callback(response);
    })
}

function getTxPoolNo(callback){
    ethcommon.getTxPoolNo(function(response){
        return callback(response);
    })
}

function getMemStats(callback){
    //ethcommon.getMemStats(function(response){
        ethmonitor.loopFirstTransaction(function(response){
        return callback(response);
    })
}

function getAddress(callback){
    ethcommon.getAddress(function(response){
        return callback(response);
    })
}

function getFinalisedEvents(callback){
    //ethmonitor.loopTransaction(function(response){
        ethmonitor.loopSecondTransaction(function(response){
        return callback(response);
    })
}

let odowalletcontractexports ={
    isLeader:isLeader,
isParticipant:isParticipant,
isFollower:isFollower,
getLeaders:getLeaders,
getNoofLeaders:getNoofLeaders,
getFollowers:getFollowers,
getParticipants:getParticipants,
getParticipantDetails:getParticipantDetails,
getAssetBalance:getAssetBalance,
getPeerCount:getPeerCount,
getPeers:getPeers,
getNodeInfo:getNodeInfo,
getHashRate:getHashRate,
getGasPrice:getGasPrice,
getCurrentBlockNo:getCurrentBlockNo,
getEthereumTransactionDetails:getEthereumTransactionDetails,
getPendingTransactions:getPendingTransactions,
getTransactionReceipt:getTransactionReceipt,
getTxPoolContent:getTxPoolContent,
getInspectionoftxPool:getInspectionoftxPool,
getTxPoolNo:getTxPoolNo,
getMemStats:getMemStats,
getFinalisedEvents:getFinalisedEvents,
getAddress:getAddress,
getOtherAssetBalance:getOtherAssetBalance
};

module.exports = odowalletcontractexports;
   