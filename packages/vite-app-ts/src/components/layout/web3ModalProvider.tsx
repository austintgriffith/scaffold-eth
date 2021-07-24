import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

import { INFURA_ID } from '~~/models/constants/constants';

/*
  Web3 modal helps us "connect" external wallets:
*/
export const web3ModalProvider = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

export const logoutOfWeb3Modal = async () => {
  await web3ModalProvider.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

/* eslint-disable */
window.ethereum &&
  window.ethereum.on('chainChanged', (chainId: any) => {
    web3ModalProvider.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on('accountsChanged', (accounts: any) => {
    web3ModalProvider.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */
