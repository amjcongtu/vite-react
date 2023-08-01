import { useContext, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAuth } from './useAuth';
import { AccessToken, WalletKey } from '../const';
import { StorageUtils } from '../storage';
import { ConnectorKey } from '../blockchain/connector';
import { walletConnect } from '../blockchain/connector/walletConnect';
import { Context } from '../context/AppContext';
import { metaMask } from '../blockchain/connector/metamask';

/**
 * Trying eager connect to connectors at first time.
 * @returns `tried` tried eager connect done or not
 */
export function useEagerConnect() {
  const { isActive, connector, account } = useWeb3React();
  const [tried, setTried] = useState(false);
  const { logout } = useAuth();
  const wallet = window.localStorage.getItem(WalletKey);
  const accessToken = StorageUtils.getItem(AccessToken);
  const context = useContext(Context);

  useEffect(() => {
    if (!isActive) {
      if (wallet === ConnectorKey.walletConnect) {
        walletConnect
          .connectEagerly()
          .then(() => {
            if (accessToken) {
              context && context.setIsLogin(true);
            }
            setTried(true);
          })
          .catch((error) => {
            console.error('Failed to connect eagerly to walletconnect', error);
            setTried(true);
          });
      } else if (wallet === ConnectorKey.metamask) {
        metaMask
          .connectEagerly()
          .then(() => {
            if (accessToken) {
              context && context.setIsLogin(true);
            }
            setTried(true);
          })
          .catch((error) => {
            console.error('Failed to connect eagerly to walletconnect', error);
            setTried(true);
          });
      }
    }
    // Update `tried` only when isActive was `true`
  }, []);

  const checkNetwork = (value: string) => {
    if (value !== process.env.BSC_HEX_CHAIN_ID) {
      logout();
    }
  };

  useEffect(() => {
    if (connector && connector.provider) {
      connector.provider.on('chainChanged', checkNetwork);
      return () => {
        connector.provider?.removeListener('chainChanged', checkNetwork);
      };
    }
  }, [connector.provider, context?.setIsLogin]);

  useEffect(() => {
    if (connector && connector.provider) {
      const checkSameAccount = (res: string[]) => {
        if (res && res.length > 0) {
          if (res[0].toLowerCase() !== account?.toLocaleLowerCase()) {
            logout();
          }
        }
      };
      connector.provider.on('accountsChanged', checkSameAccount);
      return () => {
        connector.provider?.removeListener('accountsChanged', logout);
      };
    }
  }, [connector.provider, account]);
  return tried;
}
