/* eslint-disable unused-imports/no-unused-vars-ts */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import nodeBuffer from 'buffer';
import nodeProcess from 'process';

import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';

export {};

(window as any).global = window;
const global = window;

if (!global.hasOwnProperty('Buffer')) {
  (global as any).Buffer = nodeBuffer.Buffer;
}

(global as any).process = nodeProcess;

interface Window {
  ethereum: ExternalProvider;
  location: any;
  localStorage: { getItem: (key: string) => any; setItem: (key: string, value: string) => any };
}
