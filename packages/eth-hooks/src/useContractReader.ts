import { Contract, ContractFunction } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { useOnRepetition } from '~~/useOnRepetition';

const DEBUG = false;

/**
 * Enables you to read values from contracts and keep track of them in the local React states
 * 
  ~ Features ~
  - Provide readContracts by loading contracts (see more on ContractLoader.js)
  - Specify the name of the contract, in this case it is "YourContract"
  - Specify the name of the variable in the contract, in this case we keep track of "purpose" variable
  - Pass an args array if the function requires
  - Pass pollTime - if no pollTime is specified, the function will update on every new block
 * @param contracts hash of all [contractName]: Contract
 * @param contractName contractName
 * @param functionName functionName
 * @param functionArgs arguments to functions
 * @param pollTime 
 * @param formatter 
 * @param onChange callback for value change
 * @returns 
 */
export const useContractReader = <T>(
  contracts: Record<string, Contract>,
  contractName: string,
  functionName: string,
  functionArgs: any[] = [],
  pollTime?: number,
  formatter?: (_value: T) => T,
  onChange?: (_value?: T) => void
): T | undefined => {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    if (typeof onChange === 'function') {
      setTimeout(onChange.bind(this, value), 1);
    }
  }, [value, onChange]);

  const updateValue = useCallback(async (): Promise<void> => {
    try {
      const contractFunction = contracts?.[contractName]?.[functionName] as ContractFunction<T>;
      let newValue: T;
      if (DEBUG) console.log('CALLING ', contractName, functionName, 'with args', functionArgs);

      if (contractFunction && contracts?.[contractName]?.provider?._isProvider != null) {
        if (functionArgs && functionArgs.length > 0) {
          newValue = await contractFunction(...functionArgs);
          if (DEBUG)
            console.log(
              'contractName',
              contractName,
              'functionName',
              functionName,
              'functionArgs',
              functionArgs,
              'RESULT:',
              newValue
            );
        } else {
          newValue = await contractFunction();
        }
        if (formatter && typeof formatter === 'function') {
          newValue = formatter(newValue);
        }
        setValue(newValue);
      }
    } catch (e) {
      console.log(e);
    }
  }, [contractName, formatter, functionName, functionArgs]);

  useOnRepetition(
    updateValue,
    {
      pollTime,
      leadTrigger: contracts?.[contractName] != null,
      provider: contracts?.[contractName]?.provider,
    },
    functionArgs
  );

  return value;
};
