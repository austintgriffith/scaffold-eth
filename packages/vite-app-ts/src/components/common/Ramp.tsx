import { DollarCircleOutlined } from '@ant-design/icons';
import { Network } from '@ethersproject/providers';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { Button, Divider, Modal } from 'antd';
import React, { useState, FC } from 'react';

import { TNetwork } from '~~/models/networkTypes';

interface IRampProps {
  price: number;
  address: string;
  networks: Record<string, TNetwork>;
  color?: string;
}

/**
 * Displays current ETH price and gives options to buy ETH through Wyre/Ramp/Coinbase or get through Rinkeby/Ropsten/Kovan/Goerli
 * 
  ~ Features ~

  - Ramp opens directly in the application, component uses RampInstantSDK
  - Provide price={price} and current ETH price will be displayed
  - Provide address={address} and your address will be pasted into Wyre/Ramp instantly
 * @param props 
 * @returns 
 */
export const Ramp: FC<IRampProps> = (props) => {
  const [modalUp, setModalUp] = useState('down');

  const type = 'default';

  const allFaucets = [];
  for (const n in props.networks) {
    if (props.networks[n].chainId !== 31337 && props.networks[n].chainId !== 1) {
      allFaucets.push(
        <p key={props.networks[n].chainId}>
          <Button
            style={{ color: props.networks[n].color }}
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open(props.networks[n].faucet);
            }}>
            {props.networks[n].name}
          </Button>
        </p>
      );
    }
  }

  return (
    <div>
      <Button
        size="large"
        shape="round"
        onClick={() => {
          setModalUp('up');
        }}>
        <DollarCircleOutlined style={{ color: '#52c41a' }} />{' '}
        {typeof props.price === 'undefined' ? 0 : props.price.toFixed(2)}
      </Button>
      <Modal
        title="Buy ETH"
        visible={modalUp === 'up'}
        onCancel={() => {
          setModalUp('down');
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalUp('down');
            }}>
            cancel
          </Button>,
        ]}>
        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open('https://pay.sendwyre.com/purchase?destCurrency=ETH&sourceAmount=25&dest=' + props.address);
            }}>
            <span style={{ paddingRight: 15 }} role="img">
              <span role="img" aria-label="flag-us">
                🇺🇸
              </span>
            </span>
            Wyre
          </Button>
        </p>
        <p>
          {' '}
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              new RampInstantSDK({
                hostAppName: 'scaffold-eth',
                hostLogoUrl: 'https://scaffoldeth.io/scaffold-eth.png',
                swapAmount: '100000000000000000', // 0.1 ETH in wei  ?
                swapAsset: 'ETH',
                userAddress: props.address,
              })
                .on('*', (event) => console.log(event))
                .show();
            }}>
            <span style={{ paddingRight: 15 }} role="img">
              <span role="img" aria-label="flag-gb">
                🇬🇧
              </span>
            </span>
            Ramp
          </Button>
        </p>

        <p>
          <Button
            type={type}
            size="large"
            shape="round"
            onClick={() => {
              window.open('https://www.coinbase.com/buy-ethereum');
            }}>
            <span style={{ paddingRight: 15 }} role="img" aria-label="bank">
              🏦
            </span>
            Coinbase
          </Button>
        </p>

        <Divider />

        <h2>Testnet ETH</h2>

        {allFaucets}
      </Modal>
    </div>
  );
};
