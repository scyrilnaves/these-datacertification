const odometermodel = require("../../models/odometerlocationmodel");

let validator = require('fastest-validator');

let routevalidator = new validator();

const request = require('request');

//http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.428555,52.523219?overview=false&steps=true

//http://10.214.222.244:5000/route/v1/driving/13.388860,52.517037;13.428555,52.523219?overview=false&steps=true

//var baserequest = 'http://router.project-osrm.org/route/v1/driving/';

//var params = '?overview=false&steps=true';

var baserequest = 'http://10.214.222.244:5000/route/v1/driving/';

var params = '?overview=false&steps=true';


function getrouteresponse(start_longitude,start_latitude,destination_longitude,destination_latitude,callback) {
    var routerequest = baserequest+start_longitude+','+start_latitude+';'+destination_longitude+','+destination_latitude+params;
    request(routerequest, { json: true }, (err, res, body) => {
        if (err) {
            throw new Error('unable to retrieve Routepoints co-ordinates');

        } else if (res) {

            if (Object.keys(body.routes).length == 0) {
                throw new Error('Invalid Route');
            }
            else {
                console.log(body);
                return callback(body);
            }
        }

    })
}

function getroutepointslocation(start_longitude,start_latitude,destination_longitude,destination_latitude,callback){
    var routerequest=baserequest+start_longitude+','+start_latitude+';'+destination_longitude+','+destination_latitude+params;
    console.log(routerequest);
    var routepointsarray=[];
    request(routerequest,{json:true},(err,res,body) =>{
        if(err){
            throw new Error('unable to retrieve Routepoints co-ordinates');

        }else if(res){
            console.log(body);
            if(Object.keys(body.routes).length==0){
                throw new Error('Invalid Route');
            }
            else{
            var steplength= Object.keys(body.routes[0].legs[0].steps).length;
            var steparray= body.routes[0].legs[0].steps;
            for(var i=0;i<steplength;i++){
                routepointsarray[i]=steparray[i].maneuver.location;
            } 

            //To use Waypoints:
           /*  var waypointlength = body.waypoints.length;
            var waypointarray = body.waypoints;
            for(var i=0;i<waypointlength;i++){
                routepointsarray[i]=waypointarray[i].location;
            }
            console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
            console.log(routerequest); */

            return callback(routepointsarray);
        }
        }

    })
}


function getroutepoints(bodyresponse, callback) {
    var routepointsarray = [];
    //console.log(bodyresponse);
    var steplength = Object.keys(bodyresponse.routes[0].legs[0].steps).length;
    var steparray = bodyresponse.routes[0].legs[0].steps;
    for (var i = 0; i < steplength; i++) {
        routepointsarray[i] = steparray[i].maneuver.location;
    }

    //To use Waypoints:
    /*  var waypointlength = body.waypoints.length;
     var waypointarray = body.waypoints;
     for(var i=0;i<waypointlength;i++){
         routepointsarray[i]=waypointarray[i].location;
     }
     console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
     console.log(routerequest); */
    console.log("LL"+routepointsarray)
    return callback(routepointsarray);
}





function getDistance(bodyresponse, callback) {
    var distance = bodyresponse.routes[0].distance;
    return callback(distance);
    //console.log(legs.legs[0].steps[0].maneuver.location);
}

function getDuration(bodyresponse, callback) {
    var duration = bodyresponse.routes[0].duration;
    return callback(duration);

}


function getGecoding(query, callback) {
    var coordinates = [];
    request(query, { json: true }, (err, res, body) => {
        if (err) {
            console.log(err);
            throw new Error('unable to retrieve geocoding co-ordinates');
        }
        else if (res) {
            coordinates[0] = body[0].lon;
            coordinates[1] = body[0].lat;
            return callback(coordinates);
        }
    });
}

module.exports.getroutepointslocation = getroutepointslocation;
module.exports.getrouteresponse = getrouteresponse;
module.exports.getDuration = getDuration;
module.exports.getDistance = getDistance;
module.exports.getroutepoints = getroutepoints;
module.exports.getGecoding = getGecoding;
