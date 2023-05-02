// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Owner
 * @dev Set & change owner
 */
contract Accident {
    

    address public admin;
    
    address public factory;
    
    // (FactoryID--> (CarID --> ID))
    
    mapping(address => mapping(address => uint)) public car_storage;

    //cars stored with hash of accident data
    mapping (address => uint256[]) public accidents_storage;
    
    // event for EVM logging
    event AdminSet(address indexed oldOwner, address indexed newOwner);
    
    // modifier to check if caller is admin
    modifier isAdmin() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == admin, "Caller is not Admin");
        _;
    }
    
    
      // modifier to check if caller is admin
    modifier isfactory() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == factory, "Caller is not factory");
        _;
    }
    
         // modifier to check if caller is admin
    modifier isValidCar() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        
        require(car_storage[factory][msg.sender]!= 0, "Caller is not valid car");
        _;
    }
    
    function addFactory(address caraddress) public isAdmin {
       
        factory = msg.sender;

    }
    
    
   function addCar(address caraddress) public isfactory {
       
        car_storage[msg.sender][caraddress] = 1;

    }
    
    
    function declareAccident(uint256 hash) public isValidCar {
        uint256[] storage data = accidents_storage[msg.sender];
        data.push(hash);

    }
    
    
    
    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        admin = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit AdminSet(address(0), admin);
    }

  
     
     
     
}
