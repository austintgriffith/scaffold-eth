/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useContext } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { EthersContext } from "../context";

export default function ExampleUI({purpose, setPurposeEvents, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  const [newPurpose, setNewPurpose] = useState("loading...");
  const context_value = useContext(EthersContext);
  console.log("Gas Price: ", context_value.gasPrice);
  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
        <h2>Example UI:</h2>

        <h4>purpose: {purpose}</h4>

        <Divider/>

        <div style={{margin:8}}>
          <Input onChange={(e)=>{setNewPurpose(e.target.value)}} />
          <Button onClick={()=>{
            console.log("newPurpose",newPurpose)
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.setPurpose(newPurpose) )
          }}>Set Purpose</Button>
        </div>


        <Divider />

        Your Address:
        <Address
            value={address}
            ensProvider={mainnetProvider}
            fontSize={16}
        />

        <Divider />

        ENS Address Example:
        <Address
          value={"0x34aA3F359A9D614239015126635CE7732c18fDF3"} /* this will show as austingriffith.eth */
          ensProvider={mainnetProvider}
          fontSize={16}
        />

        <Divider/>

        {  /* use formatEther to display a BigNumber: */ }
        <h2>Your Balance: {yourLocalBalance?formatEther(yourLocalBalance):"..."}</h2>

        OR

        <Balance
          address={address}
          provider={localProvider}
          dollarMultiplier={price}
        />

        <Divider/>


        {  /* use formatEther to display a BigNumber: */ }
        <h2>Your Balance: {yourLocalBalance?formatEther(yourLocalBalance):"..."}</h2>

        <Divider/>



        Your Contract Address:
        <Address
            value={readContracts?readContracts.YourContract.address:readContracts}
            ensProvider={mainnetProvider}
            fontSize={16}
        />

        <Divider />

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* look how you call setPurpose on your contract: */
            tx( writeContracts.YourContract.setPurpose("🍻 Cheers") )
          }}>Set Purpose to "🍻 Cheers"</Button>
        </div>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
            tx({
              to: writeContracts.YourContract.address,
              value: parseEther("0.001")
            });
            /* this should throw an error about "no fallback nor receive function" until you add it */
          }}>Send Value</Button>
        </div>

        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* look how we call setPurpose AND send some value along */
            tx( writeContracts.YourContract.setPurpose("💵 Paying for this one!",{
              value: parseEther("0.001")
            }))
            /* this will fail until you make the setPurpose function payable */
          }}>Set Purpose With Value</Button>
        </div>


        <div style={{margin:8}}>
          <Button onClick={()=>{
            /* you can also just craft a transaction and send it to the tx() transactor */
            tx({
              to: writeContracts.YourContract.address,
              value: parseEther("0.001"),
              data: writeContracts.YourContract.interface.encodeFunctionData("setPurpose(string)",["🤓 Whoa so 1337!"])
            });
            /* this should throw an error about "no fallback nor receive function" until you add it */
          }}>Another Example</Button>
        </div>

      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>Events:</h2>
        <List
          bordered
          dataSource={setPurposeEvents}
          renderItem={(item) => {
            return (
              <List.Item key={item.blockNumber+"_"+item.sender+"_"+item.purpose}>
                <Address
                    value={item[0]}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                  /> =>
                {item[1]}
              </List.Item>
            )
          }}
        />
      </div>


      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:256 }}>

        <Card>

          Check out all the <a href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components" target="_blank" rel="noopener noreferrer">📦  components</a>

        </Card>

        <Card style={{marginTop:32}}>

          <div>
            There are tons of generic components included from <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">🐜  ant.design</a> too!
          </div>

          <div style={{marginTop:8}}>
            <Button type="primary">
              Buttons
            </Button>
          </div>

          <div style={{marginTop:8}}>
            <SyncOutlined spin />  Icons
          </div>

          <div style={{marginTop:8}}>
            Date Pickers?
            <div style={{marginTop:2}}>
              <DatePicker onChange={()=>{}}/>
            </div>
          </div>

          <div style={{marginTop:32}}>
            <Slider range defaultValue={[20, 50]} onChange={()=>{}}/>
          </div>

          <div style={{marginTop:32}}>
            <Switch defaultChecked onChange={()=>{}} />
          </div>

          <div style={{marginTop:32}}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{marginTop:32}}>
            <Spin />
          </div>


        </Card>




      </div>


    </div>
  );
}
