var express = require('express');
var router = express.Router();

var adminservice = require('../services/blockchainservices/ethereum/adminservice');
var userservice = require('../services/blockchainservices/ethereum/userservice');
var commonservice = require('../services/blockchainservices/ethereum/commonservice');
var assettransferinterfaceservice = require('../services/blockchainservices/ethereum/assettransferinterface');
var monitorservice = require('../blockchainapi/ethereum/monitorservice');




//////////////////////////////ADMIN RELATED FUNCTIONS///////////////////////////

/**
 * POST Set MAin Contract Address in the Wallet
 * @Param: permissioned address
 * Grant Admin Permission to User Node
 */
router.post('/setMainContract', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.setMainContractAddress(body, function (outputresponse) {
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
 * POST Get MAin Contract Address in the Wallet
 * @Param: permissioned address
 * Grant Admin Permission to User Node
 */
router.get('/getMainContractinWallet', function (req, res, next) {
    try {
        adminservice.getMainContractAddressinWallet(function (outputresponse) {
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
 * GET Get MAin Contract Address in the Transaction
 * @Param: permissioned address
 * Grant Admin Permission to User Node
 */
router.get('/getMainContractinTransaction', function (req, res, next) {
    try {
        adminservice.getMainContractAddressinTransaction(function (outputresponse) {
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
 * POST Set Transaction Contract Address in the Wallet
 * @Param: permissioned address
 * Grant Admin Permission to User Node
 */
router.post('/setTransactionContract', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.setTransactionContractAddress(body, function (outputresponse) {
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
 * GET Get Transaction Contract Address in the Transaction
 * @Param: permissioned address
 * Grant Admin Permission to User Node
 */
router.get('/getTransactionContractinWallet', function (req, res, next) {
    try {
        adminservice.getTransactionContractAddressinWallet(function (outputresponse) {
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
 * POST Set Destroy Contract Address in the Wallet
 * @Param: permissioned address
 * Grant Admin Permission to User Node
 */
router.get('/destroyContract', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.destroyContract(function (outputresponse) {
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
 * Create a new PArticipant in the network
 * @param: permissioned address
 * @param: metadata
 * Grant Admin Permission to User Node
 */
router.post('/createParticipant', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.createParticipant(body, function (outputresponse) {
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
 * Create a new PArticipant in the network
 * @param: permissioned address
 * Grant Admin Permission to User Node
 */
router.post('/removeParticipant', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.removeParticipant(body, function (outputresponse) {
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
 * Add a  PArticipant to the Follower
 * @param: permissioned address
 * Grant Admin Permission to User Node
 */
router.post('/addFollower', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.addFollower(body, function (outputresponse) {
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
 * Remove a  PArticipant from the Follower
 * @param: permissioned address
 */
router.post('/removeFollower', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.removeFollowerRole(body, function (outputresponse) {
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
 * Add a  PArticipant to the Leader
 * @param: permissioned address
 */
router.post('/addLeader', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.addLeaderRole(body, function (outputresponse) {
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
 * Remove a  PArticipant to the Leader
 * @param: permissioned address
 */
router.post('/removeLeader', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.removeLeaderRole(body, function (outputresponse) {
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
 * Remove a transaction pertaining to an address
 * @param: permissioned address
 */
router.post('/deleteTransaction', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.deleteTransactions(body, function (outputresponse) {
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
 * Remove a transaction pertaining to an address
 * @param: newValue
 */
router.post('/changeParticipantConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.changeParticipantConsensus(body, function (outputresponse) {
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
 * Remove a transaction pertaining to an address
 * @param: newValue
 */
router.post('/changeFollowerConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.changeFollowerConsensus(body, function (outputresponse) {
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
 * Remove a transaction pertaining to an address
 * @param: newValue
 */
router.post('/changeOverallConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.changeOverallConsensus(body, function (outputresponse) {
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
 * Remove a transaction pertaining to an address
 * @param: newValue
 */
router.post('/changeDeleteTransactionConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.changeDeleteTransactionConsensus(body, function (outputresponse) {
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
 * Increase the token Supply !?
 * @param: permissionedaddress
 * @param: balance
 */
router.post('/increaseTokenSupply', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.increaseTokenSupply(body, function (outputresponse) {
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
 * Increase the token Supply !?
 * @param: balance
 */
router.post('/assetTransfer', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.assetTransfer(body, function (outputresponse) {
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
 * Increase the token Supply !?
 * @param: balance
 */
router.post('/assetTransferForOthers', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.assetTransferForOthers(body, function (outputresponse) {
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
 * Retract the token transfer
 * @param: permissionedaddress
 * @param: balance
 */
router.post('/assetRetract', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.assetRetract(body, function (outputresponse) {
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
 * Change Token Supply Consensus
 * @param: value
 */
router.post('/changeTokenSupplyConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.changeTokenSupplyConsensus(body, function (outputresponse) {
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
 * Change Token Transfer Consensus
 * @param: value
 */
router.post('/changeTokenTransferConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.changeTokenTransferConsensus(body, function (outputresponse) {
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
 * Change Token Transfer Consensus
 * @param: value
 */
router.post('/changeTokenRetractConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.changeTokenRetractConsensus(body, function (outputresponse) {
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
 * Add Signature by Transaction ID
 * @param: transactionid
 */
router.post('/addSignatureByTransactionId', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.addSignatureByTransactionId(body, function (outputresponse) {
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
 * Add Signature by Permissioned Address
 * @param: permissionedaddress
 */
router.post('/addSignatureByPermissionedAddress', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.addSignatureByPermissionedAddress(body, function (outputresponse) {
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
 * Job To Add Signature to Pending Transactions
 */
router.get('/jobAddSignaturetoPendingTransactions', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.jobAddSignaturetoPendingTransactions(function (outputresponse) {
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
 * Remove Signature by Transaction ID
 * @param: transactionid
 */
router.post('/removeSignatureByTransactionId', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.removeSignatureByTransactionId(body, function (outputresponse) {
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
 * Remove Signature by Permissioned Address
 * @param: permissionedaddress
 */
router.post('/removeSignatureByPermissionedAddress', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.removeSignatureByPermissionedAddress(body, function (outputresponse) {
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
 * Remove Signature by Permissioned Address
 * @param: permissionedaddress
 */
router.get('/getPendingTransactionsinNetwork', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getPendingTransactionsinNetwork(function (outputresponse) {
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
 * Get Transction ID by permisisoned address
 * @param: permissionedaddress
 */
router.post('/getTransactionId', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getTransactionId(body, function (outputresponse) {
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
 * Get PArticipant Role Consensus
 * @param: permissionedaddress
 */
router.get('/getParticipantRoleConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getParticipantRoleConsensus(function (outputresponse) {
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
 * Get Follower Role Consensus
 * @param: permissionedaddress
 */
router.get('/getFollowerRoleConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getFollowerRoleConsensus(function (outputresponse) {
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
 * Get LEader Role Consensus
 * @param: permissionedaddress
 */
router.get('/getLeaderRoleConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getLeaderRoleConsensus(function (outputresponse) {
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
 * Get Overall Consensus
 * 
 */
router.get('/getOverallConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getOverallConsensus(function (outputresponse) {
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
 * Get Delete Transaction Consensus
 * 
 */
router.get('/getDeleteTransactionConsensus', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getDeleteTransactionConsensus(function (outputresponse) {
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
 * Get Transaction Details for an address//Mainly Transaction Type
 * @param: permissionedaddress
 * 
 */
router.post('/getTransactionDetails', function (req, res, next) {
    const body = req.body;
    try {
        adminservice.getTransactionDetails(body, function (outputresponse) {
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

///////////////////////////////////////ADMIN TASK COMPLETED//////////////////////////////////////////////////////////


/**
 * Asset Transfer for initiated for an Address
 * @param: balance
 * 
 */
router.post('/userAssetTransfer', function (req, res, next) {
    const body = req.body;
    try {
        userservice.tokenTransfer(body, function (outputresponse) {
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

//////////////////////////////////////////////User Task Completed//////////////////////////////////////////////////////



/**
 * Check If Address is Leader
 * 
 * 
 */
router.post('/isLeader', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.isLeader(body, function (outputresponse) {
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
 * Check If Address is PArticipant
 * 
 * 
 */
router.post('/isParticipant', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.isParticipant(body, function (outputresponse) {
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
 * Check If Address is Follower
 * 
 * 
 */
router.post('/isFollower', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.isFollower(body, function (outputresponse) {
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
 * Get All the Leaders in the Network
 * 
 * 
 */
router.get('/getLeaders', function (req, res, next) {
    try {
        commonservice.getLeaders(function (outputresponse) {
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
 * Get the No of Leaders in the Network
 * 
 * 
 */
router.get('/getNoofLeaders', function (req, res, next) {
    try {
        commonservice.getNoofLeaders(function (outputresponse) {
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
 * Get the Followers in the Network
 * 
 * 
 */
router.get('/getFollowers', function (req, res, next) {
    try {
        commonservice.getFollowers(function (outputresponse) {
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
 * Get the Participants in the Network
 * 
 * 
 */
router.get('/getParticipants', function (req, res, next) {
    try {
        commonservice.getParticipants(function (outputresponse) {
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
 * Get the Participant Details in the Network for an Address
 * @param permissionedaddress
 * 
 */
router.post('/getParticipantDetails', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getParticipantDetails(body, function (outputresponse) {
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
 * Get the Assetbalance in the Network for an Address
 * @param permissionedaddress
 * 
 */
router.get('/getAssetBalance', function (req, res, next) {
    try {
        commonservice.getAssetBalance(function (outputresponse) {
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
 * Get the Assetbalance in the Network for an Address
 * @param permissionedaddress
 * 
 */
router.post('/getOtherAssetBalance', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getOtherAssetBalance(body, function (outputresponse) {
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

///////////////////////////////////////////New Additions


router.get('/getPeers', function (req, res, next) {
    try {
        commonservice.getPeers(function (outputresponse) {
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

router.get('/getPeerCount', function (req, res, next) {
    try {
        commonservice.getPeerCount(function (outputresponse) {
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


router.get('/getNodeInfo', function (req, res, next) {
    try {
        commonservice.getNodeInfo(function (outputresponse) {
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


router.get('/getHashRate', function (req, res, next) {
    try {
        commonservice.getHashRate(function (outputresponse) {
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


router.get('/getGasPrice', function (req, res, next) {
    try {
        commonservice.getGasPrice(function (outputresponse) {
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


router.get('/getCurrentBlockNo', function (req, res, next) {
    try {
        commonservice.getCurrentBlockNo(function (outputresponse) {
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


router.get('/getEthereumTransactionDetails', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getEthereumTransactionDetails(body, function (outputresponse) {
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


router.get('/getPendingTransactions', function (req, res, next) {
    try {
        commonservice.getPendingTransactions(function (outputresponse) {
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

router.get('/getTransactionReceipt', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getTransactionReceipt(body, function (outputresponse) {
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

router.get('/getTxPoolContent', function (req, res, next) {
    try {
        commonservice.getTxPoolContent(function (outputresponse) {
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


router.get('/getInspectionoftxPool', function (req, res, next) {
    try {
        commonservice.getInspectionoftxPool(function (outputresponse) {
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


router.get('/getTxPoolNo', function (req, res, next) {
    try {
        commonservice.getTxPoolNo(function (outputresponse) {
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


router.get('/getMemStats', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getMemStats(function (outputresponse) {
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



router.get('/getFinalisedEvents', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getFinalisedEvents(function (outputresponse) {
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

router.get('/getmyaddress', function (req, res, next) {
    const body = req.body;
    try {
        commonservice.getAddress(function (outputresponse) {
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

/////////////////////////////////////////////////////

