require('dotenv').config();

var monitorservice = require('../multichain/monitorservice');

var permissionrequest = 'permissionrequest';

var adminpermissionrequest = 'adminpermissionrequest';

var permissionapprove = 'permissionapprove'

var assetrequest = 'assetrequest';

var assetapprove = 'assetapprove';

var input_port = process.env.multichain_port;

var input_host = process.env.multichain_host;

var input_user = process.env.multichain_user;

var input_pass = process.env.multichain_pass;

var permission_consenus = process.env.multichain_permission_consenus;

var asset_consensus = process.env.multichain_asset_consenus;


var streamsubscription = false;

initiateMultichain = function () {
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

            }), (permissionerr, permissioninfo) => {
                if ((permissioninfo!=null && permissioninfo!=undefined)&&(Object.keys(permissioninfo).length > 0)) {
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


                
            }
        }

    })
}

//For NON-ADMIN NODE
/**
 * Method for Non-Admin To Request for Asset deposition
 * 1) Create an "Asset Request" entry in Stream for an Admin Selected 
 * 2) Admin Selection is random "Unoccupied Admins are preferred, meaning ehter are not involved in any Request handling of Asset/connect/Admin  "
 * 
 * @param {*} permissionaddress 
 * @param {*} assetinput 
 * @param {*} callback 
 */
function initiateBasicAssetRequest(assetinput, callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);

        }
        else {
            randomAdminChoice(function (response) {
                var streamname = response.toString().substr(0, 30) + 'AR';
                var transactionkey = (response.toString() + new Date()).toString().replace("+", "");
                multichain.publish({
                    stream: streamname,
                    key: transactionkey,
                    data: {
                        "json":
                        {
                            'address': addrinfo[0],
                            'adminaddress': response,
                            'assetbalance': assetinput, //TO CHECK
                            'comment': 'asset request'
                        }
                    }
                }, (publisherr, publishinfo) => {
                    if (publisherr) {
                        console.log("error" + publisherr.errorcode);
                        console.log("error" + publisherr.message);
                         return callback("Error Received"+publisherr);      
                    }
                    console.log('Response:' + publishinfo);
                    //Transfer value to monitoring service
                    monitorservice.storeAssetTransferTransaction(transactionkey);
                    monitorservice.storeMultichainAssetTransferTransaction(publishinfo);
                })
            })
        }
    })
    return callback('initiateBasicAssetRequestCompleted' + 'for:' + assetinput);
}

/**
 * Random Admin is selected by first filtering the available admins and then filter them
 * 1) List Permission admin filtered by a) Permisssion Requests Admin b) Asset Requests Admin c) Admin Requests Admin
 * 2) If none are free, then an available admin is freely chosen
 * @param {*} callback 
 */
