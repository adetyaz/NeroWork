export const NERO_CHAIN_CONFIG = {
	chainId: 689,
	chainName: 'NERO Chain Testnet',
	rpcUrl: 'https://rpc-testnet.nerochain.io',
	currency: 'NERO',
	explorer: 'https://testnet.neroscan.io'
};

export const AA_PLATFORM_CONFIG = {
	bundlerRpc: 'https://bundler.service.nerochain.io',
	paymasterRpc: 'https://paymaster-testnet.nerochain.io'
};

export const CONTRACT_ADDRESSES = {
	entryPoint: '0x6FD137E4b0FcAD79DcA30b7CF57E578a046d3389',
	accountFactory: '0x9143Cc6185a34896126840746125a0E56976454',
	tokenPaymaster: '0x5a6680dFd4a77FEea0A7be291147768EaA2414ad',
	escrowContract: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
};

// Your API key from the NERO Chain AA Platform
export let API_KEY: string = process.env.PUBLIC_NERO_API_KEY;
