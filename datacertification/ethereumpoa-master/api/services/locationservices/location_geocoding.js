const odometermodel =require("../../models/odometerlocationmodel");
let validator = require('fastest-validator');

let locationvalidator = new validator();

const request = require('request');

const routepoint = require("../locationservices/routepoints");

//https://search.osmnames.org/q/nice.js?key=dgb7TgC5zR0YpsAqbEgb&format=json&limit=1


const locationSchema ={
    VIN :{type:"string", min:3},
    start_place: {type:"string" , min:3},
    destination_place: {type:"string" , min:3}
};


class geocodingservice
{
 static search(data,callback)
 {
     var validationResult = locationvalidator.validate(data,locationSchema);

     //var base_request= 'https://search.osmnames.org/q/';
     //var params='.js?key=dgb7TgC5zR0YpsAqbEgb';
     var base_request= 'https://nominatim.openstreetmap.org/search?email=26cyril@gmail.com&city=';
     var params='&format=json&countrycodes=fr';


     var start_query = base_request+ data.start_place+params;
     var destination_query = base_request+ data.destination_place+params;

     if(!validationResult){
        console.log('error');
        throw new Error('unable to retrieve co-ordinates due to validation error'+data);
     }
    

     routepoint.getGecoding(start_query,function(start_coordinates){
      routepoint.getGecoding(destination_query,function(destination_coordinates){
        routepoint.getroutepointslocation(start_coordinates[0],start_coordinates[1],destination_coordinates[0],destination_coordinates[1],function(routepointresult){
                    let locationroutemodel = new odometermodel(data.VIN,data.start_place, data.destination_place,start_coordinates,destination_coordinates,routepointresult,0,0,0,0,false);
                    console.log("LOCATIONROUTE"+JSON.stringify(locationroutemodel));
                    return callback(locationroutemodel);
                });
            });
        });
     
 }


}
module.exports = geocodingservice;
