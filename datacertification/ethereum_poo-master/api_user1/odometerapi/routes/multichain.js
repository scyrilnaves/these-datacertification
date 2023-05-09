var express = require('express');
var router = express.Router();

var adminservice = require('../services/blockchainservices/multichain/adminservice');
var userservice = require('../services/blockchainservices/multichain/userservice');
var commonservice = require('../services/blockchainservices/multichain/commonservice');
var assettransferinterfaceservice = require('../services/blockchainservices/multichain/assettransferinterface');
var monitorservice = require('../blockchainapi/multichain/monitorservice');


//////////////////////////////ADMIN RELATED FUNCTIONS///////////////////////////

/**
 * POST
 * @Param: permissioned address
 * Grant Admin Permission to User Node
 */
router.post('/grantadmin', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.grantAdmin(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Clear Oustanding Admin Permissions
 */

router.get('/approveOutStandingAdminPermissions', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.approveOutStandingAdminPermissions(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Get Approvals Transaction Id which need the approval
 */
router.get('/getMyAdminApprovals', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getMyAdminApprovals(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * POST
 * @Param: transactionKey
 * Give Approval for each Transaction ID
 */
router.post('/giveAdminApprovalforTransactionId', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.giveAdminApprovalforTransactionId(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Finalise Admin Task for Node
 */
router.get('/afterAdminGrantTasksforKnownNodes', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.afterAdminGrantTasksforKnownNodes(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * PErmission of Type PEnding and Admin are returned
 */
router.get('/getPermissionApprovalsinNetworkforAdmin', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getPermissionApprovalsinNetworkforAdmin(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * REvoke Admin Permission for Node
 * @Param: Permissioned Address
 */
router.post('/revokeAdminPermissionforNode', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.revokeAdminPermissionforNode(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

///////////////////////////////////////////////ADMIN PERMISSION ENDED/////////////////////

/**
 * POST
 * @Param: Permissioned Address
 * Give Connect Permission to a Node
 */
router.post('/grantConnectPermission', function (req, res, next) {
    const body = req.body;
    console.log(body);
    try {
        adminservice.grantConnectPermission(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * GET
 * Get the status of Connect Permission which are initiated
 */
router.get('/getMyConnectApprovals', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getMyConnectApprovals(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * GET
 * Get the Connect Approval which are initiated by Admin 
 */
router.get('/finaliseMyConnectApprovals', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.finaliseMyConnectApprovals(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * For All PErmission status and Pending 
 */
router.get('/getNetworkPermissionApprovals', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getNetworkPermissionApprovals(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * GET
 * Get Connect Approvals which are pending
 */
router.get('/getConnectApprovalsPending', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getConnectApprovalsPending(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * GET
 * Get Connect Approvals Pending and Approve
 */
router.get('/getConnectApprovalsPendingandApprove', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getConnectApprovalsPendingandApprove(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * POST
 * Approve Connect by Transaction ID
 */
router.post('/ApproveConnectbyTransaction', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.ApproveConnectbyTransaction(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET NOt Possible
 * REvoke Connect PErmission for a Node
 */
router.get('/revokeConnectPermission', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.revokeConnectPermission(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});



/**
 * GET
 * Subscribe to All Streams required for an admin
 */
router.get('/subscribeToAllStreams', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.subscribeToAllStreams(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});



///////////////////////////////////CONNECT PERMISSION ENDED////////////////////////////

/**
 * GET
 * Issue Asst for first time in Network
 */
router.get('/issueFirstTimeAsset', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.issueFirstTimeAsset(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * POST
 * Replenish Asset if lacking in Network
 */
router.post('/reissueAsset', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.reissueAsset(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

////////////////////////////////////ASSET ISSUE ENDED////////////////////////////////

/**
 * GET
 * Create Asset Filter and Permission Filter
 */
router.get('/createfilter', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.createFilter(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});



/**
 * GET
 * Approve Asset Filter and Permission Filter
 */
router.get('/approvefilter', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.approveFilter(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});



/**
 * GET
 * Disapprove Asset Filter and Permission Filter
 */
router.get('/disapprovefilter', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.disapproveFilter(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});














/////////////////////////////////////////////////////////////////////////////////////////

/**
 * Raise Asset Transfer for other Node 
 * @Param permissionedaddress, inputqty
 */
router.post('/raiseAssetTransferforOtherNode', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.raiseAssetTransferforOtherNode(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Create Asset request for pending requests
 */
router.get('/createAssetRequestforPendingRequests', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.createAssetRequestforPendingRequests(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Look at request to be created
 */
router.get('/getPendingAssetRequesttoCreate', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getPendingAssetRequesttoCreate(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * POST
 * Create Asset Request for Specified Transaction
 */
router.post('/createAssetRequestforSelectedTransaction', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.createAssetRequestforSelectedTransaction(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * GET
 * Get PEnding Asset Request at Network to Approve
 */
router.get('/getAssetRequestatNetworktoApprove', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getAssetRequestatNetworktoApprove(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Give Approval to other Admin Requests for Asset Request
 */
router.get('/pollAssetRequestatNetworkandApprove', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.pollAssetRequestatNetworkandApprove(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * POST
 * Give Approval to specific transaction at Network Level
 */
router.post('/giveApprovalatNetworkwithTransactionId', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.giveApprovalatNetworkwithTransactionId(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Look at the initiated Asset Request and Finalise the Asset Request
 */
router.get('/finaliseAssetRequest', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.finaliseAssetRequest(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * Get initiated Request pending at Network Level
 */
router.get('/getMyRequestPendingatNetworkLevel', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getMyRequestPendingatNetworkLevel(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});


/**
 * GET
 * GEt the Asset Balance for asset Kilometrage
 */
router.get('/getAssetBalance', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getAssetBalance(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});

/**
 * GET
 * GEt the Asset Balance for asset Kilometrage
 */
router.post('/getOtherAssetBalance', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getOtherAssetBalance(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});


/**
 * Trasnsfer Asset to other Admin Node
 * @Param: AdminAddress, inputQty
 */
router.post('/transferAssettoOtherAdminNode', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.transferAssettoOtherAdminNode(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


////////////////////////////////////////ASSET TRASNFER ENDED//////////////////////////////////////

///////////////////////////////////ADMIN PART ENDED/////////////////////////////////////////////

///////////////////////////////USER PART STARTED/////////////////////////////////////////////////

/**
 * REquest Asset Transfer by the User
 * @Param: InputQty
 */
router.post('/userrequestAssetTransfer', function (req, res, next) {
    const body = req.body;
    try {
        userservice.requestAssetTransfer(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * Request Asset Trasnfer for specffic Admn
 * @Param AdminAddres InputQty
 */
router.post('/userrequestAssetTransferfromSpecificAdmin', function (req, res, next) {
    const body = req.body;
    try {
        userservice.requestAssetTransferfromSpecificAdmin(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * Get Asset balance of an User
 */
router.get('/userAssetBalance', function (req, res, next) {
    const body = req.body;
    try {
        userservice.getAssetBalance(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/////////////////////////////////////////END of USER SERVICES//////////////////////////

//////////////////////////////////////START OF CONFIG SERVICES/////////////////////////



/**
 * Get Network Level Information
 */
router.get('/getNetworkinfo', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getNetworkinfo(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * Get Peer Information
 */
router.get('/getPeerinfo', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getPeerinfo(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * Ping and get information at the network level info
 */
router.get('/ping', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.ping(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * Get Blockchain Information
 */
router.get('/getBlockchainInfo', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getBlockchainInfo(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * Get Memory Pool information
 */
router.get('/getMempoolInfo', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getMempoolInfo(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * Get Miniing Information
 */
router.get('/getmininginfo', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getmininginfo(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * GEt Wallet Information
 */
router.get('/getWalletInfo', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getWalletInfo(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * Validate the Address
 */
router.post('/validateaddress', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.validateaddress(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * List the permissions of an Address
 */
router.post('/listaddresspermissions', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.listaddresspermissions(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * List the permissions in general
 */
router.get('/listpermissions', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.listpermissions(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * Get the Permissions of an Asset
 */
router.get('/listassetpermissions', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.listassetpermissions(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * List stream level permission
 */
router.get('/liststreampermissionspermissionrequest', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.liststreampermissionspermissionrequest(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * List Stream Level Permission
 */
router.get('/liststreampermissionsadminpermissionrequest', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.liststreampermissionsadminpermissionrequest(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * List Stream Level Permission
 */
router.get('/liststreampermissionsassetrequest', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.liststreampermissionsassetrequest(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * List Stream Level Permission
 */
router.get('/liststreampermissionsassetapprove', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.liststreampermissionsassetapprove(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * Get Blockchain Params
 */
router.get('/getblockchainparams', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getblockchainparams(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * Get Information on Blockchain
 */
router.get('/getInfo', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getInfo(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 * List Transaction by address and Tranasaction Id
 */
router.post('/listaddresstransactions', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.listaddresstransactions(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});

/**
 * Create Default Stream, but we handle manually
 */
router.get('/createDefaultStream', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.createDefaultStream(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});




/**
 * Create Default Stream, but we handle manually
 * @param permissionedaddress
 */
router.get('/createMyAdminStream', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.createMyAdminStreams(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/**
 * Create Default Stream, but we handle manually
 * @param permissionedaddress
 */
router.get('/myaddress', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getAddress(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});


/**
 *Get Recent Cleared Transactions
 * @param permissionedaddress
 */
router.get('/getRecentClearedTransaction', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getRecentClearedTransaction(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});

//////////////////////////Validate and Processs

router.post('/ValidateandProcess', function (req, res, next) {
    const body = req.body;
    try {
        assettransferinterfaceservice.ValidateandProcessData(body, function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            throw ("Validation Error")
        }
    }
});

/////////////////////////////////////////////
router.get('/printtestlogcsv', function (req, res, next) {
    const body = req.body;
    try {
        monitorservice.writeAllDetails(function (outputresponse) {
            return res.status(201).json({
                response: outputresponse
            });
        });
    } catch (err) {
        if (err) {
            console.log(err);
            throw ("Validation Error")
        }
    }
});


module.exports = router;
