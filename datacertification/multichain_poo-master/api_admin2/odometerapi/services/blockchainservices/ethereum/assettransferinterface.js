require('dotenv').config();
var userservice = require("../ethereum/userservice");

var validateandprocesstimer=process.env.test_timer_user_ether_assettransfer_validateandprocess;

//////////////////Timer Details:
//Timer Interval //3600000 milliseconds = 60 minutes

//For Test we Keep 2 minutes
//180000

setInterval(ValidateandProcessDataforTest, validateandprocesstimer);

/**
 * Validation Check and Request for Asset Transfer
 * @param {*} data 
 */
function ValidateandProcessData(data){

    if(data.routedetails.valid ==true){
        var distance = Math.floor(data.routedetails.distance /1000);
        var dataformed={
            "balance":distance
        }
        userservice.tokenTransfer(dataformed,function(response){
            console.log(response);
        });
    }
}

/**
 * Validation Check and Request for Asset Transfer
 * @param {*} data 
 */
function ValidateandProcessDataforTest(){

    var data={
        "valid":true,
        "inputQty":120
    }

    if(data.valid ==true){
        var dataformed={
            "balance":data.inputQty
        }
        userservice.tokenTransfer(dataformed,function(response){
            console.log(response);
        });
    }
}


let assetinterfaceexports={
    ValidateandProcessData:ValidateandProcessData

    }

module.exports=assetinterfaceexports;