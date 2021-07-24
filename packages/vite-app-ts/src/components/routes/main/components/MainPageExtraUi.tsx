import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';
import { Faucet, Ramp, GasGauge } from '~~/components/common';
import { NETWORKS } from '~~/models/constants/networks';
import { TEthersProvider } from 'eth-hooks/lib/models';

interface IMainPageExtraUi {
  localProvider: TEthersProvider;
  mainnetProvider: TEthersProvider;
  price: number;
  gasPrice: number | undefined;
  userAddress: string;
  faucetAvailable: boolean;
}

/**
 * 🗺 Extra UI like gas price, eth price, faucet, and support:
 * @param props
 * @returns
 */
export const MainPageExtraUi: FC<IMainPageExtraUi> = (props) => (
  <div
    style={{
      position: 'fixed',
      textAlign: 'left',
      left: 0,
      bottom: 20,
      padding: 10,
    }}>
    <Row align="middle" gutter={[4, 4]}>
      <Col span={8}>
        <Ramp price={props.price} address={props.userAddress} networks={NETWORKS} />
      </Col>

      <Col
        span={8}
        style={{
          textAlign: 'center',
          opacity: 0.8,
        }}>
        <GasGauge gasPrice={props.gasPrice?.toString() ?? ''} />
      </Col>
      <Col
        span={8}
        style={{
          textAlign: 'center',
          opacity: 1,
        }}>
        <Button
          onClick={() => {
            window.open('https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA');
          }}
          size="large"
          shape="round">
          <span
            style={{
              marginRight: 8,
            }}
            role="img"
            aria-label="support">
            💬
          </span>
          Support
        </Button>
      </Col>
    </Row>

    <Row align="middle" gutter={[4, 4]}>
      <Col span={24}>
        {
          /*  if the local provider has a signer, let's show the faucet:  */
          props.faucetAvailable ? (
            <Faucet localProvider={props.localProvider} price={props.price} ensProvider={props.mainnetProvider} />
          ) : (
            ''
          )
        }
      </Col>
    </Row>
  </div>
);
