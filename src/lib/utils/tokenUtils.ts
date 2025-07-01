import { ethers } from 'ethers';
import type { PaymentOption } from '$lib/types/tokens';

// Standard ERC-20 ABI for token operations
export const ERC20_ABI = [
	'function balanceOf(address owner) view returns (uint256)',
	'function decimals() view returns (uint8)',
	'function transfer(address to, uint256 amount) returns (bool)',
	'function transferFrom(address from, address to, uint256 amount) returns (bool)',
	'function approve(address spender, uint256 amount) returns (bool)',
	'function allowance(address owner, address spender) view returns (uint256)',
	'function name() view returns (string)',
	'function symbol() view returns (string)'
];

/**
 * Get user's token balance
 */
export async function getTokenBalance(
	signer: ethers.Signer,
	token: PaymentOption
): Promise<string> {
	try {
		const userAddress = await signer.getAddress();

		if (token.isNative) {
			// Native token balance
			const balance = await signer.getBalance();
			return ethers.utils.formatEther(balance);
		} else {
			// ERC-20 token balance
			if (!token.contractAddress) {
				throw new Error(`No contract address for token ${token.symbol}`);
			}

			const tokenContract = new ethers.Contract(token.contractAddress, ERC20_ABI, signer);

			const decimals = await tokenContract.decimals();
			const balance = await tokenContract.balanceOf(userAddress);
			return ethers.utils.formatUnits(balance, decimals);
		}
	} catch (error) {
		console.error(`Error getting ${token.symbol} balance:`, error);
		return '0';
	}
}

/**
 * Check if user has sufficient token balance for payment + fees
 */
export async function checkSufficientBalance(
	signer: ethers.Signer,
	token: PaymentOption,
	amount: string,
	includeGasFee: boolean = true
): Promise<{ sufficient: boolean; balance: string; required: string }> {
	const balance = await getTokenBalance(signer, token);
	const balanceNum = parseFloat(balance);
	const amountNum = parseFloat(amount);

	// Add platform fee (0.2 tokens) and gas estimate
	let totalRequired = amountNum + 0.2; // Platform fee

	if (includeGasFee && token.isNative) {
		// Estimate gas for native token (roughly 0.001 NERO for simple transfer)
		totalRequired += 0.001;
	}

	return {
		sufficient: balanceNum >= totalRequired,
		balance: balance,
		required: totalRequired.toString()
	};
}

/**
 * Check and approve ERC-20 token spending if needed
 */
export async function checkAndApproveToken(
	signer: ethers.Signer,
	token: PaymentOption,
	spenderAddress: string,
	amount: string
): Promise<boolean> {
	if (token.isNative) {
		return true; // Native tokens don't need approval
	}

	if (!token.contractAddress) {
		throw new Error(`No contract address for token ${token.symbol}`);
	}

	try {
		const tokenContract = new ethers.Contract(token.contractAddress, ERC20_ABI, signer);

		const userAddress = await signer.getAddress();
		const decimals = await tokenContract.decimals();
		const amountWei = ethers.utils.parseUnits(amount, decimals);

		// Check current allowance
		const currentAllowance = await tokenContract.allowance(userAddress, spenderAddress);

		if (currentAllowance.gte(amountWei)) {
			return true; // Already approved
		}

		// Need to approve
		console.log(`Approving ${amount} ${token.symbol} for spending...`);
		const approveTx = await tokenContract.approve(spenderAddress, amountWei);
		await approveTx.wait();

		console.log(`${token.symbol} approval successful`);
		return true;
	} catch (error) {
		console.error(`Error approving ${token.symbol}:`, error);
		throw new Error(`Failed to approve ${token.symbol} spending: ${error}`);
	}
}

/**
 * Validate token contract (basic checks)
 */
export async function validateTokenContract(
	provider: ethers.providers.Provider,
	contractAddress: string
): Promise<{ valid: boolean; name?: string; symbol?: string; decimals?: number }> {
	try {
		const tokenContract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

		// Try to call basic ERC-20 functions
		const [name, symbol, decimals] = await Promise.all([
			tokenContract.name(),
			tokenContract.symbol(),
			tokenContract.decimals()
		]);

		return {
			valid: true,
			name,
			symbol,
			decimals: parseInt(decimals.toString())
		};
	} catch (error) {
		console.error('Token validation failed:', error);
		return { valid: false };
	}
}

/**
 * Get token price in USD (mock implementation - in production, use price oracle)
 */
export async function getTokenPriceUSD(token: PaymentOption): Promise<number> {
	// Mock prices - in production, integrate with price oracle like Chainlink or CoinGecko
	const mockPrices: Record<string, number> = {
		NERO: 0.15, // $0.15 per NERO
		USDC: 1.0, // $1.00 per USDC
		USDT: 1.0, // $1.00 per USDT
		DAI: 1.0 // $1.00 per DAI
	};

	return mockPrices[token.symbol] || 0;
}

/**
 * Convert amount from one token to another based on USD prices
 */
export async function convertTokenAmount(
	fromToken: PaymentOption,
	toToken: PaymentOption,
	amount: string
): Promise<string> {
	const fromPrice = await getTokenPriceUSD(fromToken);
	const toPrice = await getTokenPriceUSD(toToken);

	if (fromPrice === 0 || toPrice === 0) {
		throw new Error('Unable to get token prices for conversion');
	}

	const amountNum = parseFloat(amount);
	const usdValue = amountNum * fromPrice;
	const convertedAmount = usdValue / toPrice;

	return convertedAmount.toFixed(6);
}
