require('dotenv').config();
var fs = require('fs');
var mainabi = "blockchainapi/ethereum/abi/main.json";
var mainabiparsed = JSON.parse(fs.readFileSync(mainabi));

var transactionabi = "blockchainapi/ethereum/abi/transaction.json";
var transactionabiparsed = JSON.parse(fs.readFileSync(transactionabi));

var walletabi = "blockchainapi/ethereum/abi/wallet.json";
var walletabiparsed = JSON.parse(fs.readFileSync(walletabi));

const Web3 = require('web3');
const TxPoolWeb3 = require('web3-eth-txpool');

let web3 = undefined;

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
    txpoolweb3 = new TxPoolWeb3.TxPool(provider);
    maincontract = new web3.eth.Contract(mainabiparsed, maincontractaddress);
    transactioncontract = new web3.eth.Contract(transactionabiparsed, transactioncontractaddress);
    walletcontract = new web3.eth.Contract(walletabiparsed, walletcontractaddress);
};


function getNonce(nodeAddress,callback) {
    init();
    web3.eth.getTransactionCount(nodeAddress,function (error, txcount) {
        if (error) {
            return callback(error);
        }
        txpoolweb3.getContent(function (error, info) {
            if (error) {
                return callback("Get Tx Pool Content Information Problem"+error);
            }
            else {
                var pendinglist = info.pending;
                if(pendinglist[nodeAddress]!=undefined ){
                    var pendinglistlength = Object.keys(pendinglist[nodeAddress]).length;
                    return callback(txcount+pendinglistlength);
                }
                else{
                    return callback(txcount);
                }
                
            }
        });
       
    });
}

let utilexports={
    getNonce:getNonce
}

module.exports = utilexports;