class odometerlocationmodel{
    constructor(vin,start_place,destination_place,startcoordinate,destinationcoordinate,coordinates,distance,duration,calculateddistance,deviation,valid){
        this.vin =vin,
        this.start_place=start_place,
        this.destination_place=destination_place,
        this.startcoordinate=startcoordinate,
        this.destinationcoordinate=destinationcoordinate,
        this.coordinates=coordinates,
        this.distance=distance;
        this.duration=duration;
        this.calculateddistance=calculateddistance;
        this.deviation=deviation;
        this.valid=valid
    }
}
module.exports = odometerlocationmodel