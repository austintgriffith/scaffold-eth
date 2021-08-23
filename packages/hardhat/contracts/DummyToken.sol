//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// dummyToken Contract to test out TokenDistribution locally
contract DummyToken is ERC20 {
    constructor() public ERC20("DummyToken", "DTKN") {
        _mint(msg.sender, 100**12);
    }
}
