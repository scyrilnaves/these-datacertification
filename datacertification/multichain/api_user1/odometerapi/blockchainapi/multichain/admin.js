require('dotenv').config();

var mcasset = require('../../blockchainapi/multichain/asset');

var mcassetissue = require('../../blockchainapi/multichain/assetissue');

var monitorservice = require('../multichain/monitorservice');


var adminpermissionrequest = 'adminpermissionrequest';

var input_port = process.env.multichain_port;

var input_host = process.env.multichain_host;

var input_user = process.env.multichain_user;

var input_pass = process.env.multichain_pass;

var permission_consenus = process.env.multichain_permission_consenus;

var asset_consensus = process.env.multichain_asset_consenus;

var assetfilter = __dirname + '/filter/assetfilter.js';

var permissionfilter = __dirname + '/filter/permissionfilter.js';

var fs = require('fs');

var streamsubscription = false;

initiateMultichain = function () {
    console.log(streamsubscription);
    let multichain = require("multichain-node")({

        port: input_port,
        host: input_host,
        user: input_user,
        pass: input_pass
    });
    if (!streamsubscription) {
        subscribeAnyToStream(multichain, function (response) {
            console.log("subscribed to stream");
        })
        streamsubscription = true;
    }

    return multichain;
}

initiateOnlyMultichain = function () {
    console.log(streamsubscription);
    let multichain = require("multichain-node")({

        port: input_port,
        host: input_host,
        user: input_user,
        pass: input_pass
    });

    return multichain;
}


//Timer Interval //3600000 milliseconds = 60 minutes

//setTimeout(finaliseAdmin, 3600000);

/**
 * Main Method To grant admin Permission to a node by another admin node
 * @param {*} permissionaddress 
 * @param {*} callback 
 */

function adminconnect(permissionaddress, callback) {
    initiatePermissionRequest(permissionaddress, function (response) {
        console.log(response);

        publishSign(response, permissionaddress, function (publishresponse) {
            console.log(publishresponse);
        })
        logPermissionApproval(permissionaddress, response, function (logresponse) {
            console.log(logresponse);
        })
        return callback('AdminConnect Inititated' + response);

    })

}

/**
 * Initiate a new entry in "Permission Request" sream for the Admin Permission
 * @param {} newnode 
 */
function initiatePermissionRequest(permissionaddress, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            transactionkey = addrinfo[0] + new Date().toString().replace("+", "");
            multichain.publish({
                stream: adminpermissionrequest,
                key: transactionkey,
                data: {
                    "json": {
                        'address': permissionaddress,
                        'adminaddress': addrinfo[0],
                        'comment': 'admin request'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);

                }
                console.log('Response:' + publishinfo);
                return callback(transactionkey);
            })

        }
    })
}

/**
 * Grant the Admin Permission to the required streams as well as general "ADMIN" permission
 * 
 * Then finalise the 
 * @param {} transactionkey 
 * @param {*} permissionaddress 
 * @param {*} callback 
 */
