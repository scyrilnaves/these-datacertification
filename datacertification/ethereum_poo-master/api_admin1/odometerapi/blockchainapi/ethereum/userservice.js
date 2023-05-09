require('dotenv').config();
var fs = require('fs');
var mainabi = "blockchainapi/ethereum/abi/main.json";
var mainabiparsed = JSON.parse(fs.readFileSync(mainabi));

var transactionabi = "blockchainapi/ethereum/abi/transaction.json";
var transactionabiparsed = JSON.parse(fs.readFileSync(transactionabi));

var walletabi = "blockchainapi/ethereum/abi/wallet.json";
var walletabiparsed = JSON.parse(fs.readFileSync(walletabi));

const Web3 = require('web3');
const BN = require('bn.js');

let web3 = undefined;

let maincontract = undefined;

let transactioncontract = undefined;

let walletcontract = undefined;

var monitorservice = require('../ethereum/monitorservice');
var commonservice = require('../ethereum/commonservice');
var utiljs = require('../ethereum/util');

// Here we give the rpc port and the local node address
var provider_url = process.env.ethereum_host;
var maincontractaddress = process.env.ethereum_maincontract;
var transactioncontractaddress = process.env.ethereum_transactioncontract;
var walletcontractaddress = process.env.ethereum_walletcontract;

function init() {
    let provider = new Web3.providers.HttpProvider(provider_url);
    web3 = new Web3(provider);
    maincontract = new web3.eth.Contract(mainabiparsed, maincontractaddress);
    transactioncontract = new web3.eth.Contract(transactionabiparsed,transactioncontractaddress);
    walletcontract = new web3.eth.Contract(walletabiparsed,walletcontractaddress);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Not required for Admin , an use token supply but provided But Get the Token Transfer to it 
 * @param {*} assetbalance 
 * @param {*} callback 
 */
function tokenTransfer(assetbalance, callback) {
    init();
 
    const maincontractfunction = maincontract.methods.tokenTransfer(assetbalance.toString());
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









let odowalletcontractexports = {
    init:init,
    tokenTransfer: tokenTransfer
};

module.exports = odowalletcontractexports;