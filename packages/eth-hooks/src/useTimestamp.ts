import { useState, useEffect } from 'react';

import { useBlockNumber } from '~~';
import { TEthersProvider } from '~~/models';

/**
 * Get the current timestamp from the latest block
 * @param provider
 * @param pollTime
 * @returns date in
 */
export const useTimestamp = (provider: TEthersProvider, pollTime?: number): number => {
  const blockNumber = useBlockNumber(provider, pollTime);
  const [timestamp, setTimestamp] = useState<number>(0);

  useEffect((): void => {
    const getTimestamp = async (): Promise<void> => {
      const nextBlock = await provider.getBlock(blockNumber);
      if (nextBlock?.timestamp != null) {
        const nextTimestamp = nextBlock.timestamp;
        setTimestamp(nextTimestamp);
      }
    };

    void getTimestamp();
  }, [blockNumber, provider]);

  return timestamp;
};
