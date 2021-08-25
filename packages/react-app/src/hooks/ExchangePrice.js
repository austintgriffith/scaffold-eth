import { Fetcher, Route, Token, WETH } from "@uniswap/sdk";
import { usePoller } from "eth-hooks";
import { useState } from "react";

export default function useExchangePrice(targetNetwork, mainnetProvider, pollTime) {
  const [price, setPrice] = useState(0);

  const pollPrice = () => {
    async function getPrice() {
      if (!mainnetProvider) return 0;
      if (targetNetwork.price) {
        setPrice(targetNetwork.price);
      } else {
        const DAI = new Token(
          mainnetProvider.network ? mainnetProvider.network.chainId : 1,
          "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          18,
        );
        const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId], mainnetProvider).catch(e => {
          console.error("DAI fetch fail: ", e);
        });
        if (pair !== undefined) {
          const route = new Route([pair], WETH[DAI.chainId]);
          setPrice(parseFloat(route.midPrice.toSignificant(6)));
        }
      }
    }
    getPrice();
  };
  usePoller(pollPrice, pollTime || 9777);

  return price;
}
