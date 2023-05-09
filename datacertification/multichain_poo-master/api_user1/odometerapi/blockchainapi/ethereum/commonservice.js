require('dotenv').config();
var fs = require('fs');
var mainabi = "blockchainapi/ethereum/abi/main.json";
var mainabiparsed = JSON.parse(fs.readFileSync(mainabi));

var transactionabi = "blockchainapi/ethereum/abi/transaction.json";
var transactionabiparsed = JSON.parse(fs.readFileSync(transactionabi));

var walletabi = "blockchainapi/ethereum/abi/wallet.json";
var walletabiparsed = JSON.parse(fs.readFileSync(walletabi));

const Web3 = require('web3');

const AdminWeb3 = require('web3-eth-admin')

const TxPoolWeb3 = require('web3-eth-txpool');

const DebugWeb3 = require('web3-eth-debug');

let web3 = undefined;

let adminweb3 = undefined;

let txpoolweb3 = undefined;

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
    adminweb3 = AdminWeb3.Admin(provider);
    txpoolweb3 = new TxPoolWeb3.TxPool(provider);
    debugweb3 = new DebugWeb3.Debug(provider);
    maincontract = new web3.eth.Contract(mainabiparsed, maincontractaddress);
    transactioncontract = new web3.eth.Contract(transactionabiparsed, transactioncontractaddress);
    walletcontract = new web3.eth.Contract(walletabiparsed, walletcontractaddress);
};

///////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Check if a particular address is a Leader
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function isLeader(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            console.log(error);
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.isLeader(permissionedaddress).call({
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
 * Check if a particular address is a PArticipant
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function isParticipant(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.isParticipant(permissionedaddress).call({
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
 * Check if a node is a Follower
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function isFollower(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.isFollower(permissionedaddress).call({
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
 * Get all the Admin Nodes in a Network
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function getLeaders(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getLeaders().call({
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
 * Get the No of Admins in the Network
 * @param {*} callback 
 */
function getNoofLeaders(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getLeaderslength().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(web3.utils.toDecimal(result));

            }

        });
    });
}

/**
 * Get all the users in the network
 * @param {*} callback 
 */
function getFollowers(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getFollowers().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) {
                return callback(error);
            }
            else {
                console.log(result);
                return callback(result);

            }

        });
    });
}


/**
 * Get all the participants of the network
 * @param {*} callback 
 */
function getParticipants(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getParticipants().call({
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
 * Get the Participant details of each node address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function getParticipantDetails(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getParticipantDetails(permissionedaddress).call({
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
 * Get Asset Balance for a Node
 * @param {*} callback 
 */
function getAssetBalance(callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getBalance().call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(web3.utils.toDecimal(result));

            }

        });
    });
}

/**
 * Get Asset Balance for a Node
 * @param {*} callback 
 */
function getOtherAssetBalance(permissionedaddress, callback) {
    init();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account is needed to make the transaction")
        }
        walletcontract.methods.getBalanceOfOthers(permissionedaddress).call({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error);

            else {
                console.log(result);
                return callback(web3.utils.toDecimal(result));

            }

        });
    });
}

//===========================================================================================================================

//Additions for Monitoring:

/**
 * Get Peer Count of the Node
 */
function getPeerCount(callback) {

    init();
    web3.eth.net.getPeerCount(function (error, info) {
        if (error) {
            console.log(error);
            return callback("Peer Count Information")
        }
        else {
            console.log(info);
            return callback(info);
        }

    });

}

/**
 * Get Peers
 * @param {*} callback 
 */

function getPeers(callback) {

    init();
    adminweb3.getPeers(function (error, info) {
        if (error) {
            console.log(error);
            return callback("Peer Information")
        }
        else {
            var res = [];
            for (var i = 0; i < Object.keys(info).length; i++) {
                res[i] = "Peer" + i + ":" + info[i].network.remoteAddress;
            }
            return callback(JSON.stringify(res));
        }

    });
}

/**
 * Get Node Information
 * @param {*} callback 
 */
function getNodeInfo(callback) {
    init();
    adminweb3.getNodeInfo(function (error, info) {
        if (error) {
            console.log(error);
            return callback("Get Node Information")
        }
        else {
            var res = []
            res[0] = info.id;
            res[1] = info.ports;
            res[2] = info.protocols.eth;
            return callback(JSON.stringify(res));
        }

    });
}
/**
 * Get the Hash Rate of the Network
 */
function getHashRate(callback) {
    init();
    web3.eth.getHashrate(function (error, info) {
        if (error) {
            return callback("Get Hash Rate Information")
        }
        else {
            return callback(info);
        }

    });
}

/**
 * Get Gas Price of the Network
 */
function getGasPrice(callback) {
    init();
    web3.eth.getGasPrice(function (error, info) {
        if (error) {
            return callback("Get Gas Price Information")
        }
        else {
            return callback(info);
        }

    });
}

/**
 * Get Current Block No 
 */
