import { CameraOutlined, QrcodeOutlined } from '@ant-design/icons';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Badge, Input } from 'antd';
import { useLookupAddress } from 'eth-hooks/lib/dapps/ens';
import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import QrReader from 'react-qr-reader';

import { Blockie } from '.';

interface IAddressInputProps {
  autoFocus?: boolean;
  ensProvider: StaticJsonRpcProvider;
  placeholder?: string;
  address: string | undefined;
  onChange?: Dispatch<SetStateAction<string>>;
  hideScanner?: boolean;
}

/**
 * Displays an address input with QR scan option
  ~ Features ~
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide placeholder="Enter address" value for the input
  - Value of the address input is stored in value={toAddress}
  - Control input change by onChange={setToAddress}
                          or onChange={address => { setToAddress(address);}}
 * @param props 
 * @returns 
 */
export const AddressInput: FC<IAddressInputProps> = (props) => {
  const [scan, setScan] = useState(false);

  const ens = useLookupAddress(props.ensProvider, props.address ?? '');

  const scannerButton = (
    <div
      style={{ marginTop: 4, cursor: 'pointer' }}
      onClick={() => {
        setScan(!scan);
      }}>
      <Badge count={<CameraOutlined style={{ fontSize: 9 }} />}>
        <QrcodeOutlined style={{ fontSize: 18 }} />
      </Badge>{' '}
      Scan
    </div>
  );

  const updateAddress = useCallback(
    async (newValue) => {
      if (typeof newValue !== 'undefined') {
        let address = newValue;
        if (address.indexOf('.eth') > 0 || address.indexOf('.xyz') > 0) {
          try {
            const possibleAddress = await props.ensProvider.resolveName(address);
            if (possibleAddress) {
              address = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        if (props.onChange) {
          props.onChange(address);
        }
      }
    },
    [props.ensProvider, props.onChange]
  );

  const scanner = scan ? (
    <div
      style={{
        zIndex: 256,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
      }}
      onClick={() => {
        setScan(false);
      }}>
      <QrReader
        delay={250}
        resolution={1200}
        onError={(e: Error) => {
          console.log('SCAN ERROR', e);
          setScan(false);
        }}
        onScan={(newValue: string | null) => {
          if (newValue) {
            console.log('SCAN VALUE', newValue);
            let possibleNewValue = newValue;
            if (possibleNewValue.indexOf('/') >= 0) {
              possibleNewValue = possibleNewValue.substr(possibleNewValue.lastIndexOf('0x'));
              console.log('CLEANED VALUE', possibleNewValue);
            }
            setScan(false);
            updateAddress(possibleNewValue);
          }
        }}
        style={{ width: '100%' }}
      />
    </div>
  ) : (
    ''
  );

  return (
    <div>
      {scanner}
      <Input
        id="0xAddress" // name it something other than address for auto fill doxxing
        name="0xAddress" // name it something other than address for auto fill doxxing
        autoComplete="off"
        autoFocus={props.autoFocus}
        placeholder={props.placeholder ? props.placeholder : 'address'}
        prefix={<Blockie address={props.address ?? ''} scale={3} />}
        value={ens || props.address}
        addonAfter={scannerButton}
        onChange={(e) => {
          updateAddress(e.target.value);
        }}
      />
    </div>
  );
};
