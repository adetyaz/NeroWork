import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('InvoiceFactory', function () {
	let invoiceFactory: any;
	let owner: any;
	let client: any;

	before(async () => {
		[owner, client] = await ethers.getSigners();
		const InvoiceFactory = await ethers.getContractFactory('InvoiceFactory');
		invoiceFactory = await InvoiceFactory.deploy();
	});

	it('Should create and mark invoices as paid', async () => {
		const invoiceId = await invoiceFactory.createInvoice(client.address);
		expect(await invoiceFactory.ownerOf(invoiceId)).to.equal(client.address);

		await invoiceFactory.markAsPaid(invoiceId);
		expect(await invoiceFactory.paid(invoiceId)).to.be.true;
	});
});
