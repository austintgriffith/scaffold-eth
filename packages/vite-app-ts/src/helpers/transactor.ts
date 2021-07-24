import { TransactionRequest, TransactionResponse } from '@ethersproject/providers';
import { notification } from 'antd';
import Notify, { API, InitOptions } from 'bnc-notify';

import { parseProviderOrSigner } from 'eth-hooks/lib/functions';
import { TEthersProviderOrSigner } from 'eth-hooks/lib/models';
import { BigNumber, ethers } from 'ethers';
import { Deferrable } from 'ethers/lib/utils';

import { BLOCKNATIVE_DAPPID } from '~~/models/constants/constants';

const callbacks: Record<string, any> = {};
const DEBUG = true;
/**
 * this should probably just be renamed to "notifier"
 * it is basically just a wrapper around BlockNative's wonderful Notify.js
 * https://docs.blocknative.com/notify
 * @param provider
 * @param gasPrice
 * @param etherscan
 * @returns
 */
export const transactor = (
  providerOrSigner: TEthersProviderOrSigner | undefined,
  gasPrice?: number,
  etherscan?: string
):
  | ((
      tx: Deferrable<TransactionRequest> | Promise<TransactionResponse>,
      callback?: ((_param: any) => void) | undefined
    ) => Promise<Record<string, any> | TransactionResponse | undefined>)
  | undefined => {
  if (typeof providerOrSigner !== 'undefined') {
    // eslint-disable-next-line consistent-return
    return async (
      tx: Deferrable<TransactionRequest> | Promise<TransactionResponse>,
      callback?: (_param: any) => void
    ): Promise<Record<string, any> | TransactionResponse | undefined> => {
      const { signer, provider, providerNetwork } = await parseProviderOrSigner(providerOrSigner);

      let options: InitOptions | undefined;
      let notify: API | undefined;
      if (navigator.onLine) {
        options = {
          dappId: BLOCKNATIVE_DAPPID, // GET YOUR OWN KEY AT https://account.blocknative.com
          system: 'ethereum',
          networkId: providerNetwork?.chainId,
          // darkMode: Boolean, // (default: false)
          transactionHandler: (txInformation: any): void => {
            if (DEBUG) console.log('HANDLE TX', txInformation);
            const possibleFunction = callbacks[txInformation.transaction.hash];
            if (typeof possibleFunction === 'function') {
              possibleFunction(txInformation.transaction);
            }
          },
        };
        notify = Notify(options);
      }

      let etherscanNetwork = '';
      if (providerNetwork?.name && providerNetwork?.chainId > 1) {
        etherscanNetwork = providerNetwork.name + '.';
      }

      let etherscanTxUrl = 'https://' + etherscanNetwork + 'etherscan.io/tx/';
      if (providerNetwork?.chainId === 100) {
        etherscanTxUrl = 'https://blockscout.com/poa/xdai/tx/';
      }

      try {
        let result: TransactionResponse | undefined;
        if (tx instanceof Promise) {
          if (DEBUG) console.log('AWAITING TX', tx);
          const data = await tx;
          result = data;
        } else {
          if (!tx.gasPrice) {
            tx.gasPrice = gasPrice || ethers.utils.parseUnits('4.1', 'gwei');
          }
          if (!tx.gasLimit) {
            tx.gasLimit = BigNumber.from(ethers.utils.hexlify(120000));
          }
          if (DEBUG) console.log('RUNNING TX', tx);
          result = await signer?.sendTransaction(tx);
        }
        if (DEBUG) console.log('RESULT:', result);
        // console.log("Notify", notify);
        if (callback && result) {
          callbacks[result.hash] = callback;
        }

        // result is valid and is a TransactionResponse
        if (result && 'wait' in result && result.wait) {
          // if it is a valid Notify.js network, use that, if not, just send a default notification
          if (
            providerNetwork != null &&
            [1, 3, 4, 5, 42, 100].indexOf(providerNetwork.chainId) >= 0 &&
            notify != null
          ) {
            const { emitter } = notify.hash(result.hash);
            emitter.on('all', (transaction) => {
              return {
                onclick: (): void => {
                  window.open(`${etherscan ?? etherscanTxUrl ?? ''}${transaction.hash ?? ''}`);
                },
              };
            });
          } else {
            notification.info({
              message: 'Local Transaction Sent',
              description: result?.hash,
              placement: 'bottomRight',
            });
            // on most networks BlockNative will update a transaction handler,
            // but locally we will set an interval to listen...
            if (callback != null && result?.hash != null) {
              let listeningInterval: NodeJS.Timeout | undefined = undefined;
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              listeningInterval = setInterval(async (): Promise<void> => {
                if (result?.hash != null) {
                  console.log('CHECK IN ON THE TX', result, provider);
                  const currentTransactionReceipt = await provider?.getTransactionReceipt(result.hash);
                  if (currentTransactionReceipt && currentTransactionReceipt.confirmations) {
                    callback({ ...result, ...currentTransactionReceipt });
                    if (listeningInterval) clearInterval(listeningInterval);
                  }
                }
              }, 500);
            }
          }

          await result.wait();
        }

        return result;
      } catch (e) {
        console.log(e);
        console.log('Transaction Error:', e.message);
        notification.error({
          message: 'Transaction Error',
          description: e.message,
        });
      }
    };
  }
};
