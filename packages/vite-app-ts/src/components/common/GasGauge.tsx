import { Button } from 'antd';
import React, { FC } from 'react';

interface IGasGaugeProps {
  gasPrice: string;
}
/**
 * Displays gas gauge
 
  ~ Features ~
  - Provide gasPrice={gasPrice} and get current gas gauge
 * @param props
 * @returns
 */
export const GasGauge: FC<IGasGaugeProps> = (props) => {
  return (
    <Button
      onClick={() => {
        window.open('https://ethgasstation.info/');
      }}
      size="large"
      shape="round">
      <span style={{ marginRight: 8 }}>
        <span role="img" aria-label="fuelpump">
          ⛽️
        </span>
      </span>
      {typeof props.gasPrice === 'undefined' ? 0 : parseInt(props.gasPrice, 10) / 10 ** 9}g
    </Button>
  );
};
