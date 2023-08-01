import type { AddEthereumChainParameter } from '@web3-react/types';
import { BSC_CHAIN_ID, BSC_CHAIN_NAME, BSC_RPC_URL } from '../../const/envs';
interface BasicChainInformation {
	urls: string[];
	name: string;
}
interface ExtendedChainInformation extends BasicChainInformation {
	nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
	blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

type ChainConfig = {
	[chainId: number]: BasicChainInformation | ExtendedChainInformation;
};


export const CHAINS: ChainConfig = {
	[BSC_CHAIN_ID]: {
		urls: [BSC_RPC_URL].filter(Boolean),
		name: BSC_CHAIN_NAME,
	},
};
