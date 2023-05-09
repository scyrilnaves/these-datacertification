import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

class Common {
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
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.css']
})
export class CommonComponent implements OnInit {

  // It maintains list of Registrations

  commons: Common[] = [];

  // It maintains registration Model

  commonModel: Common;

  // It maintains registration form display status. By default it will be false.

  showNew: Boolean = false;

  // It will be either 'Save' or 'Update' based on operation.

  submitType: string = 'Save';

  // It maintains table row index based on selection.

  selectedRow: number;

  private subscriber: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    // Method , Id, Purpose, Input1, Input 2, Response
    this.commons.push(new Common('isLeader', 1, 'Info', 'checkleaderaddress', 'NA', 'Response'));

    this.commons.push(new Common('isParticipant', 2, 'Info', 'checkparticipantaddr', 'NA', 'Response'));

    this.commons.push(new Common('isFollower', 3, 'Info', 'checkfolloweraddr', 'NA', 'Response'));

    this.commons.push(new Common('getLeaders', 4, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getNoofLeaders', 5, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getFollowers', 6, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getParticipants', 7, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getParticipantDetails', 8, 'Info', 'participantaddr', 'NA', 'Response'));

    this.commons.push(new Common('getAssetBalance', 9, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getPeers', 10, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getNodeInfo', 11, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getHashRate', 12, 'Info Task', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getGasPrice', 13, 'Info Task', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getCurrentBlockNo', 14, 'Info Task', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getEthereumTransactionDetailsById', 15, 'Info Task', 'togettransactionid', 'NA', 'Response'));

    this.commons.push(new Common('getPendingTransactions', 16, 'Info Task', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getTransactionReceiptById', 17, 'Info Task', 'togetreceipttranid', 'NA', 'Response'));

    this.commons.push(new Common('getTxPoolContent', 18, 'Info Task', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getInspectionoftxPool', 19, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getTxPoolNo', 20, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('getMemStats', 21, 'Info', 'NA', 'NA', 'Response'));
    this.commons.push(new Common('getFinalisedEvents', 22, 'Info', 'NA', 'NA', 'Response'));

    this.commons.push(new Common('printtestlog', 23, 'Info', 'NA', 'NA', 'Response'));
    this.commons.push(new Common('GetMyAddress', 24, 'Info', 'NA', 'NA', 'Response'));
    this.commons.push(new Common('GetOthersAssetBalance', 25, 'Info', 'otherassetaddress', 'NA', 'Response'));
    this.commons.push(new Common('GetPeerCount', 26, 'Info', 'NA', 'NA', 'Response'));



  }

  ngOnInit() {
  }

  // This method associate to Edit Button.

  onInvoke(index: number, input1: string, input2: string) {

    // Assign selected table row index.

    this.selectedRow = index-1;

    var result = this.callAPI(index, input1, input2);

    this.commons[this.selectedRow].Response = result;

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
        "permissionedAddress": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/isLeader', dataform).subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });

    }
    else if (index == 2) {
      var dataform: any =
      {
        "permissionedAddress": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/isParticipant', dataform).subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 3) {
      var dataform: any =
      {
        "permissionedAddress": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/isFollower', dataform).subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 4) {
    
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getLeaders').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 5) {
    
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getNoofLeaders').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }

    else if (index == 6) {
    
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getFollowers').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 7) {
    
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getParticipants').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 8) {
      var dataform: any =
      {
        "permissionedAddress": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/getParticipantDetails',dataform).subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 9) {
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getAssetBalance').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 10) {
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getPeers').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 11) {
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getNodeInfo').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 12) {
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getHashRate').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 13) {
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getGasPrice').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 14) {
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getCurrentBlockNo').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 15) {
      var dataform: any =
      {
        "transactionid": input1,

      };
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/getEthereumTransactionDetails',dataform).subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 16) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getPendingTransactions').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 17) {
      var dataform: any =
      {
        "transactionid": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/getTransactionReceipt',dataform).subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 18) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getTxPoolContent').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 19) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getInspectionoftxPool').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 20) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getTxPoolNo').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 21) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getMemStats').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 22) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getFinalisedEvents').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 23) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/printtestlogcsv').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 24) {
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getmyaddress').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 25) {
      var dataform: any =
      {
        "permissionedAddress": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/getOtherAssetBalance',dataform).subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
    else if (index == 26) {
 
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getPeerCount').subscribe((data: any) => {
          this.commons[this.selectedRow].Response =data.response;
          return data;

        });
      });
    }
  }
}
