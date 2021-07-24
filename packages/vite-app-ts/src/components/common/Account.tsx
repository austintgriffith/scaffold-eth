import { Signer } from '@ethersproject/abstract-signer';
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { Button } from 'antd';
import { TEthersProvider } from 'eth-hooks/lib/models';
import React, { FC } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import Web3Modal from 'web3modal';

import { Address, Balance, Wallet } from '.';

export interface IAccountProps {
  address: string;
  userSigner?: Signer;
  localProvider: TEthersProvider | undefined;
  mainnetProvider: TEthersProvider;
  price: number;
  minimized?: string;
  web3Modal?: Web3Modal;
  loadWeb3Modal?: () => Promise<void>;
  logoutOfWeb3Modal?: () => void;
  blockExplorer: string;
}

/**
  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

    ~ Features ~
  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
 * @param props
 * @returns
 */
export const Account: FC<IAccountProps> = (props: IAccountProps) => {
  const {
    address,
    userSigner,
    localProvider,
    mainnetProvider,
    price,
    minimized,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    blockExplorer,
  } = props;

  const modalButtons = [];
  if (web3Modal && loadWeb3Modal && logoutOfWeb3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}>
          logout
        </Button>
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          type={minimized ? 'default' : 'primary'}
          onClick={loadWeb3Modal}>
          connect
        </Button>
      );
    }
  }

  const { currentTheme } = useThemeSwitcher();

  const display = minimized ? (
    ''
  ) : (
    <span>
      {address ? (
        <Address punkBlockie address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
      ) : (
        'Connecting...'
      )}
      <Balance address={address} provider={localProvider} price={price} />
      <Wallet
        address={address}
        signer={userSigner}
        ensProvider={mainnetProvider}
        price={price}
        color={currentTheme === 'light' ? '#1890ff' : '#2caad9'}
      />
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
};
