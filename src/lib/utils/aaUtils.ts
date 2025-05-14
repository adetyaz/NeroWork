import { ethers } from 'ethers';
import { Client, Presets } from 'userop';
import { NERO_CHAIN_CONFIG, AA_PLATFORM_CONFIG, CONTRACT_ADDRESSES, API_KEY } from '../config';


const ESCROW_ABI = [
	// Mint-style function to create/lock funds
	'function mintEscrow(address client, uint256 amount) external',

	// Getters
	'function getEscrowBalance(address client) external view returns (uint256)',
	'function withdrawToFreelancer(address freelancer, uint256 amount) external',

	// Admin
	'function owner() external view returns (address)'
];

// Get Ethereum provider
export const getProvider = () => {
	return new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
};

// Get signer from browser wallet


export const getSigner = async () => {
	// @ts-expect-error declared a global type
	if (!window.ethereum) {
		throw new Error('No crypto wallet found. Please install Metamask.');
	}

	// @ts-expect-error declared a global type
	await window.ethereum.request({ method: 'eth_requestAccounts' });

	// @ts-expect-error declared a global type
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	return provider.getSigner();
};

// Initialize AA Client
export const initAAClient = async () => {
	return await Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
		overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
		entryPoint: CONTRACT_ADDRESSES.entryPoint
	});
};

// Get AA wallet address for a signer
export const getAAWalletAddress = async (accountSigner: ethers.Signer) => {
	try {
		// Initialize the SimpleAccount builder
		const simpleAccount = await Presets.Builder.SimpleAccount.init(
			accountSigner,
			NERO_CHAIN_CONFIG.rpcUrl,
			{
				overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
				entryPoint: CONTRACT_ADDRESSES.entryPoint,
				factory: CONTRACT_ADDRESSES.accountFactory
			}
		);

		// Get the counterfactual address of the AA wallet
		const address = await simpleAccount.getSender();
		console.log('AA wallet address:', address);

		return address;
	} catch (error) {
		console.error('Error getting AA wallet address:', error);
		throw error;
	}
};

// Function to execute a contract call via AA with sponsored gas

export const executeSponsoredOperation = async (
	accountSigner: ethers.Signer,
	contractAddress: string,
	contractAbi: ethers.ContractInterface,
	functionName: string,
	functionParams: ethers.utils.Result | never[]
	,
	options?: {
		apiKey?: string;
		gasMultiplier?: number;
	}
) => {
	try {
		// Initialize AA client
		const client = await Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
			overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
			entryPoint: CONTRACT_ADDRESSES.entryPoint
		});

		// Initialize AA builder
		const builder = await Presets.Builder.SimpleAccount.init(
			accountSigner,
			NERO_CHAIN_CONFIG.rpcUrl,
			{
				overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
				entryPoint: CONTRACT_ADDRESSES.entryPoint,
				factory: CONTRACT_ADDRESSES.accountFactory
			}
		);

		// Configure gas parameters
		const gasParams = {
			callGasLimit: '0x1388',
			verificationGasLimit: '0x61A8',
			preVerificationGas: '0x1F40',
			maxFeePerGas: '0x9502F900',
			maxPriorityFeePerGas: '0x3B9ACA00'
		};

		// Set gas parameters
		builder.setCallGasLimit(gasParams.callGasLimit);
		builder.setVerificationGasLimit(gasParams.verificationGasLimit);
		builder.setPreVerificationGas(gasParams.preVerificationGas);
		builder.setMaxFeePerGas(gasParams.maxFeePerGas);
		builder.setMaxPriorityFeePerGas(gasParams.maxPriorityFeePerGas);

		// Configure paymaster for sponsored transactions (free)
		const paymasterOptions = {
			apikey: options?.apiKey || API_KEY,
			rpc: AA_PLATFORM_CONFIG.paymasterRpc,
			type: '0' // Type 0 = sponsored/free gas
		};

		// Set paymaster options
		builder.setPaymasterOptions(paymasterOptions);

		// Create contract instance
		const contract = new ethers.Contract(contractAddress, contractAbi, ethers.getDefaultProvider());

		// Encode function call
		const callData = contract.interface.encodeFunctionData(functionName, functionParams);

		// Create the UserOperation
		const userOp = await builder.execute(contractAddress, 0, callData);

		console.log('Sending UserOperation to paymaster...');

		// Send the UserOperation
		const res = await client.sendUserOperation(userOp);
		console.log('UserOperation sent with hash:', res.userOpHash);

		// Wait for the transaction to be included
		const receipt = await res.wait();
		if (!receipt) {
			throw new Error('Transaction receipt is null');
		}
		console.log('Transaction mined in block:', receipt.blockNumber);

		return {
			userOpHash: res.userOpHash,
			transactionHash: receipt.transactionHash,
			receipt: receipt
		};
	} catch (error) {
		console.error('Error executing operation:', error);
		throw error;
	}
};

export const mintEscrow = async (
	accountSigner: ethers.Signer,
	clientAddress: string,
	amount: string,
	options?: {
		apiKey?: string;
		gasMultiplier?: number;
	}
) => {
	try {
		return await executeSponsoredOperation(
			accountSigner,
			CONTRACT_ADDRESSES.escrowContract,
			ESCROW_ABI,
			'mintEscrow',
			[clientAddress, amount],
			options
		);
	} catch (error) {
		console.error('Error creating escrow:', error);
		throw error;
	}
};