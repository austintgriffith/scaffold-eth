import { constants } from 'ethers';
import { useState, useEffect } from 'react';

import { TEthersProvider } from '~~/models';

/**
 * Gets address from given ENS name and provider
 * @param provider
 * @param ensName
 * @returns
 */
export const useResolveEnsName = (provider: TEthersProvider, ensName: string): string => {
  const [address, setAddress] = useState<string>(constants.AddressZero);

  useEffect(() => {
    if (provider) {
      void provider.resolveName(ensName).then((resolvedAddress: string) => setAddress(resolvedAddress));
    }
  }, [provider, ensName]);

  return address;
};
