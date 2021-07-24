import { KeyOutlined, QrcodeOutlined, SendOutlined, WalletOutlined } from '@ant-design/icons';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { Button, Modal, Spin, Tooltip, Typography } from 'antd';
import { useUserAddress } from 'eth-hooks';
import { BytesLike, ethers, Signer } from 'ethers';
import QR from 'qrcode.react';
import React, { FC, useState } from 'react';
import { providers } from 'web3modal';

import { Address, AddressInput, Balance, EtherInput } from '.';

import { transactor } from '~~/helpers';

const { Text, Paragraph } = Typography;

interface IWalletProps {
  signer: Signer | undefined;
  address: string;
  ensProvider: JsonRpcProvider | Web3Provider;
  price: number;
  color: string;
}

/**
 *   Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet
  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide color to specify the color of wallet icon
 * @param props 
 * @returns 
 */
export const Wallet: FC<IWalletProps> = (props) => {
  const signerAddress = useUserAddress(props.signer);
  const selectedAddress = props.address || signerAddress;

  const [open, setOpen] = useState(false);
  const [qr, setQr] = useState<string>();
  const [amount, setAmount] = useState<string>('');
  const [toAddress, setToAddress] = useState<string>('');
  const [publicKey, setPublicKey] = useState<BytesLike>();

  const providerSend = props.signer ? (
    <Tooltip title="Wallet">
      <WalletOutlined
        onClick={() => {
          setOpen(!open);
        }}
        rotate={-90}
        style={{
          padding: 7,
          color: props.color ? props.color : '',
          cursor: 'pointer',
          fontSize: 28,
          verticalAlign: 'middle',
        }}
      />
    </Tooltip>
  ) : (
    <></>
  );

  let display;
  let receiveButton;
  let privateKeyButton;
  if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{selectedAddress}</Text>
        </div>
        <QR
          value={selectedAddress}
          size={450}
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false, src: 'copy' }}
        />
      </div>
    );
    receiveButton = (
      <Button
        key="hide"
        onClick={() => {
          setQr('');
        }}>
        <QrcodeOutlined /> Hide
      </Button>
    );
    privateKeyButton = (
      <Button
        key="hide"
        onClick={() => {
          setPublicKey(selectedAddress);
          setQr('');
        }}>
        <KeyOutlined /> Private Key
      </Button>
    );
  } else if (publicKey) {
    const privateKey = localStorage.getItem('metaPrivateKey') as BytesLike;
    const wallet = new ethers.Wallet(privateKey);

    if (wallet.address !== selectedAddress) {
      display = (
        <div>
          <b>*injected account*, private key unknown</b>
        </div>
      );
    } else {
      const extraPkDisplayAdded: Record<string, any> = {};
      const extraPkDisplay = [];
      extraPkDisplayAdded[wallet.address] = true;
      extraPkDisplay.push(
        <div style={{ fontSize: 16, padding: 2, backgroundColor: '#89e789' }}>
          <a href={'/pk#' + privateKey}>
            <Address minimized address={wallet.address} ensProvider={props.ensProvider} /> {wallet.address.substr(0, 6)}
          </a>
        </div>
      );
      for (const key in localStorage) {
        if (key.indexOf('metaPrivateKey_backup') >= 0) {
          console.log(key);
          const pastpk = localStorage.getItem(key) as BytesLike;
          const pastwallet = new ethers.Wallet(pastpk);
          if (!extraPkDisplayAdded[pastwallet.address] /* && selectedAddress!=pastwallet.address */) {
            extraPkDisplayAdded[pastwallet.address] = true;
            extraPkDisplay.push(
              <div style={{ fontSize: 16 }}>
                <a href={'/pk#' + pastpk}>
                  <Address minimized address={pastwallet.address} ensProvider={props.ensProvider} />{' '}
                  {pastwallet.address.substr(0, 6)}
                </a>
              </div>
            );
          }
        }
      }

      display = (
        <div>
          <b>Private Key:</b>

          <div>
            <Text copyable>{privateKey}</Text>
          </div>

          <hr />

          <i>
            Point your camera phone at qr code to open in
            <a target="_blank" href={'https://xdai.io/' + privateKey} rel="noopener noreferrer">
              burner wallet
            </a>
            :
          </i>
          <QR
            value={'https://xdai.io/' + privateKey}
            size={450}
            level="H"
            includeMargin
            renderAs="svg"
            imageSettings={{ excavate: false, src: 'dai' }}
          />

          <Paragraph style={{ fontSize: '16' }} copyable>
            {'https://xdai.io/' + privateKey}
          </Paragraph>

          {extraPkDisplay ? (
            <div>
              <h3>Known Private Keys:</h3>
              {extraPkDisplay}
              <Button
                onClick={() => {
                  const currentPrivateKey = window.localStorage.getItem('metaPrivateKey');
                  if (currentPrivateKey) {
                    window.localStorage.setItem('metaPrivateKey_backup' + Date.now(), currentPrivateKey);
                  }
                  const randomWallet = ethers.Wallet.createRandom();
                  const privateKey = randomWallet._signingKey().privateKey;
                  window.localStorage.setItem('metaPrivateKey', privateKey);
                  window.location.reload();
                }}>
                Generate
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
      );
    }

    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(selectedAddress);
          setPublicKey('');
        }}>
        <QrcodeOutlined /> Receive
      </Button>
    );
    privateKeyButton = (
      <Button
        key="hide"
        onClick={() => {
          setPublicKey('');
          setQr('');
        }}>
        <KeyOutlined /> Hide
      </Button>
    );
  } else {
    const inputStyle = {
      padding: 10,
    };

    display = (
      <div>
        <div style={inputStyle}>
          <AddressInput
            autoFocus
            ensProvider={props.ensProvider}
            placeholder="to address"
            address={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput
            price={props.price}
            value={amount}
            onChange={(value: string) => {
              setAmount(value);
            }}
          />
        </div>
      </div>
    );
    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(selectedAddress);
          setPublicKey('');
        }}>
        <QrcodeOutlined /> Receive
      </Button>
    );
    privateKeyButton = (
      <Button
        key="hide"
        onClick={() => {
          setPublicKey(selectedAddress);
          setQr('');
        }}>
        <KeyOutlined /> Private Key
      </Button>
    );
  }

  const disableSend = amount == undefined || toAddress == undefined || (qr != undefined && qr != '');

  return (
    <span>
      {providerSend}
      <Modal
        visible={open}
        title={
          <div>
            {selectedAddress ? <Address address={selectedAddress} ensProvider={props.ensProvider} /> : <Spin />}
            <div style={{ float: 'right', paddingRight: 25 }}>
              <Balance address={selectedAddress} provider={props?.signer?.provider} dollarMultiplier={props.price} />
            </div>
          </div>
        }
        onOk={() => {
          setQr('');
          setPublicKey('');
          setOpen(!open);
        }}
        onCancel={() => {
          setQr('');
          setPublicKey('');
          setOpen(!open);
        }}
        footer={[
          privateKeyButton,
          receiveButton,
          <Button
            key="submit"
            type="primary"
            disabled={disableSend}
            loading={false}
            onClick={() => {
              const tx = transactor(props.signer);

              let value;
              try {
                value = parseEther('' + amount);
              } catch (e) {
                // failed to parseEther, try something else
                value = parseEther('' + parseFloat(amount).toFixed(8));
              }

              if (tx) {
                tx({
                  to: toAddress,
                  value,
                });
              }
              setOpen(!open);
              setQr('');
            }}>
            <SendOutlined /> Send
          </Button>,
        ]}>
        {display}
      </Modal>
    </span>
  );
};
