/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { useEffect, useState } from "react";

const { ethers } = require("ethers");

/*
  ~ What it does? ~

  Loads your local contracts and gives options to read values from contracts
  or write transactions into them

  ~ How can I use? ~

  const readContracts = useContractLoader(localProvider) // or
  const writeContracts = useContractLoader(userProvider)

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
*/

export default function useContractLoader(providerOrSigner, config = {}) {
  const [contracts, setContracts] = useState();
  useEffect(() => {
    let active = true;

    async function loadContracts() {
      if (providerOrSigner && typeof providerOrSigner !== "undefined") {
        console.log(`loading contracts`);
        try {
          // we need to check to see if this providerOrSigner has a signer or not
          let signer;
          let provider;
          let accounts;

          if (providerOrSigner && typeof providerOrSigner.listAccounts === "function") {
            accounts = await providerOrSigner.listAccounts();
          }

          if (ethers.Signer.isSigner(providerOrSigner)) {
            signer = providerOrSigner;
            provider = signer.provider;
          } else if (accounts && accounts.length > 0) {
            signer = providerOrSigner.getSigner();
            provider = providerOrSigner;
          } else {
            signer = providerOrSigner;
            provider = providerOrSigner;
          }

          const providerNetwork = await provider.getNetwork();

          const _chainId = config.chainId || providerNetwork.chainId;

          let contractList = {};
          let externalContractList = {};
          try {
            contractList = config.hardhatContracts || require("../contracts/hardhat_contracts.json");
          } catch (e) {
            console.log(e);
          }
          try {
            externalContractList = config.externalContracts || require("../contracts/external_contracts.js");
          } catch (e) {
            console.log(e);
          }

          let combinedContracts = {};

          if (contractList[_chainId]) {
            for (const hardhatNetwork in contractList[_chainId]) {
              if (Object.prototype.hasOwnProperty.call(contractList[_chainId], hardhatNetwork)) {
                if (!config.hardhatNetworkName || hardhatNetwork === config.hardhatNetworkName) {
                  combinedContracts = {
                    ...combinedContracts,
                    ...contractList[_chainId][hardhatNetwork].contracts,
                  };
                }
              }
            }
          }

          if (externalContractList[_chainId]) {
            combinedContracts = { ...combinedContracts, ...externalContractList[_chainId].contracts };
          }

          const newContracts = Object.keys(combinedContracts).reduce((accumulator, contractName) => {
            const _address =
              config.customAddresses && Object.keys(config.customAddresses).includes(contractName)
                ? config.customAddresses[contractName]
                : combinedContracts[contractName].address;
            accumulator[contractName] = new ethers.Contract(_address, combinedContracts[contractName].abi, signer);
            return accumulator;
          }, {});
          if (active) setContracts(newContracts);
        } catch (e) {
          console.log("ERROR LOADING CONTRACTS!!", e);
        }
      }
    }
    loadContracts();

    return () => {
      active = false;
    };
  }, [
    providerOrSigner,
    config.chainId,
    config.hardhatNetworkName,
    config.customAddresses,
    config.externalContracts,
    config.hardhatContracts,
  ]);

  return contracts;
}
