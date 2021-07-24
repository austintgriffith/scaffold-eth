import { useState, useEffect } from 'react';
import { loadAppContracts } from '~~/helpers/loadAppContracts';
import { TContractConfig } from 'eth-hooks/lib';

export const useContractConfig = (): TContractConfig => {
  const [contractsConfig, setContractsConfig] = useState<TContractConfig>({});

  useEffect(() => {
    const loadFunc = async (): Promise<void> => {
      const result = await loadAppContracts();
      setContractsConfig(result);
    };
    void loadFunc();
  }, []);
  return contractsConfig;
};
