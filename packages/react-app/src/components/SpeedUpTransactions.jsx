import React, { useEffect, useState } from "react";
import { TransactionManager } from "../helpers/TransactionManager";
import { TransactionHistory, TransactionResponseDisplay } from "./";

export default function SpeedUpTransactions({provider, signer, injectedProvider, address, chainId, checkPendingTransactions = true}) {
  const transactionManager = new TransactionManager(provider, signer, true);

  const [transactionResponsesArray, setTransactionResponsesArray] = useState([]);

  const initTransactionResponsesArray = () => {
    if (injectedProvider !== undefined) {
      setTransactionResponsesArray([]);
    }
    else {
      setTransactionResponsesArray(
        filterResponsesAddressAndChainId(
          transactionManager.getTransactionResponsesArray()));    
    }
  }

  const filterResponsesAddressAndChainId = (transactionResponsesArray) => {
    return transactionResponsesArray.filter(
      transactionResponse => {
        return (transactionResponse.from == address) && (transactionResponse.chainId == chainId) && 
          ((checkPendingTransactions && (transactionResponse.confirmations == 0)) || (!checkPendingTransactions && (transactionResponse.confirmations != 0)));
      })
  }

  useEffect(() => {
    initTransactionResponsesArray();

    // Listen for storage change events from the same and from other windows as well
    window.addEventListener("storage", initTransactionResponsesArray);
    window.addEventListener(transactionManager.getLocalStorageChangedEventName(), initTransactionResponsesArray);

    return () => {
      window.removeEventListener("storage", initTransactionResponsesArray);
      window.removeEventListener(transactionManager.getLocalStorageChangedEventName(), initTransactionResponsesArray);
    }
  }, [injectedProvider, address, chainId]);
  
    return (
      <div>  
         {checkPendingTransactions ? transactionResponsesArray.map(
          transactionResponse => {
            return (
              <TransactionResponseDisplay key={transactionResponse.nonce} transactionResponse={transactionResponse} transactionManager={transactionManager}/>
            )
          })
          :
          <TransactionHistory transactionResponsesArray={transactionResponsesArray}/>
         }
      </div>
      
    );  
  }