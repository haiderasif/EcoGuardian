import React, { createContext, useState, useContext } from "react";

const WalkthroughContext = createContext();

export const WalkthroughProvider = ({ children }) => {
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);

  return (
    <WalkthroughContext.Provider
      value={{ isWalkthroughActive, setIsWalkthroughActive }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
};

export const useWalkthrough = () => useContext(WalkthroughContext);
