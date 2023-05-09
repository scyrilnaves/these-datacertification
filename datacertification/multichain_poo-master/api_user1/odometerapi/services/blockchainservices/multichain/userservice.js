var mcconnect = require('../../../blockchainapi/multichain/connect');
var mcadmin = require('../../../blockchainapi/multichain/admin');
var mcasset = require('../../../blockchainapi/multichain/asset');
var mcassetissue = require('../../../blockchainapi/multichain/assetissue');
var mcconfig = require('../../../blockchainapi/multichain/config');

var mcmonitor = require('../../../blockchainapi/multichain/monitorservice');

/**
 * Timer or Manual Function
 * Asset Trasnfer request initalised which is chose by a random admin
 * @param {*} data 
 */
function requestAssetTransfer(data,callback){
    mcasset.getassetbalance(function(assetbalance){
        console.log("assb"+assetbalance);
        console.log(data.inputQty);
        if((assetbalance+Number(data.inputQty)>assetbalance)){
            mcasset.initiateBasicAssetRequest(data.inputQty,function(assetresponse){
             console.log("Asset Request Initiated:"+assetresponse);
             mcmonitor.setStatus(assetbalance);
             return callback(assetresponse);
            })
        
        }
        else{
            return callback("Not Possible");
        }
    })

}

/**
 * Asset Request Trasnfer from a specific Admin requested in case of any fallbak
 * @param {*} data 
 */

function requestAssetTransferfromSpecificAdmin(data,callback){
    mcasset.getassetbalance(function(assetbalance){
        if((assetbalance+Number(data.inputQty)>assetbalance)){
            mcasset.initiateBasicAssetRequestSpecifiedAdmin(data.adminAddress,data.inputQty,function(assetresponse){
             console.log("Asset Request Initiated:"+assetresponse);
             return callback(assetresponse);
            })

        }else{
            return callback("Not Possible");
        }
    })
}


/**
 * Asset Balance requested
 * @param {*} callback 
 */
function getAssetBalance(callback){
    mcasset.getassetbalance(function(assetbalance){
    return callback(assetbalance);
    })
}


let odowalletmultichainexports={
    requestAssetTransfer:requestAssetTransfer,
    requestAssetTransferfromSpecificAdmin:requestAssetTransferfromSpecificAdmin,
    getAssetBalance:getAssetBalance

    }

module.exports=odowalletmultichainexports;