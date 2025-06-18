// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NeroInvoice {
    struct Invoice {
        uint256 id;
        address freelancer;
        address client;
        string clientEmail;
        string title;
        string description;
        uint256 amount; // in wei or smallest NERO unit
        uint256 createdAt;
        bool paid;
    }

    uint256 public invoiceCount;
    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(
        uint256 indexed id,
        address indexed freelancer,
        address indexed client,
        string clientEmail,
        string title,
        string description,
        uint256 amount,
        uint256 createdAt
    );

    event InvoicePaid(uint256 indexed id, address indexed payer);

    function createInvoice(
        address client,
        string memory clientEmail,
        string memory title,
        string memory description,
        uint256 amount
    ) public {
        invoiceCount++;
        invoices[invoiceCount] = Invoice(
            invoiceCount,
            msg.sender,
            client,
            clientEmail,
            title,
            description,
            amount,
            block.timestamp,
            false
        );
        emit InvoiceCreated(invoiceCount, msg.sender, client, clientEmail, title, description, amount, block.timestamp);
    }

    function markAsPaid(uint256 invoiceId) public {
        Invoice storage inv = invoices[invoiceId];
        require(!inv.paid, "Already paid");
        inv.paid = true;
        emit InvoicePaid(invoiceId, msg.sender);
    }

    function getInvoice(uint256 invoiceId) public view returns (Invoice memory) {
        return invoices[invoiceId];
    }
}