require('dotenv').config();

var input_port = process.env.multichain_port;

var input_host = process.env.multichain_host;

var input_user = process.env.multichain_user;

var input_pass = process.env.multichain_pass;


initiateMultichain = function () {
    let multichain = require("multichain-node")({

        port: input_port,
        host: input_host,
        user: input_user,
        pass: input_pass
    });
    return multichain;
}


/**
 * Get the Network Information Details
 * @param {*} callback 
 */
function getNetworkinfo(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getNetworkInfo({
            verbose: true,

        }, (error, response) => {
            if (error) {
                console.log("error" + error.errorcode);
                console.log("error" + error.message);

            } else {
                //console.log(response);
                return callback("Network Info: "+JSON.stringify(response));
            }
        }

    )

}

/**
 * Get Peer Information Details
 * @param {*} callback 
 */

function getPeerinfo(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getPeerInfo({
            verbose: true,

        }, (error, response) => {
            if (error) {
                console.log("error" + error.errorcode);
                console.log("error" + error.message);

            } else {
                return callback("Peer Info: "+JSON.stringify(response));
            }
        }

    )

}

/**
 * Ping the peers from a node and get hte details in getpeerinfo
 * @param {*} callback 
 */
function ping(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.ping({
            verbose: true,

        }, (error, response) => {
            if (error) {
                console.log("error" + error.errorcode);
                console.log("error" + error.message);

            } else {
                return callback("Ping Details: "+JSON.stringify(response) + "Get your details in Get Peer Info");
            }
        }

    )


}

/**
 * Get the blockchain information of the network
 * @param {*} callback 
 */
function getBlockchainInfo(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getBlockchainInfo({
        verbose: true,

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("BlockchainInfo: "+JSON.stringify(response));
        }
    })

}

/**
 * Get the memory pool information
 * @param {*} callback 
 */
function getMempoolInfo(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getMempoolInfo({
        verbose: true,

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("MemPool Info: "+ JSON.stringify(response));
        }
    })
}

/**
 * Get the mining details
 * @param {*} callback 
 */
function getmininginfo(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getMiningInfo({
        verbose: true,

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Mining Info: "+JSON.stringify(response));
        }
    })
}

/**
 * Get the information on the wallet
 * @param {*} callback 
 */
function getWalletInfo(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getWalletInfo({
        verbose: true,

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Get Wallet Info: "+JSON.stringify(response));
        }
    })
}

/**
 * Check if an address is valid
 * @param {*} inputaddress 
 * @param {*} callback 
 */
function validateaddress(inputaddress, callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.validateAddress({
        address: inputaddress,

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback(response);
        }
    })
}

/**
 * List all the permissions of the network
 * @param {*} callback 
 */
function listpermissions(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.listPermissions({
        verbose: true,

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("All Permissions in Network: "+JSON.stringify(response));
        }
    })
}

/**
 * Get the permission for an address
 * @param {*} inputaddress 
 * @param {*} callback 
 */
function listaddresspermissions(inputaddress, callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.listPermissions({
        address: inputaddress,
        verbose: true,

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Address"+ inputaddress+"level Permission: "+JSON.stringify(response));
        }
    })
}

/**
 * Get the permission for the asset
 * @param {*} callback 
 */
function listassetpermissions(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.listPermissions({
        verbose: true,
        permissions: 'kilometrage.*'

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Asset Permission: "+JSON.stringify(response));
        }
    })
}

/**
 * Get the Permissions for each stream
 * @param {*} callback 
 */

function liststreampermissionspermissionrequest(callback) {
    var multichain = initiateMultichain();
    var result;
    var streampermission = 'permissionrequest.*';
    multichain.listPermissions({
        verbose: true,
        permissions: streampermission
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Stream Permission: "+JSON.stringify(response));

        }
    })

}


function liststreampermissionsadminpermissionrequest(callback) {
    var multichain = initiateMultichain();
    var result;
    var streampermission = 'adminpermissionrequest.*';
    multichain.listPermissions({
        verbose: true,
        permissions: streampermission
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Stream Permission: "+JSON.stringify(response));

        }
    })
}


function liststreampermissionspermissionapprove(callback) {
    var multichain = initiateMultichain();
    var result;
    var streampermission = 'permissionapprove.*';
    multichain.listPermissions({
        verbose: true,
        permissions: streampermission
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Stream Permission: "+JSON.stringify(response));

        }
    })

}

function liststreampermissionsassetrequest(callback) {
    var multichain = initiateMultichain();
    var result;
    var streampermission = 'assetrequest.*';
    multichain.listPermissions({
        verbose: true,
        permissions: streampermission
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Stream Permission: "+JSON.stringify(response));

        }
    })

}

function liststreampermissionsassetapprove(callback) {
    var multichain = initiateMultichain();
    var result;
    var streampermission = 'assetapprove.*';
    multichain.listPermissions({
        verbose: true,
        permissions: streampermission
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Stream Permission: "+JSON.stringify(response));

        }
    })

}


