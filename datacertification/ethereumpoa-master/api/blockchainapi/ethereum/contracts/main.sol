pragma solidity >= 0.4 .21 < 0.6 .0;
pragma experimental ABIEncoderV2;

// Contract to Handle the Permission Level Consensus
//66
contract transactionInterface {
    enum  TransactionTypeEnum {
        addParticipant,
        removeParticipant,
        addFollower,
        removeFollower,
        addLeader,
        removeLeader,
        changeParticipantConsensus,
        changeLeaderConsensus,
        changeFollowerConsensus,
        changeOverallConsensus,
        changeDeleteTransactionConsensus,
        deleteTransaction,
        deleteContract,
        tokenSupply,
        tokenTransfer,
        tokenRetract,
        changeTokenSupplyConsensus,
        changeTokenTransferConsensus,
        changeTokenRetractConsensus
    }


    function createTransaction(address From, address Receiver,TransactionTypeEnum transactionType, uint newConsensusValue, string memory transactionmetadata, uint balance) public returns(bool) {}

}

contract walletInterface {


    function isLeader(address addressToCheck) public view returns(bool) {}

    function isParticipant(address addressToCheck) public view returns(bool) {}

    function isFollower(address addressToCheck) public view returns(bool) {}

}

contract main {

    transactionInterface public transactionInterfaceInstance;

    walletInterface public walletInterfaceInstance;

    event TransactionEvent(address eventAddress, uint consensusvalue, string metadata, uint balance);


    constructor(address transactionContractaddress, address walletInterfaceaddress) public {
        transactionInterfaceInstance = transactionInterface(transactionContractaddress);
        walletInterfaceInstance = walletInterface(walletInterfaceaddress);
    }
    

    //***PUBLIC METHOD ***
    function destroyContract() public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, msg.sender, transactionInterface.TransactionTypeEnum.deleteContract,0, "DeleteContract", 0)) {
                return false;

            }
        }
        else{
            return false;
        }
    }

    //***PUBLIC METHOD ***
    function createParticipant(address PermissionedAdress, string memory metadata) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
        if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.addParticipant, 0, metadata, 0)) {
         return false;
        }
        else { 
            return true;
        }
         }
        else{
            return false;
        }
    }

     function getCaller() public view returns (address){
        return msg.sender;
    }
    


    //*PUBLIC FUNCTION */
    function removeParticipant(address PermissionedAdress) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.removeParticipant, 0, "removeparticipant", 0)) {
                return false;

            }
            else{
                return true;
            }
        }
        else{
            return false;
        }
    }

    //*PUBLIC FUNCTION */
    function addFollowerRole(address PermissionedAdress) public returns(bool) {
        if (walletInterfaceInstance.isParticipant(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.addFollower,0, "addfollower", 0)) {
                return false;

            }
        }
    }

    //*PUBLIC FUNCTION */
    function removeFollowerRole(address PermissionedAdress) public returns(bool) {
        if (walletInterfaceInstance.isFollower(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.removeFollower, 0, "removeFollower", 0)) {
                return false;

            }
        }
    }

    //*PUBLIC FUNCTION */
    function addLeaderRole(address PermissionedAdress) public returns(bool) {
        if (walletInterfaceInstance.isFollower(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.addLeader, 0, "addleader", 0)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function removeLeaderRole(address PermissionedAdress) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.removeLeader, 0, "removeLeader", 0)) {
                return false;

            }
        }
    }

    //*PUBLIC FUNCTION */
    function deleteTransactions(address PermissionedAdress) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.deleteTransaction, 0, "deleteTransaction", 0)) {
                return false;

            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeParticipantConsensus(uint newValue) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, msg.sender, transactionInterface.TransactionTypeEnum.changeParticipantConsensus, newValue, "changeparticipantconsensus", 0)) {
                return false;

            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeLeaderConsensus(uint newValue) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, msg.sender, transactionInterface.TransactionTypeEnum.changeLeaderConsensus,newValue, "changeleaderconsensus", 0)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeFollowerConsensus(address PermissionedAdress, uint newValue) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.changeFollowerConsensus, newValue, "changefollowerconsensus", 0)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeOverallConsensus(address PermissionedAdress, uint newValue) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.changeFollowerConsensus, newValue, "changeoverallconsensus", 0)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeDeleteTransactionConsensus(address PermissionedAdress, uint newValue) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.changeDeleteTransactionConsensus, newValue, "changeDeleteTransactionConsensus", 0)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function increaseTokenSupply(address PermissionedAdress, uint balance) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.tokenSupply, 0, "increaseTokenSupply", balance)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function tokenTransfer(uint balance) public returns(bool) {
        //conversion to units
        //uint convertedunit = balance / 100;
        uint convertedunit = balance;
        if (walletInterfaceInstance.isFollower(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, msg.sender, transactionInterface.TransactionTypeEnum.tokenTransfer, 0, "RequestToken", convertedunit)) {
                return false;
            }
        }
    }

     //*PUBLIC FUNCTION */
    function tokenTransferforOthers(address PermissionedAddress,uint balance) public returns(bool) {
        //conversion to units
        //uint convertedunit = balance / 100;
        uint convertedunit = balance;
        if (walletInterfaceInstance.isFollower(msg.sender) && walletInterfaceInstance.isFollower(PermissionedAddress)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAddress, transactionInterface.TransactionTypeEnum.tokenTransfer, 0, "RequestToken", convertedunit)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function tokenRetract(address PermissionedAdress, uint balance) public returns(bool) {
        //uint convertedunit = balance / 100;
        uint convertedunit = balance;
        if (walletInterfaceInstance.isLeader(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.tokenRetract, 0, "RetractToken", convertedunit)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeTokenSupplyConsensus(uint consensus) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, msg.sender, transactionInterface.TransactionTypeEnum.changeTokenSupplyConsensus, consensus,"changeTokenSupplyConsensus", 0)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeTokenTransferConsensus(uint consensus) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            if (!transactionInterfaceInstance.createTransaction(msg.sender, msg.sender, transactionInterface.TransactionTypeEnum.changeTokenTransferConsensus, consensus, "changeTokenTransferConsensus", 0)) {
                return false;
            }
        }
    }

    //*PUBLIC FUNCTION */
    function changeTokenRetractConsensus(address PermissionedAdress, uint consensus) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {

            if (!transactionInterfaceInstance.createTransaction(msg.sender, PermissionedAdress, transactionInterface.TransactionTypeEnum.changeTokenRetractConsensus, consensus, "changeTokenRetractConsensus", 0)) {
                return false;
            }
        }
    }

    //Fall back function
    function() external payable {

    }


}