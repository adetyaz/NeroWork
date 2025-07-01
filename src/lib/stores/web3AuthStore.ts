import { writable } from 'svelte/store';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, UX_MODE, WEB3AUTH_NETWORK, type IProvider } from '@web3auth/base';

export interface Web3AuthState {
	web3auth: Web3Auth | null;
	provider: IProvider | null;
	user: any;
	isConnected: boolean;
	address: string;
	isLoading: boolean;
	error: string | null;
}

const initialState: Web3AuthState = {
	web3auth: null,
	provider: null,
	user: null,
	isConnected: false,
	address: '',
	isLoading: false,
	error: null
};

export const web3AuthStore = writable(initialState);

// Chain configuration for NERO testnet
const chainConfig = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: '0x2b1', // 689 in hex
	rpcTarget: 'https://rpc-testnet.nerochain.io',
	displayName: 'NERO Testnet',
	blockExplorerUrl: 'https://testnet.neroscan.io',
	ticker: 'NERO',
	tickerName: 'NERO'
};

// Web3Auth configuration
const web3AuthConfig = {
	clientId:
		import.meta.env.VITE_TESTNET_WEB3AUTH_ID ||
		'BJGIzOnYZGGH5Z6tSOQ8lnYZ0A53F4tqpg2kvdfZwpbC3ylZtVBbG-JDKaBukWjPga6p5-3FJlULz5J7xNEFaSM',
	web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
	chainConfig,
	uiConfig: {
		appName: 'NeroWork',
		mode: 'light' as const,
		useLogoLoader: true,
		theme: {
			primary: '#3B82F6'
		},
		uxMode: UX_MODE.REDIRECT,
		modalZIndex: '2147483647',
		loginMethodsOrder: ['google', 'facebook', 'email_passwordless']
	}
};

class Web3AuthService {
	private web3auth: Web3Auth | null = null;

	async init(): Promise<void> {
		try {
			web3AuthStore.update((state) => ({ ...state, isLoading: true, error: null }));

			this.web3auth = new Web3Auth({
				clientId: web3AuthConfig.clientId,
				web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
				uiConfig: web3AuthConfig.uiConfig
			});

			await this.web3auth.init();

			// Check if user is already logged in
			if (this.web3auth.connected) {
				await this.updateUserInfo();
			}

			web3AuthStore.update((state) => ({
				...state,
				web3auth: this.web3auth,
				isLoading: false
			}));
		} catch (error) {
			console.error('Web3Auth initialization error:', error);
			web3AuthStore.update((state) => ({
				...state,
				error: 'Failed to initialize Web3Auth',
				isLoading: false
			}));
		}
	}

	async login(): Promise<void> {
		if (!this.web3auth) {
			throw new Error('Web3Auth not initialized');
		}

		try {
			web3AuthStore.update((state) => ({ ...state, isLoading: true, error: null }));

			const web3authProvider = await this.web3auth.connect();

			if (web3authProvider) {
				await this.updateUserInfo();
			}
		} catch (error) {
			console.error('Login error:', error);
			web3AuthStore.update((state) => ({
				...state,
				error: 'Login failed',
				isLoading: false
			}));
		}
	}

	async logout(): Promise<void> {
		if (!this.web3auth) {
			return;
		}

		try {
			await this.web3auth.logout();
			web3AuthStore.set(initialState);
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	private async updateUserInfo(): Promise<void> {
		if (!this.web3auth || !this.web3auth.connected) {
			return;
		}

		try {
			const user = await this.web3auth.getUserInfo();
			const provider = this.web3auth.provider;

			// Get user's address
			let address = '';
			if (provider) {
				const accounts = (await provider.request({
					method: 'eth_accounts',
					params: []
				})) as string[];
				address = accounts[0] || '';
			}

			web3AuthStore.update((state) => ({
				...state,
				provider,
				user,
				isConnected: true,
				address,
				isLoading: false
			}));

			// Store for traditional wallet compatibility
			if (address) {
				localStorage.setItem('connectedWallet', address);
			}
		} catch (error) {
			console.error('Error getting user info:', error);
			web3AuthStore.update((state) => ({
				...state,
				error: 'Failed to get user info',
				isLoading: false
			}));
		}
	}

	async getProvider(): Promise<IProvider | null> {
		if (!this.web3auth || !this.web3auth.connected) {
			return null;
		}
		return this.web3auth.provider;
	}

	async getAccounts(): Promise<string[]> {
		const provider = await this.getProvider();
		if (!provider) return [];

		const accounts = (await provider.request({
			method: 'eth_accounts',
			params: []
		})) as string[];
		return accounts;
	}

	async signMessage(message: string): Promise<string> {
		const provider = await this.getProvider();
		if (!provider) throw new Error('Provider not available');

		const accounts = await this.getAccounts();
		if (accounts.length === 0) throw new Error('No accounts available');

		return provider.request({
			method: 'personal_sign',
			params: [message, accounts[0]]
		}) as Promise<string>;
	}
}

export const web3AuthService = new Web3AuthService();
