import { Component, OnInit } from '@angular/core';
import { odometermodel } from '../model/odometermodel';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

//Injection
import { DatatransmitterService } from '.././datatransmitter.service';

@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.css']
})
export class TripDisplayComponent implements OnInit {

  routemodel: odometermodel = new odometermodel({
    VIN: "CYR45",
    start_latitude: "456",
    start_longitude: "987",
    destination_latitude: "123",
    destination_longitude: "654"
  });


  constructor(private http: HttpClient, private route: ActivatedRoute, private dataTransmitter: DatatransmitterService) {
  }

  private subscriber: any;

  ngOnInit() {
    this.subscriber = this.route.params.subscribe(params => {
      this.http.post('/api/v1/tripvalidation', this.dataTransmitter.dataToTransmit).subscribe((data: any) => {
        this.routemodel = new odometermodel(data.routedetails);
        console.log(this.routemodel);

      });
    });
  }


  onSubmit() {
    this.subscriber = this.route.params.subscribe(params => {
      this.http.post('/api/v1/tripvalidation', this.dataTransmitter.dataToTransmit).subscribe((data: any) => {
        this.http.post('/api/v1/ethereum/ValidateandProcess', data).subscribe((response: any) => {
          console.log(response);

        });
      });
    })
  }
}
