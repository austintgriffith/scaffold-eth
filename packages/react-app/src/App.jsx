import { Row, Col, Layout, Space, Divider, Radio, Input, Table } from "antd";
import "antd/dist/antd.css";
import "./App.css";
import React, { useState } from "react";
// import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import axios from "axios";

import { HeaderSt } from "./components";
import { useOnBlock, usePoller } from "./hooks";

import { INFURA_ID, NETWORK, NETWORKS } from "./constants";

const { ethers } = require("ethers");
const { Header, Footer, Content } = Layout;

// 😬 Sorry for all the console logging
// const DEBUG = true;

const mainnetInfura = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID) : null;

function App(props) {
  const mainnetProvider = mainnetInfura;

  const [gasPrices, setGasPrices] = useState({});
  const [gas, setGas] = useState(0);
  const [gasEth, setGasEth] = useState(0);
  const [gasUsd, setGasUsd] = useState(0);
  const [gasLimit, setGasLimit] = useState(30000);
  const [ethPrice, setEthPrice] = useState(0);

  const [blockNum, setBlockNum] = useState(0);
  const [BlockBaseGas, setBlockBaseGas] = useState(0);
  const [BlockBaseGasEth, setBlockBaseGasEth] = useState(0);
  const [BlockGasUsed, setBlockGasUsed] = useState(0);
  const [BlockGasLimit, setBlockGasLimit] = useState(0);
  const [BlockGasPrices, setBlockGasPrices] = useState({});
  const [BlockMaxFees, setBlockMaxFees] = useState({});
  const [BlockMaxPriorityFees, setBlockMaxPriorityFees] = useState({});
  const [BlocktotalTrxs, setBlockTotalTrxs] = useState(0);

  const [Loading, setLoading] = useState(0);
  const [TrxsData, setTrxsData] = useState([]);

  const fromWei = i => {
    return i / 10 ** 18;
  };
  const fromGWei = i => {
    return i / 10 ** 9;
  };
  const toGWei = i => {
    return i * 10 ** 9;
  };

  // sort array ascending
  const asc = arr => arr.sort((a, b) => a - b);

  const sum = arr => arr.reduce((a, b) => a + b, 0);

  const mean = arr => sum(arr) / arr.length;

  // sample standard deviation
  const std = (arr) => {
      const mu = mean(arr);
      const diffArr = arr.map(a => (a - mu) ** 2);
      return Math.sqrt(sum(diffArr) / (arr.length - 1));
  };

  const ethgasAPI = "https://ethgasstation.info/json/ethgasAPI.json";
  const uniswapV2GQL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
  const ethQL = `{
    bundles (first:1) {
      ethPrice
    }
  }`;

  const getEthPrice = () => {
    axios
      .post(uniswapV2GQL, { query: ethQL })
      .then(response => {
        const { data } = response;
        const {
          data: { bundles },
        } = data;
        if (bundles.length > 0) {
          const ep = parseFloat(bundles[0].ethPrice).toFixed(6);
          setEthPrice(ep);
          calcUsd();
        }
      })
      .catch(error => console.log(error));
  };

  const gasConverter = g => {
    const gm = g * 100000000;
    const gd = parseInt(gm, 10) / 10 ** 9;
    return gd;
  };

  const getGasPrices = () => {
    axios
      .get(ethgasAPI)
      .then(response => {
        const { data } = response;
        const { average, fast, fastest } = data;
        const gasObj = {
          average: gasConverter(average),
          fast: gasConverter(fast),
          fastest: gasConverter(fastest),
        };
        setGasPrices(gasObj);
        setGas(gasObj.fast);
        calcUsd();
      })
      .catch(error => console.log(error));
  };

  const onChangeGas = e => {
    const g = e.target.value;
    // console.log("radio checked --", g);
    setGas(g);
    calcUsd();
  };

  
  const onChangeGasLimit = e => {
    const g = e.target.value;
    // console.log('value --', g);
    setGasLimit(g);
    calcUsd();
  };

  const calcUsd = () => {
    if (ethPrice < 0 || gas < 0) return;
    const fg = toGWei(gas);
    const gm = fromWei(fg * gasLimit);
    const u = parseFloat(gm * ethPrice).toFixed(6);
    if (gm > 0) setGasEth(gm);
    if (u > 0) setGasUsd(u);
  };

  const init = () => {
    getEthPrice();
    getGasPrices();
  };

  useOnBlock(mainnetProvider, async () => {
    await setLoading(0);
    // console.log(mainnetProvider)
    const bn = await mainnetProvider._lastBlockNumber;
    const blockWithTrxs = await mainnetProvider.getBlockWithTransactions( bn );
    let bf = blockWithTrxs.baseFeePerGas.toString();
    const gu = blockWithTrxs.gasUsed.toString();
    const gl = blockWithTrxs.gasLimit.toString();

    try{
      bf = parseFloat(toGWei(fromWei(bf))).toFixed(6);
    } catch (e) {
      // console.log(e);
    }
    // let bfe = fromWei(bf * gl);
    // bfe = parseFloat(bf * ethPrice).toFixed(6);
    
    setBlockNum(bn);
    setBlockBaseGas(bf);
    // setBlockBaseGasEth(bfe);
    setBlockGasUsed(gu);
    setBlockGasLimit(gl);
    setBlockTotalTrxs(blockWithTrxs.transactions.length);

    const trxs = [];
    let trxsEGP = [];
    let trxsEMF = [];
    let trxsEMPF = [];
    blockWithTrxs.transactions.map(t => {
      if(t.type == "0x2") {
        // console.log(t)

        const th = t.hash.toString();
        let tg = t.gas.toString();
        let tgl = t.gasLimit.toString();
        let tgp = t.gasPrice.toString();
        let tmf = t.maxFeePerGas.toString();
        let tmpf = t.maxPriorityFeePerGas.toString();
        
        try {
          tg = ethers.BigNumber.from(tg).toString();
        } catch (e) {
          // console.log(e);
        }
        try {
          tgl = ethers.BigNumber.from(tgl).toString();
        } catch (e) {
          // console.log(e);
        }
        try {
          tgp = ethers.BigNumber.from(tgp).toString();
        } catch (e) {
          // console.log(e);
        }
        try {
          tmf = ethers.BigNumber.from(tmf).toString();
        } catch (e) {
          // console.log(e);
        }
        try {
          tmpf = ethers.BigNumber.from(tmpf).toString();
        } catch (e) {
          // console.log(e);
        }

        trxs.push({
          hash:th,
          gas:tg,
          gasLimit:tgl,
          gasPrice:toGWei(fromWei(tgp)),
          maxFeePerGas:toGWei(fromWei(tmf)),
          maxPriorityFeePerGas:toGWei(fromWei(tmpf)),
        })
          
      } else {
        const th = t.hash.toString();
        let tg = t.gas.toString();
        let tgl = t.gasLimit.toString();
        let tgp = t.gasPrice.toString();

        try {
          tg = ethers.BigNumber.from(tg).toString();
        } catch (e) {
          // console.log(e);
        }
        try {
          tgl = ethers.BigNumber.from(tgl).toString();
        } catch (e) {
          // console.log(e);
        }
        try {
          tgp = ethers.BigNumber.from(tgp).toString();
        } catch (e) {
          // console.log(e);
        }

        trxs.push({
          hash:th,
          gas:tg,
          gasLimit:tgl,
          gasPrice:toGWei(fromWei(tgp)),
          maxFeePerGas:0,
          maxPriorityFeePerGas:0,
        })
      }
    })

    trxsEGP = trxs.filter(i => {
      if(i.gasPrice > 0) return i.gasPrice
    }).sort((a, b) => a.gasPrice - b.gasPrice);
    trxsEMF = trxs.filter(i => {
      if(i.maxFeePerGas > 0) return i.maxFeePerGas
    }).sort((a, b) => a.maxFeePerGas - b.maxFeePerGas);
    trxsEMPF = trxs.filter(i => {
      if(i.maxPriorityFeePerGas > 0) return i.maxPriorityFeePerGas
    }).sort((a, b) => a.maxPriorityFeePerGas - b.maxPriorityFeePerGas);

    // let gpmin = Math.round(Math.min.apply(null, trxsEGP.map(i => i.gasPrice)));
    // let gpmax = Math.round(Math.max.apply(null, trxsEGP.map(i => i.gasPrice)));
    // let gpavg = Math.round(trxsEGP.reduce((t, n) => t + n.gasPrice, 0) / trxsEGP.length);

    // let mfmin = Math.round(Math.min.apply(null, trxsEMF.map(i => i.maxFeePerGas)));
    // let mfmax = Math.round(Math.max.apply(null, trxsEMF.map(i => i.maxFeePerGas)));
    // let mfavg = Math.round(trxsEMF.reduce((t, n) => t + n.maxFeePerGas, 0) / trxsEMF.length);

    // let mpfmin = Math.round(Math.min.apply(null, trxsEMPF.map(i => i.maxPriorityFeePerGas)));
    // let mpfmax = Math.round(Math.max.apply(null, trxsEMPF.map(i => i.maxPriorityFeePerGas)));
    // let mpfavg = Math.round(trxsEMPF.reduce((t, n) => t + n.maxPriorityFeePerGas, 0) / trxsEMPF.length);

    let gpmax = Math.round(quantile(trxsEGP.map(i => i.gasPrice), .75));
    let gpavg = Math.round(quantile(trxsEGP.map(i => i.gasPrice), .50));

    let mfmax = Math.round(quantile(trxsEMF.map(i => i.maxFeePerGas), .75));
    let mfavg = Math.round(quantile(trxsEMF.map(i => i.maxFeePerGas), .50));

    let mpfmax = Math.round(quantile(trxsEMPF.map(i => i.maxPriorityFeePerGas), .75));
    let mpfavg = Math.round(quantile(trxsEMPF.map(i => i.maxPriorityFeePerGas), .50));

    const gpObj = {
      average: gpavg,
      fast: gpmax,
      fastest: gpmax,
    };
    const mfObj = {
      average: mfavg,
      fast: mfmax,
      fastest: mfmax,
    };
    const mpfObj = {
      average: mpfavg,
      fast: mpfmax,
      fastest: mpfmax,
    };

    setTrxsData(trxs);
    
    setBlockGasPrices(gpObj);
    setBlockMaxFees(mfObj);
    setBlockMaxPriorityFees(mpfObj);

    console.log(`⛓ mainnet block : ${bn}`);
    // console.log('⛓ trxsEMF',trxsEMF);

    init();
    await setLoading(1);
  });
  // usePoller(init, 10000);

  const quantile = (arr, q) => {
      const sorted = asc(arr);
      const pos = (sorted.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
          return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      } else {
          return sorted[base];
      }
  };

  const cols = [
    {
      title: "details",
      dataIndex: "hash",
      key: "hash",
      width: "80%",
      render: (text, record, index) => {
        // console.log(record);

        let gas = record.gas;
        let gasLimit = record.gasLimit;
        let gasPrice = record.gasPrice;
        let maxFeePerGas = record.maxFeePerGas || 0;
        let maxPriorityFeePerGas = record.maxPriorityFeePerGas || 0;
        return (
          <>
            gas: {gas} 
            <br />
            gas limit: {gasLimit}
            <br />
            gas price: {gasPrice}
            <br />
            max fee: {maxFeePerGas}
            <br />
            max priority fee: {maxPriorityFeePerGas}
          </>
        );
      },
    },
  ];

  return (
    <div className="App">
      <Layout>
        <Header
          style={{ padding: 5, position: "fixed", zIndex: 1, width: "100%", height: "auto", top: 0 }}
        >
          <HeaderSt />
          <Space></Space>
        </Header>
        <Content style={{ paddingTop: 150, paddingBottom: 50, width: "100%" }} className="">
          <div
            style={{
              width: 800,
              margin: "auto",
              marginTop: 10,
              paddingTop: 15,
              paddingBottom: 15,
              fontWeight: "bolder",
              borderRadius: 12,
            }}
            class="grad_deeprelief"
          >
            <h3> ⚓ latest block num: {blockNum}</h3>
            <h3> ⚓ base fee: {BlockBaseGas} gwei</h3>
            {/*<h3> ⚓ base fee cost (eth): {BlockBaseGasEth}</h3>*/}
            <h4> ⚓ gas used: {BlockGasUsed} | gas limit: {BlockGasLimit}</h4>
            {/*<h3> ⚓ gas limit: {BlockGasLimit}</h3>*/}
            {/*<h4> ⚓ total trxs: {BlocktotalTrxs}</h4>*/}
            <Divider />
            <h3> ⛽️ select gas price speed (based on block num: {blockNum}):</h3>
            <Radio.Group onChange={onChangeGas} value={gas} buttonStyle="solid">
              <Radio.Button
                value={BlockGasPrices && BlockGasPrices.average}
                style={{
                  margin: 5,
                  padding: "15px 5px",
                  backgroundColor: "#2FB999",
                  borderRadius: 4,
                  width: "210px",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: 15 }}>average</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>gas:{BlockGasPrices && BlockGasPrices.average}</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>max fee:{BlockMaxFees && BlockMaxFees.average}</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>max priority fee:{BlockMaxPriorityFees && BlockMaxPriorityFees.average}</div>
              </Radio.Button>
              <Radio.Button
                value={BlockGasPrices && BlockGasPrices.fast}
                style={{
                  margin: 5,
                  padding: "15px 5px",
                  backgroundColor: "#456cda",
                  borderRadius: 4,
                  width: "210px",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: 15 }}>fast</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>gas:{BlockGasPrices && BlockGasPrices.fast}</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>max fee:{BlockMaxFees && BlockMaxFees.fast}</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>max priority fee:{BlockMaxPriorityFees && BlockMaxPriorityFees.fast}</div>
              </Radio.Button>
              <Radio.Button
                value={BlockGasPrices && BlockGasPrices.fastest}
                style={{
                  margin: 5,
                  padding: "15px 5px",
                  backgroundColor: "#dc658d",
                  borderRadius: 4,
                  width: "210px",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: 15 }}>fastest</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>gas:{BlockGasPrices && BlockGasPrices.fastest}</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>max fee:{BlockMaxFees && BlockMaxFees.fastest}</div>
                <div style={{ fontSize: 16,lineHeight:"20px" }}>max priority fee:{BlockMaxPriorityFees && BlockMaxPriorityFees.fastest}</div>
              </Radio.Button>
            </Radio.Group>
            <Divider />
            <h3> ⛽️ select gas price speed (eth gas station):</h3>
            <Radio.Group onChange={onChangeGas} value={gas} buttonStyle="solid">
              <Radio.Button
                value={gasPrices && gasPrices.average}
                style={{
                  margin: 10,
                  padding: 15,
                  backgroundColor: "#2FB999",
                  borderRadius: 4,
                  width: "100px",
                  height: "100px",
                }}
              >
                <div style={{ fontSize: 15 }}>average</div>
                <div style={{ fontSize: 20 }}>{gasPrices && gasPrices.average}</div>
              </Radio.Button>
              <Radio.Button
                value={gasPrices && gasPrices.fast}
                style={{
                  margin: 10,
                  padding: 15,
                  backgroundColor: "#456cda", //0237CC
                  borderRadius: 4,
                  width: "100px",
                  height: "100px",
                }}
              >
                <div style={{ fontSize: 15 }}>fast</div>
                <div style={{ fontSize: 20 }}>{gasPrices && gasPrices.fast}</div>
              </Radio.Button>
              <Radio.Button
                value={gasPrices && gasPrices.fastest}
                style={{
                  margin: 10,
                  padding: 15,
                  backgroundColor: "#dc658d", //FF558F
                  borderRadius: 4,
                  width: "100px",
                  height: "100px",
                }}
              >
                <div style={{ fontSize: 15 }}>fastest</div>
                <div style={{ fontSize: 20 }}>{gasPrices && gasPrices.fastest}</div>
              </Radio.Button>
            </Radio.Group>
            <h3>enter gas limit:</h3>
            <Input
              placeholder="input gas limit"
              allowClear
              defaultValue={gasLimit}
              onChange={onChangeGasLimit}
              style={{ width: "50%" }}
            />
            <Divider />
            <h3> 💲 current eth price: {ethPrice}</h3>
            <h3> ⛽️ selected gas : {gas} gwei</h3>
            <h3> ♦ gas cost (eth) : {gasEth}</h3>
            <h3> 💲 gas cost (usd) : {gasUsd}</h3>
            <Divider />
            {/*<Table
              showHeader={false}
              columns={cols}
              rowKey="id"
              size="small"
              dataSource={TrxsData}
              loading={Loading == 1 ? false : true}
              pagination={{ defaultPageSize: 50 }}
              style={{
                padding: 10,
              }}
            />*/}
          </div>

          <div
            style={{
              width: 800,
              margin: "auto",
              marginTop: 10,
              padding: 10,
              fontWeight: "bolder",
              borderRadius: 12,
            }}
            class="grad_deeprelief"
          >
            <div> ****** </div>
            <div> PRIOR TO THE LONDON UPGRADE: </div>
            <div style={{ textAlign: "left" }}>
              Total fee would have been: Gas units (limit) * Gas price per unit i.e 21,000 * 200 = 4,200,000 gwei or 0.0042 ETH
            </div>
            <Divider/>
            <div> AFTER THE LONDON UPGRADE: </div>
            <div style={{ textAlign: "left" }}>
              Calculating the total transaction fee works as follows: Gas units (limit) * (Base fee + Tip)
              Using the formula above we can calculate this as 21,000 * (100 + 10) = 2,310,000 gwei or 0.0023 ETH.
            </div>
            <Divider/>
            <div style={{ textAlign: "left" }}>
              <span style={{ backgroundColor: "#98b5de", padding:2 }}>Base Fee</span>: The base fee is calculated by a formula that compares the size of the previous block (the amount of gas used for all the transactions) with the target size. 
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ backgroundColor: "#98b5de", padding:2 }}>Priority Fee (Tips)</span>: With the new base fee getting burned, the London Upgrade introduced a priority fee (tip) to incentivize miners to include a transaction in the block.
              </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ backgroundColor: "#98b5de", padding:2 }}>Max Fee</span>: To execute a transaction on the network users are able to specify a maximum limit they are willing to pay for their transaction to be executed. difference between the max fee and the actual fee is refunded, i.e. refund = max fee - (base fee + priority fee)
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ backgroundColor: "#98b5de", padding:2 }}>Gas</span>: Gas refers to the unit that measures the amount of computational effort required to execute specific
              operations on the Ethereum network.
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ backgroundColor: "#98b5de", padding:2 }}>Gas Limit</span>: Gas limit refers to the maximum amount of gas you are willing to consume on a transaction. A standard ETH transfer requires a gas limit of 21,000 units of gas.
            </div>
            <div style={{ textAlign: "left" }}>
              <span style={{ backgroundColor: "#98b5de", padding:2 }}>Gas Price</span>: Gas price refers to the amount of ether you are willing to pay for every unit of gas, and this is usually measured in 'gwei'.
            </div>
            <div style={{ textAlign: "left" }}>
              reference:{" "}
              <a href="https://ethereum.org/en/developers/docs/gas/" target="_blank" rel="noopener noreferrer">
                https://ethereum.org/en/developers/docs/gas/
              </a>
            </div>
          </div>
        </Content>
        <Footer
          style={{ padding: 5, position: "fixed", zIndex: 1, width: "100%", bottom: 0 }}
          className="grad_glasswater"
        >
          <Row align="middle" gutter={[4, 4]}>
            <Col span={12}>
            </Col>

            <Col span={12} style={{ textAlign: "center" }}>
              <div style={{ opacity: 0.5 }}>
                {/*<a
                  target="_blank"
                  style={{ color: "#000" }}
                  href="https://github.com/austintgriffith/scaffold-eth"
                >
                  🍴 Repo: Fork me!
                </a>
                <br />*/}
                <a
                  target="_blank"
                  style={{ color: "#000" }}
                  href="https://github.com/austintgriffith/scaffold-eth/tree/gas-calculator"
                >
                  🍴 Repo: Fork me!
                </a>
              </div>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </div>
  );
}

export default App;
