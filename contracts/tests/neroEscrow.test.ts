import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('NeroEscrow', function () {
	let escrow: any;
	let token: any;
	let owner: any;
	let client: any;
	let freelancer: any;

	before(async () => {
		[owner, client, freelancer] = await ethers.getSigners();

		// Deploy mock ERC20 token
		const Token = await ethers.getContractFactory('MockERC20');
		token = await Token.deploy();

		// Deploy escrow
		const Escrow = await ethers.getContractFactory('NeroEscrow');
		escrow = await Escrow.deploy(token.address);
	});

	it('Should deposit and withdraw tokens', async () => {
		// Mint tokens to client
		await token.mint(client.address, 1000);
		await token.connect(client).approve(escrow.address, 500);

		// Deposit
		await escrow.connect(client).deposit(500);
		expect(await escrow.balances(client.address)).to.equal(500);

		// Withdraw to freelancer
		await escrow.connect(owner).withdraw(freelancer.address, 300);
		expect(await token.balanceOf(freelancer.address)).to.equal(300);
	});
});
