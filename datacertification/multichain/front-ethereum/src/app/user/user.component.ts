import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

class User {
  constructor(
    public Method: string = '',
    public Id: number,
    public Purpose: string = '',
    public Input1: string = '',
    public Input2: string = '',
    public Response: string = ""
  ) { }
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

   // It maintains list of Registrations

   users: User[] = [];

   // It maintains registration Model
 
   userModel: User;
 
   // It maintains registration form display status. By default it will be false.
 
   showNew: Boolean = false;
 
   // It will be either 'Save' or 'Update' based on operation.
 
   submitType: string = 'Save';
 
   // It maintains table row index based on selection.
 
   selectedRow: number;

   private subscriber: any;


  constructor(private http: HttpClient, private route: ActivatedRoute) { 
    this.users.push(new User('userAssetTransfer', 1, 'Security', 'balance', 'NA', 'Response'));

  }

  ngOnInit() {
  }

  onInvoke(index: number, input1: string, input2: string) {

    // Assign selected table row index.

    this.selectedRow = index-1;

    var result = this.callAPI(index, input1, input2);

  }

  /**
   * Invoke the Rest API for Ethereum Admin Service
   * @param index 
   * @param input1 
   * @param input2 
   */
  callAPI(index, input1, input2): any {

    if (index == 1) {
      var dataform: any =
      {
        "balance": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/userAssetTransfer', dataform).subscribe((data: any) => {
          this.users[this.selectedRow].Response = data.response;
          return data;

        });
      });

    }

}
}