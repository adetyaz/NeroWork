import { writable } from 'svelte/store';

export interface PaymasterState {
	isEnabled: boolean;
	sponsorMode: 'FREE_GAS' | 'TOKEN_PAYMENT' | 'DISABLED';
	selectedPaymentToken: string | null;
	isFirstTimeUser: boolean;
	gasBalance: string;
	sponsorshipInfo: {
		freeGasAvailable: boolean;
		dailyLimit: string;
		usedToday: string;
	};
}

const initialState: PaymasterState = {
	isEnabled: false,
	sponsorMode: 'FREE_GAS',
	selectedPaymentToken: null,
	isFirstTimeUser: false,
	gasBalance: '0',
	sponsorshipInfo: {
		freeGasAvailable: true,
		dailyLimit: '10',
		usedToday: '0'
	}
};

export const paymasterStore = writable(initialState);

class PaymasterService {
	async checkFirstTimeUser(address: string): Promise<boolean> {
		try {
			// Check if user has made any transactions before
			const response = await fetch(
				`https://api-testnet.neroscan.io/api/account/${address}/transactions`
			);
			const data = await response.json();

			const isFirstTime = !data.result || data.result.length === 0;

			paymasterStore.update((state) => ({
				...state,
				isFirstTimeUser: isFirstTime
			}));

			return isFirstTime;
		} catch (error) {
			console.error('Error checking first-time user status:', error);
			return false;
		}
	}

	async enableSponsorship() {
		paymasterStore.update((state) => ({
			...state,
			isEnabled: true,
			sponsorMode: 'FREE_GAS'
		}));
	}

	async setTokenPayment(token: string) {
		paymasterStore.update((state) => ({
			...state,
			isEnabled: true,
			sponsorMode: 'TOKEN_PAYMENT',
			selectedPaymentToken: token
		}));
	}

	async disablePaymaster() {
		paymasterStore.update((state) => ({
			...state,
			isEnabled: false,
			sponsorMode: 'DISABLED',
			selectedPaymentToken: null
		}));
	}

	async getSponsorshipInfo(address: string) {
		try {
			// Mock API call - replace with actual paymaster service
			const info = {
				freeGasAvailable: true,
				dailyLimit: '10',
				usedToday: '2'
			};

			paymasterStore.update((state) => ({
				...state,
				sponsorshipInfo: info
			}));

			return info;
		} catch (error) {
			console.error('Error getting sponsorship info:', error);
			return null;
		}
	}

	async buildPaymasterUserOp(
		userOp: any,
		paymentMode: 'FREE_GAS' | 'TOKEN_PAYMENT',
		token?: string
	) {
		try {
			const paymasterUrl = 'https://paymaster-testnet.nerochain.io';

			const requestBody = {
				method:
					paymentMode === 'FREE_GAS' ? 'pm_sponsorUserOperation' : 'pm_buildUserOpWithTokenPayment',
				params:
					paymentMode === 'FREE_GAS'
						? [userOp, '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789']
						: [userOp, '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789', token],
				id: Date.now(),
				jsonrpc: '2.0'
			};

			const response = await fetch(paymasterUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody)
			});

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error.message);
			}

			return data.result;
		} catch (error) {
			console.error('Paymaster error:', error);
			throw error;
		}
	}

	async estimateGasCost(userOp: any): Promise<string> {
		try {
			// Estimate gas cost for the operation
			const gasPrice = '20000000000'; // 20 gwei
			const gasLimit = '300000'; // Estimated gas limit

			const gasCost = (BigInt(gasPrice) * BigInt(gasLimit)).toString();
			return gasCost;
		} catch (error) {
			console.error('Error estimating gas cost:', error);
			return '0';
		}
	}
}

export const paymasterService = new PaymasterService();
