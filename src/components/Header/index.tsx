import { useWeb3React } from "@web3-react/core";
import { ConnectorKey } from "../../blockchain/connector";
import { useAuth } from "../../hooks/useAuth";
import { Context } from "../../context/AppContext";
import { useContext } from "react";

const Header = () => {
  const { login, logout } = useAuth();
  const { account } = useWeb3React();
  const context = useContext(Context);

  const handleSelectedWallet = async (walletType: ConnectorKey) => {
    const response = await login(walletType);
    if (response) {
      console.log("response");
    }
  };

  return (
    <>
      {account && context && context.isLogin ? (
        <>{account}</>
      ) : (
        <button
          onClick={() => {
            handleSelectedWallet(ConnectorKey.metamask);
          }}
        >
          Meta Mask
        </button>
      )}
      <button
        onClick={() => {
          handleSelectedWallet(ConnectorKey.walletConnect);
        }}
      >
        Wallet Connect
      </button>
      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </>
  );
};
export default Header;
