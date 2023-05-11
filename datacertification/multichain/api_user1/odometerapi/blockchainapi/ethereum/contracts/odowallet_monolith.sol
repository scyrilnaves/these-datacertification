pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

// Contract to Handle the Permission Level Consensus

contract odowallet {

    //Consensus Value for Participant Role 
    uint private participant_signature;

    //Consensus Value for Leader Role
    uint private leader_signature;

    //Consensus Value for Follower Role
    uint private follower_signature;

    //Consensus Value for Overall Consensus parameter change which is 100%
    uint private consensus_signature;

    //Consensus value for Deleting the transaction
    uint private deleteTransaction_signature;

    //consensus value for creating tokens
    uint private token_supply_signature;

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
        mapping(address => uint) signatures;
        uint pendingSignatures;
        uint totalSignatures;
        bool isApproved;
    }

    struct Account {
        uint modified;
        address lastsignature;
        TransactionTypeEnum typeOfTransaction;
        uint balance;
    }
    //Array to maintain the list of Participants
    address[] private participantsArray;

    //Array to maintain the list of Followers
    address[] private FollowersArray;

    //Array to maintain the list of Leaders
    address[] private LeadersArray;

    //Array to maintain the list of Address which are in Permission Transaction
    address[] private TransactionArray;

    //Mapping to store the Permission and Roles of users of the Contract
    mapping(address => Participant) private participants;

    //Mapping to store Transaction associated with address and their corresponding transaction
    mapping(address => Transaction) private pendingTransactions;

    //Mapping of balance
    mapping(address => Account) private balanceMapping;

    //Permission check for a leader
    modifier isLeader(address addressToCheck) {

        Participant memory participantInstance = participants[addressToCheck];
        require(participantInstance.isLeader == true,"Only for Leader Roles");
        _;
    }

    //Permission check for a participant
    modifier isParticipant(address addressToCheck) {
        require(participants[addressToCheck].Account != address(0),"Only for Participants");
        _;
    }

    //Permission check for a follower
    modifier isFollower(address addressToCheck) {
        require(participants[addressToCheck].isFollower,"Only for Followers");
        _;
    }

    event TransactionEvent(address eventAddress, TransactionTypeEnum transactiontype, uint consensusvalue, string metadata, uint balance);


    //Create a Transaction and add it to 1) Pending Transactions Mapping and 2) Array of Transactions
    function createTransaction(address From, address Receiver, TransactionTypeEnum transactionType, uint newConsensusValue, string memory transactionmetadata, uint balance) private returns(bool) {
        if (!(pendingTransactions[Receiver].isApproved == false)) {
            Transaction memory transaction;
            transaction.TransactionId = ++transactionidCounter;
            transaction.From = From;
            transaction.Receiver = Receiver;
            transaction.isApproved = false;
            transaction.typeOfTransaction = transactionType;
            transaction.metadata = transactionmetadata;
            transaction.balance = balance;
            transaction.consensusValue = newConsensusValue;
            transaction.pendingSignatures = calculateSignatures(transactionType);
            transaction.totalSignatures = calculateSignatures(transactionType);
            pendingTransactions[Receiver] = transaction;
            TransactionArray.push(Receiver);
            emit TransactionEvent(Receiver, transactionType, newConsensusValue, transactionmetadata, balance);
            return true;
        } else {
            return false;
        }
    }

    //Calculate signature or consenus from the leaders depending on the consensus value and transaction type
    function calculateSignatures(TransactionTypeEnum transactionType) private view returns(uint) {
        uint signatureCount;
        if (transactionType == TransactionTypeEnum.addParticipant || transactionType == TransactionTypeEnum.removeParticipant) {
            signatureCount = (LeadersArray.length * participant_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.addFollower || transactionType == TransactionTypeEnum.removeFollower) {
            signatureCount = (LeadersArray.length * follower_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.addLeader || transactionType == TransactionTypeEnum.removeLeader) {
            signatureCount = (LeadersArray.length * leader_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.changeParticipantConsensus || transactionType == TransactionTypeEnum.changeLeaderConsensus || transactionType == TransactionTypeEnum.changeFollowerConsensus || transactionType == TransactionTypeEnum.changeOverallConsensus || transactionType == TransactionTypeEnum.changeDeleteTransactionConsensus) {
            signatureCount = (LeadersArray.length * consensus_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.deleteTransaction) {
            signatureCount = (LeadersArray.length * deleteTransaction_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.deleteContract) {
            signatureCount = LeadersArray.length;
        } else if (transactionType == TransactionTypeEnum.tokenSupply) {
            signatureCount = (LeadersArray.length * token_supply_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.tokenTransfer) {
            signatureCount = (LeadersArray.length * token_transfer_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.tokenRetract) {
            signatureCount = (LeadersArray.length * token_retract_signature) / 100;
        } else if (transactionType == TransactionTypeEnum.changeTokenSupplyConsensus || transactionType == TransactionTypeEnum.changeTokenTransferConsensus || transactionType == TransactionTypeEnum.changeTokenRetractConsensus) {
            signatureCount = (LeadersArray.length * consensus_signature) / 100;
        }
        return signatureCount;
    }

    //High Gas: Add signature to transaction ***PUBLIC METHOD ***
    function addSignature(uint transactionId) isLeader(msg.sender) public returns(bool) {
        for (uint i = 0; i < participantsArray.length; i++) {
            address participantAddress = participantsArray[i];
            Transaction storage transaction = pendingTransactions[participantAddress];
            if (transaction.TransactionId == transactionId) {
                //Check if the leader has already signed to prevent re-approving 
                if (!(transaction.signatures[msg.sender] > 0)) {
                    transaction.signatures[msg.sender] = now;
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

    //Add or Approve the Trasnaction based on the Address ***PUBLIC METHOD ***
    function addSignature(address PermissionedAdress) isLeader(msg.sender) public returns(bool) {
        Transaction storage transaction = pendingTransactions[PermissionedAdress];
        if (!(transaction.signatures[msg.sender] > 0)) {
            transaction.signatures[msg.sender] = now;
            transaction.pendingSignatures = --transaction.pendingSignatures;
            if (transaction.pendingSignatures == 0) {
                transaction.isApproved = true;
                return finaliseTransactionAfterSignature(transaction.Receiver);
            } else {
                return false;
            }
        }
    }

    function getTransaction(address PermissionedAdress) isLeader(msg.sender) private returns(Transaction memory) {
        Transaction storage transaction = pendingTransactions[PermissionedAdress];
        return transaction;
    }

    //Remove/Retract the Signature for a given transaction  ***PUBLIC METHOD ***
    function removeSignature(address PermissionedAdress) isLeader(msg.sender) public returns(bool) {
        Transaction storage transaction = pendingTransactions[PermissionedAdress];
        if ((transaction.signatures[msg.sender] > 0)) {
            delete transaction.signatures[msg.sender];
            transaction.pendingSignatures = ++transaction.pendingSignatures;
        }
    }

    //Remove/ Retract the signature for a transaction based on Transaction ID ***PUBLIC METHOD ***
    function removeSignature(uint transactionId) isLeader(msg.sender) public returns(bool) {
        for (uint i = 0; i < participantsArray.length; i++) {
            address participantAddress = participantsArray[i];
            Transaction storage transaction = pendingTransactions[participantAddress];
            if (transaction.TransactionId == transactionId) {
                if ((transaction.signatures[msg.sender] > 0)) {
                    delete transaction.signatures[msg.sender];
                    transaction.pendingSignatures = ++transaction.pendingSignatures;
                }
            }
        }
    }

    //Final Operation perform after approval of the trasnaction based on consensus
    function finaliseTransactionAfterSignature(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true) {
            if (transaction.typeOfTransaction == TransactionTypeEnum.addParticipant) {
                return finaliseCreateParticipant(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.removeParticipant) {
                return finaliseRemoveParticipant(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.addFollower) {
                return finaliseAddFollowerRole(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.removeFollower) {
                return finaliseRemoveFollowerRole(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.addLeader) {
                return finaliseAddLeaderRole(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.removeLeader) {
                return finaliseRemoveLeaderRole(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeParticipantConsensus) {
                return finaliseChangeParticipantConsenus(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeLeaderConsensus) {
                return finaliseChangeleaderRoleConsenus(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeFollowerConsensus) {
                return finaliseChangeFollowerRoleConsenus(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeOverallConsensus) {
                return finaliseChangeOverallConsenus(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeDeleteTransactionConsensus) {
                return finaliseChangeDeleteTransactionConsenus(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.deleteContract) {
                return destructContract(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.tokenSupply) {
                return finaliseTokenSupply(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.tokenTransfer) {
                return finaliseTokenTransfer(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.tokenRetract) {
                return finaliseTokenRetract(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeTokenSupplyConsensus) {
                return finaliseChangeTokenSupplyConsenus(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeTokenTransferConsensus) {
                return finaliseChangeTokenTransferConsenus(transaction.Receiver);
            } else if (transaction.typeOfTransaction == TransactionTypeEnum.changeTokenRetractConsensus) {
                return finaliseChangeTokenRetractConsenus(transaction.Receiver);
            }
        }
        return false;
    }

    // Removing the Participant Element from the Array ***PUBLIC METHOD ***
    function deleteParticipant(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true) {
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
    }

    // Removing the Follower Element from the Array ***PUBLIC METHOD ***
    function deleteFollower(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        uint position;
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true) {
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
    }

    //***PUBLIC METHOD ***
    function clearTransaction(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
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
    }
    
    function deleteLeader(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        uint position;
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true) {
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
        }
    }

        //***PUBLIC METHOD ***
    function destroyContract() isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, msg.sender, TransactionTypeEnum.deleteContract, 0, "DeleteContract", 0)) {
            return false;

        }
    }

        //***PUBLIC METHOD ***
    function createParticipant(address PermissionedAdress, string memory metadata) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.addParticipant, 0, metadata, 0)) {
            return false;

        }
    }
    
    //*PUBLIC FUNCTION */
    function removeParticipant(address PermissionedAdress) isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.removeParticipant, 0, "removeparticipant", 0)) {
            return false;

        }
    }
    
    //*PUBLIC FUNCTION */
    function addFollowerRole(address PermissionedAdress) isParticipant(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.addFollower, 0, "addfollower", 0)) {
            return false;

        }

    }
    
    //*PUBLIC FUNCTION */
    function removeFollowerRole(address PermissionedAdress) isFollower(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.removeFollower, 0, "removeFollower", 0)) {
            return false;

        }
    }
    
    //*PUBLIC FUNCTION */
    function addLeaderRole(address PermissionedAdress) isFollower(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.addLeader, 0, "addleader", 0)) {
            return false;
        }
    }
   
    //*PUBLIC FUNCTION */
    function removeLeaderRole(address PermissionedAdress) isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.removeLeader, 0, "removeLeader", 0)) {
            return false;

        }
    }

    //*PUBLIC FUNCTION */
    function deleteTransactions(address PermissionedAdress) isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.deleteTransaction, 0, "deleteTransaction", 0)) {
            return false;

        }
    }
    
    //*PUBLIC FUNCTION */
    function changeParticipantConsensus(address PermissionedAdress, uint newValue) isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.changeParticipantConsensus, newValue, "changeparticipantconsensus", 0)) {
            return false;

        }
    }
    
    //*PUBLIC FUNCTION */
    function changeLeaderConsensus(uint newValue) isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, msg.sender, TransactionTypeEnum.changeLeaderConsensus, newValue, "changeleaderconsensus", 0)) {
            return false;
        }

    }
    
    //*PUBLIC FUNCTION */
    function changeFollowerConsensus(address PermissionedAdress, uint newValue) isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.changeFollowerConsensus, newValue, "changefollowerconsensus", 0)) {
            return false;
        }

    }
    
    //*PUBLIC FUNCTION */
    function changeOverallConsensus(address PermissionedAdress, uint newValue) isLeader(msg.sender) public returns(bool) {

        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.changeFollowerConsensus, newValue, "changeoverallconsensus", 0)) {
            return false;
        }

    }
    
    //*PUBLIC FUNCTION */
    function changeDeleteTransactionConsensus(address PermissionedAdress, uint newValue) isLeader(msg.sender) public returns(bool) {
        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.changeDeleteTransactionConsensus, newValue, "changeDeleteTransactionConsensus", 0)) {
            return false;
        }
    }
    
    //*PUBLIC FUNCTION */
    function increaseTokenSupply(address PermissionedAdress, uint balance) isLeader(msg.sender) public returns(bool) {
        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.tokenSupply, 0, "increaseTokenSupply", balance)) {
            return false;
        }
    }
    
    //*PUBLIC FUNCTION */
    function tokenTransfer(address PermissionedAdress, uint balance) isFollower(msg.sender) public returns(bool) {
        //conversion to units
        uint convertedunit = balance / 100;
        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.tokenTransfer, 0, "RequestToken", convertedunit)) {
            return false;
        }
    }
    
    //*PUBLIC FUNCTION */
    function tokenRetract(address PermissionedAdress, uint balance) isLeader(msg.sender) public returns(bool) {
        uint convertedunit = balance / 100;
        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.tokenRetract, 0, "RetractToken", convertedunit)) {
            return false;
        }
    }
    
    //*PUBLIC FUNCTION */
    function changeTokenSupplyConsensus(address PermissionedAdress, uint consensus) isLeader(msg.sender) public returns(bool) {
        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.changeTokenSupplyConsensus, consensus, "changeTokenSupplyConsensus", 0)) {
            return false;
        }
    }

    //*PUBLIC FUNCTION */
    function changeTokenTransferConsensus(address PermissionedAdress, uint consensus) isLeader(msg.sender) public returns(bool) {
        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.changeTokenTransferConsensus, consensus, "changeTokenTransferConsensus", 0)) {
            return false;
        }
    }
    
    //*PUBLIC FUNCTION */
    function changeTokenRetractConsensus(address PermissionedAdress, uint consensus) isLeader(msg.sender) public returns(bool) {
        if (!createTransaction(msg.sender, PermissionedAdress, TransactionTypeEnum.changeTokenRetractConsensus, consensus, "changeTokenRetractConsensus", 0)) {
            return false;
        }
    }

    // Fianalise Operations for all the transactions performed after the consensus on the Trasnaction is achieved
    function finalisedeleteTransactions(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.deleteTransaction) {
            delete pendingTransactions[PermissionedAdress];
            clearTransaction(PermissionedAdress);
            return true;
        }
    }

    function finaliseCreateParticipant(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.addParticipant) {
            Participant memory participant;
            participant.Account = PermissionedAdress;
            participant.isLeader = false;
            participant.isFollower = false;
            participant.balance = 0;
            participant.metaData = transaction.metadata;
            participants[PermissionedAdress] = participant;
            participantsArray.push(PermissionedAdress);
            delete pendingTransactions[PermissionedAdress];
            clearTransaction(PermissionedAdress);
            return true;
        }
    }



    function finaliseRemoveParticipant(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.removeParticipant) {
            delete participants[PermissionedAdress];
            delete pendingTransactions[PermissionedAdress];
            clearTransaction(PermissionedAdress);
            deleteParticipant(PermissionedAdress);
        }
    }

    function finaliseAddFollowerRole(address PermissionedAddress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAddress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.addFollower) {
            Participant storage participant = participants[PermissionedAddress];
            participant.isFollower = true;
            FollowersArray.push(PermissionedAddress);
            delete pendingTransactions[PermissionedAddress];
            clearTransaction(PermissionedAddress);
            return true;
        }

    }

    function finaliseRemoveFollowerRole(address PermissionedAddress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAddress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.removeFollower) {
            Participant storage participant = participants[PermissionedAddress];
            participant.isFollower = false;
            deleteFollower(PermissionedAddress);
            delete pendingTransactions[PermissionedAddress];
            clearTransaction(PermissionedAddress);
            return true;
        }
    }

    function finaliseAddLeaderRole(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.addLeader) {
            Participant storage participant = participants[PermissionedAdress];
            participant.isLeader = true;
            LeadersArray.push(PermissionedAdress);
            delete pendingTransactions[PermissionedAdress];
            clearTransaction(PermissionedAdress);
            return true;
        }
    }

    function finaliseRemoveLeaderRole(address PermissionedAddress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAddress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.removeLeader) {
            Participant storage participant = participants[PermissionedAddress];
            participant.isLeader = false;
            deleteLeader(PermissionedAddress);
            delete pendingTransactions[PermissionedAddress];
            clearTransaction(PermissionedAddress);
            return true;
        }
    }

    function finaliseChangeleaderRoleConsenus(address PermissionedAddress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAddress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeLeaderConsensus) {
            leader_signature = transaction.consensusValue;
            return true;
        }
    }

    function finaliseChangeFollowerRoleConsenus(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeFollowerConsensus) {
            follower_signature = transaction.consensusValue;
            return true;
        }
    }

    function finaliseChangeOverallConsenus(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeOverallConsensus) {
            consensus_signature = transaction.consensusValue;
            return true;
        }
    }

    function finaliseChangeDeleteTransactionConsenus(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeDeleteTransactionConsensus) {
            deleteTransaction_signature = transaction.consensusValue;
            return true;
        }
    }

    function finaliseChangeParticipantConsenus(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeParticipantConsensus) {
            participant_signature = transaction.consensusValue;
            return true;
        }
    }

    function finaliseTokenSupply(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.tokenSupply) {
            Participant storage participant = participants[PermissionedAdress];
            if (participant.isLeader == true) {
                uint projectedBalance = participant.balance + transaction.balance;
                if (projectedBalance > participant.balance) {
                    participant.balance = transaction.balance;
                }
                delete pendingTransactions[PermissionedAdress];
                clearTransaction(PermissionedAdress);
                return true;
            }
        }
    }

    function finaliseTokenTransfer(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.tokenTransfer) {
            Participant storage participant = participants[PermissionedAdress];
            if (participant.isFollower == true) {
                uint projectedBalance = participant.balance + transaction.balance;
                if (projectedBalance > participant.balance) {
                    participant.balance = projectedBalance;
                    delete balanceMapping[PermissionedAdress];
                    Account memory account;
                    account.modified = now;
                    account.lastsignature = PermissionedAdress;
                    account.typeOfTransaction = transaction.typeOfTransaction;
                    account.balance = projectedBalance;
                    balanceMapping[PermissionedAdress] = account;
                    delete pendingTransactions[PermissionedAdress];
                    clearTransaction(PermissionedAdress);
                    return true;
                }

            }
        }
    }

    function finaliseTokenRetract(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.tokenRetract) {
            Participant storage participant = participants[PermissionedAdress];
            if (participant.isFollower == true) {
                uint projectedBalance = participant.balance - transaction.balance;
                if (projectedBalance < participant.balance) {
                    participant.balance = projectedBalance;
                }
                delete pendingTransactions[PermissionedAdress];
                clearTransaction(PermissionedAdress);
                return true;
            }
        }
    }

    function finaliseChangeTokenSupplyConsenus(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeTokenSupplyConsensus) {
            token_supply_signature = transaction.consensusValue;
            return true;
        }
    }

    function finaliseChangeTokenTransferConsenus(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeTokenTransferConsensus) {
            token_transfer_signature = transaction.consensusValue;
            return true;
        }
    }

    function finaliseChangeTokenRetractConsenus(address PermissionedAdress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAdress);
        if (transaction.isApproved == true && transaction.typeOfTransaction == TransactionTypeEnum.changeTokenRetractConsensus) {
            token_retract_signature = transaction.consensusValue;
            return true;
        }
    }
    
    //*PUBLIC FUNCTION */
    function getLeaders() isParticipant(msg.sender) public view returns(address[] memory) {
        return LeadersArray;

   }
    
    //*PUBLIC FUNCTION */
    function getFollowers() isParticipant(msg.sender) public view returns(address[] memory) {
        return FollowersArray;
    }
    
    //*PUBLIC FUNCTION */
    function getParticipants() public view returns(address[] memory) {
        return participantsArray;
    }
    
    //*PUBLIC FUNCTION */
    function getPendingSignatures(address PermissionedAdress) isParticipant(msg.sender) public view returns(uint) {
        return pendingTransactions[PermissionedAdress].pendingSignatures;
    }
    
    //*PUBLIC FUNCTION */
    function getPendingTransactions() isParticipant(msg.sender) public view returns(address[] memory) {
        return TransactionArray;
    }
  
    //*PUBLIC FUNCTION */
    function getTransactionId(address PermissionedAdress) isParticipant(msg.sender) public view returns(uint) {
        return pendingTransactions[PermissionedAdress].TransactionId;
    }
    
    //*PUBLIC FUNCTION */
    function getParticipantRoleConsenus() isParticipant(msg.sender) public view returns(uint) {
        return participant_signature;
    }
    
    //*PUBLIC FUNCTION */
    function getleaderRoleConsenus() isParticipant(msg.sender) public view returns(uint) {
        return leader_signature;
    }
    
    //*PUBLIC FUNCTION */
    function getFollowerRoleConsenus() isParticipant(msg.sender) public view returns(uint) {
        return follower_signature;
    }
    
    //*PUBLIC FUNCTION */
    function getOverallConsenus() isParticipant(msg.sender) public view returns(uint) {
        return consensus_signature;
    }
    
    //*PUBLIC FUNCTION */
    function getDeleteTransactionConsenus() isParticipant(msg.sender) public view returns(uint) {
        return deleteTransaction_signature;
    }
    
    //*PUBLIC FUNCTION */
    function getParticipantDetails(address PermissionedAdress) isLeader(msg.sender) public view returns(Participant memory) {
        //string memory details;
        Participant memory participant = participants[PermissionedAdress];
        //details =  "Account:"+participant.Account+"isLeader:"+participant.isLeader+"isFollower:"+participant.isFollower+"metaData:"+participant.metaData;
        return participant;
    }
    
    //*PUBLIC FUNCTION */
    function getTransactionDetails(address PermissionedAdress)  isLeader(msg.sender) public view returns(TransactionTypeEnum) {
        //string memory details;
        Transaction memory transaction = pendingTransactions[PermissionedAdress];
        //details =  "TransactionId:"+ transaction.TransactionId+ "From:"+ transaction.From+ "Receiver:"+transaction.Receiver+"TransactionTypeEnum:"+transaction.TransactionTypeEnum+"consensusValue:" +transaction.consensusValue+"metadata:"+transaction.metadata+"pendingSignatures"+transaction.pendingSignatures+"totalSignatures:"+transaction.totalSignatures+"isApproved:"+transaction.isApproved;
        return transaction.typeOfTransaction;
    }

    //constructor
    constructor(address[] memory leaders, string memory metadata, uint participant_consenus, uint leader_consenus, uint follower_consensus, uint overall_consensus, uint deleteConsensus, uint balance, uint tokensupply, uint tokentransfer, uint tokenretract) public {
        for (uint i = 0; i < leaders.length; i++) {
            Participant memory participant;
            participant.Account = leaders[i];
            participant.isLeader = true;
            participant.isFollower = true;
            participant.metaData = metadata;
            participant.balance = balance;
            participants[leaders[i]] = participant;
            participantsArray.push(leaders[i]);
            FollowersArray.push(leaders[i]);
            LeadersArray.push(leaders[i]);
        }
        leader_signature = leader_consenus;
        participant_signature = participant_consenus;
        deleteTransaction_signature = deleteConsensus;
        follower_signature = follower_consensus;
        consensus_signature = overall_consensus;
        token_supply_signature = tokensupply;
        token_transfer_signature = tokentransfer;
        token_retract_signature = tokenretract;
    }
    //Fall back function
    function() external payable {

    }
    
    //*PUBLIC FUNCTION */
    function getBalance(address PermissionedAdress) isFollower(msg.sender) public view returns(uint) {
        //string memory details;
        Transaction memory transaction = pendingTransactions[PermissionedAdress];
        //details =  "TransactionId:"+ transaction.TransactionId+ "From:"+ transaction.From+ "Receiver:"+transaction.Receiver+"TransactionTypeEnum:"+transaction.TransactionTypeEnum+"consensusValue:" +transaction.consensusValue+"metadata:"+transaction.metadata+"pendingSignatures"+transaction.pendingSignatures+"totalSignatures:"+transaction.totalSignatures+"isApproved:"+transaction.isApproved;
        return transaction.balance;
    }

    //Delete contract
    function destructContract(address PermissionedAddress) isLeader(msg.sender) private returns(bool) {
        Transaction memory transaction = getTransaction(PermissionedAddress);
        if (transaction.isApproved == true) {
            selfdestruct(msg.sender);
            return true;
        }
    }
}