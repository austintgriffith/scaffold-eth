import { Provider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useState, useCallback } from 'react';

import { useOnRepetition } from '~~/useOnRepetition';

const zero = BigNumber.from(0);

/**
 * Gets your balance in ETH from given address and provider
 *   
 * ~ Features ~
  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
 * @param provider 
 * @param address 
 * @param pollTime 
 * @returns 
 */
export const useBalance = (provider: Provider | undefined, address: string, pollTime: number = 0): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>();

  const pollBalance = useCallback(
    async (provider?: Provider, address?: string): Promise<void> => {
      if (provider && address) {
        const newBalance = await provider.getBalance(address);
        if (!newBalance.eq(balance ?? zero)) {
          setBalance(newBalance);
          console.log(address, newBalance.toString(), balance);
        }
      }
    },
    [balance]
  );

  useOnRepetition(
    pollBalance,
    { pollTime, provider, leadTrigger: address != null && address !== '' && provider != null },
    provider,
    address
  );
  return balance ?? zero;
};
