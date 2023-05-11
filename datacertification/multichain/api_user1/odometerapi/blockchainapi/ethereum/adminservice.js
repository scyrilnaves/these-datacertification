require('dotenv').config();
var fs = require('fs');
var mainabi = "blockchainapi/ethereum/abi/main.json";
var mainabiparsed = JSON.parse(fs.readFileSync(mainabi));

var transactionabi = "blockchainapi/ethereum/abi/transaction.json";
var transactionabiparsed = JSON.parse(fs.readFileSync(transactionabi));

var walletabi = "blockchainapi/ethereum/abi/wallet.json";
var walletabiparsed = JSON.parse(fs.readFileSync(walletabi));

const Web3 = require('web3');


let web3 = undefined;

let maincontract = undefined;

let transactioncontract = undefined;

let walletcontract = undefined;

// Here we give the rpc port and the local node address
var provider_url = process.env.ethereum_host;
var maincontractaddress = process.env.ethereum_maincontract;
var transactioncontractaddress = process.env.ethereum_transactioncontract;
var walletcontractaddress = process.env.ethereum_walletcontract;

function init() {
    let provider = new Web3.providers.HttpProvider(provider_url);
    web3 = new Web3(provider);
    maincontract = new web3.eth.Contract(mainabiparsed, maincontractaddress);
    transactioncontract = new web3.eth.Contract(transactionabiparsed, transactioncontractaddress);
    walletcontract = new web3.eth.Contract(walletabiparsed, walletcontractaddress);
};

//////////////////////////////ADMIN GENERAL TASKS///////////////////////////////

/**
 * Set the Main Contract adress in Transaction Wallet as is the most important for security concerns
 * @param {*} mainContractAddress 
 * @param {*} callback 
 */
function setMainContractAddress(mainContractAddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.setMainContractAddress(mainContractAddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
            }

        });
        transactioncontract.methods.setMainContractAddress(mainContractAddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Get the Main Contract adress in  Wallet as is the most important for security concerns
 * @param {*} mainContractAddress 
 * @param {*} callback 
 */
function getMainContractAddressinWallet(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getMainContractAddress().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
            }

        });
    });
}


/**
 * Set the Main Contract adress in Transaction Wallet as is the most important for security concerns
 * @param {*} mainContractAddress 
 * @param {*} callback 
 */
function getMainContractAddressinTransaction(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }

        transactioncontract.methods.getMainContractAddress().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}



/**
 * Set Transaction Contract Address for Wallet Contract for security concerns
 * @param {*} transactionContractAddress 
 * @param {*} callback 
 */

