require('dotenv').config();
var mcconnect = require('../../../blockchainapi/multichain/connect');
var mcadmin = require('../../../blockchainapi/multichain/admin');
var mcasset = require('../../../blockchainapi/multichain/asset');
var mcassetissue = require('../../../blockchainapi/multichain/assetissue');
var mcconfig = require('../../../blockchainapi/multichain/config');


var approveoutstandingtimer = process.env.timer_admin_multi_adminservice_approveoutstanding;
var afteradmintimer = process.env.timer_admin_multi_adminservice_afteradmin;
var finaliseconnecttimer = process.env.timer_admin_multi_adminservice_finalisconnect;
var connectapprovependingtimer = process.env.timer_admin_multi_adminservice_connectapprovepending;
var createassetrequesttimer = process.env.timer_admin_multi_adminservice_createassetrequest;
var pollassetrequesttimer = process.env.timer_admin_multi_adminservice_pollassetrequest;
var finaliseassetrequesttimer = process.env.timer_admin_multi_adminservice_finaliseasetrequest;

//////////////////Timer Details:
//Timer Interval //3600000 milliseconds = 60 minutes

//For Test we Keep 2 minutes
//180000
//For Admin Permission
setInterval(function () {
    approveOutStandingAdminPermissions(function (response) {
        console.log(response);
    })
}, approveoutstandingtimer);

setInterval(function () {
    afterAdminGrantTasksforKnownNodes(function (response) {
        console.log(response);
    })
}, afteradmintimer);

setInterval(function () {
    finaliseMyConnectApprovals(function (response) {
        console.log(response);
    })
}, finaliseconnecttimer);

setInterval(function () {
    getConnectApprovalsPendingandApprove(function (response) {
        console.log(response);
    })
}, connectapprovependingtimer);

setInterval(function () {
    createAssetRequestforPendingRequests(function (response) {
        console.log(response);
    })
}, createassetrequesttimer);

setInterval(function () {
    pollAssetRequestatNetworkandApprove(function (response) {
        console.log(response);
    })
}, pollassetrequesttimer);

setInterval(function () {
    finaliseAssetRequest(function (response) {
        console.log(response);
    })
}, finaliseassetrequesttimer);



/**
 * Main ADMIN API for Multichain interaction from the UI for providing service interaction 
 */

/**
 * Grant An Admin Permission to a User Node
 * @param {*} permissionedaddress address which needs admin permission 
 * @param {*} callback 
 */
function grantAdmin(data, callback) {
    mcconfig.validateaddress(data.permissionedAddress, function (validationresponse) {
        if (validationresponse.isvalid == true) {
            mcadmin.adminconnect(data.permissionedAddress, function (connectresponse) {
                return callback('Admin Permission Initiated for' + data.permissionedAddress);
            })
        }
        else {
            return callback('Invalid Node');
        }
    }
    )

}

/**
 * Just a util function for to create ADMINADDR+ "AR/AA/AD/PA"
 * @param {*} data 
 * @param {*} callback 
 */
function createMyAdminStreams(callback) {
    mcconfig.createMyAdminStreams(function (response) {
        return callback('createMyAdminStreams' + response);
    })
}

/**
 * Just a util function for to create ADMINADDR+ "AR/AA/AD/PA"
 * @param {*} data 
 * @param {*} callback 
 */
function subscribeToAllStreams(callback) {
    mcadmin.subscribeToAllStream(function (response) {
        return callback('subscribeToAllStream' + response);
    })
}


/**
 *  Job Can be triggered manually or can be Timer scheduled to clear approvals for Admin Permission
 * 
 * @param {*} callback 
 */
function approveOutStandingAdminPermissions(callback) {
    mcadmin.pollOutstandingTransaction(function (response) {
        return callback('Outstanding Admin Permision Polled and Approved')

    })

}

/**
 * Get the Trasnaction Id which are pending your approvals
 * @param {*} callback 
 */
