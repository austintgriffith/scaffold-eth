import { notification } from "antd";
import Notify from "bnc-notify";
import { BLOCKNATIVE_DAPPID } from "../constants";

const { ethers } = require("ethers");

// this should probably just be renamed to "notifier"
// it is basically just a wrapper around BlockNative's wonderful Notify.js
// https://docs.blocknative.com/notify
const callbacks = {};

const DEBUG = true;

export default function Transactor(providerOrSigner, gasPrice, etherscan) {
  if (typeof providerOrSigner !== "undefined") {
    // eslint-disable-next-line consistent-return
    return async (tx, callback) => {
      let signer;
      let network;
      let provider;
      if (ethers.Signer.isSigner(providerOrSigner) === true) {
        provider = providerOrSigner.provider;
        signer = providerOrSigner;
        network = providerOrSigner.provider && (await providerOrSigner.provider.getNetwork());
      } else if (providerOrSigner._isProvider) {
        provider = providerOrSigner;
        signer = providerOrSigner.getSigner();
        network = await providerOrSigner.getNetwork();
      }

      console.log("network", network);

      let options = null;
      let notify = null;
      if (navigator.onLine) {
        options = {
          dappId: BLOCKNATIVE_DAPPID, // GET YOUR OWN KEY AT https://account.blocknative.com
          system: "ethereum",
          networkId: network.chainId,
          // darkMode: Boolean, // (default: false)
          transactionHandler: txInformation => {
            if (DEBUG) console.log("HANDLE TX", txInformation);
            const possibleFunction = callbacks[txInformation.transaction.hash];
            if (typeof possibleFunction === "function") {
              possibleFunction(txInformation.transaction);
            }
          },
        };

        notify = Notify(options);
      }
       

      let etherscanNetwork = "";
      if (network.name && network.chainId > 1) {
        etherscanNetwork = network.name + ".";
      }

      let etherscanTxUrl = "https://" + etherscanNetwork + "etherscan.io/tx/";
      if (network.chainId === 100) {
        etherscanTxUrl = "https://blockscout.com/poa/xdai/tx/";
      }

      try {
        let result;
        if (tx instanceof Promise) {
          if (DEBUG) console.log("AWAITING TX", tx);
          result = await tx;
        } else {
          if (!tx.gasPrice) {
            tx.gasPrice = gasPrice || ethers.utils.parseUnits("4.1", "gwei");
          }
          if (!tx.gasLimit) {
            tx.gasLimit = ethers.utils.hexlify(120000);
          }
          if (DEBUG) console.log("RUNNING TX", tx);
          result = await signer.sendTransaction(tx);
        }
        if (DEBUG) console.log("RESULT:", result);
        // console.log("Notify", notify);

        if (callback) {
          callbacks[result.hash] = callback;
        }

        // if it is a valid Notify.js network, use that, if not, just send a default notification
        if (notify && [1, 3, 4, 5, 42, 100].indexOf(network.chainId) >= 0) {
          const { emitter } = notify.hash(result.hash);
          emitter.on("all", transaction => {
            return {
              onclick: () => window.open((etherscan || etherscanTxUrl) + transaction.hash),
            };
          });
        } else {
          notification.info({
            message: "Local Transaction Sent",
            description: result.hash,
            placement: "bottomRight",
          });
          // on most networks BlockNative will update a transaction handler,
          // but locally we will set an interval to listen...
          if (callback) {
            const txResult = await tx;
            const listeningInterval = setInterval(async () => {
              console.log("CHECK IN ON THE TX", txResult, provider);
              const currentTransactionReceipt = await provider.getTransactionReceipt(txResult.hash);
              if (currentTransactionReceipt && currentTransactionReceipt.confirmations) {
                callback({ ...txResult, ...currentTransactionReceipt });
                clearInterval(listeningInterval);
              }
            }, 500);
          }
        }

        if (typeof result.wait === "function") {
          await result.wait();
        }

        return result;
      } catch (e) {
        if (DEBUG) console.log(e);
        // Accounts for Metamask and default signer on all networks
        let message = e.data && e.data.message ? e.data.message : e.error && JSON.parse(JSON.stringify(e.error)).body ? JSON.parse(JSON.parse(JSON.stringify(e.error)).body).error.message : e.data ? e.data : JSON.stringify(e);
        if(!e.error && e.message){
          message = e.message
        }

        console.log("Attempt to clean up:", message);
        try{
          let obj = JSON.parse(message)
          if(obj && obj.body){
            let errorObj = JSON.parse(obj.body)
            if(errorObj && errorObj.error && errorObj.error.message){
              message = errorObj.error.message
            }
          }
        }catch(e){
          //ignore
        }

        notification.error({
          message: "Transaction Error",
          description: message,
        });
        if (callback && typeof callback === "function") {
          callback(e);
        }
      }
    };
  }
}
