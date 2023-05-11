
/**
 * Function is to block Transaction which do not satisfy the following property while being a permission "CONNECT / SEND / RECEIVE"
 */
function filtertransaction() {
    //Get current transaction
    var tx = getfiltertransaction();
    //Get Transaction details
    var main = tx.vout;
    //Get Tranaction receiver details
    var receiveraddress;
    //Ge Transaction admin details/performer
    var adminaddress;
    //Get the transaction receiver data
    var receiverdata;
    //Get the transaction metadata
    var metadata;
    // Get the transaction admindata
    var admindata;

    //Specify the signatures needed
    var required_signatures = 2;

    //Check for transaction which is of type permission of CONNECT/ SEND / RECEIVE 
    if (main[0].hasOwnProperty('permissions') && (main[0].permissions[0].connect == true || main[0].permissions[0].send == true || main[0].permissions[0].receive == true)) {
        //Check if all data is present in transaction
        //permissions[0].endblock=0 //For Connect permission
        //permissions[0].endblock=-1 //For Revoke permission
        if (Object.keys(main).length == 3) {
            receiverdata = main[0];
            metadata = main[1];
            admindata = main[2];
            receiveraddress = receiverdata.scriptPubKey.addresses[0];
            adminaddress = admindata.scriptPubKey.addresses[0];
        }
        else {
            return "Data not expected index";
        }

        //Check if data is actually present
        if (isNullCheck(main[0]) || isNullCheck(main[1]) || isNullCheck(main[2])) {
            return "Expected Data / Format Not Present";
        }
        //Check if metadata is present

        if (!(metadata.hasOwnProperty('data') || Object.keys(metadata.data).length < 1 || isNullCheck(metadata.data[0].json))) {
            return "Metadata with Signatures required";

        }
        //Check if transaction is initiated by an admin
        if (!(verifypermission(admindata.scriptPubKey.addresses[0], 'admin'))) {
            return "transaction not performed by admin address";
        }
        //Get the actual coredata
        var actualdata = metadata.data[0].json;
        //Get the actualdata signature length
        var signlength = Object.keys(actualdata).length;
        //Check for required signatures
        if (signlength < required_signatures) {
            return "Adequate Signatures not present" + JSON.stringify(main);
        }
        //Check and verify each metadata
        for (let i = 0; i < signlength; i++) {
            var currentmetadata = actualdata;
            var currentmetadatalength = Object.keys(currentmetadata).length

            var alreadysignedadmins = [];
            var alreadysignedcounter = 0;
            for (let j = 0; j < currentmetadatalength; j++) {
                currentdata = currentmetadata[j].json;
                for (let k = 0; k < Object.keys(alreadysignedadmins).length; k++) {
                    if (alreadysignedadmins[k] == currentdata.adminaddress) {
                        return "Duplicate Signature Present";
                    }
                }
                alreadysignedadmins[alreadysignedcounter] = currentdata.adminaddress;
                alreadysignedcounter = ++alreadysignedcounter;
                metadatacheck(currentdata, receiveraddress);
            }
        }
    }
}




/**
 * Check if the data inside metadata is good
 * @param {*} metadata 
 * @param {*} receiveraddress 
 */
function metadatacheck(metadata, receiveraddress) {
    //If metadata adress & transaction receiver address matches
    if (metadata.address != receiveraddress) {
        return 'problem with receiver address data';
    }
    //If metadata signer is an admin
    if (!(verifypermission(metadata.adminaddress, 'admin'))) {
        return "message not signed by admin address";
    }
    //If metadata comment is proper
    if (metadata.comment != 'connect approve') {
        return "commit data not proper";
    }
    //Verify the signature of the message
    verifysignmessage(metadata.message, metadata.sign, metadata.adminaddress, metadata.address);
}

/**
 * Verify if the signature of the message is proper and signed by the claimed person
 * @param {*} normalmessage 
 * @param {*} signmessage 
 * @param {*} adminaddress 
 * @param {*} receiveraddress 
 */
function verifysignmessage(normalmessage, signmessage, adminaddress, receiveraddress) {
    var formedmessage = 'approved+connect+from:' + adminaddress + 'to:' + receiveraddress;
    if (!(metadatacheck.message == formedmessage)) {
        return "message not properly formed";
    }
    else if (!(verifymessage(adminaddress, signmessage, normalmessage))) {
        return "message not signed properly";
    }
}

/**
 * General Util Null Check
 * @param {*} data 
 */
function isNullCheck(data) {
    if (data == null || data == undefined || data == '') {
        return true
    } else {
        return false;
    }

}