function getCurrentBlockNo(callback) {
    init();
    web3.eth.getBlockNumber(function (error, info) {
        if (error) {
            return callback("Get Block No Information")
        }
        else {
            return callback(info);
        }

    });
}

/**
 * Get Transaction Details of a Transaction
 */
function getEthereumTransactionDetails(txhash, callback) {
    init();
    web3.eth.getTransaction(txhash, function (error, info) {
        if (error) {
            return callback("Get Transaction Information")
        }
        else {
            return callback(info);
        }

    });
}

/**
 * Get Pending Transaction in Network
 * @param {*} calllback 
 */
function getPendingTransactions(callback) {
    init();
    web3.eth.getPendingTransactions(function (error, info) {
        if (error) {
            return callback("Get Pending Transaction Information")
        }
        else {
            return callback(info);
        }

    });
}


/**
 * Get Transaction Receipt 
 * @param {*} txhash 
 * @param {*} callback 
 */
function getTransactionReceipt(txhash,index, callback) {
    init();
    web3.eth.getTransactionReceipt(txhash, function (error, info) {
        if (error) {
            console.log("txreceipt"+error)
            return callback(null)
        }
        else {
            return callback(info,index);
        }

    });
}

/**
 * Get Transaction Pool Content
 * @param {*} callback 
 */
function getTxPoolContent(callback) {
    init();
    txpoolweb3.getContent(function (error, info) {
        if (error) {
            return callback("Get Transaction Receipt Information")
        }
        else {
            console.log(info);
            return callback(JSON.stringify(info));
        }
    });
}

/**
 * Return the Pending and Queued transaction in Txpool
 */
function getInspectionoftxPool(callback) {
    init();
    txpoolweb3.getInspection(function (error, info) {
        if (error) {
            return callback("Get Transaction Receipt Information")
        }
        else {
            console.log(info);
            return callback(JSON.stringify(info));
        }
    });
}

/**
 * Return the no of Peding and Queued Transaction in Pool
 * @param {*} callback 
 */
function getTxPoolNo(callback) {
    init();
    txpoolweb3.getStatus(function (error, info) {
        if (error) {
            return callback("Get Transaction Receipt Information")
        }
        else {
            var res = [];
            res[0] = "Pending: " + info.pending;
            res[1] = "Queued: " + info.queued;
            return callback(res);
        }
    });
}
/**
 * Get MemStats of TxPool
 * @param {*} callback 
 */
function getMemStats(callback) {
    init();
    debugweb3.getMemStats(function (error, info) {
        if (error) {
            return callback("Get Transaction Receipt Information")
        }
        else {
            var res = [];
            res[0]="Alloc:"+info.Alloc;
            res[1]="Sys:"+info.Sys;
            res[2]="Lookups:"+info.Lookups;
            res[3]="Mallocs:"+info.Mallocs;
            res[4]="HeapAlloc:"+info.HeapAlloc;
            res[5]="HeapSys:"+info.HeapSys;
            res[6]="HeapIdle:"+info.HeapIdle;
            res[7]="HeapInuse:"+info.HeapInuse;
            res[8]="HeapReleased:"+info.HeapReleased;
            res[9]="HeapObjects:"+info.HeapObjects;
            res[10]="StackInuse:"+info.StackInuse;
            res[11]="StackSys:"+info.StackSys;
            res[12]="MSpanInuse:"+info.MSpanInuse;
            res[12]="MSpanSys:"+info.MSpanSys;
            res[12]="MCacheInuse:"+info.MCacheInuse;
            res[12]="MCacheSys:"+info.MCacheSys;
            return callback(JSON.stringify(res));
        
        }
    });
}

function getAddress(callback) {
    init();
    web3.eth.getAccounts(function (error, info) {
        if (error) {
            return callback("No Account Information");
        }
        else {
            return callback(info[0]);
        }
    })
}

let odowalletcontractexports = {
    init: init,
    isLeader: isLeader,
    isParticipant: isParticipant,
    isFollower: isFollower,
    getLeaders: getLeaders,
    getNoofLeaders: getNoofLeaders,
    getFollowers: getFollowers,
    getParticipants: getParticipants,
    getParticipantDetails: getParticipantDetails,
    getAssetBalance: getAssetBalance,
    getPeerCount: getPeerCount,
    getPeers: getPeers,
    getNodeInfo: getNodeInfo,
    getHashRate: getHashRate,
    getGasPrice: getGasPrice,
    getCurrentBlockNo: getCurrentBlockNo,
    getEthereumTransactionDetails: getEthereumTransactionDetails,
    getPendingTransactions: getPendingTransactions,
    getTransactionReceipt: getTransactionReceipt,
    getTxPoolContent: getTxPoolContent,
    getInspectionoftxPool: getInspectionoftxPool,
    getTxPoolNo: getTxPoolNo,
    getMemStats: getMemStats,
    getAddress: getAddress,
    getOtherAssetBalance: getOtherAssetBalance
};

module.exports = odowalletcontractexports;

