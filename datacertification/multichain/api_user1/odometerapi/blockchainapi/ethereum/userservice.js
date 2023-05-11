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
    console.log("ASST"+assetbalance);
    web3.eth.getAccounts(function (error, accounts) {
        maincontract.methods.tokenTransfer(assetbalance.toString()).send({
            from: accounts[0],
            gas:3000000,
            gasPrice:0
        }, function (error, result) {
            console.log('result');
            console.log(result);
            if (error) callback(error, null);

            else {
                console.log(result);
                //Call for Event Service in Monitoring
                monitorservice.storeAssetTransferTransaction(result)
                commonservice.getAssetBalance(function(reponse){
                    monitorservice.setStatus(reponse);
                })
                return callback(result);

            }

        });
    });

}









let odowalletcontractexports = {
    init:init,
    tokenTransfer: tokenTransfer
};

module.exports = odowalletcontractexports;