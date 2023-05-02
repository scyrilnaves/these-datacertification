pragma solidity >= 0.4 .21 < 0.6 .0;
pragma experimental ABIEncoderV2;

contract main {

    uint public maintxsetcounter = 0;
    
    uint public secondtxsetcounter = 0;
    
    uint public thirdtxsetcounter = 0;

    

 
     //***PUBLIC METHOD ***
    function createTest(uint metadata) public returns(uint) {
        maintxsetcounter = maintxsetcounter+1;
        secondtxsetcounter = secondtxsetcounter+1;
        thirdtxsetcounter = thirdtxsetcounter+1;
        return maintxsetcounter;
    }
    
         //***PUBLIC METHOD ***
    function readtest() public view returns(uint) {
        return maintxsetcounter;
    }
    
 



}

