import { useCallback, useState, useEffect } from "react";
import useOnBlock from "./OnBlock";
import usePoller from "./Poller";

/*
  ~ What it does? ~

  Gets your balance in ETH from given address and provider

  ~ How can I use? ~

  const yourLocalBalance = useBalance(localProvider, address);

  ~ Features ~

  - Provide address and get balance corresponding to given address
  - Change provider to access balance on different chains (ex. mainnetProvider)
  - If no pollTime is passed, the balance will update on every new block
*/

const DEBUG = false;

export default function useBalance(provider, address, pollTime = 0) {
  const [balance, setBalance] = useState();

  const pollBalance = useCallback(async () => {
    if (provider && address) {
      const newBalance = await provider.getBalance(address);
      if (newBalance !== balance) {
        setBalance(newBalance);
      }
    }
  }, [provider, address, balance]);

  // Only pass a provider to watch on a block if there is no pollTime
  useOnBlock(pollTime === 0 && provider, () => {
    if (provider && address && pollTime === 0) {
      pollBalance();
    }
  });

  // Update balance when the address or provider changes
  useEffect(() => {
    if (address && provider) pollBalance(provider, address);
  }, [address, provider, pollBalance]);

  // Use a poller if a pollTime is provided
  usePoller(
    async () => {
      if (provider && address && pollTime > 0) {
        if (DEBUG) console.log("polling!", address);
        pollBalance();
      }
    },
    pollTime,
    provider && address,
  );

  return balance;
}