function randomAdminChoice(callback) {
    var multichain = initiateMultichain();
    multichain.listPermissions({
        verbose: false,
        permissions: 'admin'

    }, (adminerr, admininfo) => {
        if (adminerr) {
            console.log("error" + adminerr.errorcode);
            console.log("error" + adminerr.message);
            return callback("Error Received"+adminerr);
        }

        var adminno = Object.keys(admininfo).length;
        multichain.listStreamKeys({
            stream: permissionrequest,
            key: '*',
            verbose: true
        }, (permissionserr, permissioninfo) => {
            if (permissionserr) {
                console.log("error" + permissionserr.errorcode);
                console.log("error" + permissionserr.message);
                return callback("Error Received"+permissionserr);
            }
            multichain.listStreamKeys({
                stream: assetrequest,
                key: '*',
                verbose: true
            }, (asseterr, assetinfo) => {
                if (asseterr) {
                    console.log("error" + asseterr.errorcode);
                    console.log("error" + asseterr.message);
                    return callback("Error Received"+asseterr);
                } multichain.listStreamKeys({
                    stream: adminpermissionrequest,
                    key: '*',
                    verbose: true
                }, (adminpermissionrequesterr, adminpermissionrequestinfo) => {
                    if (adminpermissionrequesterr) {
                        console.log("error" + adminpermissionrequesterr.errorcode);
                        console.log("error" + adminpermissionrequesterr.message);
                        return callback("Error Received"+adminpermissionrequesterr);
                    }
                    var permissionrequestunique = getUniqueAdminforPermisssionRequests(permissioninfo);
                    var asetrequestunique = getUniqueAdminforPermisssionRequests(assetinfo);
                    var adminpermissionrequestunique = getUniqueAdminforPermisssionRequests(adminpermissionrequestinfo);

                    var admininfoaddress = getAdminforPermisssion(admininfo);
                    var primaryUnoccupiedAdmin = admininfoaddress.filter(function (element) {
                        return permissionrequestunique.indexOf(element) === -1;
                    });


                    var secndaryUnoccupiedAdmin = primaryUnoccupiedAdmin.filter(function (element) {
                        return asetrequestunique.indexOf(element) === -1;
                    });


                    var tertiaryUnoccupiedAdmin = secndaryUnoccupiedAdmin.filter(function (element) {
                        return adminpermissionrequestunique.indexOf(element) === -1;
                    });

                    var adminindexselected = 0;
                    var admin;
                    if (Object.keys(tertiaryUnoccupiedAdmin).length > 0) {
                        adminindexselected = Math.floor(Math.random() * Object.keys(tertiaryUnoccupiedAdmin).length);
                        admin = tertiaryUnoccupiedAdmin[adminindexselected];
                    } else if (Object.keys(secndaryUnoccupiedAdmin).length > 0) {
                        adminindexselected = Math.floor(Math.random() * Object.keys(secndaryUnoccupiedAdmin).length);
                        admin = secndaryUnoccupiedAdmin[adminindexselected];
                    } else if (Object.keys(primaryUnoccupiedAdmin).length > 0) {
                        adminindexselected = Math.floor(Math.random() * Object.keys(primaryUnoccupiedAdmin).length);
                        admin = primaryUnoccupiedAdmin[adminindexselected];
                    }
                    else {
                        adminindexselected = Math.floor(Math.random() * Object.keys(admininfoaddress).length);
                        admin = admininfoaddress[adminindexselected];
                    }
                    return callback(admin);
                })
            })
        })
    })
}

/**
* Get Admin for Permission Request which are unclosed // " Or get occupied admin"
* @param {*} listStreamKeys 
*/
function getUniqueAdminforPermisssionRequests(listStreamKeys) {
    var uniqueitem = [];
    var j = 0;
    if(listStreamKeys!=null && listStreamKeys!=undefined){
    for (var i = 0; i < Object.keys(listStreamKeys).length; i++) {
        if (listStreamKeys[i].items == 1) {
            uniqueitem[j] = listStreamKeys[i].first.data.json.adminaddress;
            j = ++j;
        }
    }
}
    return uniqueitem;

}

/**
 * Get only the Admin Addresses from List Permsissions ADMIN
 * @param {*} listAdminPermissions 
 */
function getAdminforPermisssion(listAdminPermissions) {
    var uniqueitem = [];
    var j = 0;
    if(listAdminPermissions!=null && listAdminPermissions!=undefined){
    for (var i = 0; i < Object.keys(listAdminPermissions).length; i++) {
        uniqueitem[j] = listAdminPermissions[i].address;
        j = ++j;
    }
}
    return uniqueitem;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//For NON-ADMIN NODE with SPECIFIC Admin ADDRESS
/**
 * Method for Non-Admin To Request for Asset deposition
 * 1) Create an "Asset Request" entry in Stream for an Admin Selected 
 * 2) Admin Selection is specified by the NON ADMIN NODE
 * 
 * @param {*} permissionaddress 
 * @param {*} assetinput 
 * @param {*} callback 
 */
function initiateBasicAssetRequestSpecifiedAdmin(adminaddress, assetinput, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error Received" +addresserr );
        }
        else {
            var response = adminaddress;
            var streamname = response.toString().substr(0, 30) + 'AR';
            var transactionkey = (response.toString() + new Date()).toString().replace("+", "");
            multichain.publish({
                stream: streamname,
                key: transactionkey,
                data: {
                    "json":
                    {
                        'address': addrinfo[0],
                        'adminaddress': response,
                        'assetbalance': assetinput, //TO CHECK
                        'comment': 'asset request'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
                    return callback("Error Received" +publisherr );
                }
                //Transfer value to monitoring service
                monitorservice.storeAssetTransferTransaction(transactionkey);
                monitorservice.storeMultichainAssetTransferTransaction(publishinfo);
                console.log('Response:' + publishinfo);

            })
        }
    })
    return callback('initiateBasicAssetRequestSpecifiedAdminCompleted');
}

