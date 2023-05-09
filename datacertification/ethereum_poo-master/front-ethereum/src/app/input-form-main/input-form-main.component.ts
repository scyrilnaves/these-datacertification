import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { Router} from '@angular/router';

import {DatatransmitterService} from '.././datatransmitter.service';

@Component({
  selector: 'input-form-main',
  templateUrl: './input-form-main.component.html',
  styleUrls: ['./input-form-main.component.css']
})
export class InputFormMainComponent implements OnInit {
  registered = false;
  submitted = false;
  userForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient , private router: Router, private datatransmitter:DatatransmitterService ) {

   }

  invalidVIN(){
  return (this.submitted && this.userForm.controls['VIN'].errors !=null);

  }
  invalidstartplace(){
    return( this.submitted && this.userForm.controls['start_place'].errors!=null);
  }
  
  invaliddestinationplace(){
    return ( this.submitted && this.userForm.controls['destination_place'].errors!=null)  ;
  }
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      VIN:['',[Validators.required,Validators.maxLength(50)]],
      start_place:['',[Validators.required,Validators.maxLength(50)]],
      destination_place:['',[Validators.required,Validators.maxLength(50)]],
    })
  }

  onSubmit(){
    this.submitted = true;
    if(this.userForm.invalid==true){
      return;
    }
    else{
      let data: any = Object.assign(this.userForm.value);
      this.datatransmitter.dataToTransmit = data;
        let path ='/route';
        this.router.navigate([path]);      
      this.registered=true;

    }
  }



};
