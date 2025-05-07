import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types';

declare module 'hardhat/types' {
	interface HardhatRuntimeEnvironment {
		ethers: HardhatEthersHelpers;
	}
}
