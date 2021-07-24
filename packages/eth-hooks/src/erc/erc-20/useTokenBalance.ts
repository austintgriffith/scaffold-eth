import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { useCallback, useState } from 'react';

import { useOnRepetition } from '~~/useOnRepetition';

/**
 * Get the balance of an ERC20 token in an address
 * 
 * ~ Features ~
  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
 * @param contract contract object for the ERC20 token
 * @param address
 * @param pollTime
 * @returns
 */
export const useTokenBalance = (contract: Contract, address: string, pollTime: number = 0): BigNumber => {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));

  const pollBalance = useCallback(async (): Promise<void> => {
    if (contract != null) {
      try {
        // eslint-disable-next-line
        const newBalance = await contract.balanceOf(address);
        if (newBalance !== balance) {
          setBalance(newBalance);
        }
      } catch (e) {
        console.log('⚠ Could not get token balance', e);
      }
    }
  }, [address, balance, contract]);

  useOnRepetition(pollBalance, { pollTime, leadTrigger: contract?.provider != null });

  return balance;
};
