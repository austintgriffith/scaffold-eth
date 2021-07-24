import { utils } from 'ethers';
import { useEffect, useState } from 'react';

import { TEthersProvider } from '~~/models/providerTypes';

/**
 * Checks whether a contract exists on the blockchain, returns true if it exists, otherwise false
 * 
  ~ Features ~
  - Provide contractAddress to check if the contract is deployed
  - Change provider to check contract address on different chains (ex. mainnetProvider)
 * @param provider 
 * @param contractAddress 
 * @returns 
 */
export const useContractExistsAtAddress = (provider: TEthersProvider | undefined, contractAddress: string): boolean => {
  const [contractIsDeployed, setContractIsDeployed] = useState(false);

  useEffect(() => {
    /**
     * We can look at the blockchain and see what's stored at `contractAddress`
     * If we find code then we know that a contract exists there.
     * If we find nothing (0x0) then there is no contract deployed to that address
     * @returns
     */
    const checkDeployment = async (): Promise<void> => {
      if (!utils.isAddress(contractAddress)) {
        return;
      }
      if (provider) {
        const bytecode = await provider.getCode(contractAddress);
        setContractIsDeployed(bytecode !== '0x');
      }
    };

    void checkDeployment();
  }, [provider, contractAddress]);

  return contractIsDeployed;
};
