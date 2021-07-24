import { useCallback, useState } from 'react';

import { TEthersProvider } from '~~/models';
import { useOnRepetition } from '~~/useOnRepetition';

/**
 * Get the current block number
 * @param provider
 * @param pollTime if greater than 0, update the blocknumber on an interval
 * @returns
 */
export const useBlockNumber = (provider: TEthersProvider, pollTime: number = 0): number => {
  const [blockNumber, setBlockNumber] = useState<number>(0);

  const getBlockNumber = useCallback(async (): Promise<void> => {
    const nextBlockNumber = await provider.getBlockNumber();
    if (nextBlockNumber !== blockNumber) {
      setBlockNumber(nextBlockNumber);
    }
  }, [blockNumber, provider]);

  useOnRepetition(getBlockNumber, { provider, pollTime });

  return blockNumber;
};
