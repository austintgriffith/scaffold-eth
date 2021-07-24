import { SigningKey } from '@ethersproject/signing-key';
import { BytesLike, ethers, Signer } from 'ethers';
import { useState, useEffect } from 'react';

import { TEthersProvider } from '~~/models/providerTypes';

/**
 * A hook that creates a buner address and returns a Signer
 * @param provider
 * @returns
 */
export const useBurnerSigner = (provider: TEthersProvider): Signer | undefined => {
  const key = 'metaPrivateKey';
  const [signer, setSigner] = useState<Signer>();
  const [privateKeyValue, setPrivateKeyValue] = useState<BytesLike | SigningKey>();

  const setValue = (value: any): void => {
    try {
      setPrivateKeyValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedKey = window.localStorage.getItem(key);
    if (!storedKey) {
      console.log('generating a new key');
      const newWallet = ethers.Wallet.createRandom();
      const newKey = newWallet.privateKey;
      setValue(newKey);
    } else {
      setValue(storedKey);
    }
  }, []);

  useEffect(() => {
    if (privateKeyValue && provider) {
      const wallet = new ethers.Wallet(privateKeyValue);
      const newSigner = wallet.connect(provider);
      setSigner(newSigner);
    }
  }, [privateKeyValue, provider]);

  return signer;
};
