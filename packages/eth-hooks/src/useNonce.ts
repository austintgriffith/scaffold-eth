import { useCallback, useState } from 'react';

import { TEthersProvider } from '~~/models';
import { useOnRepetition } from '~~/useOnRepetition';

/**
 * Get the current nonce of the address provided
 * @param provider
 * @param address
 * @param pollTime
 * @returns
 */
export const useNonce = (provider: TEthersProvider, address: string, pollTime: number = 0): number => {
  const [nonce, setNonce] = useState<number>(0);

  const getTransactionCount = useCallback(async (): Promise<void> => {
    const nextNonce = await provider?.getTransactionCount(address);
    if (nextNonce !== nonce && nextNonce >= 0) {
      setNonce(nextNonce);
    }
  }, [nonce]);

  useOnRepetition(getTransactionCount, { pollTime, leadTrigger: provider != null });

  return nonce;
};
