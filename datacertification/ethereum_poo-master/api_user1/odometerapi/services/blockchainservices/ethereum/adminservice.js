require('dotenv').config();
var ethadmin = require('../../../blockchainapi/ethereum/adminservice');
var ethuser = require('../../../blockchainapi/ethereum/userservice');
var ethcommon = require('../../../blockchainapi/ethereum/commonservice');


//////////////////Timer Details:
//Timer Interval //3600000 milliseconds = 60 minutes

//For Test we Keep 2 minutes
//120000

var addsignaturetimer = process.env.timer_admin_ether_adminservice_addsignature;


setInterval(function () {
    jobAddSignaturetoPendingTransactions(function (response) {
        console.log(response);
    })
}, addsignaturetimer);



/**
 * Set the Main Contract Address for the Wallet to Accept
 * @param {*} data 
 * @param {*} callback 
 */
function setMainContractAddress(data, callback) {
    ethadmin.setMainContractAddress(data.maincontractaddress, function (response) {
        return callback("ContractSet" + response);
    })
}

/**
 * Get the Main Contract Address for the Wallet to Accept
 * @param {*} data 
 * @param {*} callback 
 */
function getMainContractAddressinWallet(callback) {
    ethadmin.getMainContractAddressinWallet(function (response) {
        return callback("ContractSet" + response);
    })
}

/**
 * Get the Main Contract Address for the Transaction to Accept
 * @param {*} data 
 * @param {*} callback 
 */
function getMainContractAddressinTransaction(callback) {
    ethadmin.getMainContractAddressinTransaction(function (response) {
        return callback("ContractSet" + response);
    })
}

/**
 * Set the transaction Contract Address in Wallet to Accept
 */
function setTransactionContractAddress(data, callback) {
    ethadmin.setTransactionContractAddress(data.transactioncontractaddres, function (response) {
        return callback("Transaction Contract Set" + response);
    })
}

/**
 * Get the transaction Contract Address in Wallet to Accept
 */
function getTransactionContractAddressinWallet(callback) {
    ethadmin.getTransactionContractAddressinWallet(function (response) {
        return callback("Transaction Contract Set" + response);
    })
}

/**
 * Destroy the contract and its associated contract after the transaction consensus
 * @param {*} callback 
 */
function destroyContract(callback) {
    ethadmin.destroyMainContract(function (response) {
        return callback("Contract Destroy Initiative taken !!Careful");
    })
}

/**
 * Create a new PArticipant into the Network
 * @param {*} data 
 * @param {*} callback 
 */
function createParticipant(data, callback) {
    ethadmin.createParticipant(data.permissionedAddress, data.metadata, function (response) {
        return callback("Participant Create Transaction created" + response);
    })
}

/**
 * REmove a paricipant from the Network
 * @param {*} data 
 * @param {*} callback 
 */
function removeParticipant(data, callback) {
    ethadmin.removeParticipant(data.permissionedAddress, function (response) {
        return callback("Participant Remove initiated" + response);
    })
}

/**
 * Add Follower Role to a participant
 * @param {*} data 
 * @param {*} callback 
 */
function addFollower(data, callback) {
    ethadmin.addFollowerRole(data.permissionedAddress, function (response) {
        return callback("Follower Role Transaction Created" + response);
    })
}


function removeFollowerRole(data, callback) {
    ethadmin.removeFollowerRole(data.permissionedAddress, function (response) {
        return callback("Follower role Removal Transaction Created" + response);
    })
}

function addLeaderRole(data, callback) {
    ethadmin.addLeaderRole(data.permissionedAddress, function (response) {
        return callback("Add Leadder Role Transaction Initiated" + response);
    })
}

function removeLeaderRole(data, callback) {
    ethadmin.removeLeaderRole(data.permissionedAddress, function (response) {
        return callback("REmove Leader Role Transaction Intitated" + response);
    })
}

function deleteTransactions(data, callback) {
    ethadmin.deleteTransactions(data.permissionedAddress, function (response) {
        return callback("Delete Transaction Initated for Permissioend Address" + response);
    })
}

function changeParticipantConsensus(data, callback) {
    ethadmin.changeParticipantConsensus(data.value, function (response) {
        return callback("Participant Consensus Transaction Initiated" + response);
    })
}

function changeFollowerConsensus(data, callback) {
    ethadmin.changeFollowerConsensus(data.value, function (response) {
        return callback("Change Follower Consensus Initiated" + response);
    })
}

function changeOverallConsensus(data, callback) {
    ethadmin.changeOverallConsensus(data.value, function (response) {
        return callback("Change Overall Consensus Intitiated" + response);
    })
}

function changeDeleteTransactionConsensus(data, callback) {
    ethadmin.changeDeleteTransactionConsensus(data.value, function (response) {
        return callback("changeDeleteTransactionConsensus Initiated" + response);
    })
}

function increaseTokenSupply(data, callback) {
    ethadmin.increaseTokenSupply(data.permissionedAddress, data.balance, function (response) {
        return callback("Increase Token Supply" + response);
    })
}

function assetTransfer(data, callback) {
    ethadmin.tokenTransfer(data.balance, function (response) {
        return callback("Asset Transfer Trasnaction Initiated" + response);
    })
}

function assetTransferForOthers(data, callback) {
    ethadmin.tokenTransferForOthers(data.permissionedAddress, data.balance, function (response) {
        return callback("Asset Transfer Trasnaction Initiated" + response);
    })
}