function initiateBasicAssetRequestSpecifiedAdminandAddress(addrinfo, adminaddress, assetinput, callback) {

    var multichain = initiateMultichain();
    var response = adminaddress;
    var streamname = response.toString().substr(0, 30) + 'AR';
    var transactionkey = (response.toString() + new Date()).toString().replace("+", "");
    multichain.publish({
        stream: streamname,
        key: transactionkey,
        data: {
            "json":
            {
                'address': addrinfo,
                'adminaddress': response,
                'assetbalance': assetinput, //TO CHECK
                'comment': 'asset request'
            }
        }
    }, (publisherr, publishinfo) => {
        if (publisherr) {
            console.log("error" + publisherr.errorcode);
            console.log("error" + publisherr.message);
            return callback("Error Received" +publisherr );
        }
        console.log('Response:' + publishinfo);

    })

    return callback('initiateBasicAssetRequestSpecifiedAdminCompleted');
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//For ADMIN to request on behalf of a  NON-ADMIN NODE with SPECIFIC Admin ADDRESS
/**
 * Method for Non-Admin To Request for Asset deposition
 * 1) Create an "Asset Request" entry in Stream for an Admin Selected 
 * 2) Admin Selection is specified by the NON ADMIN NODE
 * 
 * @param {*} permissionaddress 
 * @param {*} assetinput 
 * @param {*} callback 
 */
function initiateBasicAssetRequestOnbehalf(permissionaddress, assetinput, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error Received" +addresserr );
        }
        else {
            var response = addrinfo[0];
            var streamname = response.toString().substr(0, 30) + 'AR';
            var transactionkey = (response.toString() + new Date()).toString().replace("+", "");
            multichain.publish({
                stream: streamname,
                key: transactionkey,
                data: {
                    "json":
                    {
                        'address': permissionaddress,
                        'adminaddress': response,
                        'assetbalance': assetinput, //TO CHECK
                        'comment': 'asset request'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
                    return callback("Error Received" +publisherr );
                }
                console.log('Response:' + publishinfo);

            })
        }
    })
    return callback('initiateBasicAssetRequestOnbehalfCompleted');
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//By ADMIN NODE
//Poll for Asset Request Creation

/**Poll for any Pernding asset request in own "ADMINADDR+AR" and then try to bring it to the network
 * 
 * 1) Initiate the request at the network level in "ASSET REQUEST"
 * 2)Publish the own signature approval 
 * 3) Log the approval of its own in "ADMINADDR+AA"
 * 
 */
function pollandCreateAssetRequests(callback) {
    var multichain = initiateMultichain();
    

    pendingAssetRequestCreation(function (response) {
        multichain.getAddresses({
            verbose: false,

        }, (addresserr, addrinfo) => {
            if (addresserr) {
                console.log("error" + addresserr.errorcode);
                console.log("error" + addresserr.message);
                return callback("Error Received" +addresserr );
            }
            console.log("SSSS"+response);

            for (var i = 0; i < Object.keys(response).length; i++) {
                console.log(addrinfo[0].toString().substr(0, 30) + 'AR');
                multichain.listStreamKeyItems({
                    stream: addrinfo[0].toString().substr(0, 30) + 'AR',
                    key: response[i]
                }, function (listitemerror, listitemresponse) {
                    if (listitemerror) {
                        console.log("listitemerror" + listitemerror.errorcode);
                        console.log("listitemerror" + listitemerror.message);
                        return callback("Error Received" +listitemerror );
                    }
                    console.log("AAASET"+JSON.stringify(listitemresponse));
                    if(listitemresponse!=null && listitemresponse!=undefined){
                    for (var j = 0; j < Object.keys(listitemresponse).length; j++) {
                        if(listitemresponse[j].data.hasOwnProperty('json')&&listitemresponse[j].data.json.hasOwnProperty('address')){
                        initiateAssetRequest(listitemresponse[j].data.json.address, listitemresponse[j].data.json.assetbalance, listitemresponse[j].keys[0], function (response) {
                            console.log(response);
                        })
                        publishSign(listitemresponse[j].keys[0], listitemresponse[j].data.json.address, listitemresponse[j].data.json.assetbalance, function (publishresponse) {
                            console.log(publishresponse);
                        })
                        logAssetApproval(listitemresponse[j].data.json.address, listitemresponse[j].keys[0], listitemresponse[j].data.json.assetbalance, function (logresponse) {
                            console.log(logresponse);
                        })
                    }
                    }
                }
                })
            }
        })
    })
    return callback("Cleared some Asset Requests");
}

