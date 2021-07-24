import { TDeployedContracts, TExternalContracts } from 'eth-hooks/lib/models';
import { TContractConfig } from 'eth-hooks/lib';

const contractListPromise = import('../generated/contracts/hardhat_contracts.json');
// @ts-ignore
const externalContractsPromise = import('../generated/contracts/external_contracts');

export const loadAppContracts = async (): Promise<TContractConfig> => {
  const config: TContractConfig = {};
  config.deployedContracts = ((await contractListPromise).default ?? {}) as unknown as TDeployedContracts;
  config.externalContracts = ((await externalContractsPromise).default ?? {}) as unknown as TExternalContracts;
  return config;
};