function setTransactionContractAddress(transactionContractAddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            console.log(error);
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.setTransactionContractAddress(transactionContractAddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}



/**
 * Get Transaction Contract Address for Wallet Contract for security concerns
 * @param {*} transactionContractAddress 
 * @param {*} callback 
 */

function getTransactionContractAddressinWallet(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            console.log(error);
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getTransactionContractAddress().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}



/**
 * TO CHECK FINALLY
 * Destroy Contract by creating a new Transaction for destruction
 * @param {*} callback 
 */
function destroyMainContract(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.destroyContract().send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * TO CHECK FINALLY
 * Destroy Contract by creating a new Transaction for destruction
 * @param {*} callback 
 */
function destroyTransactionContract(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.destroyContract().send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Create a new Participant into the network
 * @param {*} permissionedaddress 
 * @param {*} metadata 
 * @param {*} callback 
 */
function createParticipant(permissionedaddress, metadata, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.createParticipant(permissionedaddress, metadata).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}


/**
 * Remove participant from the network
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeParticipant(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.removeParticipant(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Add Follower role to a Node
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function addFollowerRole(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.addFollowerRole(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Remove Folllower Role from an Address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeFollowerRole(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.removeFollowerRole(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Add Leader Role to a Node
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function addLeaderRole(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.addLeaderRole(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Remove Leader Role from a Node
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeLeaderRole(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.removeLeaderRole(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Delete Transaction pertaining to an Address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function deleteTransactions(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.deleteTransactions(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Change PArticipant Consenus for the Netowrk
 * @param {*} newValue 
 * @param {*} callback 
 */
function changeParticipantConsensus(newValue, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.changeParticipantConsensus(newValue).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Change Follower role Consensus for the Network
 * @param {*} newValue 
 * @param {*} callback 
 */
function changeFollowerConsensus(newValue, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.changeFollowerConsensus(newValue).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Change Overall Consensus For the Network
 * @param {} newValue 
 * @param {*} callback 
 */
function changeOverallConsensus(newValue, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.changeOverallConsensus(newValue).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Chaneg Delete Transaction Consenssus for the Network
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function changeDeleteTransactionConsensus(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.changeDeleteTransactionConsensus(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}
/////////////////////////////////////////////////////////////////////////Permission and Consensus Function ended/////////////////////

/////////////////////////////////////////////////////////////////////////Asset Function///////////////////////////////////////////

/**
 * Increase token supply But Ideally not needed
 * @param {*} permissionedaddress 
 * @param {*} balance 
 * @param {*} callback 
 */
function increaseTokenSupply(permissionedaddress, balance, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.increaseTokenSupply(permissionedaddress, balance).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Not required for Admin , an use token supply but provided 
 * @param {*} assetbalance 
 * @param {*} callback 
 */
function tokenTransfer(assetbalance, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.tokenTransfer(assetbalance).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Not required for Admin , an use token supply but provided 
 * @param {*} assetbalance 
 * @param {*} callback 
 */
function tokenTransferForOthers(permissionedaddress, assetbalance, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.tokenTransferforOthers(permissionedaddress, assetbalance).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}
/**
 * Initiate Token Retract for a particular address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function tokenRetract(permissionedaddress, assetbalance, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.tokenRetract(permissionedaddress, assetbalance).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Change Token Supply Consensus for the Network
 * @param {} newvalue 
 * @param {*} callback 
 */
function changeTokenSupplyConsensus(newvalue, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.changeTokenSupplyConsensus(newvalue).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });

}

/**
 * Change Token Transfer Consensus for the Network
 * @param {*} newvalue 
 * @param {*} callback 
 */
function changeTokenTransferConsensus(newvalue, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.changeTokenTransferConsensus(newvalue).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Chaneg Token Retract Consensus
 * @param {*} newvalue 
 * @param {*} callback 
 */
function changeTokenRetractConsensus(newvalue, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        maincontract.methods.changeTokenRetractConsensus(newvalue).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Add signature / consent for a transaction
 * @param {*} transactionId 
 * @param {*} callback 
 */
function addSignatureByTransactionId(transactionId, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.addSignatureByTransactionId(transactionId).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });

}

/**
 * Add Signature to a transaction
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function addSignatureByPermissionedAddress(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.addSignatureByPermissionedAddress(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });

}
/**TIMER or Manual Job
 * 
 * Job to Look for the pending transactions at the Network Level and give the consent 
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
//Can REstrict the JOB for Permissions Alone if necessary
function jobAddSignaturetoPendingTransactions(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getPendingTransactions().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                for (var i=0; i<Object.keys(result).length; i++) {
                        transactioncontract.methods.addSignatureByPermissionedAddress(result[i]).send({
                            from: accounts[0],
                            gas: 3000000,
                            gasPrice: 0
                        }, function (errordet, result) {
                            console.log('result');
                            console.log(result);
                            if (errordet) {
                                console.log(errordet);
                                callback(errordet);
                            }
                            else {

                                console.log(result);

                            }

                        });
                }
                return callback("Add Signature Job Completed for following transactions " + result);
            }
        })
    })
}


/**
 * TO-DO
 * Remove the approval of signature for a Transaction //Less Priority
 * @param {*} transactionId 
 * @param {*} callback 
 */
function removeSignatureByTransactionId(transactionId, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.removeSignatureByTransactionId(transactionId).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Remove Signature of a Transaction by permissioned Address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeSignatureByPermissionedAddress(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.removeSignatureByPermissionedAddress(permissionedaddress).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}



/**
 * Get PEnding Transaction in the network
 * @param {*} callback 
 */
function getPendingTransactions(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getPendingTransactions().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * TO_DO CAN BE RENMAED AS getPendingTransactionDetails
 * Get Transaction ID for a particular address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function getTransactionId(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getPendingTransactionDetails(permissionedaddress).call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Get PArticipant Role Consensus
 * @param {*} callback 
 */
function getParticipantRoleConsensus(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            console.log(error);
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getParticipantRoleConsensus().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Get Folower Role Consensus
 * @param {*} callback 
 */
function getFollowerRoleConsensus(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getFollowerRoleConsensus().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}


/**
 * Get LEader Role Consensus
 * @param {*} callback 
 */
function getleaderRoleConsensus(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getleaderRoleConsensus().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}


/**
 * Get Overall Consensus
 * @param {*} callback 
 */
function getOverallConsensus(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getOverallConsensus().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}

/**
 * Get Delete Transaction Consensus
 * @param {*} callback 
 */
function getDeleteTransactionConsensus(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getDeleteTransactionConsensus().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}


/**
 * Get Transaction Details for a particular address//Right now Transaction Type
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
//CALL TRANSACTION ID FUNCTION Instead TO DO
function getTransactionDetails(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        transactioncontract.methods.getTransactionDetails(permissionedaddress).call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                var transactiontype=["addParticipant",
                    "removeParticipant",
                    "addFollower",
                    "removeFollower",
                    "addLeader",
                    "removeLeader",
                    "changeParticipantConsensus",
                    "changeLeaderConsensus",
                    "changeFollowerConsensus",
                    "changeOverallConsensus",
                    "changeDeleteTransactionConsensus",
                    "deleteTransaction",
                    "deleteContract",
                    "tokenSupply",
                    "tokenTransfer",
                    "tokenRetract",
                    "changeTokenSupplyConsensus",
                    "changeTokenTransferConsensus",
                    "changeTokenRetractConsensus"];
                return callback(transactiontype[result]);

            }

        });
    });
}



let maincontractexports = {
    setMainContractAddress: setMainContractAddress,
    setTransactionContractAddress: setTransactionContractAddress,
    destroyMainContract: destroyMainContract,
    destroyTransactionContract: destroyTransactionContract,
    createParticipant: createParticipant,
    removeParticipant: removeParticipant,
    addFollowerRole: addFollowerRole,
    removeFollowerRole: removeFollowerRole,
    addLeaderRole: addLeaderRole,
    removeLeaderRole: removeLeaderRole,
    deleteTransactions: deleteTransactions,
    changeParticipantConsensus: changeParticipantConsensus,
    changeFollowerConsensus: changeFollowerConsensus,
    changeOverallConsensus: changeOverallConsensus,
    changeDeleteTransactionConsensus: changeDeleteTransactionConsensus,
    increaseTokenSupply: increaseTokenSupply,
    tokenTransfer: tokenTransfer,
    tokenRetract: tokenRetract,
    changeTokenSupplyConsensus: changeTokenSupplyConsensus,
    changeTokenTransferConsensus: changeTokenTransferConsensus,
    changeTokenRetractConsensus: changeTokenRetractConsensus,
    addSignatureByTransactionId: addSignatureByTransactionId,
    addSignatureByPermissionedAddress: addSignatureByPermissionedAddress,
    jobAddSignaturetoPendingTransactions: jobAddSignaturetoPendingTransactions,
    removeSignatureByTransactionId: removeSignatureByTransactionId,
    removeSignatureByPermissionedAddress: removeSignatureByPermissionedAddress,
    getPendingTransactions: getPendingTransactions,
    getTransactionId: getTransactionId,
    getParticipantRoleConsensus: getParticipantRoleConsensus,
    getFollowerRoleConsensus: getFollowerRoleConsensus,
    getleaderRoleConsensus: getleaderRoleConsensus,
    getOverallConsensus: getOverallConsensus,
    getDeleteTransactionConsensus: getDeleteTransactionConsensus,
    getTransactionDetails: getTransactionDetails,
    getMainContractAddressinWallet: getMainContractAddressinWallet,
    getMainContractAddressinTransaction: getMainContractAddressinTransaction,
    getTransactionContractAddressinWallet: getTransactionContractAddressinWallet,
    tokenTransferForOthers: tokenTransferForOthers
};

module.exports = maincontractexports;