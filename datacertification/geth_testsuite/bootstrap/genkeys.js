const Web3 = require("web3")
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'account.csv',
  header: [
    {id: 'PublicKey', title: 'PublicKey'},
    {id: 'PrivateKey', title: 'PrivateKey'},
  ]
});

var Accounts = require('web3-eth-accounts');

const web3 = new Web3("http://ethereum-http.unice.cust.tasfrance.com")

var cars_nos=3000

var caraccount_array=[]

// Create Cars Account
for (let i=0;i<cars_nos;i++){
    var account = web3.eth.accounts.create();
    var data = {PublicKey:account.address, PrivateKey:account.privateKey }
    caraccount_array[i]=data;

}
csvWriter.writeRecords(caraccount_array).then(()=> console.log('The CSV file was written successfully'));
console.log(caraccount_array);
console.log("finished");


