import React from "react";

import { EthersContext } from "../context";
import { useGasPrice } from "../hooks";

export default function EthersContextProvider({ children }) {

  const gasPrice = useGasPrice("fast");
  const provider = 1
  const value = {
    gasPrice,
    provider
  }
  return <EthersContext.Provider value={value}>{children}</EthersContext.Provider>;
}