import { metaMask, metamaskHooks } from "./metamask";
import { walletConnect, walletConnectHooks } from "./walletConnect";

export enum ConnectorKey {
  metamask = 'MetaMask',
  walletConnect = 'WalletConnect',
}

export const connectors = {
  [ConnectorKey.metamask]: metaMask,
  [ConnectorKey.walletConnect]: walletConnect,
};

export const hooks = {
  [ConnectorKey.metamask]: metamaskHooks,
  [ConnectorKey.walletConnect]: walletConnectHooks,
};