/**
 * Get the Blockcahin Parameters
 * @param {*} callback 
 */
function getblockchainparams(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getBlockchainParams({

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Blockchain Parameters: "+JSON.stringify(response));
        }
    })
}

/**
 * Get Info on tthe blockchain network
 * @param {*} callback 
 */
function getInfo(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getInfo({

    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Chain Info: "+JSON.stringify(response));

        }
    })
}

/**
 * Get Address on tthe blockchain network
 * @param {*} callback 
 */
function getAddress(callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            return callback("Your Address: "+addrinfo[0].toString());
        }
    })

}

/**
 * Get the transaction pertaining to an address
 * @param {*} inputaddress 
 * @param {*} callback 
 */
function listaddresstransactions(inputaddress, callback) {
    var multichain = initiateMultichain();
    var result;
    multichain.listAddressTransactions({
        address: inputaddress,
        verbose: true
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);

        } else {
            return callback("Address Trasnactions: "+JSON.stringify(response));

        }
    })
}

/**
 * Create the streams which are needed to operate the network
 */
function createDefaultStream(callback) {
    var multichain = initiateMultichain();
    var result;
    var streams = ['permissionrequest', 'adminpermissionrequest', 'permissionapprove', 'assetrequest', 'assetapprove'];

    multichain.create({
        type: 'stream',
        name: 'permissionrequest',
        open: false
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);
            return callback("permissionrequesterror" + error.message);

        } else {
            console.log(response);

        }
    })

    multichain.create({
        type: 'stream',
        name: 'adminpermissionrequest',
        open: false
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);
            return callback("adminpermissionrequesterror" + error.message);

        } else {
            console.log(response);
        }
    })

    multichain.create({
        type: 'stream',
        name: 'permissionapprove',
        open: false
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);
            return callback("permissionapprove" + error.message);


        } else {
            console.log(response);
        }
    })

    multichain.create({
        type: 'stream',
        name: 'assetrequest',
        open: false
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);
            return callback("assetrequesterror" + error.message);


        } else {
            console.log(response);
        }
    })

    multichain.create({
        type: 'stream',
        name: 'assetapprove',
        open: false
    }, (error, response) => {
        if (error) {
            console.log("error" + error.errorcode);
            console.log("error" + error.message);
            return callback("assetapproveerror" + error.message);

        } else {
            console.log(response);
            return callback("Streams are created:'permissionrequest','adminpermissionrequest','permissionapprove','assetrequest','assetapprove'")
        }
    })

}

/**
 * Create your admin stream
 * @param {*} address 
 * @param {*} callback 
 */
function createMyAdminStreams(callback) {
    console.log('createAdminStreams:');
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            var permissionapproval = addrinfo[0].toString().substr(0, 30) + 'PA';
            var adminapproval = addrinfo[0].toString().substr(0, 30) + 'AD';
            var assetrequest = addrinfo[0].toString().substr(0, 30) + 'AR';
            var assetproval = addrinfo[0].toString().substr(0, 30) + 'AA';

            multichain.create({
                type: 'stream',
                name: permissionapproval,
                open: true
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);

                }
                console.log("info" + info);
            })
            multichain.create({
                type: 'stream',
                name: adminapproval,
                open: true
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);

                }
                console.log("info" + info);

            })

            multichain.create({
                type: 'stream',
                name: assetrequest,
                open: true
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);

                }
                console.log("info" + info);
            })

            multichain.create({
                type: 'stream',
                name: assetproval,
                open: true
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);

                }
                console.log("info" + info);
            })
        }
      
        return callback("Subscription of Streams Done for:" + addrinfo[0]);
    })
}


let odowalletmultichainexports = {
    getNetworkinfo: getNetworkinfo,
    createDefaultStream: createDefaultStream,
    getPeerinfo: getPeerinfo,
    listaddresstransactions: listaddresstransactions,
    createMyAdminStreams: createMyAdminStreams,
    getInfo: getInfo,
    getAddress: getAddress,
    liststreampermissionspermissionrequest: liststreampermissionspermissionrequest,
    liststreampermissionsadminpermissionrequest: liststreampermissionsadminpermissionrequest,
    liststreampermissionspermissionapprove: liststreampermissionspermissionapprove,
    liststreampermissionsassetrequest: liststreampermissionsassetrequest,
    liststreampermissionsassetapprove: liststreampermissionsassetapprove,
    getblockchainparams: getblockchainparams,
    listassetpermissions: listassetpermissions,
    listaddresspermissions: listaddresspermissions,
    listpermissions: listpermissions,
    validateaddress: validateaddress,
    getWalletInfo: getWalletInfo,
    getmininginfo: getmininginfo,
    getMempoolInfo: getMempoolInfo,
    getBlockchainInfo: getBlockchainInfo,
    ping: ping

}

module.exports = odowalletmultichainexports;