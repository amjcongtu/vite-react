import { useEffect, useState, useRef, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ConnectorKey, connectors } from "../blockchain/connector";
import { BSC_CHAIN_ID, BSC_CHAIN_NAME, BSC_SCAN_URL } from "../const/envs";
import { useWindowSize } from "./useWindowResize";
import { loginToServer } from "../apis/auth";
import { StorageUtils, removeStorageNotify } from "../storage";
import { AccessToken, WalletKey } from "../const";
import { Context } from "../context/AppContext";

export const useAuth = () => {
  const { isActive, connector, chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const currentChainIdRef = useRef<number | null>(null);
  const isDesktop = useWindowSize();
  const context = useContext(Context);

  useEffect(() => {
    if (!chainId && currentChainIdRef.current === Number(BSC_CHAIN_ID)) {
      setLoading(false);
      logout();
      setError("Wrong network please change to " + (BSC_CHAIN_NAME || ""));
    }
    currentChainIdRef.current = chainId || null;
  }, [chainId]);

  const connectWallet = async (connectorKey: ConnectorKey) => {
    console.log(connectorKey, "connectorKey");

    const connector = connectors[connectorKey];
    try {
      const objAddNetWork =
        connectorKey === ConnectorKey.metamask
          ? ({
              chainId: Number(BSC_CHAIN_ID),
              chainName: BSC_CHAIN_NAME || "Binance SmartChain Testnet",
              nativeCurrency: {
                name: "BNB",
                symbol: "bnb",
                decimals: 18,
              },
              rpcUrls: [BSC_SCAN_URL],
              blockExplorerUrls: [BSC_SCAN_URL],
            } as any)
          : Number(BSC_CHAIN_ID);
      console.log(objAddNetWork, "objAddNetWork");
      console.log(connector, "connector");

      await connector.activate(objAddNetWork);
      StorageUtils.setItem(WalletKey, connectorKey);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const handleSignMessage = async (walletType: ConnectorKey) => {
    try {
      const connector = connectors[walletType];
      if (connector?.provider) {
        const signer = new Web3Provider(connector?.provider).getSigner();
        const accountSigner = await signer.getAddress();

        const signature = await signer.signMessage(
          import.meta.env.VITE_APP_AUTH_MESSAGE_SIGN || ""
        );
        const response = await loginToServer(
          accountSigner,
          signature as string
        );
        StorageUtils.setItem(WalletKey, walletType);
        StorageUtils.setItem(AccessToken, response.token);
      }
    } catch (error: any) {
      if (error.code === "ACTION_REJECTED") {
        throw new Error("User denied message signature");
      } else {
        throw new Error(error.message);
      }
    }
  };
  const login = async (walletType: ConnectorKey) => {
    console.log("1");

    // eslint-disable-next-line no-debugger
    currentChainIdRef.current = null;
    logout();
    try {
      setLoading(true);
      setError("");

      const isMetamaskInstalled = window?.ethereum?.isMetaMask;
      if (!isDesktop && !isMetamaskInstalled) {
        setLoading(false);
        const metamaskAppDeepLink = `${
          import.meta.env.VITE_APP_METAMASK_APP_DEEP_LINK
        }${window.location.host}${window.location.pathname}`;
        window.location.assign(metamaskAppDeepLink);
        return;
      }

      if (!isMetamaskInstalled && walletType === ConnectorKey.metamask) {
        setLoading(false);
        setError("Metamask not installed");
        window.open(process.env.METAMASK_APP_DOWNLOAD_LINK, "_blank");
        return;
      }

      await connectWallet(walletType);
      await handleSignMessage(walletType);
      context && context.setIsLogin(true);
      console.log(context?.isLogin,'hihi');
      
      setLoading(false);

      return true;
    } catch (error: any) {
      console.error(error);
      setError(error?.message || "Oops, Something Went Wrong");
      logout();
      setLoading(false);
      return false;
    }
  };
  const logout = async () => {
    try {
      context && context.setIsLogin(false);
      connector.deactivate && (await connector.deactivate());
      // reset state -> update account when login metamask -> logout -> login wallet not update new account
      connector.resetState && connector.resetState();

      StorageUtils.removeItem(AccessToken);
      StorageUtils.removeItem(WalletKey);
      removeStorageNotify();
      localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    login,
    logout,
    setError,
    loading,
    error,
    isLogin: isActive && StorageUtils.getItem(AccessToken),
  };
};
