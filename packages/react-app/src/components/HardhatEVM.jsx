import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip, Drawer, Form, Row, Col, Select, DatePicker, Divider } from "antd";
import { useLookupAddress } from "eth-hooks";
import React, { useCallback, useEffect, useState } from "react";
import Blockies from "react-blockies";
import { Transactor } from "../helpers";
import Wallet from "./Wallet";
import {
  useOnBlock,
} from "../hooks";
import { formatEther, parseEther } from "@ethersproject/units";
import { parse } from "graphql";

const { Option } = Select;
const { utils, BigNumber } = require("ethers");

/**
 * Allows user to open a Hardhat console with some handy Hardhat/EVM utilities like
 * increasing time, jumping to a particular timestamp or setting an account's balance.
 * 
  ~ Features ~
  - If on Hardhat/local, displays a button to open the console
  - Allows user to execute evm_increaseTime, evm_setNextBlockTimestamp and hardhat_setBalance
 * @param props.localProvider - The localProvider for subscribing to new blocks
 * @param props.address - The address of the current user to prefill data
 */

export default function HardhatEVM(props) {
  const [visible, setVisible] = useState(false);
  const [chainTimestamp, setChainTimestamp] = useState();
  const [accountBalance, setAccountBalance] = useState();

  const {localProvider, address} = props;

  useOnBlock(localProvider, () => {
    updateTime();
  });

  async function updateTime(){
    const time = await localProvider.getBlock();
    setChainTimestamp(new Date(time.timestamp * 1000).toLocaleString("en-US"));
  }

  function onClose(){
    setVisible(false);
  }

  async function showDrawer(){  
    setField('hardhat_setBalance_address', address);
    const newBalance = await localProvider.getBalance(address);
    setAccountBalance(formatEther(newBalance));
    setVisible(true);
  }

  async function increaseTime(){
    await localProvider.send("evm_increaseTime", [parseInt(form["increaseTimeSeconds"])]);
    await localProvider.send("evm_mine");
    updateTime();
  }

   async function setNextBlockTimestamp(){
    await localProvider.send("evm_setNextBlockTimestamp", [parseInt(form["nextBlockTimestamp"])]);
    await localProvider.send("evm_mine");
    updateTime();
  }

  async function hardhatSetBalance(){
    const aNum = parseInt(parseEther(form["hardhat_setBalance_amount"]));
    console.log(aNum.toString(16));
    await localProvider.send("hardhat_setBalance", [form["hardhat_setBalance_address"], "0x"+aNum.toString(16)]);
    await localProvider.send("evm_mine");
    const newBalance = await localProvider.getBalance(form["hardhat_setBalance_address"]);
    setAccountBalance(formatEther(newBalance));
  }

  const [ form, setForm ] = useState({})
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
  }

  return (
      <>
        <Button size="large" shape="round" onClick={() => {showDrawer();}}>
          <span style={{ marginRight: 8 }} role="img" aria-label="support">
                👷‍♂️
              </span>
              Hardhat
        </Button>
        <Drawer
          title="👷 Hardhat Network Manager"
          width={720}
          onClose={() => {onClose();}}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={() => {onClose();}} type="primary">
                Close
              </Button>
            </div>
          }
        >
          <h2>⏰ Increase Time (evm_increaseTime)</h2>
          <p>Increases the blockchain time by a given amount (in seconds)</p>
          <Row gutter={8}>
            <Col span={8}>
              <Input placeholder="Increase time by seconds" onChange={e => setField('increaseTimeSeconds', e.target.value)}/>
            </Col>
            <Col span={8}>
                <Button
                onClick={() => {increaseTime()}}
              >
                Increase Time
              </Button>
            </Col>
            <Col span={8}>
                <h3>{chainTimestamp}</h3>
            </Col>
          </Row>

          <Divider /> 

          <h2>📅 Set Next Block Timestamp (evm_setNextBlockTimestamp)</h2>
          <p>Sets the next block timestamp to a given number</p>
          <Row gutter={8}>
            <Col span={8}>
              <Input placeholder="Desired timestamp Unix timestamp" onChange={e => setField('nextBlockTimestamp', e.target.value)}/>
            </Col>
            <Col span={8}>
                <Button
                onClick={() => {setNextBlockTimestamp()}}
              >
                Increase Time
              </Button>
            </Col>
            <Col span={8}>
                <h3>{chainTimestamp}</h3>
            </Col>
          </Row>
          <Divider /> 

          <h2>💸 Hardhat Set Balance (hardhat_setBalance)</h2>
          <p>Sets the balance of an account</p>
          <Row gutter={8}>
            <Col span={8}>
              <Input placeholder="address" value={form["hardhat_setBalance_address"]} onChange={e => setField('hardhat_setBalance_address', e.target.value)}/>
              <Input placeholder="amount in eth (15)" onChange={e => setField('hardhat_setBalance_amount', e.target.value)}/>
            </Col>
            <Col span={8}>
                <Button
                onClick={() => {hardhatSetBalance()}}
              >
                Set Balance
              </Button>
            </Col>
            <Col span={8}>
                <h3>{accountBalance} Ether</h3>
            </Col>
          </Row>
          <Divider /> 
        </Drawer>
      </>
    );
}
