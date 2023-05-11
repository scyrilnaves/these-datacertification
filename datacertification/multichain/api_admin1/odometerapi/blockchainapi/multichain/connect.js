require('dotenv').config();

var permissionrequest='permissionrequest';

var permissionapprove='permissionapprove'

var assetrequest='assetrequest';

var assetapprove='assetapprove';

var input_port=process.env.multichain_port;

var input_host= process.env.multichain_host;

var input_user=process.env.multichain_user;

var input_pass=process.env.multichain_pass;

var permission_consenus=process.env.multichain_permission_consenus;

var asset_consensus=process.env.multichain_asset_consenus;

var transactionKeyArray=[];


var streamsubscription=false;

var keycount = 100;

initiateMultichain = function() {
   let multichain = require("multichain-node")({
       
       port:input_port,
       host:input_host,
       user:input_user,
       pass:input_pass
   });
   if(!streamsubscription){
       subscribeAnyToStream(multichain,function(response){
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
    multichain.getAddresses({
        verbose: false,

    }, (addresserr, addrinfo) => {
        if (addresserr) {
            console.log("error" + addresserr.errorcode);
            console.log("error" + addresserr.message);
            return callback("ErrorOcurred"+addresserr);

        } else {
            multichain.listPermissions({
                permissions:'admin',
                addresses:addrinfo[0]

            }),(permissionerr,permissioninfo) =>{
                if(permissionerr){
                    return callback("ErrorOcurred"+permissionerr);
                }
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
                    return callback("ErrorOcurred"+err);

                }
            })
            multichain.subscribe({
                stream: adminapproval
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);
                    return callback("ErrorOcurred"+err);
                }

            })

            multichain.subscribe({
                stream: assetrequest
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);
                    return callback("ErrorOcurred"+err);
                }
            })

            multichain.subscribe({
                stream: assetapproval
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);
                    return callback("ErrorOcurred"+err);
                }
            })
        }
            multichain.subscribe({
                stream: 'permissionrequest'
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);
                    return callback("ErrorOcurred"+err);
                }
            })

            multichain.subscribe({
                stream: 'adminpermissionrequest'
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);
                    return callback("ErrorOcurred"+err);
                }
            })

            multichain.subscribe({
                stream: 'permissionapprove'
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);

                }
            })

            multichain.subscribe({
                stream: 'assetrequest'
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);
                    return callback("ErrorOcurred"+err);
                }
            })

            multichain.subscribe({
                stream: 'assetapprove'
            }, (err, info) => {
                if (err) {
                    console.log("error" + err.errorcode);
                    console.log("error" + err.message);
                    return callback("ErrorOcurred"+err);
                }
            })


    
}}

    })
}


 /**
     * Main Method To grant connect Permission
     * @param {*} permissionaddress 
     * @param {*} callback 
     */

    function connect(permissionaddress,callback){
        if(permissionaddress!="" && permissionaddress!=null && permissionaddress!='undefined' ){
       initiatePermissionRequest(permissionaddress,function(response){

        publishSign(response,permissionaddress,function(publishresponse){
            logPermissionApproval(permissionaddress,response,function(logresponse){
              return callback('publishresponse:'+publishresponse+'logresponse:'+logresponse);
            })
        })
       })
    }
    else{
        return callback('Specify the Address which needs permission')
    }
    }

    /**
     * Create a New Request Log for the Admin Node which initiates permission request in Stream " PERMISSION REQUEST"
     * @param {} permissionaddress 
     * @param {*} callback 
     */
    function initiatePermissionRequest(permissionaddress,callback){
     
        var multichain = initiateMultichain();
           multichain.getAddresses({
               verbose: false,
              
           },(addresserr,addrinfo)=>{
               if(addresserr){
                   console.log("error"+addresserr.errorcode);
                   console.log("error"+addresserr.message);
   
               }
               else{
               transactionkey=(addrinfo[0]+new Date()).toString().replace("+","");
               multichain.publish({
                   stream:permissionrequest,
                   key:transactionkey,
                   data:{
                       "json":
                   {
                       'address':permissionaddress,
                       'adminaddress':addrinfo[0],
                       'comment':'connect request'
                   }
                   }
                   },(publisherr,publishinfo) =>{
                       if(publisherr){
                           console.log("initiatePermissionRequesterror"+publisherr.errorcode);
                           console.log("initiatePermissionRequesterror"+publisherr.message);
           
                       }
                       return callback(transactionkey);
                   })
   
               }
           })
       }
   
       /**
        * Publish the Signature of the Grant Access to stream "PERMISSION APPROVE"
        * @param {*} transactionkey 
        * @param {*} permissionaddress 
        * @param {*} callback 
        */
        /**
     * Publish Approval
     * @param {} transactionkey 
     * @param {*} permissionaddress 
     * @param {*} callback 
     */
    function publishSign(transactionkey,permissionaddress,callback){
        console.log(transactionkey);
         var multichain = initiateMultichain();
            multichain.getAddresses({
                verbose: false,
               
            },(addresserr,addrinfo)=>{
                if(addresserr){
                    console.log("error"+addresserr.errorcode);
                    console.log("error"+addresserr.message);
    
                }
                else{
                //transactionkey=addrinfo+new Date();
                var formedmessage='approved+connect+from:'+addrinfo[0]+'to:'+permissionaddress;
                multichain.signMessage([
                addrinfo[0].toString(),formedmessage
                ],(signerr,signinfo)=>{
                  if(signerr){
                     console.log("signerr"+signerr.errorcode);
                     console.log("signerr"+signerr.message);
                  }else{
               
                var signmessage=signinfo;
                multichain.publish({
                    stream:permissionapprove,
                    key:transactionkey,
                    data:{
                        "json":
                    {
                        'address':permissionaddress,
                        'adminaddress':addrinfo[0],
                        'sign':signmessage,
                        'message':formedmessage,
                        'comment':'connect approve'
                    }
                    }
                    },(publisherr,publishinfo) =>{
                        if(publisherr){
                            console.log("error"+publisherr.errorcode);
                            console.log("error"+publisherr.message);
            
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
 * Log the permission approval granted by the ADMIN Node itself to the requested node
 * @param {*} permissionaddress 
 * @param {*} transactionid 
 * @param {*} callback 
 */
       function logPermissionApproval(permissionaddress,transactionid,callback){
        
           var multichain = initiateMultichain();
              multichain.getAddresses({
                  verbose: false,
                 
              },(addresserr,addrinfo)=>{
                  if(addresserr){
                      console.log("error"+addresserr.errorcode);
                      console.log("error"+addresserr.message);
      
                  }
                  else{
                  var transactionkey=transactionid;
                  var streamname=addrinfo[0].toString().substr(0,30)+'PA';
                  multichain.publish({
                      stream:streamname,
                      key:transactionkey,
                      data:{
                          "json":
                      {
                          'address':permissionaddress,
                          'adminaddress':addrinfo[0],
                          'comment':'connect request'
                      }
                      }
                      },(publisherr,publishinfo) =>{
                          if(publisherr){
                              console.log("error"+publisherr.errorcode);
                              console.log("error"+publisherr.message);
                              return callback("ErrorOcurred"+publisherr);
                          }
                          console.log('Response:' + publishinfo);
                          return callback(publishinfo);
                      })
      
                  }
              })
          }
   
    /////////////////////////////////////////////////////////////////////////////////////////////////////////


 //Timer Interval //3600000 milliseconds = 60 minutes
 //setTimeout(pollOutstandingTransaction, 3600000);

 /**
  * Return the outstanding transaction in the Queue initiated by the ADMIN and check if APPROVALS ARE COLLECTED and then finalise it
  * @param {*} callback 
  */
    function pollOutstandingTransaction(callback){
        getOutstandingTransaction(function(response){
            for (let i=0,p=Promise.resolve();i<Object.keys(response).length;i++){
                p=p.then(_=> new Promise(resolve =>{
                pollForPermissionApprovals(response[i],function(response){
                })
                resolve();
            }))
            }
        })
        return callback("Transaction are finalised");
    }

    /**
     * Get the Unique Items in "PERMISSION REQUEST"  pending which are initiated by the Admin
     * @param {*} callback 
     */
    function getOutstandingTransaction(callback){
        var multichain = initiateMultichain();
        multichain.getAddresses({
            verbose: false,
           
        },(addresserr,addrinfo)=>{
            if(addresserr){
                console.log("error"+addresserr.errorcode);
                console.log("error"+addresserr.message);

            }
            else{
        multichain.listStreamKeys({
        stream:permissionrequest,
        verbose:true,
        count:keycount,
        start:-keycount
        },(listStreamKeyserr,listStreamKeysinfo) =>{
            if(listStreamKeyserr){
                console.log("error"+listStreamKeyserr.errorcode);
                console.log("error"+listStreamKeyserr.message);
            }
             var listStreamKeysuniqueMatchingitem=getUnique_MatchingItemKeys(listStreamKeysinfo,addrinfo[0]);
                  return callback(listStreamKeysuniqueMatchingitem);             
            
        })
    }})
    }

    /**
 * Get the Requests which "MATCH" or "INITIATED BY" the Address of the Admin pertaining to the Transaction Key
 * @param {*} listStreamKeys 
 * @param {*} address 
 */

function getUnique_MatchingItemKeys(listStreamKeys,address){
    var uniqueMatcheditems=[];
    let j=0;
    if(listStreamKeys!=null && listStreamKeys!=undefined){
    for(let i=0;i<Object.keys(listStreamKeys).length;i++){
        if(listStreamKeys[i].first.data.hasOwnProperty('json')&&listStreamKeys[i].first.data.json.hasOwnProperty('comment')&&listStreamKeys[i].first.data.json.hasOwnProperty('adminaddress')){
        if(listStreamKeys[i].items==1 && listStreamKeys[i].first.data.json.adminaddress==address && listStreamKeys[i].first.data.json.comment=='connect request'){
            uniqueMatcheditems[j]=listStreamKeys[i].key;
            j=++j;
        }
    }
    }
}
    return uniqueMatcheditems;

}

    /**
     * On getting the admin initiated pending transacions, for each of them:
     * 1) Check for the neccessary approvals in "PERMISSION ACCESS" BY CONSENSUS
     * 2) if "YES" ------> Then GRANT REQUEST INITIALISED along with all the collected signatures
     * 3) FINALLY:
     *          1) LOG again in "PERMISSION REQUEST" && "ADMINADDR_PA" to don't poll it again!!
     * @param {*} transactionkey 
     * @param {*} callback 
     */
    function pollForPermissionApprovals(transactionkey,callback){
        var multichain = initiateMultichain();
        multichain.listStreamKeyItems({
            stream:permissionapprove,
            key:transactionkey,
            count:keycount,
            start:-keycount
            },(listStreamKeyserr,listStreamKeysinfo) =>{
                if(listStreamKeyserr){
                    console.log("error"+listStreamKeyserr.errorcode);
                    console.log("error"+listStreamKeyserr.message);
                    return callback("ErrorOcurred"+listStreamKeyserr);
                }
                calculatePermissionApproval(function(resp){
                    if(Object.keys(listStreamKeysinfo).length>=resp){
                        if(listStreamKeysinfo!=null && listStreamKeysinfo!=undefined &&listStreamKeysinfo!=''){
                        var finaldatawithsign=formMetaData(listStreamKeysinfo);
                        multichain.grantWithMetadata({
                            addresses:listStreamKeysinfo[0].data.json.address,
                            permissions:'connect,send,receive',
                            data:{
                                "json":finaldatawithsign
                            }
                        },(error,response)=>{
                            if(error){
                                console.log("error"+error.errorcode);
                                console.log("error"+error.message);
                            }
                            multichain.grantWithMetadata({
                                addresses:listStreamKeysinfo[0].data.json.address,
                                permissions:'assetrequest.write',
                                data:{
                                    "json":finaldatawithsign
                                }
                            },(error,response)=>{
                                if(error){
                                    console.log("error"+error.errorcode);
                                    console.log("error"+error.message);
                                }
                                multichain.grantWithMetadata({
                                    addresses:listStreamKeysinfo[0].data.json.address,
                                    permissions:'kilometrage.receive',
                                    data:{
                                        "json":finaldatawithsign
                                    }
                                },(error,response)=>{
                                    if(error){
                                        console.log("error"+error.errorcode);
                                        console.log("error"+error.message);
                                        return callback("ErrorOcurred"+error);
                                    }
                            connectfinalise(transactionkey,listStreamKeysinfo[0].data.json.address,listStreamKeysinfo[0].data.json.adminaddress,function(res){
                                return callback(res);
                            })
                        }) })
})
                    }

            }
         } )})
}

/**
 * Calculate necessary approvals necessary for a Permission Grant based on the consenus "permission_consenus"
 * @param {*} callback 
 */
function calculatePermissionApproval(callback){
    var multichain = initiateMultichain();
    multichain.listPermissions({
        verbose: false,
        permissions:'admin'
       
    },(adminerr,admininfo)=>{
        if(adminerr){
            console.log("error"+addresserr.errorcode);
            console.log("error"+addresserr.message);
            return callback("ErrorOcurred"+adminerr);
        }
    var adminno =  Object.keys(admininfo).length;
    var approvalrequired=Math.round((adminno*permission_consenus)/100);
    return callback(approvalrequired);
})
}


/**
 * Form Metadata with Signatures to be sent to the transaction
 * @param {*} listStreamKeysinfo 
 */
function formMetaData(listStreamKeysinfo){
    var metadatalist=[];
   for( let i=0;i<Object.keys(listStreamKeysinfo).length;i++){
       metadatalist[i]=listStreamKeysinfo[i].data;
   }
   return metadatalist;
}

/**
 * Finalise OPERATION performed after GRANT is initiated to Complete the Cycle of APPROVAL: Logging again of "PERMISSION REQUEST" && "ADMINADDR_PA"
 * with SAME " TRANSACTION ID " as "KEY"
 * @param {*} transactionkey 
 * @param {*} permissionaddress 
 * @param {*} adminaddress 
 * @param {*} callback 
 */
function connectfinalise(transactionkey,permissionaddress,adminaddress,callback){
    finaliseInitiatePermissionRequest(transactionkey,permissionaddress,adminaddress,function(response){
                })
        finaliseLogPermissionApproval(transactionkey,permissionaddress,adminaddress,function(logresponse){
        })
            return callback('Finalised Permission');
    
 }

 /**
  * LOGGING AGAIN with SAME TRANSACTION ID to avoid repolling of the admin in the stream " PERMISSION REQUEST"
  * @param {*} transactionkey 
  * @param {*} permissionaddress 
  * @param {*} addrinfo 
  * @param {*} callback 
  */
 function finaliseInitiatePermissionRequest(transactionkey,permissionaddress,addrinfo,callback){

    var multichain = initiateMultichain();
           multichain.publish({
               stream:permissionrequest,
               key:transactionkey,
               data:{
                   "json":
               {
                   'address':permissionaddress,
                   'adminaddress':addrinfo,
                   'comment':'connect request finalised'
               }
               }
               },(publisherr,publishinfo) =>{
                   if(publisherr){
                       console.log("error"+publisherr.errorcode);
                       console.log("error"+publisherr.message);
                       return callback("ErrorOcurred"+publisherr);
                   }
                   return callback(transactionkey);
               })

           
       
   }

   /**
    * LOGGING AGAIN with SAME TRANSACTION ID to avoid repolling of the admin in the stream "ADMINADDR_PA"
    * @param {*} transactionkey 
    * @param {*} permissionaddress 
    * @param {*} addrinfo 
    * @param {*} callback 
    */
   function finaliseLogPermissionApproval(transactionkey,permissionaddress,adminaddrinfo,callback){
    
       var multichain = initiateMultichain();
          multichain.getAddresses({
              verbose: false,
             
          },(addresserr,addrinfo)=>{
              if(addresserr){
                  console.log("error"+addresserr.errorcode);
                  console.log("error"+addresserr.message);
                  return callback("ErrorOcurred"+addresserr);
              }
              else{
              var streamname=addrinfo[0].toString().substr(0,30)+'PA';
              multichain.publish({
                  stream:streamname,
                  key:transactionkey,
                  data:{
                      "json":
                  {
                      'address':permissionaddress,
                      'adminaddress':addrinfo[0],
                      'comment':'connect request finalised'
                  }
                  }
                  },(publisherr,publishinfo) =>{
                      if(publisherr){
                          console.log("error"+publisherr.errorcode);
                          console.log("error"+publisherr.message);
                          return callback("ErrorOcurred"+publisherr);
                      }
                      return callback(publishinfo);
                  })
  
              }
          })
      }




////////////////////////////////////////////////////////////////////////

/**
 * Look at Approvals in General which need Permission Approvals Pending //Might be good in Tracking Revoke
 */

        function getPendingPermissionForApprovals(callback){
        var multichain = initiateMultichain();
        var filtered=[];
        let k=0;
        multichain.listPermissions({
            verbose:true
           
        },(err,info)=>{
            if(err){
                console.log("error"+err.errorcode);
                console.log("error"+err.message);
                return callback("ErrorOcurred"+err);
            }
            for( let i=0;i<Object.keys(info).length;i++){
                if(Object.keys(info[i].pending).length>0){
                    filtered[k]=info[i];
                    k=++k;
                }
            }
            return callback(filtered);
     }  
     
     )
    }

////////////////////////////////////////////////////////////////////////////

//*****Revoke Blocked in Filter which is essential to avoid random leaving and addition****
    /**
     * Revoke the CONNECT PERMISSIONS FOR A NODE
     * @param {*} permissionaddress 
     * @param {*} callback 
     */
function revokeConnectPermission(permissionaddress,callback){
    var multichain = initiateMultichain();
    multichain.revoke({
        addresses:permissionaddress,
        permissions:'connect,send,receive',

    },(error,response)=>{
        if(error){
            console.log("error"+error.errorcode);
            console.log("error"+error.message);
            return callback("ErrorOcurred"+error);
        }
        multichain.revoke({
            addresses:permissionaddress,
            permissions:'assetrequest.write',
    
        },(error,response)=>{
            if(error){
                console.log("error"+error.errorcode);
                console.log("error"+error.message);
            }
            multichain.revoke({
                addresses:permissionaddress,
                permissions:'kilometrage.receive',
        
            },(error,response)=>{
                if(error){
                    console.log("error"+error.errorcode);
                    console.log("error"+error.message);
                }
        return callback(response);
    })
})
})
}
/////////////////////////////////////////////////////////////////////////////////
   
          /**
     * Get Pending Approvals for an Admin which needs to be attended by comparing the "Permission Request" Stream and the "ADMINADDR+PA" and get the pending approvals needed
     * @param {*} callback 
     */
    function pendingPermissionApprovals(callback){
        var multichain = initiateMultichain();
        multichain.getAddresses({
            verbose: false,
           
        },(addresserr,addrinfo)=>{
            if(addresserr){
                console.log("error"+addresserr.errorcode);
                console.log("error"+addresserr.message);

            }
            else{
        multichain.listStreamKeys({
        stream:permissionrequest,
        verbose:true,
        count:keycount,
        start:-keycount
        },(listStreamKeyserr,listStreamKeysinfo) =>{
            if(listStreamKeyserr){
                console.log("error"+listStreamKeyserr.errorcode);
                console.log("error"+listStreamKeyserr.message);
            }
            var ownstreamname= addrinfo[0].toString().substr(0,30)+'PA';
            multichain.listStreamKeys({
                stream:ownstreamname,
                verbose:true,
                count:keycount,
                start:-keycount
                },(ownstreampaerror,ownstreampainfo) =>{
                    if(ownstreampaerror){
                        console.log("error"+ownstreampaerror.errorcode);
                        console.log("error"+ownstreampaerror.message);
                    }
             var PermisssionRequestitems=getUniqueItem(listStreamKeysinfo);
             var OwnPermissionApprovals=getKeyOfStream(ownstreampainfo);
             var effectiveApprovals= PermisssionRequestitems.filter(function(element){
                 return OwnPermissionApprovals.indexOf(element) ===-1;
             });
             return callback(effectiveApprovals);
            
        })
    })
    }
    })
    }

    /**
 * GET the REQEUSTS WHICH ARE NEW AND PENDING ( LOGGED ONLY ONCE BY CHECKING ITEMS NO OF key: Transaction ID)
 * @param {*} listStreamKeys 
 */
function getUniqueItem(listStreamKeys){
    var uniqueitem=[];
    let j=0;
    if(listStreamKeys!=null && listStreamKeys!=undefined){
    for(let i=0;i<Object.keys(listStreamKeys).length;i++){
        if(listStreamKeys[i].first.data.hasOwnProperty('json')&&listStreamKeys[i].first.data.json.hasOwnProperty('comment')){
        if(listStreamKeys[i].items==1 && listStreamKeys[i].first.data.json.comment=='connect request'){
            uniqueitem[j]=listStreamKeys[i].key;
            j=++j;
        }
    }
    }
}
    return uniqueitem;

}

   /**
 * GET Only the Keys)
 * @param {*} listStreamKeys 
 */
function getKeyOfStream(listStreamKeys){
    var keysitem=[];
    let j=0;
    if(listStreamKeys!=null && listStreamKeys!=undefined){
    for(let i=0;i<Object.keys(listStreamKeys).length;i++){
        keysitem[j]=listStreamKeys[i].key;
            j=++j;
        }
    }
    return keysitem;

}


/**NOT USED
 * Get the Matched Items
 * @param {*} listStreamKeys 
 * @param {*} Permission 
 */
    function getEffectiveItem(listStreamKeys,Permission){
        var uniqueitem=[];
        let k=0;
        if(listStreamKeys!=null && listStreamKeys!=undefined){
        for(let i=0;i<Object.keys(listStreamKeys).length;i++){
            for(let j=0;j<Object.keys(Permission).length;j++){
                if(listStreamKeys[i]==Permission[j]){
                    uniqueitem[k]=listStreamKeys[i];
                    k=++k;
                    break;
                }
            }
            
        }
    }
        return uniqueitem;

    }
////////////////////////////////////////////////////////////////////////////////
/**
 * Timer Job for to approve other Permission Approvals by taking the pending transactions
 */
function autoApprovePermission(callback){
    var multichain = initiateMultichain();
    pendingPermissionApprovals(function(response){

        for(let i=0,p=Promise.resolve();i<Object.keys(response).length;i++){
            p = p.then(_=> new Promise(resolve =>{
                
          
        multichain.listStreamKeyItems({
            stream:permissionrequest,
            key:response[i]
        },function(err,res){
            if(err){
                console.log("error"+err.errorcode);
                console.log("error"+err.message);
            }
            if(Object.keys(res).length>0){
            if(res[0].data!=null && res[0].data!=undefined && res[0].data!=""){
            publishSign(res[0].keys[0],res[0].data.json.address,function(publishreponse){
            })
                logPermissionApproval(res[0].data.json.address,res[0].keys[0],function(logreponse){
                    
                })
           
        }
    }
        })
        resolve();
    }))
    }
    return callback("approvedjobcomplete");
    })
}

/////////////////////////////////////////////////////////
/**
 * Manual Job to Approve a particualr transaction based on its transaction id
 * @param {} transactionid 
 */
function approvePermission(transactionid,callback){
    var multichain = initiateMultichain();
    multichain.listStreamKeyItems({
        stream:permissionrequest,
        key:transactionid,
        count:keycount,
        start:-keycount
    },function(err,response){
        if(err){
            console.log("error"+err.errorcode);
            console.log("error"+err.message);
        }
        if(response.data!=null && response.data!=undefined && response.data!=""){
        publishSign(transactionid,response.data.json.address,function(publishreponse){
        })
            logPermissionApproval(response.data.json.address,transactionid,function(logreponse){
            })
       
    }
    })
    return callback("approvedjobcomplete");

}
    let odowalletmultichainexports={
        initiateMultichain:initiateMultichain,
        connect:connect,
        publishSign:publishSign,
        pendingPermissionApprovals:pendingPermissionApprovals,
        pollOutstandingTransaction:pollOutstandingTransaction,
        pollForPermissionApprovals:pollForPermissionApprovals,
        autoApprovePermission:autoApprovePermission,
        approvePermission:approvePermission,
        getOutstandingTransaction:getOutstandingTransaction,
        revokeConnectPermission:revokeConnectPermission,
        getPendingPermissionForApprovals:getPendingPermissionForApprovals
    }

    module.exports=odowalletmultichainexports;