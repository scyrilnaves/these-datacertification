pragma solidity >= 0.4 .21 < 0.6 .0;
pragma experimental ABIEncoderV2;

// Contract to Handle the Permission Level Consensus
//66
contract wallet {

    // Enum for different transactions
    enum TransactionTypeEnum {
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

    //Enum for Different Roles
    enum RoleEnum {
        Participant,
        Follower,
        Leader
    }

    //Participant Data Structure
    struct Participant {
        address Account;
        bool isLeader;
        bool isFollower;
        string metaData;
        uint balance;
    }



    struct Account {
        uint modified;
        address lastsignature;
        TransactionTypeEnum typeOfTransaction;
        uint balance;
    }
    //Array to maintain the list of Participants
    address[] public participantsArray;

    //Array to maintain the list of Followers
    address[] public FollowersArray;

    //Array to maintain the list of Leaders
    address[] public LeadersArray;

    //Array to maintain the list of Address which are in Permission Transaction
    address[] public TransactionArray;

    //Mapping to store the Permission and Roles of users of the Contract
    mapping(address => Participant) public participants;

    //Mapping of balance
    mapping(address => Account) public balanceMapping;
    
    address public maincontractaddress;
    
    uint16 maincontractsetcounter;
    
    address public transactioncontractaddress;
    
    uint16 transactioncontractsetcounter;

    //Permission check for a leader CALL
    function isLeader(address addressToCheck) public view returns(bool) {

        Participant memory participantInstance = participants[addressToCheck];
        return participantInstance.isLeader;

    }
    
    //To set the deployed Contract address of Main SEND
     function setMainContractAddress(address mainContractAddress) public  returns (bool){
        if(maincontractsetcounter==0){
        maincontractaddress = mainContractAddress;
        maincontractsetcounter = ++maincontractsetcounter;
        return true;
        } else{
            return false;
        }
    }

    function getMainContractAddress() public view returns (address){
      return maincontractaddress;
    }

    // To set the deployed contract address of Transaction SEND
     function setTransactionContractAddress(address transactionContractAddress) public returns (bool){
        if(transactioncontractsetcounter==0){
        transactioncontractaddress = transactionContractAddress;
        transactioncontractsetcounter= ++transactioncontractsetcounter;
        return true;
        } else{
            return false;
        }
    }

    //To get the deployed transaction contract address
    function getTransactionContractAddress() public view returns (address){
      return transactioncontractaddress;
    }


    //Permission check for a participant CALL
    function isParticipant(address addressToCheck) public view returns(bool) {
        return (participants[addressToCheck].Account != address(0));
    }

    //Permission check for a follower CALL
    function isFollower(address addressToCheck) public view returns(bool) {
        return (participants[addressToCheck].isFollower);
    }

    //Permission check for a leader
    modifier isLeader_(address addressToCheck) {

        Participant memory participantInstance = participants[addressToCheck];
        require(participantInstance.isLeader == true, "Only for Leader Roles");
        _;
    }

    //Permission check for a participant
    modifier isParticipant_(address addressToCheck) {
        require(participants[addressToCheck].Account != address(0), "Only for Participants");
        _;
    }

    //Permission check for a follower
    modifier isFollower_(address addressToCheck) {
        require(participants[addressToCheck].isFollower, "Only for Followers");
        _;
    }

    event TransactionEvent(address eventAddress, TransactionTypeEnum transactiontype, uint consensusvalue, string metadata, uint balance);

    // Removing the Participant Element from the Array ***PUBLIC METHOD *** SEND
    function deleteParticipant(address PermissionedAdress) public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        uint position;
        // Find the index of the address
        for (uint i = 0; i < participantsArray.length; i++) {
            if (participantsArray[i] == PermissionedAdress) {
                position = i;
            }
        }
        if (position == participantsArray.length - 1) {
            delete participantsArray[participantsArray.length - 1];
            participantsArray.length--;
        }
        //move the position from the last element to the position of the element to be deleted
        else {
            participantsArray[position] = participantsArray[participantsArray.length - 1];
            delete participantsArray[participantsArray.length - 1];
            participantsArray.length--;
        }
        return true;
        }
        else{
            return false;
        }
    }

     function getCaller() public view returns (address){
        return msg.sender;
    }

    // Removing the Follower Element from the Array ***PUBLIC METHOD *** SEND
    function deleteFollower(address PermissionedAdress) public returns(bool) {
        uint position;
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        for (uint i = 0; i < FollowersArray.length; i++) {
            if (FollowersArray[i] == PermissionedAdress) {
                position = i;
            }
        }
        if (position == FollowersArray.length - 1) {
            delete FollowersArray[FollowersArray.length - 1];
            FollowersArray.length--;
        }
        //move the position from the last element to the position of the element to be deleted
        else {
            FollowersArray[position] = FollowersArray[FollowersArray.length - 1];
            delete FollowersArray[FollowersArray.length - 1];
            FollowersArray.length--;
        }
        return true;
        }
         else{
             return false;
         }
    }

    //Remove the Leader Role by removing the element from the leaders Array
    function deleteLeader(address PermissionedAdress) public returns(bool) {
        uint position;
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        for (uint i = 0; i < LeadersArray.length; i++) {
            if (LeadersArray[i] == PermissionedAdress) {
                position = i;
            }
        }
        if (position == LeadersArray.length - 1) {
            delete LeadersArray[LeadersArray.length - 1];
            LeadersArray.length--;
        }
        //move the position from the last element to the position of the element to be deleted
        else {
            LeadersArray[position] = LeadersArray[LeadersArray.length - 1];
            delete LeadersArray[LeadersArray.length - 1];
            LeadersArray.length--;
        }
        return true;
        }else{
            return false;
        }
    }


    function finaliseCreateParticipant(string memory metadata, address PermissionedAdress) public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant memory participant;
        participant.Account = PermissionedAdress;
        participant.isLeader = false;
        participant.isFollower = false;
        participant.balance = 0;
        participant.metaData = metadata;
        participants[PermissionedAdress] = participant;
        participantsArray.push(PermissionedAdress);
        return true;
        }else{
            return false;
        }
    }



    function finaliseRemoveParticipant(address PermissionedAdress) public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        delete participants[PermissionedAdress];
        deleteParticipant(PermissionedAdress);
        return true;
        }else{
            return false;
        }

    }

    function finaliseAddFollowerRole(address PermissionedAddress) public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant storage participant = participants[PermissionedAddress];
        participant.isFollower = true;
        FollowersArray.push(PermissionedAddress);

        return true;
        }else{
            return false;
        }
    }



    function finaliseRemoveFollowerRole(address PermissionedAddress)  public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant storage participant = participants[PermissionedAddress];
        participant.isFollower = false;
        deleteFollower(PermissionedAddress);

        return true;
        }else{
            return false;
        }
    }

    function finaliseAddLeaderRole(address PermissionedAdress)public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant storage participant = participants[PermissionedAdress];
        participant.isLeader = true;
        LeadersArray.push(PermissionedAdress);
        return true;
        }else{
            return false;
        }
    }

    function finaliseRemoveLeaderRole(address PermissionedAddress) public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant storage participant = participants[PermissionedAddress];
        participant.isLeader = false;
        deleteLeader(PermissionedAddress);
        return true;
        }else{
            return false;
        }
    }

    function finaliseTokenSupply(uint balance, address PermissionedAdress)public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant storage participant = participants[PermissionedAdress];
        if (participant.isLeader == true) {
            uint projectedBalance = participant.balance + balance;
            if (projectedBalance > participant.balance) {
                participant.balance = projectedBalance;
            }
            return true;
        }
        }else{
            return false;
        }
    }

    function finaliseTokenTransfer(uint balance, address PermissionedAdress)public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant storage participant = participants[PermissionedAdress];
        if (participant.isFollower == true) {
            uint projectedBalance = participant.balance + balance;
            if (projectedBalance > participant.balance) {
                participant.balance = projectedBalance;
                delete balanceMapping[PermissionedAdress];
                Account memory account;
                account.modified = now;
                account.lastsignature = PermissionedAdress;
                account.typeOfTransaction = TransactionTypeEnum.tokenTransfer;
                account.balance = projectedBalance;
                balanceMapping[PermissionedAdress] = account;
                return true;
            }
        }
        }else{
            return false;
        }
    }

    function finaliseTokenRetract(uint balance, address PermissionedAdress)public returns(bool) {
        //Check for security call
        if(msg.sender == transactioncontractaddress){
        Participant storage participant = participants[PermissionedAdress];
        if (participant.isFollower == true) {
            uint projectedBalance = participant.balance - balance;
            if (projectedBalance < participant.balance) {
                participant.balance = projectedBalance;
            }
            return true;
        }
        }else{
            return false;
        }

    }


    //*PUBLIC FUNCTION */
    function getLeaders() public view returns(address[] memory) {
        return LeadersArray;

    }

    function getLeaderslength() public view returns(uint) {
        return LeadersArray.length;

    }

    //*PUBLIC FUNCTION */
    function getFollowers() public view returns(address[] memory) {
        return FollowersArray;
    }

    //*PUBLIC FUNCTION */
    function getParticipants() public view returns(address[] memory) {
        return participantsArray;
    }




    //*PUBLIC FUNCTION */
    function getParticipantDetails(address PermissionedAdress) public view returns(Participant memory) {
        Participant memory participant = participants[PermissionedAdress];
        return participant;
    }

    //*PUBLIC FUNCTION */

    //constructor
    constructor(address[] memory leaders) public {
        for (uint i = 0; i < leaders.length; i++) {
            Participant memory participant;
            participant.Account = leaders[i];
            participant.isLeader = true;
            participant.isFollower = true;
            participant.metaData = "metadata";
            participant.balance = 300;
            participants[leaders[i]] = participant;
            participantsArray.push(leaders[i]);
            FollowersArray.push(leaders[i]);
            LeadersArray.push(leaders[i]);
        }

    }
    //Fall back function
    function() external payable {

    }

    //*PUBLIC FUNCTION */
    function getBalanceOfOthers(address PermissionedAdress) public view returns(uint) {
        Participant memory participant = participants[PermissionedAdress];
        //return participant.balance*100;
        return participant.balance;
    }

  //*PUBLIC FUNCTION */
    function getBalance() public view returns(uint) {
        address PermissionedAdress= msg.sender;
        Participant memory participant = participants[PermissionedAdress];
        //return participant.balance*100;
        return participant.balance;
    }



    //Delete contract
    function destructContract() public returns(bool) {
        if(msg.sender == transactioncontractaddress){
        selfdestruct(msg.sender);
        return true;
    }
    else{
        return false;
    }
}
}