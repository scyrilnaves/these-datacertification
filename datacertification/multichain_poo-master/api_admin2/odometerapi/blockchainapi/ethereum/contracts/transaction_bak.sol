pragma solidity >= 0.4 .21 < 0.6 .0;
pragma experimental ABIEncoderV2;

//56
contract walletInterface {

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
    struct Transaction {
        uint TransactionId;
        address From;
        address Receiver;
        TransactionTypeEnum typeOfTransaction;
        uint consensusValue;
        string metadata;
        uint balance;
       address [] signatureaddresses;
        uint pendingSignatures;
        uint totalSignatures;
        bool isApproved;
    }


    function isLeader(address addressToCheck) public view returns(bool);

    function isParticipant(address addressToCheck) public view returns(bool);

    function isFollower(address addressToCheck) public view returns(bool);

    function getLeaderslength() public view returns(uint);

    function finaliseCreateParticipant(string memory, address) public returns(bool);

    function finaliseRemoveParticipant(address) public returns(bool);

    function finaliseAddFollowerRole(address) public returns(bool) ;

    function finaliseRemoveFollowerRole(address) public returns(bool) ;

    function finaliseAddLeaderRole(address) public returns(bool) ;

    function finaliseRemoveLeaderRole(address) public returns(bool) ;

    function finaliseTokenSupply(uint, address) public returns(bool) ;

    function finaliseTokenTransfer(uint, address) public returns(bool) ;

    function finaliseTokenRetract(uint, address) public returns(bool) ;

    function getParticipants() public view returns(address[] memory) ;

    function destructContract(address) public returns(bool);

}

// Contract to Handle the Permission Level Consensus

