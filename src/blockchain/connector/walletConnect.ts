import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { CHAINS } from '../config/chain';
import { BSC_CHAIN_ID, BSC_RPC_URL } from '../../const/envs';

const [mainnet] = Object.keys(CHAINS).map(Number);
export const [walletConnect, walletConnectHooks] =
  initializeConnector<WalletConnectV2>(
    (actions) =>
      new WalletConnectV2({
        actions,
        options: {
          projectId: import.meta.env.VITE_APP_WALLET_CONNECT_PROJECT_ID as string,
          chains: [mainnet],
          showQrModal: true,
          rpcMap: {
            [BSC_CHAIN_ID]: BSC_RPC_URL,
          },
          events: ['accountsChanged', 'chainChanged'],
        },
      }),
  );