function getMyAdminApprovals(callback) {
    mcadmin.pendingPermissionApprovals(function (response) {
        return callback(response);
    })
}

/**
 * Give The Approval for each TransactionID manually 
 * @param {*} Transaction ID
 * @param {*} callback 
 */
function giveAdminApprovalforTransactionId(data, callback) {
    mcadmin.pollForPermissionApprovals(data.transactionid, function (response) {
        return callback("Admin Approval status for:" + data.transactionid + 'is:' + response);
    })
}

/**
 * Job can be triggered Manually or Scheduled
 * @param {*} callback 
 */
function afterAdminGrantTasksforKnownNodes(callback) {
    mcadmin.finaliseAdmin(function (response) {
        return callback("Logging and Stream Creation, Initial Asset Transfer Task cleared for New Admins" + response);
    })
}

/**
 * Permisssions Which are of Type Admin and Pending are returned
 * @param {*} callback 
 */
function getPermissionApprovalsinNetworkforAdmin(callback) {
    mcadmin.getPendingPermissionForApprovals(function (response) {
        return callback("Permisssions Which are of Type Admin and PEnding are returned" + response);
    })
}

/**
 * Revoke Admin Permission for an Admin Node
 * Offline Commuincation Needed
 * @param {*} data 
 * @param {*} callback 
 */
function revokeAdminPermissionforNode(data, callback) {
    mcadmin.revokeAdminPermission(data.permissionedAddress, function (response) {
        return callback("Admin Permission Revoked for:" + data.permissionedAddress + response);
    })
}
////////////////////////////////////////////////////ADMIN PERMISSION ENDED//////////////////////////////////////////////////

/**
 * Initiate a Connect permission for a new node
 * @param {*} data which contains Permission Address
 * @param {*} callback 
 */
function grantConnectPermission(data, callback) {
    mcconnect.connect(data.permissionedAddress, function (response) {
        return callback("Granted Connect Permission for:" + data.permissionedAddress + response)
    })
}

/**
 * Get the status of your Connect permission which are initated and pending
 */
function getMyConnectApprovals(callback) {
    mcconnect.getOutstandingTransaction(function (response) {
        return callback(response);
    })
}

/**
 * TIMER or Manually Triggered Get the Connect Approvals which are initiated by Admin and then finalise for Connect Permission
 */
function finaliseMyConnectApprovals(callback) {
    mcconnect.pollOutstandingTransaction(function (response) {
        return callback("Cleared Some Connect Permissions" + response);
    })
}

/**
 * Manually Called
 * Function to get the Approvals wwhich are needing everyones attention, For All Permissions in general
 * @param {*} callback 
 */
function getNetworkPermissionApprovals(callback) {
    mcconnect.getPendingPermissionForApprovals(function (response) {
        return callback(response);
    })
}

/**
 * Get Connect Approvals which are Pending your permission approval
 * @param {*} callback 
 */
function getConnectApprovalsPending(callback) {
    mcconnect.pendingPermissionApprovals(function (response) {
        return callback(response);
    })
}

/**
 * Timer or manually Called for Approval of Connect Permission which are pending your attention
 * @param {*} callback 
 */
function getConnectApprovalsPendingandApprove(callback) {
    mcconnect.autoApprovePermission(function (permission) {
        return callback('Approval for Connect Permission are granted');
    })
}

/**
 * Approve Connect Permission by Transaction ID
 * @param {*} data 
 * @param {*} callback 
 */
function ApproveConnectbyTransaction(data, callback) {
    mcconnect.approvePermission(data.transactionid, function (reponse) {
        return callback("Connect Permission Approved for" + data.transactionID);
    })
}

/**
 * Revoke Connect Permission Not Allowed rather we dissociate the data of the Node Address from the Network 
 * @param {*} callback 
 */
function revokeConnectPermission(callback) {
    return callback("Revoke is Not Possible, But Data of node is to be dissociated by GDPR")
}
/////////////////////////////////////Connect Permission Ended///////////////////////////////////////////

