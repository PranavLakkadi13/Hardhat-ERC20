// This is basically creating an ERC20 using the openzeppelin library 


// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OurToken is ERC20 {
    constructor(uint256 initialsupply) ERC20("OurToken","OT") {
        _mint(msg.sender,initialsupply);
    }
}