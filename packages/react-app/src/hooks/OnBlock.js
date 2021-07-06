import { useEffect, useRef } from "react";

// helper hook to call a function regularly in time intervals
const DEBUG = false;

export default function useOnBlock(provider, fn, args) {
  const savedCallback = useRef();
  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  // Turn on the listener if we have a function & a provider
  useEffect(() => {
    if (savedCallback.current && provider) {
      const listener = blockNumber => {
        if (DEBUG) console.log(blockNumber, savedCallback.current, args, provider.listeners());

        if (args && args.length > 0) {
          savedCallback.current(...args);
        } else {
          savedCallback.current();
        }
      };

      provider.on("block", listener);

      return () => {
        provider.off("block", listener);
      };
    }
  }, [provider, args]);
}
