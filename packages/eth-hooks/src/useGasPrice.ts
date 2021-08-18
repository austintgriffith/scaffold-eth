import axios, { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';

import { TNetwork } from '~~/models';
import { useOnRepetition } from '~~/useOnRepetition';

/**
 * Preset speeds for Eth Gas Station
    fast: Recommended fast(expected to be mined in < 2 minutes) gas price in x10 Gwei(divite by 10 to convert it to gwei)
    fastest: Recommended fastest(expected to be mined in < 30 seconds) gas price in x10 Gwei(divite by 10 to convert it to gwei)
    safeLow: Recommended safe(expected to be mined in < 30 minutes) gas price in x10 Gwei(divite by 10 to convert it to gwei)
    average: Recommended average(expected to be mined in < 5 minutes) gas price in x10 Gwei(divite by 10 to convert it to gwei)
 */
export type TGasStationSpeed = 'fast' | 'fastest' | 'safeLow' | 'average';

/**
 * Gets the gas price from Eth Gas Station
 * @param targetNetwork
 * @param speed 'slow' | 'fast' | 'fastest' | 'average'
 * @param pollTime
 * @returns
 */
export const useGasPrice = (
  targetNetwork: TNetwork,
  speed: TGasStationSpeed,
  pollTime: number = 39999
): number | undefined => {
  const multiplier = 100000000;
  const [gasPrice, setGasPrice] = useState<number | undefined>();

  const loadGasPrice = useCallback((): void => {
    if (targetNetwork?.gasPrice) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      if (navigator.onLine) {
        axios
          .get('https://ethgasstation.info/json/ethgasAPI.json')
          .then((response: AxiosResponse<any>) => {
            const result: Record<string, any> = (response.data as Record<string, any>) ?? {};
            let newGasPrice: number | undefined = result[speed] * multiplier;
            if (!newGasPrice) newGasPrice = result['fast'] * multiplier;
            if (newGasPrice !== gasPrice) {
              setGasPrice(newGasPrice);
            }
          })
          .catch((error) => {
            console.log('⚠ Could not get gas Price!', error);
            setGasPrice(undefined);
          });
      }
    }
  }, [gasPrice, speed, targetNetwork.gasPrice]);

  useOnRepetition(loadGasPrice, { pollTime, leadTrigger: true });
  return gasPrice;
};
