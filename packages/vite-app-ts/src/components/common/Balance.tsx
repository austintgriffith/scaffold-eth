import { Provider } from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import { useBalance } from 'eth-hooks';
import { BigNumber } from 'ethers';
import React, { FC, useState } from 'react';

interface IBalanceProps {
  address: string;
  provider: Provider | undefined;
  price?: number;
  balance?: BigNumber;
  dollarMultiplier?: number;
  size?: 'short' | 'long';
}

/**
 * Displays a balance of given address in ether & dollar
 *
  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
 * @param props
 * @returns
 */
export const Balance: FC<IBalanceProps> = ({ size = 'short', ...rest }) => {
  const props = { ...rest, size };
  const [dollarMode, setDollarMode] = useState(true);
  const balance = useBalance(props.provider, props.address);

  let floatBalance = parseFloat('0.00');

  let usingBalance = balance;

  if (typeof props.balance !== 'undefined') {
    usingBalance = props.balance;
  }

  if (usingBalance) {
    const etherBalance = formatEther(usingBalance);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  const price = props.price || props.dollarMultiplier;

  if (price && dollarMode) {
    displayBalance = '$' + (floatBalance * price).toFixed(2);
  }

  return (
    <span
      style={{
        verticalAlign: 'middle',
        fontSize: props.size ? props.size : 24,
        padding: 8,
        cursor: 'pointer',
      }}
      onClick={() => {
        setDollarMode(!dollarMode);
      }}>
      {displayBalance}
    </span>
  );
};
