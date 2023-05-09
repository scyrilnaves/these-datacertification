import { AsyncSubject } from 'rxjs';

export class odometermodel
{
    vin:string;
    start_place:string;
    destination_place:string;
    startcoordinate:Object;
    destinationcoordinate:Object;
    coordinates:Object;
    distance:number;
    duration:number;
    calculateddistance:number;
    deviation:number;
    valid:boolean

    constructor(obj: any = null){
        console.log(obj.routedetails);
        if(obj!=null){
            Object.assign(this,obj);
        }
    }
}