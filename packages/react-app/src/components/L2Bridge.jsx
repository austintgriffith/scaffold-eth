import { utils, ethers } from "ethers";
import { Button, Input, Form, Select, InputNumber, Table, Radio } from "antd";
import React, { useState, useEffect } from "react";
import { useContractLoader, useOnBlock } from "eth-hooks";
import { NETWORKS } from "../constants";
import { Transactor } from "../helpers";

/*
This is a component for bridging between L1 & L2
Currently it supports Testnet deposits for Arbitrum & Optimism

 __          _______ _____
 \ \        / /_   _|  __ \
  \ \  /\  / /  | | | |__) |
   \ \/  \/ /   | | |  ___/
    \  /\  /   _| |_| |
     \/  \/   |_____|_|


*/

export default function L2ArbitrumBridge({ address, userSigner }) {
  const [L1EthBalance, setL1EthBalance] = useState("...");
  const [L2EthBalance, setL2EthBalance] = useState("...");
  const [L1Provider, setL1Provider] = useState("");
  const [L2Provider, setL2Provider] = useState("");
  const [rollup, setRollup] = useState("arbitrum");
  const [environment, setEnvironment] = useState("test");

  const rollupConfig = {
    arbitrum: {
      test: { L1: NETWORKS.rinkeby, L2: NETWORKS.rinkebyArbitrum },
      main: { L1: NETWORKS.mainnet, L2: NETWORKS.arbitrum },
      local: { L1: NETWORKS.localArbitrumL1, L2: NETWORKS.localArbitrum },
    },
    optimism: {
      test: { L1: NETWORKS.kovan, L2: NETWORKS.kovanOptimism },
      local: { L1: NETWORKS.localOptimismL1, L2: NETWORKS.localOptimism },
    },
  };

  const activeConfig = rollupConfig[rollup][environment];

  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  const tx = Transactor(userSigner);

  useEffect(() => {
    async function setProviders() {
      const L1 = activeConfig.L1;
      const L2 = activeConfig.L2;
      setL1Provider(new ethers.providers.StaticJsonRpcProvider(L1.rpcUrl));
      setL2Provider(new ethers.providers.StaticJsonRpcProvider(L2.rpcUrl));
      setL1EthBalance("...");
      setL2EthBalance("...");
    }
    setProviders();
  }, [rollup]);

  const contracts = useContractLoader(userSigner, { externalContracts: L1BridgeMetadata, hardhatContracts: {} });

  useOnBlock(L1Provider, async () => {
    console.log(`⛓ A new mainnet block is here: ${L1Provider._lastBlockNumber}`);
    const yourL1Balance = await L1Provider.getBalance(address);
    setL1EthBalance(yourL1Balance ? ethers.utils.formatEther(yourL1Balance) : "...");
    const yourL2Balance = await L2Provider.getBalance(address);
    setL2EthBalance(yourL2Balance ? ethers.utils.formatEther(yourL2Balance) : "...");
  });

  const { Option } = Select;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 12,
        offset: 8,
      },
    },
  };

  const columns = [
    {
      title: "",
      dataIndex: "token",
      key: "token",
      align: "center",
    },
    {
      title: `${activeConfig.L1.name} L1 Balance`,
      dataIndex: "l1",
      key: "l1",
      align: "center",
    },
    {
      title: `${activeConfig.L1.name} ${rollup} Balance`,
      dataIndex: "l2",
      key: "l2",
      align: "center",
    },
  ];

  const data = [
    {
      key: "1",
      token: "ETH",
      l1: "Ξ" + L1EthBalance,
      l2: "Ξ" + L2EthBalance,
    },
  ];

  const [form] = Form.useForm();

  const onAssetChange = value => {
    console.log(value);
  };

  async function onFinish(values) {
    console.log(contracts);
    console.log(values.amount.toString());
    console.log(rollup);
    let newTx;
    try {
      if (rollup === "arbitrum") {
        newTx = await tx(
          contracts.Inbox.depositEth(1_300_000, {
            value: utils.parseEther(values.amount.toString()),
            gasLimit: 300000,
          }),
        );
      } else if (rollup === "optimism") {
        newTx = await tx(
          contracts.OVM_L1StandardBridge.depositETH(1_300_000, "0x", {
            value: utils.parseEther(values.amount.toString()),
          }),
        );
      }
      await newTx.wait();
      console.log("woop!");
    } catch (e) {
      console.log(e);
      console.log("something went wrong!");
    }
  }

  const onReset = () => {
    form.resetFields();
  };

  const wrongNetwork = selectedChainId !== activeConfig.L1.chainId;

  return (
    <div style={{ padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 800, margin: "auto", marginBottom: 128 }}>
        <h2>Welcome to the L2 Deposit Bridge!</h2>
        <Radio.Group
          value={rollup}
          onChange={e => {
            setRollup(e.target.value);
          }}
          style={{ marginBottom: 10 }}
        >
          <Radio.Button value="arbitrum">Arbitrum</Radio.Button>
          <Radio.Button value="optimism">Optimism</Radio.Button>
        </Radio.Group>

        <Table columns={columns} dataSource={data} pagination={false} style={{ marginBottom: 20 }} />

        <Form
          {...formItemLayout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          initialValues={{ assetType: "eth" }}
        >
          <Form.Item
            name="assetType"
            label="Select Asset Type"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select an asset type" onChange={onAssetChange} allowClear>
              <Option value="eth">ETH</Option>
              <Option disabled value="erc20">
                ERC-20
              </Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input disabled placeholder={address} />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount to bridge"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={wrongNetwork}>
              {wrongNetwork ? `Switch wallet to ${activeConfig.L1.name}` : "Deposit"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

// Arbitrum Inbox https://rinkeby.etherscan.io/address/0xa157dc79ca26d69c3b1282d03ec42bdee2790a8f#code
const ArbitrumInboxABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "messageNum", type: "uint256" },
      { indexed: false, internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "InboxMessageDelivered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "messageNum", type: "uint256" }],
    name: "InboxMessageDeliveredFromOrigin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "newSource", type: "address" }],
    name: "WhitelistSourceUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "bridge",
    outputs: [{ internalType: "contract IBridge", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "destAddr", type: "address" },
      { internalType: "uint256", name: "l2CallValue", type: "uint256" },
      { internalType: "uint256", name: "maxSubmissionCost", type: "uint256" },
      { internalType: "address", name: "excessFeeRefundAddress", type: "address" },
      { internalType: "address", name: "callValueRefundAddress", type: "address" },
      { internalType: "uint256", name: "maxGas", type: "uint256" },
      { internalType: "uint256", name: "gasPriceBid", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "createRetryableTicket",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "maxSubmissionCost", type: "uint256" }],
    name: "depositEth",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IBridge", name: "_bridge", type: "address" },
      { internalType: "address", name: "_whitelist", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isMaster",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "maxGas", type: "uint256" },
      { internalType: "uint256", name: "gasPriceBid", type: "uint256" },
      { internalType: "address", name: "destAddr", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "sendContractTransaction",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "maxGas", type: "uint256" },
      { internalType: "uint256", name: "gasPriceBid", type: "uint256" },
      { internalType: "address", name: "destAddr", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "sendL1FundedContractTransaction",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "maxGas", type: "uint256" },
      { internalType: "uint256", name: "gasPriceBid", type: "uint256" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "address", name: "destAddr", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "sendL1FundedUnsignedTransaction",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "messageData", type: "bytes" }],
    name: "sendL2Message",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes", name: "messageData", type: "bytes" }],
    name: "sendL2MessageFromOrigin",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "maxGas", type: "uint256" },
      { internalType: "uint256", name: "gasPriceBid", type: "uint256" },
      { internalType: "uint256", name: "nonce", type: "uint256" },
      { internalType: "address", name: "destAddr", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "sendUnsignedTransaction",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newSource", type: "address" }],
    name: "updateWhitelistSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "whitelist",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

// https://github.com/ethereum-optimism/optimism/blob/2bd49730fa8d2c10953873f0ccc792198a49d5c9/packages/contracts/contracts/optimistic-ethereum/iOVM/bridge/tokens/iOVM_L1StandardBridge.sol
const OVM_L1StandardBridgeABI = [
  "function depositETH(uint32 _l2Gas,bytes calldata _data) external payable",
  "function depositETHTo(address _to,uint32 _l2Gas,bytes calldata _data) external payable",
  "function finalizeETHWithdrawal (address _from,address _to,uint _amount,bytes calldata _data) external",
];

const L1BridgeMetadata = {
  // Arbitrium Contract's
  44010: {
    contracts: {
      Inbox: {
        address: "0xA4d796Ad4e79aFB703340a596AEd88f8a5924183",
        abi: ArbitrumInboxABI,
      },
    },
  },
  4: {
    contracts: {
      Inbox: {
        address: "0x578bade599406a8fe3d24fd7f7211c0911f5b29e",
        abi: ArbitrumInboxABI,
      },
    },
  },
  // Optimism Contract's
  31337: {
    contracts: {
      OVM_L1StandardBridge: {
        address: "0x998abeb3E57409262aE5b751f60747921B33613E",
        abi: OVM_L1StandardBridgeABI,
      },
    },
  },
  42: {
    contracts: {
      OVM_L1StandardBridge: {
        address: "0x22F24361D548e5FaAfb36d1437839f080363982B",
        abi: OVM_L1StandardBridgeABI,
      },
    },
  },
};
