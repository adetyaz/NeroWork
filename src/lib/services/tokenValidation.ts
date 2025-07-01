import { ethers } from 'ethers';
import { SUPPORTED_PAYMENT_TOKENS, type PaymentOption } from '../types/tokens.js';

/**
 * Token validation and security service
 */
export class TokenValidationService {
	private static instance: TokenValidationService;
	private validatedTokens: Map<string, boolean> = new Map();

	static getInstance(): TokenValidationService {
		if (!TokenValidationService.instance) {
			TokenValidationService.instance = new TokenValidationService();
		}
		return TokenValidationService.instance;
	}

	/**
	 * Validate if a token is safe to use
	 */
	async validateToken(
		provider: ethers.providers.Provider,
		token: PaymentOption
	): Promise<{
		isValid: boolean;
		isWhitelisted: boolean;
		errors: string[];
	}> {
		const errors: string[] = [];

		// Check if token is in our whitelist
		const isWhitelisted = SUPPORTED_PAYMENT_TOKENS.some(
			(t) =>
				t.id === token.id ||
				(t.contractAddress &&
					t.contractAddress.toLowerCase() === token.contractAddress?.toLowerCase())
		);

		if (!isWhitelisted) {
			errors.push('Token is not in whitelist');
		}

		// For native tokens, skip contract validation
		if (token.isNative) {
			return {
				isValid: errors.length === 0,
				isWhitelisted,
				errors
			};
		}

		// Check contract address format
		if (!token.contractAddress || !ethers.utils.isAddress(token.contractAddress)) {
			errors.push('Invalid contract address');
			return { isValid: false, isWhitelisted, errors };
		}

		// Check cache first
		const cacheKey = token.contractAddress.toLowerCase();
		if (this.validatedTokens.has(cacheKey)) {
			return {
				isValid: this.validatedTokens.get(cacheKey)! && errors.length === 0,
				isWhitelisted,
				errors
			};
		}

		try {
			// Basic contract validation
			const code = await provider.getCode(token.contractAddress);
			if (code === '0x') {
				errors.push('Contract does not exist');
				this.validatedTokens.set(cacheKey, false);
				return { isValid: false, isWhitelisted, errors };
			}

			// Try to call basic ERC-20 functions
			const tokenContract = new ethers.Contract(
				token.contractAddress,
				[
					'function name() view returns (string)',
					'function symbol() view returns (string)',
					'function decimals() view returns (uint8)',
					'function totalSupply() view returns (uint256)'
				],
				provider
			);

			// Test basic functions
			await Promise.all([
				tokenContract.name(),
				tokenContract.symbol(),
				tokenContract.decimals(),
				tokenContract.totalSupply()
			]);

			this.validatedTokens.set(cacheKey, true);
		} catch (error) {
			errors.push('Contract validation failed: ' + (error.message || 'Unknown error'));
			this.validatedTokens.set(cacheKey, false);
		}

		return {
			isValid: this.validatedTokens.get(cacheKey)! && errors.length === 0,
			isWhitelisted,
			errors
		};
	}

	/**
	 * Get security warnings for a token
	 */
	getSecurityWarnings(token: PaymentOption): string[] {
		const warnings: string[] = [];

		if (!token.gasless) {
			warnings.push('This token requires gas fees for transactions');
		}

		if (!SUPPORTED_PAYMENT_TOKENS.some((t) => t.id === token.id)) {
			warnings.push('This token is not officially supported by the platform');
		}

		return warnings;
	}

	/**
	 * Check if a token amount is reasonable (not too small or too large)
	 */
	validateAmount(
		token: PaymentOption,
		amount: string
	): {
		isValid: boolean;
		warnings: string[];
	} {
		const warnings: string[] = [];
		const amountNum = parseFloat(amount);

		if (amountNum <= 0) {
			return { isValid: false, warnings: ['Amount must be greater than 0'] };
		}

		// Check for dust amounts (too small)
		if (amountNum < 0.000001) {
			warnings.push('Amount is very small and may not be economical');
		}

		// Check for extremely large amounts
		if (amountNum > 1000000) {
			warnings.push('Amount is very large - please double-check');
		}

		// Token-specific checks
		if (token.symbol === 'NERO' && amountNum > 100000) {
			warnings.push('Large NERO amount - please verify');
		}

		if (['USDC', 'USDT', 'DAI'].includes(token.symbol) && amountNum > 50000) {
			warnings.push('Large stablecoin amount - please verify');
		}

		return {
			isValid: true,
			warnings
		};
	}
}

// Export singleton instance
export const tokenValidationService = TokenValidationService.getInstance();
