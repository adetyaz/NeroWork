import { writable } from 'svelte/store';
import type { PaymentOption, PaymasterToken } from '$lib/types/tokens';
import { SUPPORTED_PAYMENT_TOKENS } from '$lib/types/tokens';

// Token context store
export const selectedPaymentToken = writable<PaymentOption | null>(null);
export const availableTokens = writable<PaymentOption[]>(SUPPORTED_PAYMENT_TOKENS);
export const paymasterTokens = writable<PaymasterToken[]>([]);
export const gaslessEnabled = writable<boolean>(false);

// Token utility functions
export function getTokenBySymbol(symbol: string): PaymentOption | undefined {
	return SUPPORTED_PAYMENT_TOKENS.find((token) => token.symbol === symbol);
}

export function getTokenIcon(symbol: string): string {
	const token = getTokenBySymbol(symbol);
	return token?.icon || '/tokens/default.svg';
}

export function isGaslessToken(tokenId: string): boolean {
	const token = SUPPORTED_PAYMENT_TOKENS.find((t) => t.id === tokenId);
	return token?.gasless || false;
}

// Initialize default token (NERO for gasless transactions)
selectedPaymentToken.set(SUPPORTED_PAYMENT_TOKENS[0]); // NERO as default
