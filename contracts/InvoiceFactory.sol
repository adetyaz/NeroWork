// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract InvoiceFactory is ERC721 {
    uint256 public nextInvoiceId;
    mapping(uint256 => bool) public paid;

    constructor() ERC721("InvoiceNFT", "INV") {}

    function createInvoice(address client) external returns (uint256) {
        uint256 invoiceId = nextInvoiceId++;
        _mint(client, invoiceId);
        return invoiceId;
    }

    function markAsPaid(uint256 invoiceId) external {
        paid[invoiceId] = true;
    }
}