/**
 * Issue the Asset "Kilometrage" which is only executed the first time
 */
function issueFirstTimeAsset(callback) {
    mcassetissue.issueAsset(function (response) {
        return callback("Kilometrage Asset Issue which is restricted")
    })
}

/**
 * Reissue Asset when Asset gets fully transferred
 * 
 * Initial Balance of the Asset is 9 * 10^18
 */
function reissueAsset(data, callback) {
    mcassetissue.reissue(data.inputQty, function (response) {
        return callback("Asset Reissued for:" + data.inputQty);
    })
}
/////////////////////////////////FILTER CREATION////////////////////////////////////////////////////////////

/**
 * Create asset and permission filter onto the network
 * @param {*} callback 
 */
function createFilter(callback) {
    mcadmin.createFilter(function (response) {
        return callback("Filter Created for Asset and Permission:");
    })
}

/**
 * Approve the Filter
 * @param {*} callback 
 */
function approveFilter(callback) {
    mcadmin.approveFilter(function (response) {
        return callback("Filter Approved for Asset and Permission:");
    })
}

function disapproveFilter(callback) {
    mcadmin.disapproveFilter(function (response) {
        return callback("Filter Disapproved for Asset and Permission:");
    })
}




//////////////////////////////////////Asset Issue Ended/////////////////////////////////////////////////

/**
 * Admin Node Raises an asset request for the other node
 * @param PermissionedAddress and Input Qty
 * @param {*} callback 
 */
function raiseAssetTransferforOtherNode(data, callback) {
    mcasset.initiateBasicAssetRequestOnbehalf(data.permissionedAddress, data.inputQty, function (response) {
        return callback("Asset request initiated for Node:" + data.permissionedAddress);
    })
}

/**
 * Timer or Manual 
 * Look at the own stream "OWN+AR" and look for pending requests and create the request for the same
 */
function createAssetRequestforPendingRequests(callback) {
    mcasset.pollandCreateAssetRequests(function (response) {
        return callback("Asset Requests created for the pending asset request in my queue")
    })
}

/**
 * Get Request which are to be looked at an admin and to be created
 */
function getPendingAssetRequesttoCreate(callback) {
    mcasset.pendingAssetRequestCreation(function (response) {
        return callback(response);
    })
}

/**
 * Initiate Asset Request only for specific transaction
 */
function createAssetRequestforSelectedTransaction(data, callback) {
    mcasset.initiateAssetRequest(data.permissionedAddress, data.inputQty, data.transactionid, function (response) {
        return callback("Asset Request taken forward for:" + data.transactionid);
    })
    mcasset.publishSign(data.transactionid, data.permissionedAddress, data.inputQty, function (publishresponse) {
        console.log(publishresponse);
    })
    mcasset.logAssetApproval(data.permissionedAddress, data.transactionid, data.inputQty, function (logresponse) {
        console.log(logresponse);
    })

}

/**
 * Get the Pending Asset Request at network Level to Approve
 * @param {*} callback 
 */
function getAssetRequestatNetworktoApprove(callback) {
    mcasset.pendingAssetApprovals(function (response) {
        return callback(response);
    })
}


/**
 * Timer or Manual Job to give approval by other Admin node Request for Asset Requests
 * @param {*} callback 
 */
function pollAssetRequestatNetworkandApprove(callback) {
    mcasset.pollforAssetTransferRequesttoApprove(function (response) {
        return callback("Approval at network level for Asset Request submitted");
    })
}

/**
 * Give Approval to specific transaction at network level to go formward with Asset Approval
 * @param {*} data 
 * @param {*} callback 
 */
function giveApprovalatNetworkwithTransactionId(data, callback) {
    mcasset.approveAssetTransferRequest(data.transactionid, function (response) {
        return callback("Approval at netowrk level for:" + data.transactionID);
    })
}