/**
     * BY ADMIN NODE
     * 
     * Get Pending Asset Request which are to be Approved by an Admin by looking at boht of its streams Addr+AR && Addr+AA
     * 
     * 1) Get the Assigned Asset Requests (Items=1) in ADMINADDR+AR  - (minus) ADMINADDR+AA
     * @param {}  
     */

function pendingAssetRequestCreation(callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error Received" + addresserr );
        }
        else {
            multichain.listStreamKeys({
                stream: addrinfo[0].toString().substr(0, 30) + 'AR',
            }, (listStreamKeyserr, listStreamKeysinfo) => {
                if (listStreamKeyserr) {
                    console.log("error" + listStreamKeyserr.errorcode);
                    console.log("error" + listStreamKeyserr.message);
                    return callback("Error Received" + listStreamKeyserr );
                }
                var ownstreamname = addrinfo[0].toString().substr(0, 30) + 'AA';
                multichain.listStreamKeys({
                    stream: ownstreamname,
                }, (permissionserr, permissioninfo) => {
                    if (permissionserr) {
                        console.log("error" + permissionserr.errorcode);
                        console.log("error" + permissionserr.message);
                        return callback("Error Received" + permissionserr );
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
 * Get items which occur once or in other words // Get new requests
 * @param {*} listStreamKeys 
 */
function getUniqueItem(listStreamKeys) {
    var uniqueitem = [];
    var j = 0;
    if(listStreamKeys!=null && listStreamKeys!=undefined){
    for (var i = 0; i < Object.keys(listStreamKeys).length; i++) {
        if (listStreamKeys[i].items == 1) {
            uniqueitem[j] = listStreamKeys[i].key;
            j = ++j;
        }
    }
}
    return uniqueitem;

}

/**
 * After getting the pending request for that Particular ADMIN then initiate the Request to the 
 * 1) NETWORK: Stream "ASSET REQUEST"
 * 2) Give the Approval by publishing the signed message in "ASSET APPROVE"
 * 3) LOG the asset Approval by itself in "ADMINADDR+AA"
 * @param {} permissionaddress 
 * @param {*} assetinput 
 * @param {*} inputtransactionkey 
 * @param {*} callback 
 */
function initiateAssetRequest(permissionaddress, assetinput, inputtransactionkey, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error Received" + addresserr );
        }
        else {
            var transactionkey = inputtransactionkey;
            multichain.publish({
                stream: assetrequest,
                key: transactionkey,
                data: {
                    "json":
                    {
                        'address': permissionaddress,
                        'adminaddress': addrinfo[0],
                        'assetbalance': assetinput, //TO CHECK
                        'comment': 'asset request'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
                    return callback("Error Received" + publisherr );
                }
                console.log('Response:' + publishinfo);
            })

        }
    })
    return callback("Initiated Asset Request" + inputtransactionkey);

}

/**
 * Publish the signed message to the "ASSET APPROVAL" Stream for the ASSET TRANSFER for its own initiated Request
 * @param {} transactionkey 
 * @param {*} permissionaddress 
 * @param {*} assetbalance 
 * @param {*} callback 
 */
function publishSign(transactionkey, permissionaddress, assetbalance, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error Received" + addresserr );
        }
        else {
            //transactionkey=addrinfo+new Date();
            var formedmessage = 'approved+asset+from:' + addrinfo[0] + 'to:' + permissionaddress + 'balance:' + assetbalance;
            multichain.signMessage([
                addrinfo[0], formedmessage
            ], (signerr, signinfo) => {
                if (signerr) {
                    console.log("signerr" + signerr.errorcode);
                    console.log("signerr" + signerr.message);
                    return callback("Error Received" + signerr );
                } else {

                    var signmessage = signinfo;
                    multichain.publish({
                        stream: assetapprove,
                        key: transactionkey,
                        data: {
                            "json":
                            {
                                'address': permissionaddress,
                                'adminaddress': addrinfo[0],
                                'sign': signmessage,
                                'message': formedmessage,
                                'assetbalance': assetbalance,
                                'comment': 'asset approve'
                            }
                        }
                    }, (publisherr, publishinfo) => {
                        if (publisherr) {
                            console.log("error" + publisherr.errorcode);
                            console.log("error" + publisherr.message);
                            return callback("Error Received" + publisherr );
                        }
                        console.log('Response:' + publishinfo);
                        return callback(publishinfo);
                    })
                }
            })
        }

    })
}

/**
 * After the publishing of the signed message in stream "ASSET APPROVAL" then LOG the approval in
 * 1) OWn Stream : ADMINADDR+AA
 * @param {*} permissionaddress 
 * @param {*} transactionid 
 * @param {*} balance 
 * @param {*} callback 
 */

function logAssetApproval(permissionaddress, transactionid, balance, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error Received" + addresserr );
        }
        else {
            var transactionkey = transactionid;
            var streamname = addrinfo[0].toString().substr(0, 30) + 'AA';
            multichain.publish({
                stream: streamname,
                key: transactionkey,
                data: {
                    "json":
                    {
                        'address': permissionaddress,
                        'adminaddress': addrinfo[0],
                        'assetbalance': balance,
                        'comment': 'asset approve'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
                    return callback("Error Received" + publisherr );
                }
                console.log('Response:' + publishinfo);
                return callback(publishinfo);
            })

        }
    })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//For Other Admin Nodes which are in general POlling to APPROVE the asset Request initiated by other Admin Nodes

