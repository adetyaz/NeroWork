/** @type import('hardhat/config').HardhatUserConfig */
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-ignition-ethers';
import { vars } from 'hardhat/config';

const NERO_TESTNET_PROVIDER_URL = vars.get('NERO_TESTNET_PROVIDER_URL');
const PRIVATE_KEY = vars.get('PRIVATE_KEY');
const ETHERSCAN_API_KEY = vars.get('ETHERSCAN_API_KEY'); //(optional)

const config = {
	solidity: '0.8.24',
	defaultNetwork: 'nero_testnet',
	networks: {
		nero_testnet: {
			url: NERO_TESTNET_PROVIDER_URL,
			accounts: [PRIVATE_KEY]
		}
	},
	etherscan: {
		//(optional)
		apiKey: ETHERSCAN_API_KEY,
		customChains: [
			{
				network: 'nero_testnet',
				chainId: 689,
				urls: {
					apiURL: 'https://api-testnet.neroscan.io/api',
					browserURL: 'https://testnet.neroscan.io'
				}
			}
		],
		enabled: true
	}
};
export default config;
