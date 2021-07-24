import { Input } from 'antd';
import React, { FC, useEffect, useState } from 'react';

// small change in useEffect, display currentValue if it's provided by user

/*
  ~ What it does? ~

  Displays input field for ETH/USD amount, with an option to convert between ETH and USD

  ~ How can I use? ~

  <EtherInput
    autofocus
    price={price}
    value=100
    placeholder="Enter amount"
    onChange={value => {
      setAmount(value);
    }}
  />

  ~ Features ~

  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide value={value} to specify initial amount of ether
  - Provide placeholder="Enter amount" value for the input
  - Control input change by onChange={value => { setAmount(value);}}
*/

interface IEtherInputProps {
  autoFocus?: boolean;
  price: number | undefined;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

/**
 * Displays input field for ETH/USD amount, with an option to convert between ETH and USD
  ~ Features ~

  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide value={value} to specify initial amount of ether
  - Provide placeholder="Enter amount" value for the input
  - Control input change by onChange={value => { setAmount(value);}}
 * @param props
 * @returns
 */
export const EtherInput: FC<IEtherInputProps> = (props) => {
  const [mode, setMode] = useState(props.price ? 'USD' : 'ETH');
  const [display, setDisplay] = useState<string>();
  const [value, setValue] = useState<string>();

  const currentValue: string | undefined = props.value ? props.value : value;

  const option = (title: string) => {
    if (props?.price != null) {
      return <></>;
    }
    return (
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => {
          if (mode === 'USD') {
            setMode('ETH');
            setDisplay(currentValue);
          } else {
            setMode('USD');
            if (currentValue) {
              const usdValue = '' + (parseFloat(currentValue) * props.price!).toFixed(2);
              setDisplay(usdValue);
            } else {
              setDisplay(currentValue);
            }
          }
        }}>
        {title}
      </div>
    );
  };

  let prefix;
  let addonAfter;
  if (mode === 'USD') {
    prefix = '$';
    addonAfter = option('USD 🔀');
  } else {
    prefix = 'Ξ';
    addonAfter = option('ETH 🔀');
  }

  useEffect(() => {
    if (!currentValue) {
      setDisplay('');
    }
  }, [currentValue]);

  return (
    <Input
      placeholder={props.placeholder ? props.placeholder : 'amount in ' + mode}
      autoFocus={props.autoFocus}
      prefix={prefix}
      value={display}
      addonAfter={addonAfter}
      onChange={async (e) => {
        const newValue = e.target.value;
        if (mode === 'USD') {
          const possibleNewValue = parseFloat(newValue);
          if (possibleNewValue) {
            const ethValue = possibleNewValue / (props.price ?? 1);
            setValue(ethValue.toString());
            if (typeof props.onChange === 'function') {
              props.onChange(ethValue.toString());
            }
            setDisplay(newValue);
          } else {
            setDisplay(newValue);
          }
        } else {
          setValue(newValue);
          if (typeof props.onChange === 'function') {
            props.onChange(newValue);
          }
          setDisplay(newValue);
        }
      }}
    />
  );
};
