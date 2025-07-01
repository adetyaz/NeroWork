// Token types for multi-token payment support
export interface TokenBase {
	balance: string;
	contractAddress: string;
	decimals: string;
	name: string;
	symbol: string;
	type: string;
}

export interface ERC20Token extends TokenBase {
	logo?: string;
	type: 'ERC-20';
	decimals: string;
}

export interface NativeToken extends TokenBase {
	logo?: string;
	type: 'native';
	decimals: string;
}

export type Token = (ERC20Token | NativeToken) & {
	isNative: boolean;
	price?: string; // USD price for display
};

export interface PaymasterToken {
	token: string; // contract address
	symbol: string;
	name: string;
	decimals: number;
	price: string; // gas cost in this token
	type: 'native' | 'ERC-20';
	logo?: string;
}

export interface PaymentOption {
	id: string;
	name: string;
	symbol: string;
	icon: string;
	contractAddress?: string;
	isNative: boolean;
	gasless?: boolean; // if paymaster sponsors gas
}

// Supported tokens on NERO Chain for payments
export const SUPPORTED_PAYMENT_TOKENS: PaymentOption[] = [
	{
		id: 'nero',
		name: 'NERO',
		symbol: 'NERO',
		icon: '/tokens/default.svg',
		isNative: true,
		gasless: true
	},
	{
		id: 'usdc',
		name: 'USD Coin',
		symbol: 'USDC',
		icon: '/tokens/usdc.svg',
		contractAddress: '0xC86Fed58edF0981e927160C50ecB8a8B05B32fed',
		isNative: false,
		gasless: true
	},
	{
		id: 'usdt',
		name: 'Tether USD',
		symbol: 'USDT',
		icon: '/tokens/usdt.png',
		contractAddress: '0x1dA998CfaA0C044d7205A17308B20C7de1bdCf74',
		isNative: false,
		gasless: false
	},
	{
		id: 'dai',
		name: 'Dai Stablecoin',
		symbol: 'DAI',
		icon: '/tokens/dai.png',
		contractAddress: '0x5d0E342cCD1aD86a16BfBa26f404486940DBE345',
		isNative: false,
		gasless: false
	}
];
