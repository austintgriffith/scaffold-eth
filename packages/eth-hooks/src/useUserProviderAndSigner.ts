import { Provider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { useMemo, useState } from 'react';

import { useBurnerSigner } from '~~';
import { parseProviderOrSigner } from '~~/functions/providerOrSigner';
import { TEthersProvider, TProviderAndSigner, TEthersProviderOrSigner } from '~~/models';

const syncBurnerKeyFromStorage = (): void => {
  if (window.location.pathname && window.location.pathname.includes('/pk')) {
    const incomingPK = window.location.hash.replace('#', '');

    if (incomingPK.length === 64 || incomingPK.length === 66) {
      console.log('🔑 Incoming Private Key...');
      const rawPK = incomingPK;
      window.history.pushState({}, '', '/');
      const currentPrivateKey = window.localStorage.getItem('metaPrivateKey');
      if (currentPrivateKey && currentPrivateKey !== rawPK) {
        window.localStorage.setItem(`metaPrivateKey_backup${Date.now()}`, currentPrivateKey);
      }
      window.localStorage.setItem('metaPrivateKey', rawPK);
    }
  }
};

/**
 * Gets user provider or Signer
 *
  ~ Features ~
  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const tx = Transactor(userSigner, gasPrice)
 * @param injectedProviderOrSigner
 * @param localProvider
 * @returns
 */
export const useUserProviderAndSigner = (
  injectedProviderOrSigner: TEthersProviderOrSigner | undefined,
  localProvider: TEthersProvider
): TProviderAndSigner | undefined => {
  const [signer, setSigner] = useState<Signer>();
  const [provider, setProvider] = useState<Provider>();
  const [providerNetwork, setProviderNetwork] = useState<ethers.providers.Network>();
  const burnerSigner = useBurnerSigner(localProvider);

  useMemo(() => {
    if (injectedProviderOrSigner) {
      console.log('🦊 Using injected provider');
      void parseProviderOrSigner(injectedProviderOrSigner).then((result) => {
        if (result != null) setSigner(result.signer);
      });
    } else if (!localProvider) {
      setSigner(undefined);
    } else {
      syncBurnerKeyFromStorage();
      console.log('🔥 Using burner signer', burnerSigner);
      setSigner(burnerSigner);
    }
  }, [injectedProviderOrSigner, localProvider, burnerSigner]);

  useMemo(() => {
    if (signer) {
      const result = parseProviderOrSigner(signer);
      void result.then((r) => {
        setProvider(r.provider);
        setProviderNetwork(r.providerNetwork);
      });
    }
  }, [signer]);

  return { signer, provider, providerNetwork };
};
