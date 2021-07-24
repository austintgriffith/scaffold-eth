import React, { FC } from 'react';
import { GenericContract } from '~~/components/generic-contract';
import { Contract } from 'ethers';
import { TEthersProvider, TProviderAndSigner } from 'eth-hooks/lib/models';
import { TContractConfig } from 'eth-hooks/lib';

interface IMainPageContracts {
  mainnetProvider: TEthersProvider;
  mainnetContracts: Record<string, Contract>;
  userProviderAndSigner: TProviderAndSigner;
  localProvider: TEthersProvider;
  userAddress: string;
  blockExplorerUrl: string;
  contractConfig: TContractConfig;
}

/**
 * 🎛 this scaffolding is full of commonly used components
    this <GenericContract/> component will automatically parse your ABI
    and give you a form to interact with it locally
 * @param props 
 * @returns 
 */
export const MainPageContracts: FC<IMainPageContracts> = (props) => {
  return (
    <>
      {/*
        🎛 this scaffolding is full of commonly used components
        this <Contract/> component will automatically parse your ABI
        and give you a form to interact with it locally
      */}
      {props.userProviderAndSigner?.signer != null && (
        <>
          <GenericContract
            contractName="YourContract"
            signer={props.userProviderAndSigner.signer}
            provider={props.localProvider}
            address={props.userAddress}
            blockExplorer={props.blockExplorerUrl}
            contractConfig={props.contractConfig}
          />

          {/* uncomment for a second contract: 
        <GenericContract
          name="SecondContract"
          signer={props.userProviderAndSigner.signer}
          provider={props.localProvider}
          address={props.userAddress}
          blockExplorer={props.blockExplorerUrl}
          config={props.config}
        />
        */}

          {/* Uncomment to display and interact with an external contract (DAI on mainnet): 
        <GenericContract
          name="DAI"
          customContract={props.mainnetContracts?.['DAI']}
          signer={props.userProviderAndSigner.signer}
          provider={props.mainnetProvider}
          address={props.userAddress}
          blockExplorer={props.blockExplorerUrl}
          config={props.config}
          chainId={props.mainnetProvider.chainId}
        />
        */}
        </>
      )}
    </>
  );
};
