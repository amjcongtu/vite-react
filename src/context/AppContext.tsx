
import React, { useState } from 'react';
export const Context = React.createContext<
  | {
  
      isLogin: boolean;
      setIsLogin: (open: boolean) => void;
    }
  | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
}

export const AppContext = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Context.Provider
      value={{
        isLogin,
        setIsLogin,
      }}
    >
      {children}
      {/* <ConnectWalletModal
        open={connectWalletModalOpen}
        onClose={handleModalClose}
      /> */}
    </Context.Provider>
  );
};