/**
 * Get Pending Assset Approval which are back logged and requested by other Admin Nodes
 * 1) Look at the Network Level " ASSET REQUEST" Stream
 * 2) Look at the own "ADMINADDR+AA" Stream
 * 3) Filter the owns which are not approved
 * 
 * 
 * @param {*} callback 
 */
function pendingAssetApprovals(callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error Received" + addresserr );
        }
        else {
            multichain.listStreamKeys({
                stream: assetrequest,
            }, (listStreamKeyserr, listStreamKeysinfo) => {
                if (listStreamKeyserr) {
                    console.log("error" + listStreamKeyserr.errorcode);
                    console.log("error" + listStreamKeyserr.message);
                    return callback("Error Received" + listStreamKeyserr );
                }
                var ownstreamname = addrinfo[0].toString().substr(0, 30) + 'AA';
                multichain.listStreamKeys({
                    stream: ownstreamname,
                }, (permissionserr, permissioninfo) => {
                    if (permissionserr) {
                        console.log("error" + permissionserr.errorcode);
                        console.log("error" + permissionserr.message);
                        return callback("Error Received" + permissionserr );
                    }
                    var listStreamKeysuniqueitem = getUniqueItem(listStreamKeysinfo); // getUniqueItem referred earlier defined function
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// For other Admin Nodes to give its approval for the Asset Transfer

/**
 * Other Node polls in general and looks at the STREAM "ASSET REQUEST" - "ADMINADDR+AA" to ge the pending trasnaction to approve
 * 
 * Then
 * 1) Publish the signature for the approval to the stream "ASSET APPROVE"
 * 2) Log the approval in its won "ADMINADDR+AA"
 * @param {*} callback 
 */

function pollforAssetTransferRequesttoApprove(callback) {
    var multichain = initiateMultichain();

    pendingAssetApprovals(function (pendingapprovals) {
        for (var i = 0; i < Object.keys(pendingapprovals).length; i++) {
            multichain.listStreamKeyItems({
                stream: assetrequest,
                key: pendingapprovals[i]
            }, function (listitemerror, listitemresponse) {
                if (listitemerror) {
                    console.log('listitemerror' + listitemerror);
                    return callback('listitemerror' + listitemerror);
                }
                if (Object.keys(listitemresponse).length > 0) {
                    publishSign(listitemresponse[0].keys[0], listitemresponse[0].data.json.address, listitemresponse[0].data.json.assetbalance, function (publishresponse) {
                        console.log(publishresponse);
                    })
                    logAssetApproval(listitemresponse[0].data.json.address, listitemresponse[0].keys[0], listitemresponse[0].data.json.assetbalance, function (logresponse) {
                        console.log(logresponse);

                    })
                }
            })

        }
    })
    return callback("Asset Approvals pooled and Done");
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// For other Admin Nodes to give its approval for the Asset Transfer

/**
 * Other Node sepecify the TRANSACTION ID to approve the ASSET TRANSFER
 * 
 * Then
 * 1) Publish the signature for the approval to the stream "ASSET APPROVE"
 * 2) Log the approval in its won "ADMINADDR+AA"
 * @param {*} callback 
 */

function approveAssetTransferRequest(transactionid, callback) {
    var multichain = initiateMultichain();
    multichain.listStreamKeyItems({
        stream: assetrequest,
        key: transactionid
    }, function (listitemerror, listitemresponse) {
        if (listitemerror) {
            console.log('listitemerror' + listitemerror);
            return callback('listitemerror' + listitemerror);
        }
        console.log(listitemresponse);
        if (Object.keys(listitemresponse).length > 0) {
            publishSign(listitemresponse[0].keys[0], listitemresponse[0].data.json.address, listitemresponse[0].data.json.assetbalance, function (publishresponse) {
                console.log(publishresponse);
            })
            logAssetApproval(listitemresponse[0].data.json.address, listitemresponse[0].keys[0], listitemresponse[0].data.json.assetbalance, function (logresponse) {
                console.log(logresponse);

            })

        }
    })

    return callback("Asset Approvals pooled and Done")
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/// TIMER FUNCTION

/**
 * FOR AN ADMIN NODE which initiated the ASSET TRANSFER it looks if the approvals have reached
 * 
 * if YES ==>
 *           Then form the metadata with signatures and then trasnfer the asset
 * Then
 *      Log in 1) Own AR 2) Own AA 3) Network AR
 * 
 */
function finalise(callback) {
    clearOutstandingTransaction(function (response) {
        console.log('finalise'+response)
        for (var i = 0; i < Object.keys(response).length; i++) {
            console.log(response[i]);
            pollForAssetApprovals(response[i], function (pollresponse) {
                //Poll REsponse should be transaction id to pass thorugh logging
            })
        }
    })
    return callback("cleared and finalised some initiated approvals");

}

/**
 * We look at ASSET REQUEST GENERAL Stream and get the Request which match the particular ADMIN && are PENDING
 * @param {*} callback 
 */
function clearOutstandingTransaction(callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback('ErrorReceived' + addresserr);
        }
        else {
            multichain.listStreamKeys({
                stream: assetrequest,
                verbose: true
            }, (listStreamKeyserr, listStreamKeysinfo) => {
                if (listStreamKeyserr) {
                    console.log("error" + listStreamKeyserr.errorcode);
                    console.log("error" + listStreamKeyserr.message);
                    return callback('ErrorReceived' + listStreamKeyserr);
                }
                var effectiveApprovals = getUnique_MatchingItemKeys(listStreamKeysinfo, addrinfo[0]);
                return callback(effectiveApprovals);

            })
        }
    })
}

/**
 * Get the Requests which "MATCH" or "INITIATED BY" the Address of the Admin pertaining to the Transaction Key
 * @param {*} listStreamKeys 
 * @param {*} address 
 */

function getUnique_MatchingItemKeys(listStreamKeys, address) {
    var uniqueMatcheditems = [];
    var j = 0;
    if(listStreamKeys!=null && listStreamKeys!=undefined){
    for (var i = 0; i < Object.keys(listStreamKeys).length; i++) {

        console.log(address);
        console.log(listStreamKeys[i].items);
        console.log(listStreamKeys[i].first.data.json.adminaddress);
        console.log(listStreamKeys[i].first.data.json.comment);


        if (listStreamKeys[i].items == 1 && listStreamKeys[i].first.data.json.adminaddress == address && listStreamKeys[i].first.data.json.comment == 'asset request') {
            uniqueMatcheditems[j] = listStreamKeys[i].key;
            j = ++j;
            console.log("yes");
        }
    }
}
    console.log(uniqueMatcheditems);
    return uniqueMatcheditems;

}

/**
 * After we get its own pending lists which are to be finalised we look at the "ASSET APPROVE" and then pool if all the signatures have arrived
 * 
 *1) Based on consenus set we look at the required signatures and then form a metadat with all the signatures and then send the final asset TRANSFER
 * @param {*} transactionkey 
 */
function pollForAssetApprovals(transactionkey, callback) {
    console.log('pollForAssetApprovals');
    var multichain = initiateMultichain();
    multichain.listStreamKeyItems({
        stream: assetapprove,
        key: transactionkey
    }, (listStreamKeyserr, listStreamKeysinfo) => {
        if (listStreamKeyserr) {
            console.log("error" + listStreamKeyserr.errorcode);
            console.log("error" + listStreamKeyserr.message);
            return callback('ErrorReceived' + listStreamKeyserr);
        }
        calculateAssetApproval(function (resp) {
            console.log("inpo++++++++++++++++++++++++++++++++");
            console.log(resp);
            console.log(listStreamKeysinfo);
            console.log("inpo++++++++++++++++++++++++++++++++");
            console.log(Object.keys(listStreamKeysinfo).length);
            if (Object.keys(listStreamKeysinfo).length >= resp) {
                var finaldatawithsign = formMetaData(listStreamKeysinfo);

                //sendAsset: ["address", "asset", "qty", {"native-amount": 0}, {"comment": ""}, {"comment-to": ""}],
                console.log("inpo");
                console.log(listStreamKeysinfo[0].data.json.address);
                console.log("NUMBER"+Number(listStreamKeysinfo[0].data.json.assetbalance));
                console.log("inpo");
                monitorservice.clearAssetTransferTransaction(transactionkey);
                multichain.sendWithMetadata({
                    address: listStreamKeysinfo[0].data.json.address,
                    amount: { "kilometrage": Number(listStreamKeysinfo[0].data.json.assetbalance) },
                    data: {
                        "json": finaldatawithsign
                    }
                }, (error, response) => {
                    if (error) {
                        console.log("sendAsseterror" + error.errorcode);
                        console.log("sendAsseterror" + error.message);
                        return callback('ErrorReceived' + error);
                    }
                     return callback(transactionkey)
                })
                finaliselogNodeAssetRequest(transactionkey, function (logfirstresponse) {
                    console.log(logfirstresponse);
    
                })
                finaliselogNodeAssetApprove(transactionkey, function (logsecondresponse) {
                    console.log(logsecondresponse);
    
                })
                finaliselogAssetRequest(transactionkey, function (logthirdresponse) {
                    console.log(logthirdresponse);
                })
            }
            
            else{
                return callback(false);
            }
        })
    })
    return callback("pollForAssetApprovals completed");
}

/**
 * Calcualate the minimum signatures needed for the ASSET TRANSFER function to pass
 * @param {*} callback 
 */
function calculateAssetApproval(callback) {
    var multichain = initiateMultichain();
    multichain.listPermissions({
        verbose: false,
        permissions: 'admin'

    }, (adminerr, admininfo) => {
        if (adminerr) {
            console.log("error" + adminerr.errorcode);
            console.log("error" + adminerr.message);
            return callback('ErrorReceived' + adminerr);
        }
        var adminno = Object.keys(admininfo).length;
        var approvalrequired = Math.round((adminno * asset_consensus) / 100);
        return callback(approvalrequired);
    })
}

/**
 * Form METADATA which will be sent along with ASSET TRANSFER comprising of all the required signatures
 * @param {*} listStreamKeysinfo 
 */

function formMetaData(listStreamKeysinfo) {
    var metadatalist = [];
    for (var i = 0; i < Object.keys(listStreamKeysinfo).length; i++) {
        metadatalist[i] = listStreamKeysinfo[i].data;
    }
    return metadatalist;
}


/**
 * After we send the ASSET TRANSFER, we then LOG it succesively in three STREAMS deeming the transaction as APPROVED 
 * 1) FIRST STREAM: OWN ASSET REQUEST
 * @param {*} transactionid 
 */
function finaliselogNodeAssetRequest(transactionid, callback) {
     console.log("tranid"+transactionid);
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback('ErrorReceived' + addresserr);
        }
        else {
            var transactionkey = transactionid;
            var streamname = addrinfo[0].toString().substr(0, 30) + 'AR';
            multichain.publish({
                stream: streamname,
                key: transactionkey,
                data: {
                    "json":
                    {
                        'adminaddress': addrinfo[0],
                        'comment': 'asset approved'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
                    return callback('ErrorReceived' + publisherr);
                }
                console.log('Response:' + publishinfo);
            })

        }
    })
    return callback('finalisedlognodeassetrequest' + transactionid);

}


/**
* After we send the ASSET TRANSFER, we then LOG it succesively in three STREAMS deeming the transaction as APPROVED 
* 2) SECOND STREAM: OWN ASSET APPROVE
* @param {*} transactionid 
*/

function finaliselogNodeAssetApprove(transactionid, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback('ErrorReceived' + addresserr);
        }
        else {
            var transactionkey = transactionid;
            var streamname = addrinfo[0].toString().substr(0, 30) + 'AA';
            multichain.publish({
                stream: streamname,
                key: transactionkey,
                data: {
                    "json":
                    {
                        'adminaddress': addrinfo[0],
                        'comment': 'asset approved'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
                    return callback('ErrorReceived' + publisherr);
                }
                console.log('Response:' + publishinfo);
                return callback(publishinfo);
            })

        }
    })
}

