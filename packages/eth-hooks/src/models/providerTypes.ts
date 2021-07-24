import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider, Provider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';

export type TEthersProvider = JsonRpcProvider | Web3Provider | StaticJsonRpcProvider;

export type TEthersProviderOrSigner = JsonRpcProvider | Web3Provider | StaticJsonRpcProvider | Signer;

export type TAbstractProvider = Provider;

// TODO: perhaps? provider should be TEthersProvider, what impact does this have?
//  the perse functions need to be change dtoo
export type TProviderAndSigner = {
  signer: Signer | undefined;
  provider: TAbstractProvider | undefined;
  providerNetwork: ethers.providers.Network | undefined;
};
