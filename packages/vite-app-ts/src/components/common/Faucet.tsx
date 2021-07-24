import { SendOutlined } from '@ant-design/icons';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { Button, Input, Tooltip } from 'antd';
import { useLookupAddress } from 'eth-hooks/lib/dapps/ens';
import React, { FC, useCallback, useState } from 'react';
import Blockies from 'react-blockies';

import { Wallet } from '.';

import { transactor } from '~~/helpers';

// improved a bit by converting address to ens if it exists
// added option to directly input ens name
// added placeholder option

interface IFaucetProps {
  address?: string;
  price: number;
  ensProvider: StaticJsonRpcProvider;
  onChange?: (value: string) => void;
  placeholder?: string;
  localProvider: StaticJsonRpcProvider;
}

/**
 * Displays a local faucet to send ETH to given address, also wallet is provided
 * 
 * ~ Features ~

  - Provide price={price} of ether and convert between USD and ETH in a wallet
  - Provide localProvider={localProvider} to be able to send ETH to given address
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
              works both in input field & wallet
  - Provide placeholder="Send local faucet" value for the input
 * @param props 
 * @returns 
 */
export const Faucet: FC<IFaucetProps> = (props) => {
  const [address, setAddress] = useState<string>();

  let blockie;
  if (props.address && typeof props.address.toLowerCase === 'function') {
    blockie = <Blockies seed={props.address.toLowerCase()} size={8} scale={4} />;
  } else {
    blockie = <div />;
  }

  const ens = useLookupAddress(props.ensProvider, props.address ?? '');

  const updateAddress = useCallback(
    async (newValue) => {
      if (typeof newValue !== 'undefined') {
        let tempAddress = newValue;
        if (tempAddress.indexOf('.eth') > 0 || tempAddress.indexOf('.xyz') > 0) {
          try {
            const possibleAddress = await props.ensProvider.resolveName(tempAddress);
            if (possibleAddress) {
              tempAddress = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        setAddress(tempAddress);
      }
    },
    [props.ensProvider, props.onChange]
  );

  const tx = transactor(props.localProvider);

  return (
    <span>
      <Input
        size="large"
        placeholder={props.placeholder ? props.placeholder : 'local faucet'}
        prefix={blockie}
        // value={address}
        value={ens || address}
        onChange={(e) => {
          // setAddress(e.target.value);
          updateAddress(e.target.value);
        }}
        suffix={
          <Tooltip title="Faucet: Send local ether to an address.">
            <Button
              onClick={() => {
                if (tx) {
                  tx({
                    to: address,
                    value: parseEther('0.01'),
                  });
                }
                setAddress('');
              }}
              shape="circle"
              icon={<SendOutlined />}
            />
            <Wallet
              color="#888888"
              signer={props.localProvider.getSigner()}
              ensProvider={props.ensProvider}
              price={props.price}
              address={address ?? ''}
            />
          </Tooltip>
        }
      />
    </span>
  );
};