/**
* After we send the ASSET TRANSFER, we then LOG it succesively in three STREAMS deeming the transaction as APPROVED 
* 3) THIRD STREAM: "ASSET REQUEST" at network LEvel
* @param {*} transactionid 
*/
function finaliselogAssetRequest(transactionid, callback) {

    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback('ErrorReceived' + addresserr);
        }
        else {
            var transactionkey = transactionid;
            var streamname = assetrequest;
            multichain.publish({
                stream: streamname,
                key: transactionkey,
                data: {
                    "json":
                    {
                        'adminaddress': addrinfo[0],
                        'comment': 'asset approved'
                    }
                }
            }, (publisherr, publishinfo) => {
                if (publisherr) {
                    console.log("error" + publisherr.errorcode);
                    console.log("error" + publisherr.message);
                    return callback('ErrorReceived' + publisherr);
                }
                console.log('Response:' + publishinfo);
                return callback(publishinfo);
            })

        }
    })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Get the Asset balance for a speicific address
 * @param {*} callback 
 */
function getassetbalance(callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback('ErrorReceived' + addresserr);
        }
        else {
            multichain.getAddressBalances({
                address: addrinfo[0]
            }, function (addressBalanceerror, addressBalanceresponse) {
                if (addressBalanceerror) {
                    console.log("error" + addressBalanceerror.errorcode);
                    console.log("error" + addressBalanceerror.message);
                    return callback('ErrorReceived' + addressBalanceerror);
                }
                console.log("ADDRBLANCE"+addressBalanceresponse)
                if(Object.keys(addressBalanceresponse).length>0){
                for (var i = 0; i < Object.keys(addressBalanceresponse).length; i++) {
                    if (addressBalanceresponse[i].name == 'kilometrage') {
                        return callback(addressBalanceresponse[i].qty);
                    }
                }
            }else{
                return callback(0)
            }
            })
        }
    })
}

