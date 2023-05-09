require('dotenv').config();
var fs = require('fs');
var mainabi = "blockchainapi/ethereum/abi/main.json";
var mainabiparsed = JSON.parse(fs.readFileSync(mainabi));

var transactionabi = "blockchainapi/ethereum/abi/transaction.json";
var transactionabiparsed = JSON.parse(fs.readFileSync(transactionabi));

var walletabi = "blockchainapi/ethereum/abi/wallet.json";
var walletabiparsed = JSON.parse(fs.readFileSync(walletabi));

var utiljs = require('../ethereum/util');
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
    const walletcontractfunction = walletcontract.methods.setMainContractAddress(mainContractAddress);
    const transactioncontractfunction = transactioncontract.methods.setMainContractAddress(mainContractAddress);
    const walletcontractfunctionabi = walletcontract.methods.setMainContractAddress(mainContractAddress).encodeABI();
    const transactioncontractfunctionabi = transactioncontract.methods.setMainContractAddress(mainContractAddress).encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
        walletcontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const wallettxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:walletcontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:walletcontractfunctionabi
            }
            web3.eth.sendTransaction(wallettxparams,function(error,result){

                  utiljs.getNonce(accounts[0],function(transactnonce){
           
                    transactioncontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
                           if(gasAmount>5000000){
                               return callback("Gas Supplied is less, Required is"+gasAmount);
                           }})
            
                        const transacttxparams ={
                            from: accounts[0],
                            gas: 5000000,
                            gasPrice: 0,
                            to:transactioncontractaddress,
                            nonce:'0x'+transactnonce.toString(16),
                            data:transactioncontractfunctionabi
                        }
                        web3.eth.sendTransaction(transacttxparams,function(error,result){
                            return callback(result);
                        })
                    });
            })
        });
           
        })
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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

    const walletcontractfunction = walletcontract.methods.setTransactionContractAddress(transactionContractAddress);
    const walletcontractfunctionabi = walletcontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
        walletcontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const wallettxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:walletcontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:walletcontractfunctionabi
            }
            web3.eth.sendTransaction(wallettxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
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
            if (error) callback(error);

            else {
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

    const maincontractfunction = maincontract.methods.destroyContract();
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })

}

/**
 * TO CHECK FINALLY
 * Destroy Contract by creating a new Transaction for destruction
 * @param {*} callback 
 */
