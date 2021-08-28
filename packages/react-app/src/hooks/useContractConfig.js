import { useState, useEffect } from "react";
import { loadAppContracts } from "../helpers/loadAppContracts";
import { TContractConfig } from "eth-hooks/lib";

export const useContractConfig = () => {
  const [contractsConfig, setContractsConfig] = useState({});

  useEffect(() => {
    const loadFunc = async () => {
      const result = await loadAppContracts();
      setContractsConfig(result);
    };
    void loadFunc();
  }, []);
  return contractsConfig;
};