/**
 * Get the Asset balance for a speicific address
 * @param {*} callback 
 */
function getotherassetbalance(addrresrequest, callback) {
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("Error received"+addresserr);

        }
        else { 
            if(addrinfo[0]!=addrresrequest){
            multichain.importAddress({
                address:addrresrequest
            }),function(importaddreserror,importaddressresponse){
                if(importaddreserror){
                    return callback("Error received"+importaddreserror);
                }
                console.log("Import started");
            }   

    multichain.getAddressBalances({
        address: addrresrequest
    }, function (addressBalanceerror, addressBalanceresponse) {
        if (addressBalanceerror) {
            return callback("Error received"+addressBalanceerror);
        }
        else {
            if(addressBalanceresponse==null ||addressBalanceresponse==undefined || Object.keys(addressBalanceresponse).length==0){
                return callback("No Assets Available: You are Not Allowed to View");
            }
            for (var i = 0; i < Object.keys(addressBalanceresponse).length; i++) {
                if (addressBalanceresponse[i].name == 'kilometrage') {
                    return callback(addressBalanceresponse[i].qty);
                }
            }
        }
    })
}
}
})
}

//////////////////////////////////////////////////////////////////////////////////////



// ISSUE ASSET TO ALL ADMINS INITIALLY

let odowalletmultichainexports = {
    initiateMultichain: initiateMultichain,
    publishSign: publishSign,
    initiateBasicAssetRequest: initiateBasicAssetRequest,
    clearOutstandingTransaction: clearOutstandingTransaction,
    initiateBasicAssetRequestSpecifiedAdmin: initiateBasicAssetRequestSpecifiedAdmin,
    initiateBasicAssetRequestSpecifiedAdminandAddress: initiateBasicAssetRequestSpecifiedAdminandAddress,
    pollandCreateAssetRequests: pollandCreateAssetRequests,
    pollforAssetTransferRequesttoApprove: pollforAssetTransferRequesttoApprove,
    initiateBasicAssetRequestOnbehalf: initiateBasicAssetRequestOnbehalf,
    finalise: finalise,
    pollForAssetApprovals: pollForAssetApprovals,
    pendingAssetApprovals: pendingAssetApprovals,
    getassetbalance: getassetbalance,
    approveAssetTransferRequest: approveAssetTransferRequest,
    pendingAssetRequestCreation: pendingAssetRequestCreation,
    getotherassetbalance:getotherassetbalance

}

module.exports = odowalletmultichainexports;