import React from "react";
import ReactDOM from "react-dom/client";
import WrapperApp from "./App.tsx";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect-v2";
import { metaMask, metamaskHooks } from "./blockchain/connector/metamask.ts";
import {
  walletConnect,
  walletConnectHooks,
} from "./blockchain/connector/walletConnect.ts";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import "./index.css";
import { AppContext } from "./context/AppContext.tsx";

const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
  [metaMask, metamaskHooks],
  [walletConnect, walletConnectHooks],
];
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3ReactProvider connectors={connectors}>
      <AppContext>
        <WrapperApp />
      </AppContext>
    </Web3ReactProvider>
  </React.StrictMode>
);