/**
 * Timer or Manual Look at the initiated Asset Request and Check if its Approved at the netowrk level and finalise the
 * Approval with SEND metadata
 * @param {*} callback 
 */
function finaliseAssetRequest(callback) {
    mcasset.finalise(function (response) {
        return callback("Finalisation of Asset Request in Progress");
    })
}

/**
 *Get My initatiated Asset Request which are pending at NEtwork LEvel 
 */

function getMyRequestPendingatNetworkLevel(callback) {
    mcasset.clearOutstandingTransaction(function (response) {
        return callback(response);
    })
}

/**
 * Get the Asset balance of the Admin for the kilometrage
 * @param {*} callback 
 */
function getAssetBalance(callback) {
    mcasset.getassetbalance(function (response) {
        return callback(response);
    })
}

/**
 * Get the Asset balance of the Other for the kilometrage
 * @param {*} callback 
 */
function getOtherAssetBalance(data, callback) {
    mcasset.getotherassetbalance(data.permissionedAddress, function (response) {
        return callback(response);
    })
}

/**
 * Trasnfer Asset to other Admin
 * This Transaction will be allowed by the Trasnaction filter for Asst Transfer
 * @param {*} data 
 * @param {*} callback 
 */
function transferAssettoOtherAdminNode(data, callback) {
    mcassetissue.transferAssettoOtherAdmin(data.adminAddress, data.inputQty, function (response) {
        return callback("Asset Transfered to Other Admin")
    })
}

/////////////////////////////////////End of Asset////////////////////////////////////////


let odowalletmultichainexports = {
    grantAdmin: grantAdmin,
    approveOutStandingAdminPermissions: approveOutStandingAdminPermissions,
    getMyAdminApprovals: getMyAdminApprovals,
    giveAdminApprovalforTransactionId: giveAdminApprovalforTransactionId,
    afterAdminGrantTasksforKnownNodes: afterAdminGrantTasksforKnownNodes,
    getPermissionApprovalsinNetworkforAdmin: getPermissionApprovalsinNetworkforAdmin,
    revokeAdminPermissionforNode: revokeAdminPermissionforNode,
    grantConnectPermission: grantConnectPermission,
    getMyConnectApprovals: getMyConnectApprovals,
    finaliseMyConnectApprovals: finaliseMyConnectApprovals,
    getNetworkPermissionApprovals: getNetworkPermissionApprovals,
    getConnectApprovalsPending: getConnectApprovalsPending,
    getConnectApprovalsPendingandApprove: getConnectApprovalsPendingandApprove,
    ApproveConnectbyTransaction: ApproveConnectbyTransaction,
    revokeConnectPermission: revokeConnectPermission,
    issueFirstTimeAsset: issueFirstTimeAsset,
    reissueAsset: reissueAsset,
    approveFilter: approveFilter,
    disapproveFilter: disapproveFilter,
    createFilter: createFilter,
    raiseAssetTransferforOtherNode: raiseAssetTransferforOtherNode,
    createAssetRequestforPendingRequests: createAssetRequestforPendingRequests,
    getPendingAssetRequesttoCreate: getPendingAssetRequesttoCreate,
    createAssetRequestforSelectedTransaction: createAssetRequestforSelectedTransaction,
    getAssetRequestatNetworktoApprove: getAssetRequestatNetworktoApprove,
    pollAssetRequestatNetworkandApprove: pollAssetRequestatNetworkandApprove,
    giveApprovalatNetworkwithTransactionId: giveApprovalatNetworkwithTransactionId,
    finaliseAssetRequest: finaliseAssetRequest,
    getMyRequestPendingatNetworkLevel: getMyRequestPendingatNetworkLevel,
    getAssetBalance: getAssetBalance,
    getOtherAssetBalance: getOtherAssetBalance,
    transferAssettoOtherAdminNode: transferAssettoOtherAdminNode,
    createMyAdminStreams: createMyAdminStreams,
    subscribeToAllStreams: subscribeToAllStreams
}

module.exports = odowalletmultichainexports;
