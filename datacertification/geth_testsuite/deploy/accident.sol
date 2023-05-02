// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.4 .21 < 0.6 .0;

pragma experimental ABIEncoderV2;

/**
 * @title Owner
 * @dev Set & change owner
 */
contract Accident {
    

    address public admin;
    
    address public factory;

    uint public admin_counter = 0;
    
    uint public factory_counter = 0;

    uint public car_storage_counter = 0;
    
    uint public accidents_storage_counter = 0;
    
    
    // (CarID --> FactoryID)
    
    mapping(address => address) public car_storage;

    //cars stored with hash of accident data
    // (CarID --> map(liste d'accident contient hash) )
    mapping (address => bytes32[]) public accidents_storage;
    
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
        
        require(car_storage[msg.sender]!= address(0), "Caller is not valid car");
        _;
    }
    
    function addFactory(address factoryaddress) public isAdmin {
       
        factory = factoryaddress;
        factory_counter = factory_counter+1;

    }
    
    
   function addCar(address caraddress) public isfactory {
       
        car_storage[caraddress] = msg.sender;
        car_storage_counter = car_storage_counter+1;

    }
    
    
     function declareAccident(bytes32 hash) public isValidCar {
        bytes32[] storage data = accidents_storage[msg.sender];
        data.push(hash);
        accidents_storage_counter = accidents_storage_counter+1;

    }
    
    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        admin = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        admin_counter = admin_counter+1;
        emit AdminSet(address(0), admin);
    }

  
     
     
     
}