var ethadmin = require('../../../blockchainapi/ethereum/adminservice');
var ethuser = require('../../../blockchainapi/ethereum/userservice');
var ethcommon = require('../../../blockchainapi/ethereum/commonservice');


/**
 * Asset Transfer for a requesting node
 * @param {*} data 
 * @param {*} callback 
 */
function tokenTransfer(data,callback) {
    ethuser.tokenTransfer(data.balance,function(response){
        return callback(response);
    })
}


let odowalletcontractexports = {
    tokenTransfer: tokenTransfer
};

module.exports = odowalletcontractexports;