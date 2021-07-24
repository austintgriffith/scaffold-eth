import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/dist/src/types';
import { ethers } from 'ethers';
import '@nomiclabs/hardhat-ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import 'hardhat-deploy/src/type-extensions';

// export type ContractJson = {
//   _format: string;
//   contractName: string;
//   abi: Record<string, object>[];
//   bytecode: string;
//   deployedBytecode: string;
//   linkReferences: Record<string, object>;
//   deployedLinkReferences: Record<string, object>;
//   address: string;
// };

export type { HardhatRuntimeEnvironment as HardhatRuntimeEnvironmentT };

export type { Deployment as DeploymentT } from 'hardhat-deploy/types';

export type TEthers = typeof ethers & HardhatEthersHelpers;

// export const castEthersT = (e: (typeof ethers & HardhatEthersHelpers) | any): EthersT => {
//   return e as EthersT;
// };
