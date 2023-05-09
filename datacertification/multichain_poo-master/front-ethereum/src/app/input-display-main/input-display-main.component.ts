import { Component, OnInit } from '@angular/core';
import {odometermodel} from '../model/odometermodel';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import { Router} from '@angular/router';


//Injection
import {DatatransmitterService} from '.././datatransmitter.service';

//import leaflet plugin
import '../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js'

declare let L;

@Component({
  selector: 'input-display-main',
  templateUrl: './input-display-main.component.html',
  styleUrls: ['./input-display-main.component.css']
})
export class InputDisplayMainComponent implements OnInit {

  routemodel:odometermodel = new odometermodel({
    VIN:"CYR45",
    start_latitude:"456",
    start_longitude:"987",
    destination_latitude:"123",
    destination_longitude:"654"
  });


  constructor(private http:HttpClient,private route:ActivatedRoute,private dataTransmitter: DatatransmitterService,private router: Router) { 
  }

  private subscriber: any;

  ngOnInit() {
    this.subscriber = this.route.params.subscribe(params =>{
        this.http.post('/api/v1/routes',this.dataTransmitter.dataToTransmit).subscribe((data:any)=>{
        this.routemodel = new odometermodel(data.routedetails);

        const map = L.map('map').setView([51.505, -0.09], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var allpoints =[];
        allpoints[0] = L.latLng(this.routemodel.startcoordinate[1],this.routemodel.startcoordinate[0]);
        var obj = this.routemodel.coordinates;
        var keys = Object.keys(obj);
        var waypointlength = keys.length;

        for( var i=0;i<waypointlength;i++){
          allpoints[i+1]= L.latLng(obj[i][1],obj[i][0]);
        }
        allpoints[waypointlength+1] = L.latLng(this.routemodel.destinationcoordinate[1],this.routemodel.destinationcoordinate[0]);
        L.Routing.control({
          waypoints: allpoints
      }).addTo(map);

      });
    });
  }

  onSubmit(){
  
        let path ='/trip';
        this.router.navigate([path]);      

    
  }
  }
