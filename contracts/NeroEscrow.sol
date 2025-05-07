// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NeroEscrow {
    address public owner;
    IERC20 public paymentToken;
    mapping(address => uint256) public escrowBalances;

    constructor(address _paymentToken) {
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
    }

    // Minting function to lock funds
    function mintEscrow(address client, uint256 amount) external {
        paymentToken.transferFrom(msg.sender, address(this), amount);
        escrowBalances[client] += amount;
    }

    // Withdraw to freelancer which will be Paymaster-sponsored
    function withdrawToFreelancer(address freelancer, uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        paymentToken.transfer(freelancer, amount);
        escrowBalances[client] -= amount;
    }

    // Getter for UI
    function getEscrowBalance(address client) external view returns (uint256) {
        return escrowBalances[client];
    }
}