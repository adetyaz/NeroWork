import * as hre from 'hardhat';

async function main() {
	const { ethers } = hre;

	const PAYMENT_TOKEN = '0x99BD4BDD7A9c22E2a35F09A6Bd17f038D5E5eB87';

	const NeroEscrow = await ethers.getContractFactory('NeroEscrow');
	const escrow = await NeroEscrow.deploy(PAYMENT_TOKEN);

	await escrow.deployed();
	console.log(`NeroEscrow deployed to: ${escrow.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
