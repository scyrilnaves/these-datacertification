import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


class Admin {
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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  // It maintains list of Registrations

  admins: Admin[] = [];

  // It maintains registration Model

  adminModel: Admin;

  // It maintains registration form display status. By default it will be false.

  showNew: Boolean = false;

  // It will be either 'Save' or 'Update' based on operation.

  submitType: string = 'Save';

  // It maintains table row index based on selection.

  selectedRow: number;

  private subscriber: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    // Method , Id, Purpose, Input1, Input 2, Response
    this.admins.push(new Admin('SetMainContractAdress', 1, 'Security', 'maincontractaddress', 'NA', 'Response'));

    this.admins.push(new Admin('SetTransactionContractAdress', 2, 'Security', 'transactioncontractaddress', 'NA', 'Response'));

    this.admins.push(new Admin('DestroyContract', 3, 'Destroy', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('AddParticipant', 4, 'AdminTask', 'participantaddress', 'participantmetadata', 'Response'));

    this.admins.push(new Admin('RemoveParticipant', 5, 'AdminTask', 'toremoveparticipantaddress', 'NA', 'Response'));

    this.admins.push(new Admin('AddFollower', 6, 'AdminTask', 'followeraddress', 'NA', 'Response'));

    this.admins.push(new Admin('RemoveFollower', 7, 'AdminTask', 'toremovefolloweraddress', 'NA', 'Response'));

    this.admins.push(new Admin('AddAdmin', 8, 'AdminTask', 'adminaddress', 'NA', 'Response'));

    this.admins.push(new Admin('RemoveAdmin', 9, 'AdminTask', 'toremoveadminaddress', 'NA', 'Response'));

    this.admins.push(new Admin('Cancel Transaction for Address', 10, 'Asset Task', 'canceltransactionaddr', 'NA', 'Response'));

    this.admins.push(new Admin('Change Participant Approval Consensus', 11, 'Consensus Task', 'newparticipantconsensus', 'NA', 'Response'));

    this.admins.push(new Admin('Change Follower Approval Consensus', 12, 'Consensus Task', 'newfollowerconsensus', 'NA', 'Response'));

    this.admins.push(new Admin('Change Overall Approval Consensus', 13, 'Consensus Task', 'newoverallconsensus', 'NA', 'Response'));

    this.admins.push(new Admin('Change Delete Transaction Consensus', 14, 'Consensus Task', 'newdeletetrasnactionconsesus', 'NA', 'Response'));

    this.admins.push(new Admin('Increase Asset Supply ', 15, 'Asset Task', 'assetreceivingaddress', 'assetstockvalue', 'Response'));

    this.admins.push(new Admin('Asset Transfer', 16, 'Asset Task', 'assettransfervalue', 'NA', 'Response'));

    this.admins.push(new Admin('Asset Retract', 17, 'Asset Admin', 'assetretractaddress', 'assetretractvalue', 'Response'));

    this.admins.push(new Admin('Change Token Supply Consensus', 18, 'Asset Admin', 'newtokensupplyconsensus', 'NA', 'Response'));

    this.admins.push(new Admin('Change Token Transfer Consensus', 19, 'Asset Admin', 'newtokentransferconsensus', 'NA', 'Response'));

    this.admins.push(new Admin('Change Token Retract Consensus', 20, 'Asset Admin', 'newtokenretractconsensus', 'NA', 'Response'));

    this.admins.push(new Admin('Approve Transaction by Id', 21, 'Asset Admin', 'approvetransaactionid', 'NA', 'Response'));

    this.admins.push(new Admin('Approve Transaction by address', 22, 'Asset Admin', 'approvetransactionaddr', 'NA', 'Response'));

    this.admins.push(new Admin('Approve Pending Transactions', 23, 'Asset Admin', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Disapprove Transaction by Id', 24, 'Asset Admin', 'disapprovetransactionid', 'NA', 'Response'));

    this.admins.push(new Admin('Disapprove Transaction by Address', 25, 'Asset Admin', 'disapprovetransactionaddr', 'NA', 'Response'));

    this.admins.push(new Admin('Get Pending Transactions', 26, 'Transaction Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Get Transaction for Address', 27, 'Transaction Info', 'transactionaddress', 'NA', 'Response'));

    this.admins.push(new Admin('Get Participant Role Consensus', 28, 'Consensus Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Get Follower Role Consensus', 29, 'Consensus Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Get Leader Role Consensus', 30, 'Consensus Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Get Overall Consensus', 31, 'Consensus Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Get Delete Transaction Consensus', 32, 'Consensus Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Get Transaction Detail by addr', 33, 'Transaction Info', 'transactiondetailofaddr', 'NA', 'Response'));

    this.admins.push(new Admin('Main Contract Address in Transaction', 34, 'Transaction Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Main Contract Address in Wallet', 35, 'Transaction Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Transaction Contract Address in Wallet ', 36, 'Transaction Info', 'NA', 'NA', 'Response'));

    this.admins.push(new Admin('Transfer Asset Request for Other Node ', 37, 'Transaction Info', 'AssetBalanceforOther', 'OtherAssetAddress', 'Response'));

    // User Task


  }

  ngOnInit() {
  }



  // This method associate to Edit Button.

  onInvoke(index: number, input1: string, input2: string) {

    // Assign selected table row index.

    this.selectedRow = index - 1;

    var result;
    this.callAPI(index, input1, input2);
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
        "maincontractaddress": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/setMainContract', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });

    }
    else if (index == 2) {
      var dataform: any =
      {
        "transactioncontractaddres": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/setTransactionContract', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 3) {
      var dataform: any =
      {
        "transactioncontractaddres": input1,

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/destroyContract').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 4) {
      var dataform: any =
      {
        "permissionedAddress": input1,
        "metadata": input2

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/createParticipant', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 5) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/removeParticipant', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }

    else if (index == 6) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/addFollower', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 7) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/removeFollower', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 8) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/addLeader', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 9) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/removeLeader', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 10) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/deleteTransaction', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 11) {
      var dataform: any =
      {
        "value": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/changeParticipantConsensus', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 12) {
      var dataform: any =
      {
        "value": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/changeFollowerConsensus', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 13) {
      var dataform: any =
      {
        "value": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/changeOverallConsensus', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 14) {
      var dataform: any =
      {
        "value": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/changeDeleteTransactionConsensus', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 15) {
      var dataform: any =
      {
        "permissionedAddress": input1,
        "balance": input2

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/increaseTokenSupply', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 16) {
      var dataform: any =
      {
        "balance": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/assetTransfer', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 17) {
      var dataform: any =
      {
        "permissionedAddress": input1,
        "balance": input2

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/assetRetract', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 18) {
      var dataform: any =
      {
        "value": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/changeTokenSupplyConsensus', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 19) {
      var dataform: any =
      {
        "value": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/changeTokenTransferConsensus', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 20) {
      var dataform: any =
      {
        "value": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/changeTokenRetractConsensus', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 21) {
      var dataform: any =
      {
        "transactionid": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/addSignatureByTransactionId', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 22) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/addSignatureByPermissionedAddress', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 23) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/jobAddSignaturetoPendingTransactions').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 24) {
      var dataform: any =
      {
        "transactionid": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/removeSignatureByTransactionId', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 25) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/removeSignatureByPermissionedAddress', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 26) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getPendingTransactionsinNetwork').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 27) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/getTransactionId', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 28) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getParticipantRoleConsensus').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 29) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getFollowerRoleConsensus').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 30) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getLeaderRoleConsensus').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 31) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getOverallConsensus').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 32) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getDeleteTransactionConsensus').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 33) {
      var dataform: any =
      {
        "permissionedAddress": input1

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/getTransactionDetails', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 34) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getMainContractinTransaction').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 35) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getMainContractinWallet').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 36) {

      this.subscriber = this.route.params.subscribe(params => {
        this.http.get('/api/v1/ethereum/getTransactionContractinWallet').subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
    else if (index == 37) {
      var dataform: any =
      {
        "balance": input1,
        "permissionedAddress": input2

      };
      this.subscriber = this.route.params.subscribe(params => {
        this.http.post('/api/v1/ethereum/assetTransferForOthers', dataform).subscribe((data: any) => {
          this.admins[this.selectedRow].Response = data.response;
          return data;

        });
      });
    }
  }



}
