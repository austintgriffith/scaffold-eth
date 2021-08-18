import { Contract } from 'ethers';

type Index = string | number;
export type TDeployedContracts = {
  [key: string]: {
    [key: string]: {
      name: string;
      chainId: string;
      contracts: Record<string, Contract>;
    };
  };
};

export type TExternalContracts = {
  [key: number]: {
    name?: string;
    chainId?: string;
    contracts?: Record<string, Contract>;
  };
};