function publishSign(transactionkey, permissionaddress, callback) {
    var multichain = initiateMultichain();
    var inputpermission = 'create,issue,activate,admin,mine,adminpermissionrequest.admin,permissionrequest.admin,permissionapprove.admin,assetapprove.admin,kilometrage.admin,kilometrage.send,assetrequest.admin,'
    console.log(permissionaddress);
    multichain.grantWithMetadata({
        addresses: permissionaddress,
        permissions: 'create,issue,activate,admin,mine',
        data: {
            "json": 'Admin approve'
        }
    }, (error, response) => {
        if (error) {
            console.log("error0" + error.errorcode);
            console.log("error0" + error.message);
        }
        multichain.grantWithMetadata({
            addresses: permissionaddress,
            permissions: 'adminpermissionrequest.write',
            data: {
                "json": 'Admin approve'
            }
        }, (error, response) => {
            if (error) {
                console.log("error1a" + error.errorcode);
                console.log("error1" + error.message);
            }
            multichain.grantWithMetadata({
                addresses: permissionaddress,
                permissions: 'adminpermissionrequest.read',
                data: {
                    "json": 'Admin approve'
                }
            }, (error, response) => {
                if (error) {
                    console.log("error1" + error.errorcode);
                    console.log("error1" + error.message);
                }
                multichain.grantWithMetadata({
                    addresses: permissionaddress,
                    permissions: 'adminpermissionrequest.activate',
                    data: {
                        "json": 'Admin approve'
                    }
                }, (error, response) => {
                    if (error) {
                        console.log("error1" + error.errorcode);
                        console.log("error1" + error.message);
                    }
                    multichain.grantWithMetadata({
                        addresses: permissionaddress,
                        permissions: 'adminpermissionrequest.admin',
                        data: {
                            "json": 'Admin approve'
                        }
                    }, (error, response) => {
                        if (error) {
                            console.log("error1" + error.errorcode);
                            console.log("error1" + error.message);
                        }
                        multichain.grantWithMetadata({
                            addresses: permissionaddress,
                            permissions: 'permissionrequest.write,',
                            data: {
                                "json": 'Admin approve'
                            }
                        }, (error, response) => {
                            if (error) {
                                console.log("error2" + error.errorcode);
                                console.log("error2" + error.message);
                            }
                            multichain.grantWithMetadata({
                                addresses: permissionaddress,
                                permissions: 'permissionrequest.read',
                                data: {
                                    "json": 'Admin approve'
                                }
                            }, (error, response) => {
                                if (error) {
                                    console.log("error2" + error.errorcode);
                                    console.log("error2" + error.message);
                                }
                                multichain.grantWithMetadata({
                                    addresses: permissionaddress,
                                    permissions: 'permissionrequest.activate',
                                    data: {
                                        "json": 'Admin approve'
                                    }
                                }, (error, response) => {
                                    if (error) {
                                        console.log("error2" + error.errorcode);
                                        console.log("error2" + error.message);
                                    }
                                    multichain.grantWithMetadata({
                                        addresses: permissionaddress,
                                        permissions: 'permissionapprove.admin',
                                        data: {
                                            "json": 'Admin approve'
                                        }
                                    }, (error, response) => {
                                        if (error) {
                                            console.log("error3" + error.errorcode);
                                            console.log("error3" + error.message);
                                        }
                                        multichain.grantWithMetadata({
                                            addresses: permissionaddress,
                                            permissions: 'assetapprove.write',
                                            data: {
                                                "json": 'Admin approve'
                                            }
                                        }, (error, response) => {
                                            if (error) {
                                                console.log("error4" + error.errorcode);
                                                console.log("error4" + error.message);
                                            }
                                            multichain.grantWithMetadata({
                                                addresses: permissionaddress,
                                                permissions: 'assetapprove.read',
                                                data: {
                                                    "json": 'Admin approve'
                                                }
                                            }, (error, response) => {
                                                if (error) {
                                                    console.log("error4" + error.errorcode);
                                                    console.log("error4" + error.message);
                                                }
                                                multichain.grantWithMetadata({
                                                    addresses: permissionaddress,
                                                    permissions: 'assetapprove.activate',
                                                    data: {
                                                        "json": 'Admin approve'
                                                    }
                                                }, (error, response) => {
                                                    if (error) {
                                                        console.log("error4" + error.errorcode);
                                                        console.log("error4" + error.message);
                                                    }
                                                    multichain.grantWithMetadata({
                                                        addresses: permissionaddress,
                                                        permissions: 'assetapprove.admin',
                                                        data: {
                                                            "json": 'Admin approve'
                                                        }
                                                    }, (error, response) => {
                                                        if (error) {
                                                            console.log("error4" + error.errorcode);
                                                            console.log("error4" + error.message);
                                                        }

                                                        multichain.grantWithMetadata({
                                                            addresses: permissionaddress,
                                                            permissions: 'kilometrage.issue',
                                                            data: {
                                                                "json": 'Admin approve'
                                                            }
                                                        }, (error, response) => {
                                                            if (error) {
                                                                console.log("error5" + error.errorcode);
                                                                console.log("error5" + error.message);
                                                            }
                                                            multichain.grantWithMetadata({
                                                                addresses: permissionaddress,
                                                                permissions: 'kilometrage.send',
                                                                data: {
                                                                    "json": 'Admin approve'
                                                                }
                                                            }, (error, response) => {
                                                                if (error) {
                                                                    console.log("error5" + error.errorcode);
                                                                    console.log("error5" + error.message);
                                                                }
                                                                multichain.grantWithMetadata({
                                                                    addresses: permissionaddress,
                                                                    permissions: 'kilometrage.receive',
                                                                    data: {
                                                                        "json": 'Admin approve'
                                                                    }
                                                                }, (error, response) => {
                                                                    if (error) {
                                                                        console.log("error5" + error.errorcode);
                                                                        console.log("error5" + error.message);
                                                                    }
                                                                    multichain.grantWithMetadata({
                                                                        addresses: permissionaddress,
                                                                        permissions: 'kilometrage.activate',
                                                                        data: {
                                                                            "json": 'Admin approve'
                                                                        }
                                                                    }, (error, response) => {
                                                                        if (error) {
                                                                            console.log("error5" + error.errorcode);
                                                                            console.log("error5" + error.message);
                                                                        }
                                                                        multichain.grantWithMetadata({
                                                                            addresses: permissionaddress,
                                                                            permissions: 'kilometrage.admin',
                                                                            data: {
                                                                                "json": 'Admin approve'
                                                                            }
                                                                        }, (error, response) => {
                                                                            if (error) {
                                                                                console.log("error5" + error.errorcode);
                                                                                console.log("error5" + error.message);
                                                                            }
                                                                            multichain.grantWithMetadata({
                                                                                addresses: permissionaddress,
                                                                                permissions: 'assetrequest.write',
                                                                                data: {
                                                                                    "json": 'Admin approve'
                                                                                }
                                                                            }, (error, response) => {
                                                                                if (error) {
                                                                                    console.log("error6" + error.errorcode);
                                                                                    console.log("error6" + error.message);
                                                                                }
                                                                                multichain.grantWithMetadata({
                                                                                    addresses: permissionaddress,
                                                                                    permissions: 'assetrequest.read',
                                                                                    data: {
                                                                                        "json": 'Admin approve'
                                                                                    }
                                                                                }, (error, response) => {
                                                                                    if (error) {
                                                                                        console.log("error6" + error.errorcode);
                                                                                        console.log("error6" + error.message);
                                                                                    }
                                                                                    multichain.grantWithMetadata({
                                                                                        addresses: permissionaddress,
                                                                                        permissions: 'assetrequest.admin',
                                                                                        data: {
                                                                                            "json": 'Admin approve'
                                                                                        }
                                                                                    }, (error, response) => {
                                                                                        if (error) {
                                                                                            console.log("error6" + error.errorcode);
                                                                                            console.log("error6" + error.message);
                                                                                        }
                                                                                        return callback(response);
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}


/**
 * After the initiation of the new Admin Request in "PERMISSION REQUEST STREAM" && then GRANT its own permission approval
 * LOG the Approval in its own "ADMINADDR_AD"
 * @param {*} permissionaddress 
 * @param {*} transactionid 
 * @param {*} callback 
 */
function logPermissionApproval(permissionaddress, transactionid, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            var transactionkey = transactionid;
            var streamname = addrinfo[0].toString().substr(0, 30) + 'AD';
            multichain.publish({
                stream: streamname,
                key: transactionkey,
                data: {
                    "json": {
                        'address': permissionaddress,
                        'adminaddress': addrinfo[0],
                        'comment': 'admin request'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);

                }
                console.log('Response:' + publishinfo);
                return callback(publishinfo);
            })

        }
    })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//Timer
/**
 * Poll for outstanding transaction and give the approvals for those requests which are governed by the default admin consensus of the multichain
 * @param {*} callback 
 */
function pollOutstandingTransaction(callback) {
    pendingPermissionApprovals(function (response) {
        for (var i = 0; i < Object.keys(response).length; i++) {
            pollForPermissionApprovals(response[i], function (pollreponse) {
                console.log(pollreponse);
            })
        }
        return callback('Polling completed')
    })
}

/**
 * Get Pending Approvals for an Admin to be done by comparing the stream "ADMIN PERMISSION REQUEST" && "ADMINADDR_AD"
 * @param {*} callback 
 */
function pendingPermissionApprovals(callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            multichain.listStreamKeys({
                stream: adminpermissionrequest,
                verbose: true
            }, (listStreamKeyserr, listStreamKeysinfo) => {
                if (listStreamKeyserr) {
                    console.log("error" + listStreamKeyserr.errorcode);
                    console.log("error" + listStreamKeyserr.message);
                }
                var ownstreamname = addrinfo[0].toString().substr(0, 30) + 'AD';
                multichain.listStreamKeys({
                    stream: ownstreamname,
                    verbose: true
                }, (permissionserr, permissioninfo) => {
                    if (permissionserr) {
                        console.log("error" + permissionserr.errorcode);
                        console.log("error" + permissionserr.message);
                    }
                    var listStreamKeysuniqueitem = getUniqueItem(listStreamKeysinfo);
                    var permissionuniqueitem = getUniqueItem(permissioninfo);
                    console.log('Response:' + listStreamKeysuniqueitem);
                    console.log('Response:' + permissionuniqueitem);
                    var effectiveApprovals = listStreamKeysuniqueitem.filter(function (element) {
                        return permissionuniqueitem.indexOf(element) === -1;
                    });

                    return callback(effectiveApprovals);

                })
            })
        }
    })
}

/**
 * Get the Stream items with "SINGLE OCCURENCR" meaning new ones ---and also which are "ADMIN REQUESTS"
 * @param {*} listStreamKeys 
 */
function getUniqueItem(listStreamKeys) {
    var uniqueitem = [];
    var j = 0;
    if (listStreamKeys != null && listStreamKeys != undefined && listStreamKeys != '') {
        for (var i = 0; i < Object.keys(listStreamKeys).length; i++) {
            if (listStreamKeys[i].first.data.hasOwnProperty('json') && listStreamKeys[i].first.data.json.hasOwnProperty('comment')) {
                if (listStreamKeys[i].items == 1 && listStreamKeys[i].first.data.json.comment == 'admin request') {
                    uniqueitem[j] = listStreamKeys[i].key;
                    j = ++j;
                }
            }
        }
    }
    return uniqueitem;

}

/// TIMER FUNCTION ALSO CAN CALL PUBLICLY
/**
 * After getting the Pending approvals by comparing the "ADMIN PERMISSION REQUEST" && "ADMINADDR_AD" we then grant the admin permissions to them
 * @param {*} transactionkey 
 */
function pollForPermissionApprovals(transactionkey, callback) {
    var multichain = initiateMultichain();
    multichain.listStreamKeyItems({
        stream: adminpermissionrequest,
        key: transactionkey
    }, (listStreamKeyserr, listStreamKeysinfo) => {
        if (listStreamKeyserr) {
            console.log("errora" + listStreamKeyserr.errorcode);
            console.log("errora" + listStreamKeyserr.message);
        }
        if (Object.keys(listStreamKeysinfo).length < 1) {
            return callback('Return Valid Transaction ID');
        }
        multichain.grantWithMetadata({
            addresses: listStreamKeysinfo[0].data.json.address,
            permissions: 'create,issue,activate,admin,mine',
            data: {
                "json": 'Admin approve'
            }
        }, (error, response) => {
            if (error) {
                console.log("errorb" + error.errorcode);
                console.log("errorb" + error.message);
            }
            multichain.grantWithMetadata({
                addresses: listStreamKeysinfo[0].data.json.address,
                permissions: 'adminpermissionrequest.admin',
                data: {
                    "json": 'Admin approve'
                }
            }, (error, response) => {
                if (error) {
                    console.log("errorc" + error.errorcode);
                    console.log("errorc" + error.message);
                }
                multichain.grantWithMetadata({
                    addresses: listStreamKeysinfo[0].data.json.address,
                    permissions: 'adminpermissionrequest.write',
                    data: {
                        "json": 'Admin approve'
                    }
                }, (error, response) => {
                    if (error) {
                        console.log("errord" + error.errorcode);
                        console.log("errord" + error.message);
                    }
                    multichain.grantWithMetadata({
                        addresses: listStreamKeysinfo[0].data.json.address,
                        permissions: 'adminpermissionrequest.read',
                        data: {
                            "json": 'Admin approve'
                        }
                    }, (error, response) => {
                        if (error) {
                            console.log("errore" + error.errorcode);
                            console.log("errore" + error.message);
                        }
                        multichain.grantWithMetadata({
                            addresses: listStreamKeysinfo[0].data.json.address,
                            permissions: 'adminpermissionrequest.activate',
                            data: {
                                "json": 'Admin approve'
                            }
                        }, (error, response) => {
                            if (error) {
                                console.log("errorf" + error.errorcode);
                                console.log("errorf" + error.message);
                            }
                            multichain.grantWithMetadata({
                                addresses: listStreamKeysinfo[0].data.json.address,
                                permissions: 'permissionrequest.write',
                                data: {
                                    "json": 'Admin approve'
                                }
                            }, (error, response) => {
                                if (error) {
                                    console.log("errorg" + error.errorcode);
                                    console.log("errorg" + error.message);
                                }
                                multichain.grantWithMetadata({
                                    addresses: listStreamKeysinfo[0].data.json.address,
                                    permissions: 'permissionrequest.read',
                                    data: {
                                        "json": 'Admin approve'
                                    }
                                }, (error, response) => {
                                    if (error) {
                                        console.log("errorh" + error.errorcode);
                                        console.log("errorh" + error.message);
                                    }
                                    multichain.grantWithMetadata({
                                        addresses: listStreamKeysinfo[0].data.json.address,
                                        permissions: 'permissionrequest.activate',
                                        data: {
                                            "json": 'Admin approve'
                                        }
                                    }, (error, response) => {
                                        if (error) {
                                            console.log("errori" + error.errorcode);
                                            console.log("errori" + error.message);
                                        }
                                        multichain.grantWithMetadata({
                                            addresses: listStreamKeysinfo[0].data.json.address,
                                            permissions: 'permissionrequest.admin',
                                            data: {
                                                "json": 'Admin approve'
                                            }
                                        }, (error, response) => {
                                            if (error) {
                                                console.log("errorj" + error.errorcode);
                                                console.log("errorj" + error.message);
                                            }
                                            multichain.grantWithMetadata({
                                                addresses: listStreamKeysinfo[0].data.json.address,
                                                permissions: 'permissionapprove.write',
                                                data: {
                                                    "json": 'Admin approve'
                                                }
                                            }, (error, response) => {
                                                if (error) {
                                                    console.log("errork" + error.errorcode);
                                                    console.log("errork" + error.message);
                                                }
                                                multichain.grantWithMetadata({
                                                    addresses: listStreamKeysinfo[0].data.json.address,
                                                    permissions: 'permissionapprove.read',
                                                    data: {
                                                        "json": 'Admin approve'
                                                    }
                                                }, (error, response) => {
                                                    if (error) {
                                                        console.log("errorl" + error.errorcode);
                                                        console.log("errorl" + error.message);
                                                    }
                                                    multichain.grantWithMetadata({
                                                        addresses: listStreamKeysinfo[0].data.json.address,
                                                        permissions: 'permissionapprove.activate',
                                                        data: {
                                                            "json": 'Admin approve'
                                                        }
                                                    }, (error, response) => {
                                                        if (error) {
                                                            console.log("errorm" + error.errorcode);
                                                            console.log("errorm" + error.message);
                                                        }
                                                        multichain.grantWithMetadata({
                                                            addresses: listStreamKeysinfo[0].data.json.address,
                                                            permissions: 'permissionapprove.admin',
                                                            data: {
                                                                "json": 'Admin approve'
                                                            }
                                                        }, (error, response) => {
                                                            if (error) {
                                                                console.log("errorn" + error.errorcode);
                                                                console.log("errorn" + error.message);
                                                            }
                                                            multichain.grantWithMetadata({
                                                                addresses: listStreamKeysinfo[0].data.json.address,
                                                                permissions: 'assetapprove.write',
                                                                data: {
                                                                    "json": 'Admin approve'
                                                                }
                                                            }, (error, response) => {
                                                                if (error) {
                                                                    console.log("erroro" + error.errorcode);
                                                                    console.log("erroro" + error.message);
                                                                }
                                                                multichain.grantWithMetadata({
                                                                    addresses: listStreamKeysinfo[0].data.json.address,
                                                                    permissions: 'assetapprove.read',
                                                                    data: {
                                                                        "json": 'Admin approve'
                                                                    }
                                                                }, (error, response) => {
                                                                    if (error) {
                                                                        console.log("errorp" + error.errorcode);
                                                                        console.log("errorp" + error.message);
                                                                    }
                                                                    multichain.grantWithMetadata({
                                                                        addresses: listStreamKeysinfo[0].data.json.address,
                                                                        permissions: 'assetapprove.activate',
                                                                        data: {
                                                                            "json": 'Admin approve'
                                                                        }
                                                                    }, (error, response) => {
                                                                        if (error) {
                                                                            console.log("errorq" + error.errorcode);
                                                                            console.log("errorq" + error.message);
                                                                        }
                                                                        multichain.grantWithMetadata({
                                                                            addresses: listStreamKeysinfo[0].data.json.address,
                                                                            permissions: 'assetapprove.admin',
                                                                            data: {
                                                                                "json": 'Admin approve'
                                                                            }
                                                                        }, (error, response) => {
                                                                            if (error) {
                                                                                console.log("errorr" + error.errorcode);
                                                                                console.log("errorr" + error.message);
                                                                            }
                                                                            multichain.grantWithMetadata({
                                                                                addresses: listStreamKeysinfo[0].data.json.address,
                                                                                permissions: 'kilometrage.issue',
                                                                                data: {
                                                                                    "json": 'Admin approve'
                                                                                }
                                                                            }, (error, response) => {
                                                                                if (error) {
                                                                                    console.log("errorss" + error.errorcode);
                                                                                    console.log("errorss" + error.message);
                                                                                }
                                                                                multichain.grantWithMetadata({
                                                                                    addresses: listStreamKeysinfo[0].data.json.address,
                                                                                    permissions: 'kilometrage.send',
                                                                                    data: {
                                                                                        "json": 'Admin approve'
                                                                                    }
                                                                                }, (error, response) => {
                                                                                    if (error) {
                                                                                        console.log("errort" + error.errorcode);
                                                                                        console.log("errort" + error.message);
                                                                                    }
                                                                                    multichain.grantWithMetadata({
                                                                                        addresses: listStreamKeysinfo[0].data.json.address,
                                                                                        permissions: 'kilometrage.receive',
                                                                                        data: {
                                                                                            "json": 'Admin approve'
                                                                                        }
                                                                                    }, (error, response) => {
                                                                                        if (error) {
                                                                                            console.log("erroru" + error.errorcode);
                                                                                            console.log("erroru" + error.message);
                                                                                        }
                                                                                        multichain.grantWithMetadata({
                                                                                            addresses: listStreamKeysinfo[0].data.json.address,
                                                                                            permissions: 'kilometrage.activate',
                                                                                            data: {
                                                                                                "json": 'Admin approve'
                                                                                            }
                                                                                        }, (error, response) => {
                                                                                            if (error) {
                                                                                                console.log("errorv" + error.errorcode);
                                                                                                console.log("errorv" + error.message);
                                                                                            }
                                                                                            multichain.grantWithMetadata({
                                                                                                addresses: listStreamKeysinfo[0].data.json.address,
                                                                                                permissions: 'kilometrage.admin',
                                                                                                data: {
                                                                                                    "json": 'Admin approve'
                                                                                                }
                                                                                            }, (error, response) => {
                                                                                                if (error) {
                                                                                                    console.log("errorw" + error.errorcode);
                                                                                                    console.log("errorw" + error.message);
                                                                                                }
                                                                                                multichain.grantWithMetadata({
                                                                                                    addresses: listStreamKeysinfo[0].data.json.address,
                                                                                                    permissions: 'assetrequest.write',
                                                                                                    data: {
                                                                                                        "json": 'Admin approve'
                                                                                                    }
                                                                                                }, (error, response) => {
                                                                                                    if (error) {
                                                                                                        console.log("errorx" + error.errorcode);
                                                                                                        console.log("errorx" + error.message);
                                                                                                    }
                                                                                                    multichain.grantWithMetadata({
                                                                                                        addresses: listStreamKeysinfo[0].data.json.address,
                                                                                                        permissions: 'assetrequest.read',
                                                                                                        data: {
                                                                                                            "json": 'Admin approve'
                                                                                                        }
                                                                                                    }, (error, response) => {
                                                                                                        if (error) {
                                                                                                            console.log("errory" + error.errorcode);
                                                                                                            console.log("errory" + error.message);
                                                                                                        }
                                                                                                        multichain.grantWithMetadata({
                                                                                                            addresses: listStreamKeysinfo[0].data.json.address,
                                                                                                            permissions: 'assetrequest.activate',
                                                                                                            data: {
                                                                                                                "json": 'Admin approve'
                                                                                                            }
                                                                                                        }, (error, response) => {
                                                                                                            if (error) {
                                                                                                                console.log("errorz" + error.errorcode);
                                                                                                                console.log("errorz" + error.message);
                                                                                                            }
                                                                                                            multichain.grantWithMetadata({
                                                                                                                addresses: listStreamKeysinfo[0].data.json.address,
                                                                                                                permissions: 'assetrequest.admin',
                                                                                                                data: {
                                                                                                                    "json": 'Admin approve'
                                                                                                                }
                                                                                                            }, (error, response) => {
                                                                                                                if (error) {
                                                                                                                    console.log("errorgh" + error.errorcode);
                                                                                                                    console.log("errorgh" + error.message);
                                                                                                                }
                                                                                                                logPermissionApproval(listStreamKeysinfo[0].data.json.address, transactionkey, function (logreponse) {
                                                                                                                    console.log("log Approval in  ADMINADDR+AD")
                                                                                                                })
                                                                                                                return callback(response);
                                                                                                            })
                                                                                                        })
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * After a node has been granted admin based on consensus, the node which initiated admin pemission will finalise the operation as follows:
 * 1) Get the general Peer info of Admin & COMPARE with the list of Permission Request which are 1) Admin Request 2) Create by the admin 3) ITEM==1 count
 * 2) Get the matched addresses in tboth the list and then get the correspoding transaction which are to be finalised
 * 3) Finalise the Tranaction by logging in 1) Permission  Request 2) ADMINADDR_AD 3) Create the corresponding streams
 * 4) ISSUE THE ASSETS !!!!
 * 5) Give Access to read / write in 'permissionrequest','adminpermissionrequest','permissionapprove','assetrequest','assetapprove'
 * @param {*} callback 
 */

function finaliseAdmin(callback) {
    var multichain = initiateMultichain();
    multichain.listPermissions({
        permissions: 'admin'

    }, (peererr, peerinfo) => {
        if (peererr) {
            console.log("error" + peererr.errorcode);
            console.log("error" + peererr.message);

        }
        console.log("PEERINFO"+peerinfo);
        multichain.getAddresses({
            verbose: false,

        }, (addresserr, addrinfo) => {
            if (addresserr) {
                console.log("error" + addresserr.errorcode);
                console.log("error" + addresserr.message);

            } else {
                multichain.listStreamKeys({
                    stream: adminpermissionrequest,
                    key: '*',
                    verbose: true
                }, (listStreamKeyserr, listStreamiteminfo) => {
                    if (listStreamKeyserr) {
                        console.log("error" + listStreamKeyserr.errorcode);
                        console.log("error" + listStreamKeyserr.message);
                    }
                    var adminuniquepermissionrequests = getFullUniqueItem(listStreamiteminfo, addrinfo[0]);
                    console.log("PEERINFOSECNDE"+peerinfo);
                    var pendingTransaction = getPendingFulfilledTransaction(peerinfo, adminuniquepermissionrequests);
                    for (var i = 0; i < Object.keys(pendingTransaction).length; i++) {
                        //9*10^16
                        mcassetissue.transferAssettoOtherAdmin(pendingTransaction[i].first.data.json.address, 9000000000000000, function (assettrasnaferresponse) {
                            console.log(assettrasnaferresponse);
                        })
                        adminconnectfinalise(pendingTransaction[i].key, pendingTransaction[i].first.data.json.address, function (response) {
                            console.log(response);

                        })
                    }


                })
            }
        })
    })
    return callback('ADMIN FINALISED');
}

/**
 * Get the Stream items with "SINGLE OCCURENCR" meaning new ones ---and also which are "ADMIN REQUESTS"
 * @param {*} listStreamKeys 
 */
function getFullUniqueItem(listStreamKeys, adminaddress) {
    var uniqueitem = [];
    var j = 0;
    if(listStreamKeys!=null && listStreamKeys !=undefined){
    for (var i = 0; i < Object.keys(listStreamKeys).length; i++) {
        if (listStreamKeys[i].items == 1 && listStreamKeys[i].first.data.json.comment == 'admin request' && listStreamKeys[i].first.data.json.adminaddress == adminaddress) {
            uniqueitem[j] = listStreamKeys[i];
            j = ++j;
        }
    }
}
    return uniqueitem;

}

/**
 * Get the Transactions which are yet to be fulfilled although they are approved already
 */
function getPendingFulfilledTransaction(AdminPeers, PermissionRequests) {
    var filter = [];
    var k = 0;
    if(AdminPeers!=null && AdminPeers!=undefined){
    for (var i = 0; i < Object.keys(AdminPeers).length; i++) {
        for (var j = 0; j < Object.keys(PermissionRequests).length; j++) {
            if (AdminPeers[i].address == PermissionRequests[j].first.data.json.address) {
                filter[k] = PermissionRequests[j];
                k = ++k;
            }
        }
    }
}
    console.log(filter)
    return filter;
}

/**
 * Finalise operation for an admin after its Approval
 * @param {*} transactionkey 
 * @param {*} permissionaddress 
 * @param {*} callback 
 */
function adminconnectfinalise(transactionkey, permissionaddress, callback) {
    finaliseInitiatePermissionRequest(transactionkey, permissionaddress, function (response) {
        console.log(response);

        logPermissionApproval(permissionaddress, response, function (logresponse) { //referred earlier
            console.log(logresponse);
        })
        createAdminStreams(permissionaddress, function (createresponse) {
            console.log(createresponse);

        })
        grantAccesstoNewAdminStreams(permissionaddress, function (createresponse) {
            console.log(createresponse);

        })
    })
    return callback('Admin Tasks Finalised');
}

/**
 * Finalise entry in "Permission Request" sream for the Admin Permission
 * @param {} newnode 
 */
function finaliseInitiatePermissionRequest(transactionkey, permissionaddress, callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            multichain.publish({
                stream: adminpermissionrequest,
                key: transactionkey,
                data: {
                    "json": {
                        'address': permissionaddress,
                        'adminaddress': addrinfo[0],
                        'comment': 'admin approve'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);

                }
                console.log('Response:' + publishinfo);
                return callback(transactionkey);
            })

        }
    })
}

/**
 *  Since An Admin is created we create its corresponding streams
 * 1) NEW ADMIN ADDR+ PA Permission Access
 * 2) NEW ADMIN ADDR+ AD Admin Access
  * 3) NEW ADMIN ADDR+ AR Asset Request
 * 4) NEW ADMIN ADDR+ AA Asset Approve

 * @param {*} address 
 * @param {*} callback 
 */

function createAdminStreams(address, callback) {
    console.log('createAdminStreams:');
    var multichain = initiateMultichain();
    var permissionapproval = address.toString().substr(0, 30) + 'PA';
    var adminapproval = address.toString().substr(0, 30) + 'AD';
    var assetrequest = address.toString().substr(0, 30) + 'AR';
    var assetproval = address.toString().substr(0, 30) + 'AA';
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
    return callback("Creation of Streams Done for:" + address);
}

/**
 * Subscribe to stream
 * @param {*} callback 
 */
//Subscribe to the Streams in general to read from the stream

function subscribeAnyToStream(multichain) {

    //var multichain = initiateMultichain();
    console.log('subscribetoStream:');
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            multichain.listPermissions({
                permissions: 'admin',
                addresses: addrinfo[0]

            }, (permissionerr, permissioninfo) => {
                if (Object.keys(permissioninfo).length > 0) {


                    var permissionapproval = addrinfo[0].toString().substr(0, 30) + 'PA';
                    var adminapproval = addrinfo[0].toString().substr(0, 30) + 'AD';
                    var assetrequest = addrinfo[0].toString().substr(0, 30) + 'AR';
                    var assetapproval = addrinfo[0].toString().substr(0, 30) + 'AA';

                    multichain.subscribe({
                        stream: permissionapproval,
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })
                    multichain.subscribe({
                        stream: adminapproval
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);

                    })

                    multichain.subscribe({
                        stream: assetrequest
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })
            
                    multichain.subscribe({
                        stream: assetapproval
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })
                }
                    multichain.subscribe({
                        stream: 'permissionrequest'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'adminpermissionrequest'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'permissionapprove'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'assetrequest'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'assetapprove'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })


                
            })
        }

    })
}


/**
 * Subscribe to stream
 * @param {*} callback 
 */
//Subscribe to the Streams in general to read from the stream

function subscribeToAllStream(callback) {

    var multichain = initiateOnlyMultichain();
    console.log('subscribetoStream:');
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {
            multichain.listPermissions({
                permissions: 'admin',
                addresses: addrinfo[0]

            }, (permissionerr, permissioninfo) => {
                if (permissionerr) {
                    console.log("permissionerr" + permissionerr.errorcode);
                    console.log("permissionerr" + permissionerr.message);

                }
                if (Object.keys(permissioninfo).length > 0) {

                    var permissionapproval = addrinfo[0].toString().substr(0, 30) + 'PA';
                    var adminapproval = addrinfo[0].toString().substr(0, 30) + 'AD';
                    var assetrequest = addrinfo[0].toString().substr(0, 30) + 'AR';
                    var assetapproval = addrinfo[0].toString().substr(0, 30) + 'AA';

                    multichain.subscribe({
                        stream: permissionapproval,
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })
                    multichain.subscribe({
                        stream: adminapproval
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);

                    })

                    multichain.subscribe({
                        stream: assetrequest
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: assetapproval
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })
                }
                    multichain.subscribe({
                        stream: 'permissionrequest'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'adminpermissionrequest'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'permissionapprove'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'assetrequest'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })

                    multichain.subscribe({
                        stream: 'assetapprove'
                    }, (err, info) => {
                        if (err) {
                            console.log("error" + err.errorcode);
                            console.log("error" + err.message);

                        }
                        console.log("info" + info);
                    })


                
            })
        }

    })

    return callback('subscribed to all streams');
}


/**
 * Give Access to read / write in 'permissionrequest','adminpermissionrequest','permissionapprove','assetrequest','assetapprove'
 */

function grantAccesstoNewAdminStreams(address, callback) {
    var multichain = initiateMultichain();
    multichain.grant({
        addresses: address,
        permissions: 'permissionrequest.write'
    }, (err, info) => {
        if (err) {
            console.log("errorga" + err.errorcode);
            console.log("errorga" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'permissionrequest.read'
    }, (err, info) => {
        if (err) {
            console.log("errorgb" + err.errorcode);
            console.log("errorgb" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'permissionrequest.activate'
    }, (err, info) => {
        if (err) {
            console.log("errorgc" + err.errorcode);
            console.log("errorgc" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'permissionrequest.admin'
    }, (err, info) => {
        if (err) {
            console.log("errorgd" + err.errorcode);
            console.log("errorgd" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'adminpermissionrequest.write'
    }, (err, info) => {
        if (err) {
            console.log("errorge" + err.errorcode);
            console.log("errorge" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'adminpermissionrequest.read'
    }, (err, info) => {
        if (err) {
            console.log("errorgf" + err.errorcode);
            console.log("errorgf" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })


    multichain.grant({
        addresses: address,
        permissions: 'adminpermissionrequest.activate'
    }, (err, info) => {
        if (err) {
            console.log("errorgfh" + err.errorcode);
            console.log("errorgfh" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })


    multichain.grant({
        addresses: address,
        permissions: 'adminpermissionrequest.admin'
    }, (err, info) => {
        if (err) {
            console.log("errornj" + err.errorcode);
            console.log("errornj" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })


    multichain.grant({
        addresses: address,
        permissions: 'permissionapprove.admin'
    }, (err, info) => {
        if (err) {
            console.log("errorde" + err.errorcode);
            console.log("errorde" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'permissionapprove.write'
    }, (err, info) => {
        if (err) {
            console.log("errorggr" + err.errorcode);
            console.log("errorrgr" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'permissionapprove.read'
    }, (err, info) => {
        if (err) {
            console.log("errorww" + err.errorcode);
            console.log("errorww" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'permissionapprove.activate'
    }, (err, info) => {
        if (err) {
            console.log("errorjj" + err.errorcode);
            console.log("errorjj" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })
    multichain.grant({
        addresses: address,
        permissions: 'assetrequest.write'
    }, (err, info) => {
        if (err) {
            console.log("errorkk" + err.errorcode);
            console.log("errorkk" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'assetrequest.read'
    }, (err, info) => {
        if (err) {
            console.log("errordd" + err.errorcode);
            console.log("errorjnhjh" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'assetrequest.activate'
    }, (err, info) => {
        if (err) {
            console.log("errorcd" + err.errorcode);
            console.log("errorcd" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'assetrequest.admin'
    }, (err, info) => {
        if (err) {
            console.log("errorbg" + err.errorcode);
            console.log("errorbg" + err.message);
            return callback('error');

        }
        console.log("info" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'assetapprove.admin'
    }, (err, info) => {
        if (err) {
            console.log("errornh" + err.errorcode);
            console.log("errornh" + err.message);
            return callback('error');

        }
        console.log("info" + info);
        return callback("Default Stream Permission Granted" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'assetapprove.write'
    }, (err, info) => {
        if (err) {
            console.log("errormj" + err.errorcode);
            console.log("errormj" + err.message);
            return callback('error');

        }
        console.log("info" + info);
        return callback("Default Stream Permission Granted" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'assetapprove.read'
    }, (err, info) => {
        if (err) {
            console.log("errorkj" + err.errorcode);
            console.log("errorhg" + err.message);
            return callback('error');

        }
        console.log("info" + info);
        return callback("Default Stream Permission Granted" + info);
    })

    multichain.grant({
        addresses: address,
        permissions: 'assetapprove.activate'
    }, (err, info) => {
        if (err) {
            console.log("errorhg" + err.errorcode);
            console.log("errorgh" + err.message);
            return callback('error');

        }
        console.log("info" + info);
        return callback("Default Stream Permission Granted" + info);
    })

}

//////////////////////////////////////////////////////////////////////////////////////////
/**
 * Get Pending Permissions which are of type admin/ mine as well as PENDING
 */
function getPendingPermissionForApprovals(callback) {
    var filtered = [];
    var k = 0;
    var multichain = initiateMultichain();
    multichain.listPermissions({
        verbose: true

    }, (err, info) => {
        for (var i = 0; i < Object.keys(info).length; i++) {
            if (Object.keys(info[i].pending).length > 0 && info[i].type == "admin") {
                filtered[k] = info[i];
                k = ++k;
            }
        }
        return callback(filtered);
    })
}

///////////////////////////////////////////        /////////////////////////////////

/**
 * Revoke the Admin Permission for a node
 * @param {*} permissionaddress 
 * @param {*} callback 
 */
function revokeAdminPermission(permissionaddress, callback) {
    var multichain = initiateMultichain();
    multichain.revoke({
        addresses: permissionaddress,
        permissions: 'create,issue,activate,admin,mine',

    }, (error, mresponse) => {
        if (error) {
            console.log("errorqw" + error.errorcode);
            console.log("errorqw" + error.message);
        }
        multichain.revoke({
            addresses: permissionaddress,
            permissions: 'adminpermissionrequest.write',

        }, (error, response) => {
            if (error) {
                console.log("errorfd" + error.errorcode);
                console.log("errordf" + error.message);
            }
            multichain.revoke({
                addresses: permissionaddress,
                permissions: 'adminpermissionrequest.read',

            }, (error, response) => {
                if (error) {
                    console.log("errorgd" + error.errorcode);
                    console.log("errorfd" + error.message);
                }
                multichain.revoke({
                    addresses: permissionaddress,
                    permissions: 'adminpermissionrequest.activate',

                }, (error, response) => {
                    if (error) {
                        console.log("errordfd" + error.errorcode);
                        console.log("errordfd" + error.message);
                    }
                    multichain.revoke({
                        addresses: permissionaddress,
                        permissions: 'adminpermissionrequest.admin',

                    }, (error, response) => {
                        if (error) {
                            console.log("errorfdd" + error.errorcode);
                            console.log("errordfd" + error.message);
                        }
                        multichain.revoke({
                            addresses: permissionaddress,
                            permissions: 'permissionrequest.write',

                        }, (error, response) => {
                            if (error) {
                                console.log("errordfd" + error.errorcode);
                                console.log("errordfd" + error.message);
                            }
                            multichain.revoke({
                                addresses: permissionaddress,
                                permissions: 'permissionrequest.read',

                            }, (error, response) => {
                                if (error) {
                                    console.log("erroraas" + error.errorcode);
                                    console.log("errorasa" + error.message);
                                }
                                multichain.revoke({
                                    addresses: permissionaddress,
                                    permissions: 'permissionrequest.activate',

                                }, (error, response) => {
                                    if (error) {
                                        console.log("errorasa" + error.errorcode);
                                        console.log("errorasa" + error.message);
                                    }
                                    multichain.revoke({
                                        addresses: permissionaddress,
                                        permissions: 'permissionrequest.admin',

                                    }, (error, response) => {
                                        if (error) {
                                            console.log("errorasa" + error.errorcode);
                                            console.log("errorsaa" + error.message);
                                        }
                                        multichain.revoke({
                                            addresses: permissionaddress,
                                            permissions: 'permissionapprove.write',

                                        }, (error, response) => {
                                            if (error) {
                                                console.log("errorasa" + error.errorcode);
                                                console.log("errorkuku" + error.message);
                                            }
                                            multichain.revoke({
                                                addresses: permissionaddress,
                                                permissions: 'permissionapprove.read',

                                            }, (error, response) => {
                                                if (error) {
                                                    console.log("errormuu" + error.errorcode);
                                                    console.log("errormuu" + error.message);
                                                }
                                                multichain.revoke({
                                                    addresses: permissionaddress,
                                                    permissions: 'permissionapprove.activate',

                                                }, (error, response) => {
                                                    if (error) {
                                                        console.log("errormuu" + error.errorcode);
                                                        console.log("errorllk" + error.message);
                                                    }
                                                    multichain.revoke({
                                                        addresses: permissionaddress,
                                                        permissions: 'permissionapprove.admin',

                                                    }, (error, response) => {
                                                        if (error) {
                                                            console.log("errormmu" + error.errorcode);
                                                            console.log("errorjjj" + error.message);
                                                        }
                                                        multichain.revoke({
                                                            addresses: permissionaddress,
                                                            permissions: 'assetapprove.write',

                                                        }, (error, response) => {
                                                            if (error) {
                                                                console.log("errornfgh" + error.errorcode);
                                                                console.log("errorfgfg" + error.message);
                                                            }
                                                            multichain.revoke({
                                                                addresses: permissionaddress,
                                                                permissions: 'assetapprove.read',

                                                            }, (error, response) => {
                                                                if (error) {
                                                                    console.log("errornghg" + error.errorcode);
                                                                    console.log("errorngfhgf" + error.message);
                                                                }
                                                                multichain.revoke({
                                                                    addresses: permissionaddress,
                                                                    permissions: 'assetapprove.activate',

                                                                }, (error, response) => {
                                                                    if (error) {
                                                                        console.log("errornhhgf" + error.errorcode);
                                                                        console.log("errorngfhgf" + error.message);
                                                                    }
                                                                    multichain.revoke({
                                                                        addresses: permissionaddress,
                                                                        permissions: 'assetapprove.admin',

                                                                    }, (error, response) => {
                                                                        if (error) {
                                                                            console.log("errornhgfh" + error.errorcode);
                                                                            console.log("errornhh" + error.message);
                                                                        }
                                                                        multichain.revoke({
                                                                            addresses: permissionaddress,
                                                                            permissions: 'kilometrage.admin',

                                                                        }, (error, response) => {
                                                                            if (error) {
                                                                                console.log("errornfgh" + error.errorcode);
                                                                                console.log("errornhgfh" + error.message);
                                                                            }
                                                                            multichain.revoke({
                                                                                addresses: permissionaddress,
                                                                                permissions: 'kilometrage.send',

                                                                            }, (error, response) => {
                                                                                if (error) {
                                                                                    console.log("errornhgfh" + error.errorcode);
                                                                                    console.log("errornhgh" + error.message);
                                                                                }
                                                                                multichain.revoke({
                                                                                    addresses: permissionaddress,
                                                                                    permissions: 'assetrequest.write',

                                                                                }, (error, response) => {
                                                                                    if (error) {
                                                                                        console.log("errornhgh" + error.errorcode);
                                                                                        console.log("errornhg" + error.message);
                                                                                    }
                                                                                    multichain.revoke({
                                                                                        addresses: permissionaddress,
                                                                                        permissions: 'assetrequest.read',

                                                                                    }, (error, response) => {
                                                                                        if (error) {
                                                                                            console.log("errorngh" + error.errorcode);
                                                                                            console.log("errornhg" + error.message);
                                                                                        }
                                                                                        multichain.revoke({
                                                                                            addresses: permissionaddress,
                                                                                            permissions: 'assetrequest.activate',

                                                                                        }, (error, response) => {
                                                                                            if (error) {
                                                                                                console.log("errorngh" + error.errorcode);
                                                                                                console.log("error" + error.message);
                                                                                            }
                                                                                            multichain.revoke({
                                                                                                addresses: permissionaddress,
                                                                                                permissions: 'assetrequest.admin',

                                                                                            }, (error, response) => {
                                                                                                if (error) {
                                                                                                    console.log("errornhgh" + error.errorcode);
                                                                                                    console.log("errornhg" + error.message);
                                                                                                }

                                                                                                return callback(mresponse);
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}

///////////////////////////////////////////////////////////

/**
 * Function to Create AssetFilter and PermissionFilter
 * @param {*} callback 
 */
function createFilter(callback) {

    var multichain = initiateMultichain();

    var assetfilterfile = fs.readFileSync(assetfilter, 'utf8');
    var permissionfilterfile = fs.readFileSync(permissionfilter, 'utf8');
    multichain.create({
        type: 'txfilter',
        name: 'permissionfilter',
        open: {},
        details: permissionfilterfile
    }, (err, info) => {
        if (err) {
            console.log(err.message);
            console.log(err.errorcode);
        } else {
            console.log('info' + info)
        }
    })

    multichain.create({
        type: 'txfilter',
        name: 'assetfilter',
        open: {},
        details: assetfilterfile
    }, (err, info) => {
        if (err) {
            console.log(err.message);
            console.log(err.errorcode);
        } else {
            console.log('info' + info)
        }
    })
    return callback("Filter created")
}


/**
 * Approve Filter
 * @param {*} callback 
 */
function approveFilter(callback) {

    var multichain = initiateMultichain();

    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {

            multichain.approveFrom({
                from: addrinfo[0],
                upgrade: 'permissionfilter',
                approve: true
            }, (err, info) => {
                if (err) {
                    console.log(err.message);
                    console.log(err.errorcode);
                } else {
                    console.log('info' + info)
                }
            })

            multichain.approveFrom({
                from: addrinfo[0],
                upgrade: 'assetfilter',
                approve: true
            }, (err, info) => {
                if (err) {
                    console.log(err.message);
                    console.log(err.errorcode);
                } else {
                    console.log('info' + info)
                }
            })

        }
    })
    return callback("Filter Approved")

}


/**
 * Disapprove Filter
 * @param {*} callback 
 */
function disapproveFilter(callback) {

    var multichain = initiateMultichain();

    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        } else {

            multichain.approveFrom({
                from: addrinfo[0],
                upgrade: 'permissionfilter',
                approve: false
            }, (err, info) => {
                if (err) {
                    console.log(err.message);
                    console.log(err.errorcode);
                } else {
                    console.log('info' + info)
                }
            })

            multichain.approveFrom({
                from: addrinfo[0],
                upgrade: 'assetfilter',
                approve: false
            }, (err, info) => {
                if (err) {
                    console.log(err.message);
                    console.log(err.errorcode);
                } else {
                    console.log('info' + info)
                }
            })

        }
    })
    return callback("Filter Disaproved")

}

let odowalletmultichainexports = {
    initiateMultichain: initiateMultichain,
    adminconnect: adminconnect,
    adminconnectfinalise: adminconnectfinalise,
    publishSign: publishSign,
    pendingPermissionApprovals: pendingPermissionApprovals,
    pollForPermissionApprovals: pollForPermissionApprovals,
    revokeAdminPermission: revokeAdminPermission,
    getPendingPermissionForApprovals: getPendingPermissionForApprovals,
    finaliseAdmin: finaliseAdmin,
    pollOutstandingTransaction: pollOutstandingTransaction,
    createAdminStreams: createAdminStreams,
    subscribeToAllStream: subscribeToAllStream,
    createFilter: createFilter,
    approveFilter: approveFilter,
    disapproveFilter: disapproveFilter
}

module.exports = odowalletmultichainexports;