contract transaction {

    walletInterface public walletInterfaceInstance;

    //Consensus Value for Participant Role 
    uint  participant_signature;

    //Consensus Value for Leader Role
    uint  leader_signature;

    //Consensus Value for Follower Role
    uint  follower_signature;

    //Consensus Value for Overall Consensus parameter change which is 100%
    uint  consensus_signature;

    //Consensus value for Deleting the transaction
    uint  deleteTransaction_signature;

    //consensus value for creating tokens
    uint  token_supply_signature;

    //consensus value for transferring tokens
    uint token_transfer_signature;

    //consensus value for retracting tokens
    uint token_retract_signature;

    //Counter value for trasnactions
    uint private transactionidCounter = 0;

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

    //Transaction Data Structure
    struct Transaction {
        uint TransactionId;
        address From;
        address Receiver;
        TransactionTypeEnum typeOfTransaction;
        uint consensusValue;
        string metadata;
        uint balance;
        address [] signatureaddresses;
        uint16 pendingSignatures;
        uint16 totalSignatures;
        bool isApproved;
    }

    struct Account {
        uint modified;
        address lastsignature;
        TransactionTypeEnum typeOfTransaction;
        uint balance;
    }


    //Array to maintain the list of Address which are in Permission Transaction
    address[] public TransactionArray;

    address public maincontractaddress;
    
    uint16 maincontractsetcounter;
    
    

    //Mapping to store Transaction associated with address and their corresponding transaction
    mapping(address => Transaction) public pendingTransactions;

    //constructor
    constructor(address walletInterfaceaddress) public {
        walletInterfaceInstance = walletInterface(walletInterfaceaddress);
        leader_signature = 100;
        participant_signature = 100;
        deleteTransaction_signature = 100;
        follower_signature = 100;
        consensus_signature = 100;
        token_supply_signature = 100;
        token_transfer_signature = 100;
        token_retract_signature = 100;
    }

    //Set the Main Contract Address to Interact with and for security
    function setMainContractAddress(address mainContractAddress) public returns (bool){
        if(maincontractsetcounter==0){
        maincontractaddress = mainContractAddress;
        maincontractsetcounter = ++maincontractsetcounter;
        return true;
        } else{
            return false;
        }
    }

    //Set the Main Contract Address to Interact with and for security
    function getMainContractAddress() public view returns (address){
        
        return maincontractaddress; 
       
    }


    //Event after finalise Event
    event FinaliseTransactionEvent(address eventAddress, TransactionTypeEnum transactiontype, uint consensusvalue, string metadata, uint balance);

    //Event after Creation Event
    event CreateTransactionEvent(address eventAddress, TransactionTypeEnum transactiontype, uint consensusvalue, string metadata, uint balance);


    //Create a Transaction and add it to 1) Pending Transactions Mapping and 2) Array of Transactions
    function createTransaction(address From, address Receiver,TransactionTypeEnum transactionType, uint newConsensusValue, string memory transactionmetadata, uint balance) public returns(bool) {
        if (pendingTransactions[Receiver].TransactionId==0 && pendingTransactions[Receiver].isApproved == false) {
            Transaction memory transaction;
            transaction.TransactionId = ++transactionidCounter;
            transaction.From = From;
            transaction.Receiver = Receiver;
            transaction.typeOfTransaction = transactionType;
            transaction.metadata = transactionmetadata;
            transaction.balance = balance;
            transaction.consensusValue = newConsensusValue;
            transaction.pendingSignatures = calculateSignatures(transactionType);
            transaction.totalSignatures = calculateSignatures(transactionType);
            if( transaction.pendingSignatures==0 ||transaction.totalSignatures ==0 ){
                transaction.isApproved = true;
            }else{
                 transaction.isApproved = false;
            }
            pendingTransactions[Receiver] = transaction;
            TransactionArray.push(Receiver);
            if( transaction.pendingSignatures==0 ||transaction.totalSignatures==0 ){
                emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                finaliseTransactionAfterSignature(transaction.Receiver);
            }
           emit CreateTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
            return true;
        } else {
           return false;
        }
    }
    
    function getCaller() public view returns (address){
        return msg.sender;
    }

    //Calculate signature or consenus from the leaders depending on the consensus value and transaction type
    function calculateSignatures(TransactionTypeEnum transactionType) public view returns(uint16) {
        uint16 signatureCount;
        uint leadersno = walletInterfaceInstance.getLeaderslength();
        if (transactionType == TransactionTypeEnum.addParticipant || transactionType == TransactionTypeEnum.removeParticipant) {
            signatureCount = uint16((leadersno * participant_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.addFollower || transactionType == TransactionTypeEnum.removeFollower) {
            signatureCount = uint16((leadersno * follower_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.addLeader || transactionType == TransactionTypeEnum.removeLeader) {
            signatureCount = uint16((leadersno * leader_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.changeParticipantConsensus || transactionType == TransactionTypeEnum.changeLeaderConsensus || transactionType == TransactionTypeEnum.changeFollowerConsensus || transactionType == TransactionTypeEnum.changeOverallConsensus || transactionType == TransactionTypeEnum.changeDeleteTransactionConsensus) {
            signatureCount = uint16((leadersno * consensus_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.deleteTransaction) {
            signatureCount = uint16((leadersno * deleteTransaction_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.deleteContract) {
            signatureCount = uint16(leadersno);
        } else if (transactionType == TransactionTypeEnum.tokenSupply) {
            signatureCount = uint16((leadersno * token_supply_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.tokenTransfer) {
            signatureCount = uint16((leadersno * token_transfer_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.tokenRetract) {
            signatureCount = uint16((leadersno * token_retract_signature) / 100);
        } else if (transactionType == TransactionTypeEnum.changeTokenSupplyConsensus || transactionType == TransactionTypeEnum.changeTokenTransferConsensus || transactionType == TransactionTypeEnum.changeTokenRetractConsensus) {
            signatureCount = uint16((leadersno * consensus_signature) / 100);
        }
        return signatureCount;
    }
    
    function display() public view returns (uint){
       return  walletInterfaceInstance.getLeaderslength();
    }

  
    function checksignatureadded(address[] memory signatureaddresses,address input) private returns(bool){
        for(uint i=0;i<signatureaddresses.length;i++){
            if(signatureaddresses[i]==input){
                return true;
            }
        }
        return false;
    }

    //Add or Approve the Trasnaction based on the Address ***PUBLIC METHOD ***
    function addSignatureByPermissionedAddress(address PermissionedAdress) public returns(bool) {
        Transaction storage transaction = pendingTransactions[PermissionedAdress];
        if (walletInterfaceInstance.isLeader(msg.sender)) {
           address[] memory signaturetocheck = transaction.signatureaddresses;
                    if (!(checksignatureadded(signaturetocheck,msg.sender))) {
                   transaction.signatureaddresses.push(msg.sender);
                   transaction.pendingSignatures = --transaction.pendingSignatures;
                if (transaction.pendingSignatures == 0) {
                    transaction.isApproved = true;
                    return finaliseTransactionAfterSignature(transaction.Receiver);
                } else {
                    return false;
                }
            }
        }
    }

    function getTransaction(address PermissionedAdress) private returns(Transaction memory) {
        //if (walletInterfaceInstance.isLeader(msg.sender)) {
            Transaction storage transaction = pendingTransactions[PermissionedAdress];
            return transaction;
        //}
    }

    //Remove/Retract the Signature for a given transaction  ***PUBLIC METHOD ***
    function removeSignatureByPermissionedAddress(address PermissionedAdress) public returns(bool) {
        if (walletInterfaceInstance.isLeader(msg.sender)) {
            Transaction storage transaction = pendingTransactions[PermissionedAdress];
             address[] storage signaturetocheck = transaction.signatureaddresses;
                    if ((checksignatureadded(signaturetocheck,msg.sender))) {
                clearSignature(signaturetocheck,msg.sender);
                transaction.pendingSignatures = ++transaction.pendingSignatures;
            }
        }
    }

      //High Gas: Add signature to transaction ***PUBLIC METHOD ***

    function addSignatureByTransactionId(uint transactionId) public returns(bool) {

        address[] memory participantsArray = walletInterfaceInstance.getParticipants();

        if (walletInterfaceInstance.isLeader(msg.sender)) {

            for (uint i = 0; i < participantsArray.length; i++) {

                address participantAddress = participantsArray[i];

                Transaction storage transaction = pendingTransactions[participantAddress];

                if (transaction.TransactionId == transactionId) {

                    //Check if the leader has already signed to prevent re-approving

                    address[] memory signaturetocheck = transaction.signatureaddresses;

                    if (!(checksignatureadded(signaturetocheck,msg.sender))) {

                        transaction.signatureaddresses.push(msg.sender);

                        transaction.pendingSignatures = --transaction.pendingSignatures;

                        if (transaction.pendingSignatures == 0) {

                            transaction.isApproved = true;

                            return finaliseTransactionAfterSignature(transaction.Receiver);

                        } else {

                            return false;

                        }

                    }

                }

            }

        }

    }
	
	
	

    //Remove/ Retract the signature for a transaction based on Transaction ID ***PUBLIC METHOD ***

    function removeSignatureByTransactionId(uint transactionId) public returns(bool) {

        if (walletInterfaceInstance.isLeader(msg.sender)) {

            address[] memory participantsArray = walletInterfaceInstance.getParticipants();

            for (uint i = 0; i < participantsArray.length; i++) {

                address participantAddress = participantsArray[i];

                Transaction storage transaction = pendingTransactions[participantAddress];

                if (transaction.TransactionId == transactionId) {

                   address[] storage signaturetocheck = transaction.signatureaddresses;

                    if ((checksignatureadded(signaturetocheck,msg.sender))) {

                        clearSignature(signaturetocheck,msg.sender);

                        transaction.pendingSignatures = ++transaction.pendingSignatures;

                    }

                }

            }

        }

    }

    

    
    //***PUBLIC METHOD ***
    function clearSignature(address[] storage signatureaddress ,address PermissionedAdress) private returns(bool) {
        //if (walletInterfaceInstance.isLeader(msg.sender)) {
            uint position;
    
                for (uint i = 0; i < signatureaddress.length; i++) {
                    if (signatureaddress[i] == PermissionedAdress) {
                        position = i;
                    }
                }
                if (position == signatureaddress.length - 1) {
                    delete signatureaddress[signatureaddress.length - 1];
                    signatureaddress.length--;
                }
                //move the position from the last element to the position of the element to be deleted
                else {
                    signatureaddress[position] = signatureaddress[signatureaddress.length - 1];
                    delete signatureaddress[signatureaddress.length - 1];
                    signatureaddress.length--;
                }
                return true;
            }
       


    //Final Operation perform after approval of the trasnaction based on consensus
    function finaliseTransactionAfterSignature(address PermissionedAdress) private returns(bool) {
        //if (walletInterfaceInstance.isLeader(msg.sender)) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true) {
                if (transaction.typeOfTransaction == TransactionTypeEnum.addParticipant) {
                    walletInterfaceInstance.finaliseCreateParticipant(transaction.metadata, transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.removeParticipant) {
                    walletInterfaceInstance.finaliseRemoveParticipant(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.addFollower) {
                    walletInterfaceInstance.finaliseAddFollowerRole(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.removeFollower) {
                    walletInterfaceInstance.finaliseRemoveFollowerRole(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.addLeader) {
                    walletInterfaceInstance.finaliseAddLeaderRole(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                  delete pendingTransactions[PermissionedAdress].signatureaddresses;
                   delete pendingTransactions[PermissionedAdress];
                   clearTransaction(PermissionedAdress);
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.removeLeader) {
                    walletInterfaceInstance.finaliseRemoveLeaderRole(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeParticipantConsensus) {
                    finaliseChangeParticipantConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeLeaderConsensus) {
                    finaliseChangeleaderRoleConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeFollowerConsensus) {
                    finaliseChangeFollowerRoleConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                   clearTransaction(PermissionedAdress);
                   delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeOverallConsensus) {
                    finaliseChangeOverallConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeDeleteTransactionConsensus) {
                    finaliseChangeDeleteTransactionConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.deleteContract) {
                    destructContract(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                     
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.tokenSupply) {
                    walletInterfaceInstance.finaliseTokenSupply(transaction.balance, transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.tokenTransfer) {
                    walletInterfaceInstance.finaliseTokenTransfer(transaction.balance, transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.tokenRetract) {
                    walletInterfaceInstance.finaliseTokenRetract(transaction.balance, transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeTokenSupplyConsensus) {
                    finaliseChangeTokenSupplyConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeTokenTransferConsensus) {
                    finaliseChangeTokenTransferConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                    clearTransaction(PermissionedAdress);
                    delete pendingTransactions[PermissionedAdress].signatureaddresses;
                    delete pendingTransactions[PermissionedAdress];
                } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeTokenRetractConsensus) {
                    finaliseChangeTokenRetractConsensus(transaction.Receiver);
                    emit FinaliseTransactionEvent(transaction.Receiver, transaction.typeOfTransaction, transaction.consensusValue, transaction.metadata, transaction.balance);
                   clearTransaction(PermissionedAdress);
                   delete pendingTransactions[PermissionedAdress].signatureaddresses;
                   delete pendingTransactions[PermissionedAdress];
                }
                return true;
            }
        //}
        return false;
    }


    //***PUBLIC METHOD ***
    function clearTransaction(address PermissionedAdress) private returns(bool) {
        //if (walletInterfaceInstance.isLeader(msg.sender)) {
            uint position;
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true) {
                for (uint i = 0; i < TransactionArray.length; i++) {
                    if (TransactionArray[i] == PermissionedAdress) {
                        position = i;
                    }
                }
                if (position == TransactionArray.length - 1) {
                    delete TransactionArray[TransactionArray.length - 1];
                    TransactionArray.length--;
                }
                //move the position from the last element to the position of the element to be deleted
                else {
                    TransactionArray[position] = TransactionArray[TransactionArray.length - 1];
                    delete TransactionArray[TransactionArray.length - 1];
                    TransactionArray.length--;
                }
                return true;
            }
       // }
    }

    // Fianalise Operations for all the transactions performed after the consensus on the Trasnaction is achieved
    function finalisedeleteTransactions(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.deleteTransaction) {
                delete pendingTransactions[PermissionedAdress];
                clearTransaction(PermissionedAdress);
                return true;
            }
    }

    function finaliseChangeleaderRoleConsensus(address PermissionedAddress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAddress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeLeaderConsensus) {
                leader_signature = transaction.consensusValue;
                return true;
            }
    }

    function finaliseChangeFollowerRoleConsensus(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeFollowerConsensus) {
                follower_signature = transaction.consensusValue;
                return true;
            }
    }

    function finaliseChangeOverallConsensus(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeOverallConsensus) {
                consensus_signature = transaction.consensusValue;
                return true;
            }
    }

    function finaliseChangeDeleteTransactionConsensus(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeDeleteTransactionConsensus) {
                deleteTransaction_signature = transaction.consensusValue;
                return true;
            }
    }

    function finaliseChangeParticipantConsensus(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeParticipantConsensus) {
                participant_signature = transaction.consensusValue;
                return true;
            }
    }

    function finaliseChangeTokenSupplyConsensus(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeTokenSupplyConsensus) {
                token_supply_signature = transaction.consensusValue;
                return true;
            }
    }

    function finaliseChangeTokenTransferConsensus(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeTokenTransferConsensus) {
                token_transfer_signature = transaction.consensusValue;
                return true;
            }
    }

    function finaliseChangeTokenRetractConsensus(address PermissionedAdress) private returns(bool) {
            Transaction memory transaction = getTransaction(PermissionedAdress);
            if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeTokenRetractConsensus) {
                token_retract_signature = transaction.consensusValue;
                return true;
            }
    }


    //*PUBLIC FUNCTION */
    function getPendingSignatures(address PermissionedAdress) public view returns(uint) {
            return pendingTransactions[PermissionedAdress].pendingSignatures;
    }

    //*PUBLIC FUNCTION */
    function getPendingTransactions() public view returns(address[] memory) {
            return TransactionArray;
    }

    //*PUBLIC FUNCTION */
    function getTransactionId(address PermissionedAdress) public view returns(uint) {
            return pendingTransactions[PermissionedAdress].TransactionId;
        //}
    }

    //*PUBLIC FUNCTION */
    function getParticipantRoleConsensus() public view returns(uint) {
            return participant_signature;
    }

    function getleaderRoleConsensus() public view returns(uint) {
            return leader_signature;
    }

    function getFollowerRoleConsensus() public view returns(uint) {
            return follower_signature;
    }

    function getOverallConsensus() public view returns(uint) {
       // if (walletInterfaceInstance.isParticipant(msg.sender)) {
            return consensus_signature;
       // }
    }

    //*PUBLIC FUNCTION */
    function getDeleteTransactionConsensus() public view returns(uint) {
       // if (walletInterfaceInstance.isParticipant(msg.sender)) {
            return deleteTransaction_signature;
       // }
    }

    //*PUBLIC FUNCTION */
    function getTransactionDetails(address PermissionedAdress) public view returns(TransactionTypeEnum) {
            Transaction memory transaction = pendingTransactions[PermissionedAdress];
            return transaction.typeOfTransaction;
    }
    
    //Fall back function
    function() external payable {

    }

    //Delete contract
    function destructContract(address PermissionedAddress) private returns(bool) {
      //  if (walletInterfaceInstance.isLeader(msg.sender)) {
            walletInterfaceInstance.destructContract(PermissionedAddress);
            Transaction memory transaction = getTransaction(PermissionedAddress);
            if (transaction.isApproved == true) {
                selfdestruct(msg.sender);
                return true;
            }
    }
}