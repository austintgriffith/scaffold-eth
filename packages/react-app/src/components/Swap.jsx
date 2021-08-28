import { RetweetOutlined, SettingOutlined } from "@ant-design/icons";
import { ChainId, Fetcher, Percent, Token, TokenAmount, Trade, WETH } from "@uniswap/sdk";
import { abi as IUniswapV2Router02ABI } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Drawer,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { useBlockNumber, usePoller } from "eth-hooks";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks";

const { Option } = Select;
const { Text } = Typography;

export const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
];

const makeCall = async (callName, contract, args, metadata = {}) => {
  if (contract[callName]) {
    let result;
    if (args) {
      result = await contract[callName](...args, metadata);
    } else {
      result = await contract[callName]();
    }
    return result;
  }
  return undefined;
  console.log("no call of that name!");
};

const defaultToken = "ETH";
const defaultTokenOut = "DAI";
const defaultSlippage = "0.5";
const defaultTimeLimit = 60 * 10;

const tokenListToObject = array =>
  array.reduce((obj, item) => {
    obj[item.symbol] = new Token(item.chainId, item.address, item.decimals, item.symbol, item.name);
    return obj;
  }, {});

function Swap({ selectedProvider, tokenListURI }) {
  const [tokenIn, setTokenIn] = useState(defaultToken);
  const [tokenOut, setTokenOut] = useState(defaultTokenOut);
  const [exact, setExact] = useState();
  const [amountIn, setAmountIn] = useState();
  const [amountInMax, setAmountInMax] = useState();
  const [amountOut, setAmountOut] = useState();
  const [amountOutMin, setAmountOutMin] = useState();
  const [trades, setTrades] = useState();
  const [routerAllowance, setRouterAllowance] = useState();
  const [balanceIn, setBalanceIn] = useState();
  const [balanceOut, setBalanceOut] = useState();
  const [slippageTolerance, setSlippageTolerance] = useState(
    new Percent(Math.round(defaultSlippage * 100).toString(), "10000"),
  );
  const [timeLimit, setTimeLimit] = useState(defaultTimeLimit);
  const [swapping, setSwapping] = useState(false);
  const [approving, setApproving] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [swapModalVisible, setSwapModalVisible] = useState(false);

  const [tokenList, setTokenList] = useState([]);

  const [tokens, setTokens] = useState();

  const [invertPrice, setInvertPrice] = useState(false);

  const blockNumber = useBlockNumber(selectedProvider, 3000);

  const signer = selectedProvider.getSigner();
  const routerContract = new ethers.Contract(ROUTER_ADDRESS, IUniswapV2Router02ABI, signer);

  const _tokenListUri = tokenListURI || "https://gateway.ipfs.io/ipns/tokens.uniswap.org";

  const debouncedAmountIn = useDebounce(amountIn, 500);
  const debouncedAmountOut = useDebounce(amountOut, 500);

  const activeChainId = process.env.REACT_APP_NETWORK === "kovan" ? ChainId.KOVAN : ChainId.MAINNET;

  useEffect(() => {
    const getTokenList = async () => {
      console.log(_tokenListUri);
      try {
        const tokenListResponse = await fetch(_tokenListUri);
        const tokenListJson = await tokenListResponse.json();
        const filteredTokens = tokenListJson.tokens.filter(function (t) {
          return t.chainId === activeChainId;
        });
        const ethToken = WETH[activeChainId];
        ethToken.name = "Ethereum";
        ethToken.symbol = "ETH";
        ethToken.logoURI =
          "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png";
        const _tokenList = [ethToken, ...filteredTokens];
        setTokenList(_tokenList);
        const _tokens = tokenListToObject(_tokenList);
        setTokens(_tokens);
      } catch (e) {
        console.log(e);
      }
    };
    getTokenList();
  }, [tokenListURI]);

  const getTrades = async () => {
    if (tokenIn && tokenOut && (amountIn || amountOut)) {
      const pairs = arr => arr.map((v, i) => arr.slice(i + 1).map(w => [v, w])).flat();

      const baseTokens = tokenList
        .filter(function (t) {
          return ["DAI", "USDC", "USDT", "COMP", "ETH", "MKR", "LINK", tokenIn, tokenOut].includes(t.symbol);
        })
        .map(el => {
          return new Token(el.chainId, el.address, el.decimals, el.symbol, el.name);
        });

      const listOfPairwiseTokens = pairs(baseTokens);

      const getPairs = async list => {
        const listOfPromises = list.map(item => Fetcher.fetchPairData(item[0], item[1], selectedProvider));
        return Promise.all(listOfPromises.map(p => p.catch(() => undefined)));
      };

      const listOfPairs = await getPairs(listOfPairwiseTokens);

      let bestTrade;

      if (exact === "in") {
        setAmountInMax();
        bestTrade = Trade.bestTradeExactIn(
          listOfPairs.filter(item => item),
          new TokenAmount(tokens[tokenIn], ethers.utils.parseUnits(amountIn.toString(), tokens[tokenIn].decimals)),
          tokens[tokenOut],
          { maxNumResults: 3, maxHops: 1 },
        );
        if (bestTrade[0]) {
          setAmountOut(bestTrade[0].outputAmount.toSignificant(6));
        } else {
          setAmountOut();
        }
      } else if (exact === "out") {
        setAmountOutMin();
        bestTrade = Trade.bestTradeExactOut(
          listOfPairs.filter(item => item),
          tokens[tokenIn],
          new TokenAmount(tokens[tokenOut], ethers.utils.parseUnits(amountOut.toString(), tokens[tokenOut].decimals)),
          { maxNumResults: 3, maxHops: 1 },
        );
        if (bestTrade[0]) {
          setAmountIn(bestTrade[0].inputAmount.toSignificant(6));
        } else {
          setAmountIn();
        }
      }

      setTrades(bestTrade);

      console.log(bestTrade);
    }
  };

  useEffect(() => {
    getTrades();
  }, [tokenIn, tokenOut, debouncedAmountIn, debouncedAmountOut, slippageTolerance, selectedProvider]);

  useEffect(() => {
    if (trades && trades[0]) {
      if (exact === "in") {
        setAmountOutMin(trades[0].minimumAmountOut(slippageTolerance));
      } else if (exact === "out") {
        setAmountInMax(trades[0].maximumAmountIn(slippageTolerance));
      }
    }
  }, [slippageTolerance, amountIn, amountOut, trades]);

  const getBalance = async (_token, _account, _contract) => {
    let newBalance;
    if (_token === "ETH") {
      newBalance = await selectedProvider.getBalance(_account);
    } else {
      newBalance = await makeCall("balanceOf", _contract, [_account]);
    }
    return newBalance;
  };

  const getAccountInfo = async () => {
    if (tokens) {
      const accountList = await selectedProvider.listAccounts();

      if (tokenIn) {
        const tempContractIn = new ethers.Contract(tokens[tokenIn].address, erc20Abi, selectedProvider);
        const newBalanceIn = await getBalance(tokenIn, accountList[0], tempContractIn);
        setBalanceIn(newBalanceIn);

        let allowance;

        if (tokenIn === "ETH") {
          setRouterAllowance();
        } else {
          allowance = await makeCall("allowance", tempContractIn, [accountList[0], ROUTER_ADDRESS]);
          setRouterAllowance(allowance);
        }
      }

      if (tokenOut) {
        const tempContractOut = new ethers.Contract(tokens[tokenOut].address, erc20Abi, selectedProvider);
        const newBalanceOut = await getBalance(tokenOut, accountList[0], tempContractOut);
        setBalanceOut(newBalanceOut);
      }
    }
  };

  usePoller(getAccountInfo, 6000);

  const route = trades
    ? trades.length > 0
      ? trades[0].route.path.map(function (item) {
          return item.symbol;
        })
      : []
    : [];

  const updateRouterAllowance = async newAllowance => {
    setApproving(true);
    try {
      const tempContract = new ethers.Contract(tokens[tokenIn].address, erc20Abi, signer);
      const result = await makeCall("approve", tempContract, [ROUTER_ADDRESS, newAllowance]);
      console.log(result);
      setApproving(false);
      return true;
    } catch (e) {
      notification.open({
        message: "Approval unsuccessful",
        description: `Error: ${e.message}`,
      });
    }
  };

  const approveRouter = async () => {
    const approvalAmount =
      exact === "in"
        ? ethers.utils.hexlify(ethers.utils.parseUnits(amountIn.toString(), tokens[tokenIn].decimals))
        : amountInMax.raw.toString();
    console.log(approvalAmount);
    const approval = updateRouterAllowance(approvalAmount);
    if (approval) {
      notification.open({
        message: "Token transfer approved",
        description: `You can now swap up to ${amountIn} ${tokenIn}`,
      });
    }
  };

  const removeRouterAllowance = async () => {
    const approvalAmount = ethers.utils.hexlify(0);
    console.log(approvalAmount);
    const removal = updateRouterAllowance(approvalAmount);
    if (removal) {
      notification.open({
        message: "Token approval removed",
        description: `The router is no longer approved for ${tokenIn}`,
      });
    }
  };

  const executeSwap = async () => {
    setSwapping(true);
    try {
      let args;
      const metadata = {};

      let call;
      const deadline = Math.floor(Date.now() / 1000) + timeLimit;
      const path = trades[0].route.path.map(function (item) {
        return item.address;
      });
      console.log(path);
      const accountList = await selectedProvider.listAccounts();
      const address = accountList[0];

      if (exact === "in") {
        const _amountIn = ethers.utils.hexlify(ethers.utils.parseUnits(amountIn.toString(), tokens[tokenIn].decimals));
        const _amountOutMin = ethers.utils.hexlify(ethers.BigNumber.from(amountOutMin.raw.toString()));
        if (tokenIn === "ETH") {
          call = "swapExactETHForTokens";
          args = [_amountOutMin, path, address, deadline];
          metadata.value = _amountIn;
        } else {
          call = tokenOut === "ETH" ? "swapExactTokensForETH" : "swapExactTokensForTokens";
          args = [_amountIn, _amountOutMin, path, address, deadline];
        }
      } else if (exact === "out") {
        const _amountOut = ethers.utils.hexlify(
          ethers.utils.parseUnits(amountOut.toString(), tokens[tokenOut].decimals),
        );
        const _amountInMax = ethers.utils.hexlify(ethers.BigNumber.from(amountInMax.raw.toString()));
        if (tokenIn === "ETH") {
          call = "swapETHForExactTokens";
          args = [_amountOut, path, address, deadline];
          metadata.value = _amountInMax;
        } else {
          call = tokenOut === "ETH" ? "swapTokensForExactETH" : "swapTokensForExactTokens";
          args = [_amountOut, _amountInMax, path, address, deadline];
        }
      }
      console.log(call, args, metadata);
      const result = await makeCall(call, routerContract, args, metadata);
      console.log(result);
      notification.open({
        message: "Swap complete 🦄",
        description: (
          <>
            <Text>{`Swapped ${tokenIn} for ${tokenOut}, transaction: `}</Text>
            <Text copyable>{result.hash}</Text>
          </>
        ),
      });
      setSwapping(false);
    } catch (e) {
      console.log(e);
      setSwapping(false);
      notification.open({
        message: "Swap unsuccessful",
        description: `Error: ${e.message}`,
      });
    }
  };

  const showSwapModal = () => {
    setSwapModalVisible(true);
  };

  const handleSwapModalOk = () => {
    setSwapModalVisible(false);
    executeSwap();
  };

  const handleSwapModalCancel = () => {
    setSwapModalVisible(false);
  };

  const insufficientBalance = balanceIn
    ? parseFloat(ethers.utils.formatUnits(balanceIn, tokens[tokenIn].decimals)) < amountIn
    : null;
  const inputIsToken = tokenIn !== "ETH";
  const insufficientAllowance = !inputIsToken
    ? false
    : routerAllowance
    ? parseFloat(ethers.utils.formatUnits(routerAllowance, tokens[tokenIn].decimals)) < amountIn
    : null;
  const formattedBalanceIn = balanceIn
    ? parseFloat(ethers.utils.formatUnits(balanceIn, tokens[tokenIn].decimals)).toPrecision(6)
    : null;
  const formattedBalanceOut = balanceOut
    ? parseFloat(ethers.utils.formatUnits(balanceOut, tokens[tokenOut].decimals)).toPrecision(6)
    : null;

  const metaIn =
    tokens && tokenList && tokenIn
      ? tokenList.filter(function (t) {
          return t.address === tokens[tokenIn].address;
        })[0]
      : null;
  const metaOut =
    tokens && tokenList && tokenOut
      ? tokenList.filter(function (t) {
          return t.address === tokens[tokenOut].address;
        })[0]
      : null;

  const cleanIpfsURI = uri => {
    try {
      return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    } catch (e) {
      console.log(e, uri);
      return uri;
    }
  };

  const logoIn = metaIn ? cleanIpfsURI(metaIn.logoURI) : null;
  const logoOut = metaOut ? cleanIpfsURI(metaOut.logoURI) : null;

  const rawPrice = trades && trades[0] ? trades[0].executionPrice : null;
  const price = rawPrice ? rawPrice.toSignificant(7) : null;
  const priceDescription = rawPrice
    ? invertPrice
      ? `${rawPrice.invert().toSignificant(7)} ${tokenIn} per ${tokenOut}`
      : `${price} ${tokenOut} per ${tokenIn}`
    : null;

  const priceWidget = (
    <Space>
      <Text type="secondary">{priceDescription}</Text>
      <Button
        type="text"
        onClick={() => {
          setInvertPrice(!invertPrice);
        }}
      >
        <RetweetOutlined />
      </Button>
    </Space>
  );

  const swapModal = (
    <Modal title="Confirm swap" visible={swapModalVisible} onOk={handleSwapModalOk} onCancel={handleSwapModalCancel}>
      <Row>
        <Space>
          <img src={logoIn} alt={tokenIn} width="30" />
          {amountIn}
          {tokenIn}
        </Space>
      </Row>
      <Row justify="center" align="middle" style={{ width: 30 }}>
        <span>↓</span>
      </Row>
      <Row>
        <Space>
          <img src={logoOut} alt={tokenOut} width="30" />
          {amountOut}
          {tokenOut}
        </Space>
      </Row>
      <Divider />
      <Row>{priceWidget}</Row>
      <Row>
        {trades && ((amountOutMin && exact === "in") || (amountInMax && exact === "out"))
          ? exact === "in"
            ? `Output is estimated. You will receive at least ${amountOutMin.toSignificant(
                6,
              )} ${tokenOut} or the transaction will revert.`
            : `Input is estimated. You will sell at most ${amountInMax.toSignificant(
                6,
              )} ${tokenIn} or the transaction will revert.`
          : null}
      </Row>
    </Modal>
  );

  return (
    <Card
      title={
        <Space>
          <img src="https://ipfs.io/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg" width="40" alt="uniswapLogo" />
          <Typography>Uniswapper</Typography>
        </Space>
      }
      extra={
        <Button
          type="text"
          onClick={() => {
            setSettingsVisible(true);
          }}
        >
          <SettingOutlined />
        </Button>
      }
    >
      <Space direction="vertical">
        <Row justify="center" align="middle">
          <Card
            size="small"
            type="inner"
            title={`From${exact === "out" && tokenIn && tokenOut ? " (estimate)" : ""}`}
            extra={
              <>
                <img src={logoIn} alt={tokenIn} width="30" />
                <Button
                  type="link"
                  onClick={() => {
                    setAmountOut();
                    setAmountIn(ethers.utils.formatUnits(balanceIn, tokens[tokenIn].decimals));
                    setAmountOutMin();
                    setAmountInMax();
                    setExact("in");
                  }}
                >
                  {formattedBalanceIn}
                </Button>
              </>
            }
            style={{ width: 400, textAlign: "left" }}
          >
            <InputNumber
              style={{ width: "160px" }}
              min={0}
              size="large"
              value={amountIn}
              onChange={e => {
                setAmountOut();
                setTrades();
                setAmountIn(e);
                setExact("in");
              }}
            />
            <Select
              showSearch
              value={tokenIn}
              style={{ width: "120px" }}
              size="large"
              bordered={false}
              defaultValue={defaultToken}
              onChange={value => {
                console.log(value);
                if (value === tokenOut) {
                  console.log("switch!", tokenIn);
                  setTokenOut(tokenIn);
                  setAmountOut(amountIn);
                  setBalanceOut(balanceIn);
                }
                setTokenIn(value);
                setTrades();
                setAmountIn();
                setExact("out");
                setBalanceIn();
              }}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              optionFilterProp="children"
            >
              {tokenList.map(token => (
                <Option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </Option>
              ))}
            </Select>
          </Card>
        </Row>
        <Row justify="center" align="middle">
          <Tooltip title={route.join("->")}>
            <span>↓</span>
          </Tooltip>
        </Row>
        <Row justify="center" align="middle">
          <Card
            size="small"
            type="inner"
            title={`To${exact === "in" && tokenIn && tokenOut ? " (estimate)" : ""}`}
            extra={
              <>
                <img src={logoOut} width="30" alt={tokenOut} />
                <Button type="text">{formattedBalanceOut}</Button>
              </>
            }
            style={{ width: 400, textAlign: "left" }}
          >
            <InputNumber
              style={{ width: "160px" }}
              size="large"
              min={0}
              value={amountOut}
              onChange={e => {
                setAmountOut(e);
                setAmountIn();
                setTrades();
                setExact("out");
              }}
            />
            <Select
              showSearch
              value={tokenOut}
              style={{ width: "120px" }}
              size="large"
              bordered={false}
              onChange={value => {
                console.log(value, tokenIn, tokenOut);
                if (value === tokenIn) {
                  console.log("switch!", tokenOut);
                  setTokenIn(tokenOut);
                  setAmountIn(amountOut);
                  setBalanceIn(balanceOut);
                }
                setTokenOut(value);
                setExact("in");
                setAmountOut();
                setTrades();
                setBalanceOut();
              }}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              optionFilterProp="children"
            >
              {tokenList.map(token => (
                <Option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </Option>
              ))}
            </Select>
          </Card>
        </Row>
        <Row justify="center" align="middle">
          {priceDescription ? priceWidget : null}
        </Row>
        <Row justify="center" align="middle">
          <Space>
            {inputIsToken ? (
              <Button size="large" loading={approving} disabled={!insufficientAllowance} onClick={approveRouter}>
                {!insufficientAllowance && amountIn && amountOut ? "Approved" : "Approve"}
              </Button>
            ) : null}
            <Button
              size="large"
              loading={swapping}
              disabled={insufficientAllowance || insufficientBalance || !amountIn || !amountOut}
              onClick={showSwapModal}
            >
              {insufficientBalance ? "Insufficient balance" : "Swap!"}
            </Button>
            {swapModal}
          </Space>
        </Row>
      </Space>
      <Drawer
        visible={settingsVisible}
        onClose={() => {
          setSettingsVisible(false);
        }}
        width={500}
      >
        <Descriptions title="Details" column={1} style={{ textAlign: "left" }}>
          <Descriptions.Item label="blockNumber">{blockNumber}</Descriptions.Item>
          <Descriptions.Item label="routerAllowance">
            <Space>
              {routerAllowance ? ethers.utils.formatUnits(routerAllowance, tokens[tokenIn].decimals) : null}
              {routerAllowance > 0 ? <Button onClick={removeRouterAllowance}>Remove Allowance</Button> : null}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="route">{route.join("->")}</Descriptions.Item>
          <Descriptions.Item label="exact">{exact}</Descriptions.Item>
          <Descriptions.Item label="bestPrice">
            {trades ? (trades.length > 0 ? trades[0].executionPrice.toSignificant(6) : null) : null}
          </Descriptions.Item>
          <Descriptions.Item label="nextMidPrice">
            {trades ? (trades.length > 0 ? trades[0].nextMidPrice.toSignificant(6) : null) : null}
          </Descriptions.Item>
          <Descriptions.Item label="priceImpact">
            {trades ? (trades.length > 0 ? trades[0].priceImpact.toSignificant(6) : null) : null}
          </Descriptions.Item>
          <Descriptions.Item label="slippageTolerance">
            <InputNumber
              defaultValue={defaultSlippage}
              min={0}
              max={100}
              precision={2}
              formatter={value => `${value}%`}
              parser={value => value.replace("%", "")}
              onChange={value => {
                console.log(value);

                const slippagePercent = new Percent(Math.round(value * 100).toString(), "10000");
                setSlippageTolerance(slippagePercent);
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="amountInMax">{amountInMax ? amountInMax.toExact() : null}</Descriptions.Item>
          <Descriptions.Item label="amountOutMin">{amountOutMin ? amountOutMin.toExact() : null}</Descriptions.Item>
          <Descriptions.Item label="timeLimitInSeconds">
            <InputNumber
              min={0}
              max={3600}
              defaultValue={defaultTimeLimit}
              onChange={value => {
                console.log(value);
                setTimeLimit(value);
              }}
            />
          </Descriptions.Item>
        </Descriptions>
      </Drawer>
    </Card>
  );
}

export default Swap;
