import { useEffect, useRef } from 'react';

/**
 * @see useOnRepetition for a newer implementation
 * helper hook to call a function regularly in time intervals
 * @param callbackFn
 * @param delay
 * @param extraWatch
 */
export const usePoller = (callbackFn: () => void, delay: number, extraWatch: boolean = false): void => {
  const savedCallback = useRef<() => void>();

  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = callbackFn;
  }, [callbackFn]);

  // Set up the interval.
  useEffect(() => {
    const tick = (): void => {
      if (savedCallback.current) savedCallback.current();
    };

    if (delay !== null && delay > 0) {
      const id = setInterval(tick, delay);
      return (): void => clearInterval(id);
    }
  }, [delay]);

  // run at start too
  useEffect(() => {
    if (savedCallback.current && delay > 0) savedCallback.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraWatch]);
};
