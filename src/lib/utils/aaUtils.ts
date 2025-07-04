import { ethers } from 'ethers';
import { Client, Presets } from 'userop';
import { NERO_CHAIN_CONFIG, AA_PLATFORM_CONFIG, CONTRACT_ADDRESSES, API_KEY } from '../config';

// Extend the Window interface to include the ethereum property
declare global {
	interface Window {
		ethereum?: any;
	}
}

const NFT_ABI = [
	'function mint(address to, string memory uri) external',
	'function tokenURI(uint256 tokenId) external view returns (string memory)',
	'function balanceOf(address owner) external view returns (uint256)'
];

// Get Ethereum provider
export const getProvider = () => {
	return new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
};

// Get signer from browser wallet
export const getSigner = async () => {
	if (typeof window === 'undefined' || !window.ethereum) {
		throw new Error('No crypto wallet found. Please install MetaMask.');
	}

	try {
		// Request account access

		await window.ethereum.request({ method: 'eth_requestAccounts' });

		// Create provider and signer

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();

		// Verify the signer by getting its address
		const address = await signer.getAddress();
		console.log('Connected wallet address:', address);

		return signer;
	} catch (error) {
		console.error('Error connecting to wallet:', error);
		throw error;
	}
};

// Initialize AA Client
export const initAAClient = async (accountSigner: ethers.Signer) => {
	return await Client.init(NERO_CHAIN_CONFIG.rpcUrl, {
		overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
		entryPoint: CONTRACT_ADDRESSES.entryPoint
	});
};

