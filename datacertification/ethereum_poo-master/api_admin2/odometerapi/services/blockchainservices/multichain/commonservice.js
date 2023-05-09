var mcconnect = require('../../../blockchainapi/multichain/connect');
var mcadmin = require('../../../blockchainapi/multichain/admin');
var mcasset = require('../../../blockchainapi/multichain/asset');
var mcassetissue = require('../../../blockchainapi/multichain/assetissue');
var mcconfig = require('../../../blockchainapi/multichain/config');
var mcmonitor = require('../../../blockchainapi/multichain/monitorservice');
/**
 * Get Blockchain Network Info 
 * @param {*} callback 
 */
function getNetworkinfo(callback){
    mcconfig.getNetworkinfo(function(response){
        return callback(response);
    })
}

/**
 * Get the information on connected peers
 * @param {*} callback 
 */
function getPeerinfo(callback){
    mcconfig.getPeerinfo(function(response){
        return callback(response);
    })
}

/**
 * Ping to all the peers and get information in get network info
 * @param {*} callback 
 */
function ping(callback){
    mcconfig.ping(function(response){
        return callback(response);
    })
}


/**
 * Get Blockchain Information
 * @param {*} callback 
 */
function getBlockchainInfo(callback){
    mcconfig.getBlockchainInfo(function(response){
        return callback(response);
    })
}


/**
 * Get Memory Pool Info of the Blockchain Network
 * @param {*} callback 
 */
function getMempoolInfo(callback){
    mcconfig.getMempoolInfo(function(response){
        return callback(response);
    })
}


/**
 * Get Mining Information of the Node
 * @param {*} callback 
 */
function getmininginfo(callback){
    mcconfig.getmininginfo(function(response){
        return callback(response);
    })
}


/**
 * Get Wallet Information of the Node
 * @param {*} callback 
 */
function getWalletInfo(callback){
    mcconfig.getWalletInfo(function(response){
        return callback(response);
    })
}

/**
 * Check if the address of a Node is Valid
 * @param {*} data 
 * @param {*} callback 
 */
function validateaddress(data,callback){
    mcconfig.validateaddress(data.inputaddress,function(response){
        return callback("Address Validation: "+JSON.stringify(response));
    })
}

/**
 * List Permissions of a particular address
 * @param {*} data 
 * @param {*} callback 
 */
function listaddresspermissions(data,callback){
    mcconfig.getNetworkinfo(data.inputaddress,function(response){
        return callback(response);
    })
}

/**
 * List Permissions of the Network in general
 * @param {*} callback 
 */
function listpermissions(callback){
    mcconfig.listpermissions(function(response){
        return callback(response);
    })
}

/**
 * List the permissions of the asset "Kilometrage"
 * @param {*} callback 
 */
function listassetpermissions(callback){
    mcconfig.listassetpermissions(function(response){
        return callback(response);
    })
}

/**
 * List Stream permission
 * @param {*} callback 
 */
function liststreampermissionspermissionrequest(callback){
    mcconfig.liststreampermissionspermissionrequest(function(response){
        return callback(response);
    })
}

/**
 * List Stream permission
 * @param {*} callback 
 */
function liststreampermissionspermissionapprove(callback){
    mcconfig.liststreampermissionspermissionapprove(function(response){
        return callback(response);
    })
}


/**
 * List Stream Permission
 * @param {*} callback 
 */
function liststreampermissionsadminpermissionrequest(callback){
    mcconfig.liststreampermissionsadminpermissionrequest(function(response){
        return callback(response);
    })
}

/**
 * List Stream Permission
 * @param {*} callback 
 */
function liststreampermissionsassetrequest(callback){
    mcconfig.liststreampermissionsassetrequest(function(response){
        return callback(response);
    })
}

/**
 * List Stream PErmission
 * @param {*} callback 
 */
function liststreampermissionsassetapprove(callback){
    mcconfig.liststreampermissionsassetapprove(function(response){
        return callback(response);
    })
}

/**
 * Get the Blockchain Parameters
 * @param {*} callback 
 */
function getblockchainparams(callback){
    mcconfig.getblockchainparams(function(response){
        return callback(response);
    })
}

/**
 * Get Information of the Blockchain
 * @param {*} callback 
 */
function getInfo(callback){
    //mcconfig.getInfo(function(response){
        mcmonitor.loopFirstTransaction(function(response){
        return callback(response);
    })
}


/**
 * Get Information of the Blockchain
 * @param {*} callback 
 */
function getAddress(callback){
    mcconfig.getAddress(function(response){
        return callback(response);
    })
}

/**
 * List Transaction of a particular address
 * @param {*} callback 
 */
function listaddresstransactions(data,callback){
    mcconfig.listaddresstransactions(data.permissionedaddress,function(response){
        return callback(response);
    })
}

/**
 * Create the 5 default streams Handle Manually
 * @param {*} callback 
 */
function createDefaultStream(callback){
    mcconfig.createDefaultStream(function(response){
        return callback(response);
    })
}

/**
 * Create the 5 default streams Handle Manually
 * @param {*} callback 
 */
function createDefaultStream(callback){
    mcconfig.createDefaultStream(function(response){
        return callback(response);
    })
}

/**
 * Create the 5 default streams Handle Manually
 * @param {*} callback 
 */
function getRecentClearedTransaction(callback){
    mcmonitor.loopSecondTransaction(function(response){
        return callback(response);
    })
}







let odowalletmultichainexports={
    getNetworkinfo:getNetworkinfo,
    createDefaultStream:createDefaultStream,
    getPeerinfo:getPeerinfo,
    listaddresstransactions:listaddresstransactions,
    getInfo:getInfo,
    getAddress:getAddress,
    liststreampermissionspermissionrequest:liststreampermissionspermissionrequest,
    liststreampermissionsadminpermissionrequest:liststreampermissionsadminpermissionrequest,
    liststreampermissionspermissionapprove:liststreampermissionspermissionapprove,
    liststreampermissionsassetrequest:liststreampermissionsassetrequest,
    liststreampermissionsassetapprove:liststreampermissionsassetapprove,
    getblockchainparams:getblockchainparams,
    listassetpermissions:listassetpermissions,
    listaddresspermissions:listaddresspermissions,
    listpermissions:listpermissions,
    validateaddress:validateaddress,
    getWalletInfo:getWalletInfo,
    getmininginfo:getmininginfo,
    getMempoolInfo:getMempoolInfo,
    getBlockchainInfo:getBlockchainInfo,
    ping:ping,
    getRecentClearedTransaction:getRecentClearedTransaction

}

module.exports=odowalletmultichainexports;