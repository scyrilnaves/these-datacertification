require('dotenv').config();

var input_port=process.env.multichain_port;

var input_host= process.env.multichain_host;

var input_user=process.env.multichain_user;

var input_pass=process.env.multichain_pass;


var streamsubscription=false;

 initiateMultichain = function() {
    let multichain = require("multichain-node")({
        
        port:input_port,
        host:input_host,
        user:input_user,
        pass:input_pass
    });
    if(!streamsubscription){
        subscribeAnyToStream(multichain,function(response){
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

    function subscribeAnyToStream(multichain){
       
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
                permissions:'admin',
                addresses:addrinfo[0]

            }),(permissionerr,permissioninfo) =>{
                if(Object.keys(permissioninfo).length>0){
            

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


    
}}

    })
}

/**
 * Issue Asset "kilometrage "
 * @param {*} callback 
 */
function issueAsset(callback){
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,
       
    },(addresserr,addrinfo)=>{
        if(addresserr){
            console.log("error"+addresserr.errorcode);
            console.log("error"+addresserr.message);

        }
        else{
            //{"name":"asset1","open":true,"restrict":"send"}
            //issuefrom 1... 1... '{"name":"GBP","open":true}' 50000 0.01 0 '{"origin":"uk", "stage":"01", "purpose":"parts prepayment"}'
             //console.log(addrinfo[0]);
            //'{"name":"kilometragetest","open":true,"restrict":"issue,send,receive,activate,admin"}',

            multichain.issue({
             address:addrinfo[0].toString(),
             asset:{name:"kilometrage",open:true,restrict:"send,receive"},
             qty:9000000000000000000,
             units:1.0,
             details: {OdometerValue: "Kilmoetrage"}

            },(issueerr,issueinfo)=>{
               if(issueerr){
                console.log("issueerr"+issueerr.errorcode);
                console.log("issueerr"+issueerr.message);
                console.log("Error in issuing assets")
               }
               else{
                   console.log(issueinfo);
               }
            })

}
    }
    )
return callback('Asset Created')
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {*} callback 
 * @param {*} inputqty 
 */
function reissue(inputqty,callback){
    var multichain = initiateMultichain();
    multichain.getAddresses({
        verbose: false,
       
    },(addresserr,addrinfo)=>{
        if(addresserr){
            console.log("error"+addresserr.errorcode);
            console.log("error"+addresserr.message);

        }
        else{
            multichain.issueMore({
             address:addrinfo[0],
             asset:'kilometrage',
             qty:inputqty,  //9000000000000000000 (9*10^19)
             units:1,
             details: {OdometerValue: "Kilmoetrage"}
            },(issueerr,issueinfo)=>{
               if(issueerr){
                console.log("issueerr"+issueerr.errorcode);
                console.log("issueerr"+issueerr.message);
                console.log("Error in issuing assets")
               }
               else{
                   console.log(issueinfo);
               }
            })

}
    }
    )
    return callback('Asset Create for Kilmoterage'+inputqty)
}

/**
 * Trasnfer Asset to another Admin
 * This transaction will pass if the receiver is only Admin as it will get filtered at transaction level
 * @param {*} adminAddress 
 * @param {*} inputQty 
 * @param {*} callback 
 */
function transferAssettoOtherAdmin(adminAddress,inputQty,callback){
    var multichain = initiateMultichain();
    multichain.sendWithMetadata({   
        address:adminAddress, 
        amount:{"kilometrage":Number(inputQty)},
        data:{
            "json":'{"Admin Transfer of Asset for rotation"}'
        }
    },(error,response)=>{
        if(error){
            console.log("sendAsseterror"+error.errorcode);
            console.log("sendAsseterror"+error.message);
        }
        
    })
}

let odowalletmultichainexports={
    initiateMultichain:initiateMultichain,
    issueAsset:issueAsset,
    reissue:reissue,
    transferAssettoOtherAdmin:transferAssettoOtherAdmin
}

module.exports=odowalletmultichainexports;