function assetRetract(data, callback) {
    ethadmin.tokenRetract(data.permissionedAddress, data.balance, function (response) {
        return callback("Asset Retract Initiated" + response);
    })
}

function changeTokenSupplyConsensus(data, callback) {
    ethadmin.changeTokenSupplyConsensus(data.value, function (response) {
        return callback("changeTokenSupplyConsensus Initiated" + response);
    })
}

function changeTokenTransferConsensus(data, callback) {
    ethadmin.changeTokenTransferConsensus(data.value, function (response) {
        return callback("changeTokenTransferConsensus Initiated" + response);
    })
}

function changeTokenRetractConsensus(data, callback) {
    ethadmin.changeTokenRetractConsensus(data.value, function (response) {
        return callback("changeTokenRetractConsensus Initiated" + response);
    })
}

function addSignatureByTransactionId(data, callback) {
    ethadmin.addSignatureByTransactionId(data.transactionid, function (response) {
        return callback("Signature Added for the tranaction" + response);
    })
}

function addSignatureByPermissionedAddress(data, callback) {
    ethadmin.addSignatureByPermissionedAddress(data.permissionedAddress, function (response) {
        return callback("AddSignatureByPermissionedAddress done" + response);
    })
}

function jobAddSignaturetoPendingTransactions(callback) {
    ethadmin.jobAddSignaturetoPendingTransactions(function (response) {
        return callback("Job Add Signature to PEnding Transaction Initiated" + response);
    })
}

function removeSignatureByTransactionId(data, callback) {
    ethadmin.removeSignatureByTransactionId(data.transactionid, function (response) {
        return callback("Removal of Signature to the Transaction Initiated" + response);
    })
}

function removeSignatureByPermissionedAddress(data, callback) {
    ethadmin.removeSignatureByPermissionedAddress(data.permissionedAddress, function (response) {
        return callback("Removal of Signature By Permissioned Address Intitiated" + response);
    })
}

function getPendingTransactionsinNetwork(callback) {
    ethadmin.getPendingTransactions(function (response) {
        return callback("Pending transaction listed:" + response);
    })
}

function getTransactionId(data, callback) {
    ethadmin.getTransactionId(data.permissionedAddress, function (response) {
        return callback("Returned Pending Transaction Id for Address:" + response);
    })
}

function getParticipantRoleConsensus(callback) {
    ethadmin.getParticipantRoleConsensus(function (response) {
        return callback("Particpant Role Consensus is:" + response);
    })
}

function getFollowerRoleConsensus(callback) {
    ethadmin.getFollowerRoleConsensus(function (response) {
        return callback("Follower Role Consensus is:" + response);
    })
}

function getLeaderRoleConsensus(callback) {
    ethadmin.getleaderRoleConsensus(function (response) {
        return callback("Leader Role Consensus is:" + response);
    })
}

function getOverallConsensus(callback) {
    ethadmin.getOverallConsensus(function (response) {
        return callback("Overall Consensus is:" + response);
    })
}

function getDeleteTransactionConsensus(callback) {
    ethadmin.getDeleteTransactionConsensus(function (response) {
        return callback("Delete Transaction Consensus is:" + response);
    })
}

function getTransactionDetails(data, callback) {
    ethadmin.getTransactionDetails(data.permissionedAddress, function (response) {
        return callback("Transaction details for address:" + response);
    })
}


let maincontractexports = {
    setMainContractAddress: setMainContractAddress,
    setTransactionContractAddress: setTransactionContractAddress,
    destroyContract: destroyContract,
    createParticipant: createParticipant,
    removeParticipant: removeParticipant,
    addFollower: addFollower,
    removeFollowerRole: removeFollowerRole,
    addLeaderRole: addLeaderRole,
    removeLeaderRole: removeLeaderRole,
    deleteTransactions: deleteTransactions,
    changeParticipantConsensus: changeParticipantConsensus,
    changeFollowerConsensus: changeFollowerConsensus,
    changeOverallConsensus: changeOverallConsensus,
    changeDeleteTransactionConsensus: changeDeleteTransactionConsensus,
    increaseTokenSupply: increaseTokenSupply,
    assetTransfer: assetTransfer,
    assetRetract: assetRetract,
    changeTokenSupplyConsensus: changeTokenSupplyConsensus,
    changeTokenTransferConsensus: changeTokenTransferConsensus,
    changeTokenRetractConsensus: changeTokenRetractConsensus,
    addSignatureByTransactionId: addSignatureByTransactionId,
    addSignatureByPermissionedAddress: addSignatureByPermissionedAddress,
    jobAddSignaturetoPendingTransactions: jobAddSignaturetoPendingTransactions,
    removeSignatureByTransactionId: removeSignatureByTransactionId,
    removeSignatureByPermissionedAddress: removeSignatureByPermissionedAddress,
    getPendingTransactionsinNetwork: getPendingTransactionsinNetwork,
    getTransactionId: getTransactionId,
    getParticipantRoleConsensus: getParticipantRoleConsensus,
    getFollowerRoleConsensus: getFollowerRoleConsensus,
    getLeaderRoleConsensus: getLeaderRoleConsensus,
    getOverallConsensus: getOverallConsensus,
    getDeleteTransactionConsensus: getDeleteTransactionConsensus,
    getTransactionDetails: getTransactionDetails,
    assetTransferForOthers: assetTransferForOthers,
    getMainContractAddressinWallet: getMainContractAddressinWallet,
    getMainContractAddressinTransaction: getMainContractAddressinTransaction,
    getTransactionContractAddressinWallet: getTransactionContractAddressinWallet

};

module.exports = maincontractexports;