// Get AA wallet address for a signer
export const getAAWalletAddress = async (accountSigner: ethers.Signer) => {
	try {
		// Ensure we have a valid signer with getAddress method
		if (!accountSigner || typeof accountSigner.getAddress !== 'function') {
			throw new Error('Invalid signer object: must have a getAddress method');
		}

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

export const initAABuilder = async (accountSigner: ethers.Signer, apiKey?: string) => {
	try {
		// Ensure we have a valid signer with getAddress method
		if (!accountSigner || typeof accountSigner.getAddress !== 'function') {
			throw new Error('Invalid signer object: must have a getAddress method');
		}

		// Get the signer address to verify it's working
		const signerAddress = await accountSigner.getAddress();
		console.log('Initializing AA builder for address:', signerAddress);

		// Initialize the SimpleAccount builder
		const builder = await Presets.Builder.SimpleAccount.init(
			accountSigner,
			NERO_CHAIN_CONFIG.rpcUrl,
			{
				overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
				entryPoint: CONTRACT_ADDRESSES.entryPoint,
				factory: CONTRACT_ADDRESSES.accountFactory
			}
		);

		// Set API key for paymaster
		const currentApiKey = apiKey || API_KEY;

		// Set paymaster options with API key
		builder.setPaymasterOptions({
			apikey: currentApiKey,
			rpc: AA_PLATFORM_CONFIG.paymasterRpc,
			type: '0' // Default to free (sponsored gas)
		});

		// Set gas parameters for the UserOperation
		builder.setCallGasLimit(300000);
		builder.setVerificationGasLimit(2000000);
		builder.setPreVerificationGas(100000);

		return builder;
	} catch (error) {
		console.error('Error initializing AA builder:', error);
		throw error;
	}
};

// ts-expect-error anticipated to be a preset
export const setPaymentType = (builder: any, paymentType: number, tokenAddress: string = '') => {
	// ts-expect-error anticipated to be a preset
	const paymasterOptions: any = {
		type: paymentType.toString(),
		apikey: API_KEY,
		rpc: AA_PLATFORM_CONFIG.paymasterRpc
	};

	// Add token address if ERC20 payment is selected
	if (paymentType > 0 && tokenAddress) {
		paymasterOptions.token = tokenAddress;
	}

	builder.setPaymasterOptions(paymasterOptions);
	return builder;
};

export const executeOperation = async (
	accountSigner: ethers.Signer,
	contractAddress: string,
	contractAbi: any,
	functionName: string,
	functionParams: any[],
	paymentType: number = 0,
	selectedToken: string = '',
	options?: {
		apiKey?: string;
		gasMultiplier?: number;
		value?: ethers.BigNumber; // Added value parameter for native token transfers
	}
) => {
	try {
		// Validate signer
		if (!accountSigner || typeof accountSigner.getAddress !== 'function') {
			throw new Error('Invalid signer: missing getAddress method');
		}

		// Initialize client
		const client = await initAAClient(accountSigner);

		// Initialize builder with paymaster
		const builder = await initAABuilder(accountSigner, options?.apiKey);

		// Set payment type and token if specified
		if (paymentType > 0 && selectedToken) {
			// Set payment options for ERC20 tokens
			builder.setPaymasterOptions({
				apikey: options?.apiKey || API_KEY,
				rpc: AA_PLATFORM_CONFIG.paymasterRpc,
				type: paymentType.toString(),
				token: selectedToken
			});
		} else {
			// Set default payment options (sponsored)
			builder.setPaymasterOptions({
				apikey: options?.apiKey || API_KEY,
				rpc: AA_PLATFORM_CONFIG.paymasterRpc,
				type: paymentType.toString()
			});
		}

		// Create contract instance
		const contract = new ethers.Contract(contractAddress, contractAbi, getProvider());
		// Encode function call data
		const callData = contract.interface.encodeFunctionData(functionName, functionParams);

		// Set transaction data in the builder, including value for native token transfers if provided
		const value = options?.value || ethers.BigNumber.from(0);
		console.log('Transaction value (native token):', value.toString());
		const userOp = await builder.execute(contractAddress, value, callData);

		// Send the user operation
		console.log('Sending UserOperation to bundler');
		const res = await client.sendUserOperation(userOp);

		console.log('UserOperation sent with hash:', res.userOpHash);

		// Wait for the transaction to be included
		const receipt = await res.wait();

		// Log transaction hash when available
		if (receipt && receipt.transactionHash) {
			console.log('Transaction mined:', receipt.transactionHash);
		}

		// Return operation results
		return {
			userOpHash: res.userOpHash,
			transactionHash: receipt?.transactionHash || '',
			receipt: receipt
		};
	} catch (error) {
		console.error('Error executing operation:', error);
		throw error;
	}
};

// Function to execute a contract call via AA with sponsored gas
export const executeSponsoredOperation = async (
	accountSigner: ethers.Signer,
	contractAddress: string,
	contractAbi: ethers.ContractInterface,
	functionName: string,
	functionParams: ethers.utils.Result | never[],
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

export const mintNFT = async (
	accountSigner: ethers.Signer,
	recipientAddress: string,
	metadataUri: string,
	paymentType: number = 0,
	selectedToken: string = '',
	options?: {
		apiKey?: string;
		gasMultiplier?: number;
	}
) => {
	try {
		// Execute the mint function with sponsored gas
		return await executeOperation(
			accountSigner,
			CONTRACT_ADDRESSES.nftContract,
			NFT_ABI,
			'mint',
			[recipientAddress, metadataUri],
			paymentType,
			selectedToken,
			options
		);
	} catch (error) {
		console.error('Error minting NFT:', error);
		throw error;
	}
};

export const getSupportedTokens = async (client: any, builder: any) => {
	try {
		// Make sure the builder is initialized
		if (!builder) {
			throw new Error('Builder not initialized');
		}

		// Get the AA wallet address
		const sender = await builder.getSender();
		console.log('Getting supported tokens for wallet:', sender);

		// Create a minimal UserOp for querying tokens
		const minimalUserOp = {
			sender,
			nonce: '0x0',
			initCode: '0x',
			callData: '0x',
			callGasLimit: '0x88b8',
			verificationGasLimit: '0x33450',
			preVerificationGas: '0xc350',
			maxFeePerGas: '0x2162553062',
			maxPriorityFeePerGas: '0x40dbcf36',
			paymasterAndData: '0x',
			signature: '0x'
		};

		// Setup provider for paymaster API call
		const provider = new ethers.providers.JsonRpcProvider(AA_PLATFORM_CONFIG.paymasterRpc);
		console.log('Connecting to paymaster RPC at:', AA_PLATFORM_CONFIG.paymasterRpc);

		// Log API key (redacted for security)
		const maskedApiKey = API_KEY
			? `${API_KEY.substring(0, 4)}...${API_KEY.substring(API_KEY.length - 4)}`
			: 'undefined';
		console.log(`Using API key: ${maskedApiKey}`);

		// Try different parameter formats for the paymaster API
		let tokensResponse;

		try {
			// First format attempt: [userOp, apiKey, entryPoint]
			console.log('Trying first parameter format for pm_supported_tokens');
			tokensResponse = await provider.send('pm_supported_tokens', [
				minimalUserOp,
				API_KEY,
				CONTRACT_ADDRESSES.entryPoint
			]);
		} catch (formatError) {
			console.warn('First parameter format failed:', formatError);

			try {
				// Second format attempt: { userOp, entryPoint, apiKey }
				console.log('Trying second parameter format for pm_supported_tokens');
				tokensResponse = await provider.send('pm_supported_tokens', [
					{
						userOp: minimalUserOp,
						entryPoint: CONTRACT_ADDRESSES.entryPoint,
						apiKey: API_KEY
					}
				]);
			} catch (format2Error) {
				console.warn('Second parameter format failed:', format2Error);

				// Third format attempt: { op, entryPoint }
				console.log('Trying third parameter format for pm_supported_tokens');
				tokensResponse = await provider.send('pm_supported_tokens', [
					{
						op: minimalUserOp,
						entryPoint: CONTRACT_ADDRESSES.entryPoint
					}
				]);
			}
		}

		console.log('Tokens response:', tokensResponse);

		// Transform and return the results
		if (!tokensResponse) {
			console.log('No tokens response received');
			return [];
		}

		// Handle different response formats
		let tokens = [];
		if (tokensResponse.tokens) {
			tokens = tokensResponse.tokens;
		} else if (Array.isArray(tokensResponse)) {
			tokens = tokensResponse;
		} else if (typeof tokensResponse === 'object') {
			// Try to find tokens in the response object
			const possibleTokensArray = Object.values(tokensResponse).find((val) => Array.isArray(val));
			if (possibleTokensArray && Array.isArray(possibleTokensArray)) {
				tokens = possibleTokensArray as any[];
			}
		}

		if (tokens.length === 0) {
			console.log('No tokens found in response');
			return [];
		}

		// Log the raw token response for debugging
		console.log('Raw tokens response:', JSON.stringify(tokensResponse));

		// Try to find flags in the response that might indicate token types
		const isArrayWithFreepayFlag = tokens.some(
			(t: any) => 'freepay' in t || 'prepay' in t || 'postpay' in t
		);

		if (isArrayWithFreepayFlag) {
			console.log('Detected payment type flags in token response');
		}

		const mappedTokens = tokens.map((token: any) => {
			// Ensure token type is a valid number
			let tokenType = 1; // Default to type 1 (prepay)

			// Check if this is from a response with prepay/postpay flags
			if ('freepay' in token || 'prepay' in token || 'postpay' in token) {
				if (token.freepay === true) {
					tokenType = 0; // Sponsored
				} else if (token.prepay === true) {
					tokenType = 1; // Prepay
				} else if (token.postpay === true) {
					tokenType = 2; // Postpay
				}
			}
			// Try to parse the type if it exists
			else if (token.type !== undefined) {
				if (typeof token.type === 'number' && !isNaN(token.type)) {
					tokenType = token.type;
				} else if (typeof token.type === 'string') {
					const parsedType = parseInt(token.type);
					if (!isNaN(parsedType)) {
						tokenType = parsedType;
					}
				}
			}

			// Create the token object with normalized properties
			return {
				address: token.token || token.address,
				decimal: parseInt(token.decimal || token.decimals || '18'),
				symbol: token.symbol,
				type: tokenType,
				price: token.price ? parseFloat(token.price) : undefined,
				// Add the original flags for debugging and alternative filtering
				prepay: token.prepay === true,
				postpay: token.postpay === true,
				freepay: token.freepay === true
			};
		});

		console.log('Mapped tokens:', mappedTokens);
		return mappedTokens;
	} catch (error) {
		console.error('Error fetching supported tokens:', error);
		// Include paymaster URL in error for debugging
		console.error('Paymaster URL:', AA_PLATFORM_CONFIG.paymasterRpc);
		return [];
	}
};
