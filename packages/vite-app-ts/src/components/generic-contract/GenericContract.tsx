import { Card } from 'antd';
import { TContractConfig, useContractExistsAtAddress, useContractLoader } from 'eth-hooks';
import { TEthersProvider } from 'eth-hooks/lib/models';
import { Contract, Signer } from 'ethers';
import { FunctionFragment } from 'ethers/lib/utils';
import React, { FC, ReactElement, useMemo, useState } from 'react';

import { Account } from '../common';

import { DisplayVariable } from './DisplayVariable';
import { FunctionForm } from './FunctionFrom';
import { NoContractDisplay } from './NoContractDisplay';

const isQueryable = (fn: FunctionFragment) =>
  (fn.stateMutability === 'view' || fn.stateMutability === 'pure') && fn.inputs.length === 0;

interface IGenericContract {
  customContract?: Contract;
  account?: ReactElement;
  gasPrice?: number;
  signer: Signer;
  provider: TEthersProvider;
  contractName: string;
  show?: string[];
  tokenPrice?: number;
  blockExplorer: string;
  address: string;
  chainId?: number;
  contractConfig: TContractConfig;
}

export const GenericContract: FC<IGenericContract> = (props) => {
  const contracts = useContractLoader(props.provider, props.contractConfig, props.chainId);
  let contract: Contract | undefined = props.customContract;
  if (!props.customContract) {
    contract = contracts ? contracts[props.contractName] : undefined;
  }
  const address = contract ? contract.address : '';
  const contractIsDeployed = useContractExistsAtAddress(props.provider, address);

  const displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            (fn) => fn.type === 'function' && !(props.show && props.show.indexOf(fn.name) < 0)
          )
        : [],
    [contract, props.show]
  );

  const [refreshRequired, setTriggerRefresh] = useState(false);
  const contractDisplay = displayedContractFunctions.map((fn) => {
    if (isQueryable(fn)) {
      // If there are no inputs, just display return value
      return (
        <DisplayVariable
          key={fn.name}
          contractFunction={contract?.[fn.name]}
          functionInfo={fn}
          refreshRequired={refreshRequired}
          setTriggerRefresh={setTriggerRefresh}
        />
      );
    }
    // If there are inputs, display a form to allow users to provide these
    return (
      <FunctionForm
        key={'FF' + fn.name}
        contractFunction={
          fn.stateMutability === 'view' || fn.stateMutability === 'pure'
            ? contract?.[fn.name]
            : contract?.connect(props.signer)[fn.name]
        }
        functionInfo={fn}
        provider={props.provider}
        gasPrice={props.gasPrice ?? 0}
        setTriggerRefresh={setTriggerRefresh}
      />
    );
  });

  return (
    <div style={{ margin: 'auto', width: '70vw' }}>
      <Card
        title={
          <div>
            {props.contractName}
            <div style={{ float: 'right' }}>
              <Account
                address={address}
                localProvider={props.provider}
                mainnetProvider={props.provider}
                price={props.tokenPrice ?? 0}
                blockExplorer={props.blockExplorer}
              />
              {props.account}
            </div>
          </div>
        }
        size="default"
        style={{ marginTop: 25, width: '100%' }}
        loading={contractDisplay && contractDisplay.length <= 0}>
        {contractIsDeployed ? contractDisplay : NoContractDisplay}
      </Card>
    </div>
  );
};
