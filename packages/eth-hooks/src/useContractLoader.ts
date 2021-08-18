import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';

import { parseProviderOrSigner } from '~~/functions/providerOrSigner';
import { TDeployedContracts, TExternalContracts, TEthersProviderOrSigner } from '~~/models';

export type TContractConfig = {
  hardhatNetworkName?: string;
  customAddresses?: Record<string, string>;
  deployedContracts?: TDeployedContracts;
  externalContracts?: TExternalContracts;
};

/**
 * Loads your local contracts and gives options to read values from contracts
  or write transactions into them

   ~ Features ~
  - localProvider enables reading values from contracts
  - userProvider enables writing transactions into contracts
  - Example of keeping track of "purpose" variable by loading contracts into readContracts
    and using ContractReader.js hook:
    const purpose = useContractReader(readContracts,"YourContract", "purpose")
  - Example of using setPurpose function from our contract and writing transactions by Transactor.js helper:
    tx( writeContracts.YourContract.setPurpose(newPurpose) )

  config can include:
  - chainId - to hardcode the chainId, irrespective of the providerOrSigner chainId
  - hardhatNetworkName - to hardcode the hardhat network of interest
  - customAddresses: { contractName: 0xCustomAddress } to hardcode the address for a given named contract
  - hardhatContracts: object following the hardhat deploy export format (Json with chainIds as keys, which have hardhat network names as keys, which contain arrays of contracts for each)
  - externalContracts: object with chainIds as keys, with an array of contracts for each
 * @param providerOrSigner 
 * @param safeConfig 
 * @returns Hash: contractName: Contract
 */
export const useContractLoader = (
  providerOrSigner: TEthersProviderOrSigner | undefined,
  config: TContractConfig = {},
  chainId?: number
): Record<string, Contract> => {
  const [contracts, setContracts] = useState<Record<string, Contract>>({});
  const configDep: string = useMemo(() => JSON.stringify(config ?? {}), [config]);

  useEffect(() => {
    let active = true;

    const loadContracts = async (): Promise<void> => {
      if (providerOrSigner && typeof providerOrSigner !== 'undefined') {
        console.log(`loading contracts`);
        console.log(providerOrSigner, config);
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          if (typeof providerOrSigner !== 'undefined') {
            // we need to check to see if this providerOrSigner has a signer or not

            const { signer, providerNetwork } = await parseProviderOrSigner(providerOrSigner);
            // find the current chainId based on this order:
            //  - chainId passed in or a fallback of provider chainId
            const currentChainId: number = chainId ?? providerNetwork?.chainId ?? 0;

            // Type definition
            //  Record<string, Record<string, Contract>>
            //  { chainId: { contractName: Contract } }
            const contractList: TDeployedContracts = { ...(config.deployedContracts ?? {}) };
            const externalContractList: TExternalContracts = {
              ...(config.externalContracts ?? {}),
            };
            let combinedContracts: Record<string, Contract> = {};

            // combine partitioned contracts based on all the available and chain id.
            if (contractList?.[currentChainId] != null) {
              for (const hardhatNetwork in contractList[currentChainId]) {
                if (Object.prototype.hasOwnProperty.call(contractList[currentChainId], hardhatNetwork)) {
                  if (!config.hardhatNetworkName || hardhatNetwork === config.hardhatNetworkName) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    combinedContracts = {
                      ...combinedContracts,
                      ...contractList?.[currentChainId]?.[hardhatNetwork]?.contracts,
                    };
                  }
                }
              }
            }

            if (externalContractList?.[currentChainId] != null) {
              combinedContracts = { ...combinedContracts, ...externalContractList[currentChainId].contracts };
            }

            const newContracts = Object.keys(combinedContracts).reduce(
              (accumulator: Record<string, any>, contractName: string) => {
                const address: string =
                  config.customAddresses && Object.keys(config.customAddresses).includes(contractName)
                    ? config.customAddresses[contractName]
                    : combinedContracts[contractName].address;
                accumulator[contractName] = new ethers.Contract(address, combinedContracts[contractName].abi, signer);
                return accumulator;
              },
              {}
            );
            if (active) setContracts(newContracts);
          }
        } catch (e) {
          console.log('ERROR LOADING CONTRACTS!!', e);
        }
      }
    };

    void loadContracts();

    return (): void => {
      active = false;
    };
    // disable as configDep is used for dep instead of config
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerOrSigner, configDep]);

  return contracts;
};
