const haversine = require('haversine');

function getdistance(routestartcoordinate,routesdestinationcoordinate,waypoints,callback){

    var totalcoordinate=[];

    totalcoordinate[0]=[routestartcoordinate[0],routestartcoordinate[1]];
    //console.log(waypoints);
     var waypointlength=Object.keys(waypoints).length;
     //console.log(waypointlength);
    for(var i=0;i<Object.keys(waypoints).length;i++){
        totalcoordinate[i+1]=waypoints[i];
     }
     totalcoordinate[Object.keys(waypoints).length+1]=[routesdestinationcoordinate[0],routesdestinationcoordinate[1]];

     //console.log(totalcoordinate);
     
     var calculateddistance = 0;
    for(var j=0;j<Object.keys(totalcoordinate).length;j++){
        if((j!=Object.keys(totalcoordinate).length-1)){
        var start = {
         'latitude':totalcoordinate[j][1],
         'longitude':totalcoordinate[j][0]
        }
        var end ={
            'latitude':totalcoordinate[j+1][1],
            'longitude':totalcoordinate[j+1][0]
        }
        calculateddistance+=haversine(start, end, {unit: 'meter'});
           
    
    }
}
return callback(calculateddistance);
    }

    function getDeviationPercent(actualDistance,calculatedDistance,callback){
      var actualDistanceNumber = new Number(actualDistance);
      var calculatedDistanceNumber = Number(calculatedDistance);
      var deviation = actualDistanceNumber - calculatedDistanceNumber;
      var deviationpercent = (deviation/actualDistanceNumber)*100;
      return callback(deviationpercent);

    }

  


module.exports.getdistance=getdistance;
module.exports.getDeviationPercent=getDeviationPercent;

