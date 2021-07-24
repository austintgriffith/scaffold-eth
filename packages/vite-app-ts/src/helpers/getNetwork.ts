import { TNetwork } from '~~/models/networkTypes';
import { NETWORKS } from '../models/constants/networks';

export const getNetwork = (chainId: number): TNetwork | undefined => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};