function destroyTransactionContract(callback) {
    init();
 
    const transactioncontractfunction =  transactioncontract.methods.destroyContract();
    const transactioncontractfunctionabi = transactioncontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            transactioncontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const transactiontxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:transactioncontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:transactioncontractfunctionabi
            }
            web3.eth.sendTransaction(transactiontxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Create a new Participant into the network
 * @param {*} permissionedaddress 
 * @param {*} metadata 
 * @param {*} callback 
 */
function createParticipant(permissionedaddress, metadata, callback) {
    init();
  
    const maincontractfunction =  maincontract.methods.createParticipant(permissionedaddress, metadata);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}


/**
 * Remove participant from the network
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeParticipant(permissionedaddress, callback) {
    init();

    const maincontractfunction =  maincontract.methods.removeParticipant(permissionedaddress);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Add Follower role to a Node
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function addFollowerRole(permissionedaddress, callback) {
    init();
    const maincontractfunction =   maincontract.methods.addFollowerRole(permissionedaddress);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Remove Folllower Role from an Address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeFollowerRole(permissionedaddress, callback) {
    init();

    const maincontractfunction =  maincontract.methods.removeFollowerRole(permissionedaddress);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Add Leader Role to a Node
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function addLeaderRole(permissionedaddress, callback) {
    init();

    const maincontractfunction =  maincontract.methods.addLeaderRole(permissionedaddress);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Remove Leader Role from a Node
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeLeaderRole(permissionedaddress, callback) {
    init();

    const maincontractfunction =   maincontract.methods.removeLeaderRole(permissionedaddress);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Delete Transaction pertaining to an Address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function deleteTransactions(permissionedaddress, callback) {
    init();

    const maincontractfunction =   maincontract.methods.deleteTransactions(permissionedaddress);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Change PArticipant Consenus for the Netowrk
 * @param {*} newValue 
 * @param {*} callback 
 */
function changeParticipantConsensus(newValue, callback) {
    init();
   
    const maincontractfunction =   maincontract.methods.changeParticipantConsensus(newValue);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Change Follower role Consensus for the Network
 * @param {*} newValue 
 * @param {*} callback 
 */
function changeFollowerConsensus(newValue, callback) {
    init();

    const maincontractfunction =   maincontract.methods.changeFollowerConsensus(newValue);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Change Overall Consensus For the Network
 * @param {} newValue 
 * @param {*} callback 
 */
function changeOverallConsensus(newValue, callback) {
    init();

    const maincontractfunction =   maincontract.methods.changeOverallConsensus(newValue);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Chaneg Delete Transaction Consenssus for the Network
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function changeDeleteTransactionConsensus(permissionedaddress, callback) {
    init();

    const maincontractfunction =  maincontract.methods.changeDeleteTransactionConsensus(permissionedaddress);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
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

    const maincontractfunction =  maincontract.methods.increaseTokenSupply(permissionedaddress, balance);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Not required for Admin , an use token supply but provided 
 * @param {*} assetbalance 
 * @param {*} callback 
 */
function tokenTransfer(assetbalance, callback) {
    init();

    const maincontractfunction =  maincontract.methods.tokenTransfer(assetbalance);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Not required for Admin , an use token supply but provided 
 * @param {*} assetbalance 
 * @param {*} callback 
 */
function tokenTransferForOthers(permissionedaddress, assetbalance, callback) {
    init();
  
    const maincontractfunction =  maincontract.methods.tokenTransferforOthers(permissionedaddress, assetbalance);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}
/**
 * Initiate Token Retract for a particular address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function tokenRetract(permissionedaddress, assetbalance, callback) {
    init();
 
    const maincontractfunction =  maincontract.methods.tokenRetract(permissionedaddress, assetbalance);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Change Token Supply Consensus for the Network
 * @param {} newvalue 
 * @param {*} callback 
 */
function changeTokenSupplyConsensus(newvalue, callback) {
    init();

    const maincontractfunction =  maincontract.methods.changeTokenSupplyConsensus(newvalue);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })

}

/**
 * Change Token Transfer Consensus for the Network
 * @param {*} newvalue 
 * @param {*} callback 
 */
function changeTokenTransferConsensus(newvalue, callback) {
    init();
 
    const maincontractfunction =  maincontract.methods.changeTokenTransferConsensus(newvalue);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Chaneg Token Retract Consensus
 * @param {*} newvalue 
 * @param {*} callback 
 */
function changeTokenRetractConsensus(newvalue, callback) {
    init();
    const maincontractfunction =  maincontract.methods.changeTokenRetractConsensus(newvalue);
    const maincontractfunctionabi = maincontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            maincontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const maintxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:maincontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:maincontractfunctionabi
            }
            web3.eth.sendTransaction(maintxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Add signature / consent for a transaction
 * @param {*} transactionId 
 * @param {*} callback 
 */
function addSignatureByTransactionId(transactionId, callback) {
    init();

    const transactioncontractfunction =   transactioncontract.methods.addSignatureByTransactionId(transactionId);
    const transactioncontractfunctionabi = transactioncontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            transactioncontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const transactiontxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:transactioncontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:transactioncontractfunctionabi
            }
            web3.eth.sendTransaction(transactiontxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })

}

/**
 * Add Signature to a transaction
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function addSignatureByPermissionedAddress(permissionedaddress, callback) {
    init();
  
    const transactioncontractfunction =   transactioncontract.methods.addSignatureByPermissionedAddress(permissionedaddress);
    const transactioncontractfunctionabi = transactioncontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            transactioncontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const transactiontxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:transactioncontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:transactioncontractfunctionabi
            }
            web3.eth.sendTransaction(transactiontxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })

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
            if (error) callback(error);

            else {
                for (let i=0, p= Promise.resolve();i<Object.keys(result).length; i++) {
                    p =p.then (_=> new Promise(resolve => {

                        const transactioncontractfunction =   transactioncontract.methods.addSignatureByPermissionedAddress(result[i]);
                        const transactioncontractfunctionabi = transactioncontractfunction.encodeABI();
                        
                            utiljs.getNonce(accounts[0],function(walletnonce){
                         
                                transactioncontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
                                   if(gasAmount>5000000){
                                       return callback("Gas Supplied is less, Required is"+gasAmount);
                                   }})  
                        
                                const transactiontxparams ={
                                    from: accounts[0],
                                    gas: 5000000,
                                    gasPrice: 0,
                                    to:transactioncontractaddress,
                                    nonce:'0x'+walletnonce.toString(16),
                                    data:transactioncontractfunctionabi
                                }
                                web3.eth.sendTransaction(transactiontxparams,function(error,result){
                                    resolve();
                                  
                                })
                            });
                }))
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

    const transactioncontractfunction =   transactioncontract.methods.removeSignatureByTransactionId(transactionId);
    const transactioncontractfunctionabi = transactioncontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            transactioncontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const transactiontxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:transactioncontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:transactioncontractfunctionabi
            }
            web3.eth.sendTransaction(transactiontxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
}

/**
 * Remove Signature of a Transaction by permissioned Address
 * @param {*} permissionedaddress 
 * @param {*} callback 
 */
function removeSignatureByPermissionedAddress(permissionedaddress, callback) {
    init();

    const transactioncontractfunction =   transactioncontract.methods.removeSignatureByPermissionedAddress(permissionedaddress);
    const transactioncontractfunctionabi = transactioncontractfunction.encodeABI();
    web3.eth.getAccounts(function (error, accounts) {
        if (error) {
            return callback("Account"+error);
        }
        utiljs.getNonce(accounts[0],function(walletnonce){
     
            transactioncontractfunction.estimateGas({from:accounts[0],gas: 5000000},function(error,gasAmount){
               if(gasAmount>5000000){
                   return callback("Gas Supplied is less, Required is"+gasAmount);
               }})  

            const transactiontxparams ={
                from: accounts[0],
                gas: 5000000,
                gasPrice: 0,
                to:transactioncontractaddress,
                nonce:'0x'+walletnonce.toString(16),
                data:transactioncontractfunctionabi
            }
            web3.eth.sendTransaction(transactiontxparams,function(error,result){
                return callback(result);
              
            })
        });
           
        })
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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
            if (error) callback(error);

            else {
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