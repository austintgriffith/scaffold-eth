# 🏗 scaffold-eth

> is everything you need to get started building decentralized applications on Ethereum! 🚀 

---


#### [ 🏃‍♀️ Quick Start ](https://github.com/austintgriffith/scaffold-eth#%EF%B8%8F-quick-start)

#### [ 🔭 Learning Solidity ](https://github.com/austintgriffith/scaffold-eth#-learning-solidity)

#### [ 📡 Deploy ](https://github.com/austintgriffith/scaffold-eth#-deploy)

#### [ 📺 Frontend](https://github.com/austintgriffith/scaffold-eth#-frontend)
- [ 🛰 Providers ](https://github.com/austintgriffith/scaffold-eth#-providers)
- [ 🖇 Hooks ](https://github.com/austintgriffith/scaffold-eth#-hooks)
- [ 📦 Components ](https://github.com/austintgriffith/scaffold-eth#-components)
- [ 🖲 UI Library ](https://github.com/austintgriffith/scaffold-eth#-ui-library)
- [ ⛑ Helpers ](https://github.com/austintgriffith/scaffold-eth#-helpers)
- [ 🎚 Extras ](https://github.com/austintgriffith/scaffold-eth#-extras)
-  <B> [ 🛳 Ship it! ](https://github.com/austintgriffith/scaffold-eth#-ship-it) </B>

#### [ 🚩 Challenges ](https://github.com/austintgriffith/scaffold-eth#-challenges)
- [ 🥩 Staking App](https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking)
- [ 🏵 Token Vendor ](https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor)

#### [ 👩‍💻 Examples & Tutorials ](https://github.com/austintgriffith/scaffold-eth#-examples-and-tutorials)
- [ 🎟 Simple NFT ](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)

#### [ Built with 🏗 scaffold-eth ](https://github.com/austintgriffith/scaffold-eth#-built-with--scaffold-eth)
- [ 🎨 Nifty.ink ](https://nifty.ink) ([code](https://github.com/austintgriffith/scaffold-eth/tree/nifty-ink-dev))
- [ 🧑‍🎤PunkWallet.io ](https://punkwallet.io/) ([code](https://github.com/austintgriffith/scaffold-eth/tree/punk-wallet))

#### [🌉 Infrastructure ](https://github.com/austintgriffith/scaffold-eth#-infrastructure)

- [ 🛰 The Graph ](https://github.com/austintgriffith/scaffold-eth#-using-the-graph)
- [ 🔬 Tenderly ](https://github.com/austintgriffith/scaffold-eth#-using-tenderly)
- [ 🌐 Etherscan ](https://github.com/austintgriffith/scaffold-eth#-etherscan)
- [ 🔶 Infura ](https://github.com/austintgriffith/scaffold-eth#-using-infura)
-  🟪 [ Blocknative ](https://github.com/austintgriffith/scaffold-eth#-blocknative)

|-   <B> [ 📠 Legacy Content ](https://github.com/austintgriffith/scaffold-eth#-legacy-content) </B> - | - <B> [ 💬 Support Chat ](https://github.com/austintgriffith/scaffold-eth#-support-chat) </B> -|

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/austintgriffith/scaffold-eth)


---

[![ethdenvervideo](https://user-images.githubusercontent.com/2653167/109873369-e2c58c00-7c2a-11eb-8adf-0ec4b8dcae1e.png)](https://youtu.be/33gnKe7ttCc?t=477)


---
---
---

# 🏃‍♀️ Quick Start

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


```bash
git clone https://github.com/austintgriffith/scaffold-eth.git
cd scaffold-eth
yarn install
yarn chain
```

> in a second terminal window:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window:

```bash
cd scaffold-eth
yarn deploy
```

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment script `deploy.js` in `packages/hardhat/scripts`

📱 Open http://localhost:3000 to see the app

🏗 scaffold-eth is a hackthon stack for quick product prototyping on Ethereum.

👩‍🔬 This scaffolding leverages state of the art tooling from the ecosystem.

🧪 It is a free standing dapp so you can learn by making small changes.


> *After installing*, your dev environment should look like this:

![image](https://user-images.githubusercontent.com/2653167/109870279-24ecce80-7c27-11eb-91f3-b2c4febac118.png)


> React dev server, HardHat blockchain, deploy terminal, code IDE, and frontend browser.

✏️ Make small changes to `YourContract.sol` and watch your app auto update!


🔁 You can `yarn deploy` any time and get a fresh new contract in the frontend:


![deploy](https://user-images.githubusercontent.com/2653167/93149199-f8fa8280-f6b2-11ea-9da7-3b26413ec8ab.gif)


💵 Each browser has an account in the top right and you can use the faucet (bottom left) to get ⛽️  testnet eth for gas:


![faucet](https://user-images.githubusercontent.com/2653167/93150077-6c04f880-f6b5-11ea-9ee8-5c646b5b7afc.gif)




🔨Once you have funds, you can call `setPurpose` on your contract and "write" to the `purpose` storage:


![setp](https://user-images.githubusercontent.com/2653167/93229761-2d625300-f734-11ea-9036-44a75429ef0c.gif)


Look for the [HardHat](https://hardhat.org) console.log() output in the `yarn chain` terminal:

![image](https://user-images.githubusercontent.com/2653167/93687934-2f534b80-fa7f-11ea-84b2-c0ba99533dc2.png)

> ⚗️ Spend some time tinkering with `YourContract.sol`

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
---

# 🔭 Learning Solidity

📕 Read the docs: https://docs.soliditylang.org

📚 Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **🏗 scaffold-eth**

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn all the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

👨‍🏫 Start super simple with a counter: `uint8 public count = 1;`

⬇️ Then a `function dec() public {}` that does a `count = count - 1;`

![image](https://user-images.githubusercontent.com/2653167/93150263-dae25180-f6b5-11ea-94e1-b24ab2a63fa5.png)


🚽 UNDERFLOW!?! 🚑 [Solidity >0.8.0](https://docs.soliditylang.org/en/v0.8.0/) catchs this [with Checked Arithmetic](https://blog.soliditylang.org/2020/12/16/solidity-v0.8.0-release-announcement/)!

![underflow](https://user-images.githubusercontent.com/2653167/93688066-46466d80-fa80-11ea-85df-81fbafa46575.gif)

🔬  What happens when you subtract 1 from 0 without this improvement? [Use Solidity 0.7.6](https://hardhat.org/guides/compile-contracts.html#multiple-solidity-versions) and try it out in the app to see what happens! 

🧫 You can iterate and learn as you go. Test your assumptions!

🔐 Global variables like `msg.sender` and `msg.value` are cryptographically backed and can be used to make rules

📝 Keep this [cheat sheet](https://solidity.readthedocs.io/en/v0.8.0/cheatsheet.html?highlight=global#global-variables) handy

⏳ Maybe we could use `block.timestamp` or `block.number` to track time in our contract

🔏 Or maybe keep track of an `address public owner;` then make a rule like `require( msg.sender == owner );` for an important function

🧾 Maybe create a smart contract that keeps track of a `mapping ( address => uint256 ) public balance;`

🏦 It could be like a decentralized bank that you `function deposit() public payable {}` and `withdraw()`

📟 Events are really handy for signaling to the frontend. [Read more about events here.](https://solidity-by-example.org/0.6/events/)

📲 Spend some time in `App.jsx` in `packages/react-app/src` and learn about the 🛰 [Providers](https://github.com/austintgriffith/scaffold-eth#-web3-providers)

⚠️ Big numbers are stored as objects: `formatEther` and `parseEther` (ethers.js) will help with WEI->ETH and ETH->WEI.

🧳 The single page (searchable) [ethers.js docs](https://docs.ethers.io/v5/single-page/) are pretty great too.

🐜 The UI framework `Ant Design` has a [bunch of great components](https://ant.design/components/overview/).

📃 Check the console log for your app to see some extra output from hooks like `useContractReader` and `useEventListener`.

🏗 You'll notice the `<Contract />` component that displays the dynamic form as scaffolding for interacting with your contract.

🔲 Try making a `<Button/>` that calls `writeContracts.YourContract.setPurpose("👋 Hello World")` to explore how your UI might work...

💬 Wrap the call to `writeContracts` with a `tx()` helper that uses BlockNative's [Notify.js](https://www.blocknative.com/notify).

🧬 Next learn about [structs](https://solidity-by-example.org/0.6/structs/) in Solidity.

🗳 Maybe an make an array `YourStructName[] public proposals;` that could call be voted on with `function vote() public {}`

🔭 Your dev environment is perfect for *testing assumptions* and learning by prototyping.

📝 Next learn about the [fallback function](https://solidity-by-example.org/0.6/fallback/)

💸 Maybe add a `receive() external payable {}` so your contract will accept ETH?

🚁 OH! Programming decentralized money! 😎 So rad!

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
---


# 📡 Deploy


🛰 Ready to deploy to a testnet? Change the `defaultNetwork` in `packages/hardhat/hardhat.config.js`

🔐 Generate a deploy account with `yarn generate` and view it with `yarn account`

💵 Fund your deployer account (pro tip: use an [instant wallet](https://instantwallet.io) to send funds to the QR code from `yarn account`)

> Deploy your contract:

```bash
yarn deploy
```

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)


---
---
# 📺 Frontend

> Edit your frontend `App.jsx` in `packages/react-app/src`

📡 Make sure your `targetNetwork` is the same as 👷‍♀️ HardHat's `defaultNetwork` (where you deployed your contracts).

![image](https://user-images.githubusercontent.com/2653167/110500412-68778a80-80b6-11eb-91bd-194d47d62771.png)


🤡 Adjust your debugging settings as needed:

![image](https://user-images.githubusercontent.com/2653167/110499550-95776d80-80b5-11eb-8024-287878b180d5.png)


---

## 🔏 Providers:

Providers are your connections to different blockchains.

The frontend has three different providers that provide different levels of access to different chains:

`mainnetProvider`: (read only) [Alchemy](https://alchemyapi.io/) or [Infura](https://infura.io/) connection to main [Ethereum](https://ethereum.org/developers/) network (and contracts already deployed like [DAI](https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f#code) or [Uniswap](https://etherscan.io/address/0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667)).

`localProvider`: local [HardHat](https://hardhat.org) accounts, used to read from _your_ contracts (`.env` file points you at testnet or mainnet)

`injectedProvider`: your personal [MetaMask](https://metamask.io/download.html), [WalletConnect](https://walletconnect.org/apps) via [Argent](https://www.argent.xyz/), or other injected wallet (generates [burner-provider](https://www.npmjs.com/package/burner-provider) on page load)

![image](https://user-images.githubusercontent.com/2653167/110499705-bc35a400-80b5-11eb-826d-44815b89296c.png)


---

## 🖇 Hooks:

![image](https://user-images.githubusercontent.com/2653167/110499834-dcfdf980-80b5-11eb-9d2d-de7046bf5c2b.png)


Commonly used Ethereum hooks located in `packages/react-app/src/`:


`usePoller(fn, delay)`: runs a function on app load and then on a custom interval

```jsx
usePoller(() => {
  //do something cool at start and then every three seconds
}, 3000);
```

<br/>

`useBalance(address, provider, [pollTime])`: poll for the balance of an address from a provider

```js
const localBalance = useBalance(address, localProvider);
```

<br/>

`useBlockNumber(provider,[pollTime])`: get current block number from a provider

```js
const blockNumber = useBlockNumber(props.provider);
```

<br/>

`useGasPrice([speed])`: gets current "fast" price from [ethgasstation](https://ethgasstation.info)

```js
const gasPrice = useGasPrice();
```

<br/>

`useExchangePrice(mainnetProvider, [pollTime])`: gets current price of Ethereum on the Uniswap exchange

```js
const price = useExchangePrice(mainnetProvider);
```

<br/>

`useContractLoader(provider)`: loads your smart contract interface

```js
const readContracts = useContractLoader(localProvider);
const writeContracts = useContractLoader(injectedProvider);
```

<br/>

`useContractReader(contracts, contractName, variableName, [pollTime])`: reads a variable from your contract and keeps it in the state

```js
const title = useContractReader(props.readContracts, contractName, "title");
const owner = useContractReader(props.readContracts, contractName, "owner");
```

<br/>

`useEventListener(contracts, contractName, eventName, [provider], [startBlock])`: listens for events from a smart contract and keeps them in the state

```js
const ownerUpdates = useEventListener(
  readContracts,
  contractName,
  "UpdateOwner",
  props.localProvider,
  1
);
```

---

## 📦 Components:

![image](https://user-images.githubusercontent.com/2653167/110500019-04ed5d00-80b6-11eb-97a4-74068fa90846.png)


Your commonly used React Ethereum components located in `packages/react-app/src/`:

<br/>

📬 `<Address />`: A simple display for an Ethereum address that uses a [Blockie](https://www.npmjs.com/package/ethereum-blockies), lets you copy, and links to [Etherescan](https://etherscan.io/).

```jsx
  <Address value={address} />
  <Address value={address} size="short" />
  <Address value={address} size="long" blockexplorer="https://blockscout.com/poa/xdai/address/"/>
  <Address value={address} ensProvider={mainnetProvider}/>
```

![ensaddress](https://user-images.githubusercontent.com/2653167/80522487-e375fd80-8949-11ea-84fd-0de3eab5cd03.gif)

<br/>

🖋 `<AddressInput />`: An input box you control with useState for an Ethereum address that uses a [Blockie](https://www.npmjs.com/package/ethereum-blockies) and ENS lookup/display.

```jsx
  const [ address, setAddress ] = useState("")
  <AddressInput
    value={address}
    ensProvider={props.ensProvider}
    onChange={(address)=>{
      setAddress(address)
    }}
  />
```

<br/>

💵 `<Balance />`: Displays the balance of an address in either dollars or decimal.

```jsx
<Balance
  address={address}
  provider={injectedProvider}
  dollarMultiplier={price}
/>
```

![balance](https://user-images.githubusercontent.com/2653167/80522919-86c71280-894a-11ea-8f61-70bac7a72106.gif)

<br/>

<br/>

👤 `<Account />`: Allows your users to start with an Ethereum address on page load but upgrade to a more secure, injected provider, using [Web3Modal](https://web3modal.com/). It will track your `address` and `localProvider` in your app's state:

```jsx
const [address, setAddress] = useState();
const [injectedProvider, setInjectedProvider] = useState();
const price = useExchangePrice(mainnetProvider);
```

```jsx
<Account
  address={address}
  setAddress={setAddress}
  localProvider={localProvider}
  injectedProvider={injectedProvider}
  setInjectedProvider={setInjectedProvider}
  dollarMultiplier={price}
/>
```

![account](https://user-images.githubusercontent.com/2653167/80527048-fdffa500-8950-11ea-9a0f-576be87e4368.gif)

> 💡 **Notice**: the `<Account />` component will call `setAddress` and `setInjectedProvider` for you.

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---

## 🖲 UI Library

🐜 [Ant.design](https://ant.design/components/button/) is a fantastic UI library with components like the [grids](https://ant.design/components/grid/), [menus](https://ant.design/components/menu/), [dates](https://ant.design/components/date-picker/), [times](https://ant.design/components/time-picker/), [buttons](https://ant.design/components/button/), etc.

---

## ⛑ Helpers:

`Transactor`: The transactor returns a `tx()` function to make running and tracking transactions as simple and standardized as possible. We will bring in [BlockNative's Notify](https://www.blocknative.com/notify) library to track our testnet and mainnet transactions.

```js
const tx = Transactor(props.injectedProvider, props.gasPrice);
```

Then you can use the `tx()` function to send funds and write to your smart contracts:

```js
tx({
  to: readContracts[contractName].address,
  value: parseEther("0.001"),
});
```

```js
tx(writeContracts["SmartContractWallet"].updateOwner(newOwner));
```

> ☢️ **Warning**: You will need to update the configuration for `react-app/src/helpers/Transactor.js` to use _your_ [BlockNative dappId](https://www.blocknative.com/notify)

---

## 🎚 Extras:

🔑 Create wallet links to your app with `yarn wallet` and `yarn fundedwallet`

⬇️ Installing a new package to your frontend? You need to `cd packages/react-app` and then `yarn add PACKAGE`

⬇️ Installing a new package to your backend? You need to `cd packages/harthat` and then `yarn add PACKAGE`

---

## 🛳 Ship it!

You can deploy your app with:

```bash

# packge up the static site:

yarn build

# ship it!

yarn surge

OR

yarn s3

OR

yarn ipfs
```

🚀 Good luck!

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
---

## 🚩 Challenges

1. [ 🥩 Decentralized Staking App ](https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking)

2. [  🏵 Token Vendor ](https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor)

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
---

## 📡 Examples and Tutorials

(todo: insert all the cool active branches)


| <M> [ tenderly ](https://github.com/austintgriffith/scaffold-eth/tree/tenderly) |
| --- |
| [ simple-nft-example ](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example) |


^^^ ⛏ <b>PR</b> your 🏗 scaffold-eth branch!!! 🙏🙏🙏 ^^^

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
---

# 🔨 Built with 🏗 scaffold-eth:

[<H3>👩‍🎨 Nifty Ink</H3>](https://nifty.ink)

Paintings come to life as you "ink" new creations and trade them on Ethereum. A deep dive into 🖼 NFTs, 🐳 OpenSea, 🖍 react-canvas-draw, 🎨 react-color, and 🛬 onboarding user experience.

🏃‍♂️ SpeedRun 📹 (TODO)

[💾 Source Code ](https://github.com/austintgriffith/scaffold-eth/tree/nifty-ink-dev)


[<H3>🧙‍♂️ Instant Wallet</H3>](https://instantwallet.io)

An instant wallet running on xDAI insired by [xdai.io](https://xdai.io).


[💾 Source Code ](https://github.com/austintgriffith/scaffold-eth/tree/instantwallet-dev-session)


[<H3>🗳 Personal Token Voting</H3>](https://medium.com/@austin_48503/personal-token-voting-73b44a598d8e)

Poll your holders! Build an example emoji voting system with 🏗 <b>scaffold-eth</b>. 🔏 Cryptographically signed votes but tracked off-chain with 📡 Zapier and 📑 Google Sheets.

[🏃‍♂️ SpeedRun 📹 ](https://youtu.be/Q5zgxcQtwWI)

[💾 Source Code ](https://github.com/austintgriffith/scaffold-eth/tree/emoji-vote-dev)


^^^ ⛏ PLEASE <b>PR</b> your 🏗 scaffold-eth project in above!!! 🙏🙏🙏 ^^^

---
===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
---

# 📟 Infrastructure

---

## 🛰 Using The Graph

[![thegraphplayvideo](https://user-images.githubusercontent.com/2653167/101052782-4664ee00-3544-11eb-8805-887ad4d1406e.png)
](https://youtu.be/T5ylzOTkn-Q)

[ 🎥 here is another Graph speed run tutorial video ](https://youtu.be/T5ylzOTkn-Q)


---

## 🔬 Using Tenderly
[Tenderly](https://tenderly.co) is a platform for monitoring, alerting and trouble-shooting smart contracts. They also have a hardhat plugin and CLI tool that can be helpful for local development!

Hardhat Tenderly [announcement blog](https://blog.tenderly.co/level-up-your-smart-contract-productivity-using-hardhat-and-tenderly/) for reference.


### Verifying contracts on Tenderly
scaffold-eth includes the hardhat-tenderly plugin. When deploying to any of the following networks:
```
["kovan","goerli","mainnet","rinkeby","ropsten","matic","mumbai","xDai","POA"]
```
You can verify contracts as part of the `deploy.js` script. We have created a `tenderlyVerify()` helper function, which takes your contract name and its deployed address:
```
await tenderlyVerify(
  {contractName: "YourContract",
   contractAddress: yourContract.address
})
```
Make sure your target network is present in the hardhat networks config, then either update the default network in `hardhat.config.js` to your network of choice or run:
```
yarn deploy --network NETWORK_OF_CHOICE
```
Once verified, they will then be available to view on Tenderly!



[![TenderlyRun](https://user-images.githubusercontent.com/2653167/110502199-38c98200-80b8-11eb-8d79-a98bb1f39617.png)](https://www.youtube.com/watch?v=c04rrld1IiE&t=47s)


#### Exporting local Transactions
One of Tenderly's best features for builders is the ability to [upload local transactions](https://dashboard.tenderly.co/tx/main/0xb8f28a9cace2bdf6d10809b477c9c83e81ce1a1b2f75f35ddd19690bbc6612aa/local-transactions) so that you can use all of Tenderly's tools for analysis and debugging. You will need to create a [tenderly account](https://tenderly.co/) if you haven't already.

Exporting local transactions can be done using the [Tenderly CLI](https://github.com/tenderly/tenderly-cli). Installing the Tenderly CLI:
```
brew tap tenderly/tenderly
brew install tenderly
```
_See alternative installation steps [here](https://github.com/tenderly/tenderly-cli#installation)_

You need to log in and configure for your local chain (including any forking information) - this can be done from any directory, but it probably makes sense to do under `/packages/hardhat` to ensure that local contracts are also uploaded with the local transaction (see more below!)
```
cd packages/hardhat
tenderly login
tenderly export init
```
You can then take transaction hashes from your local chain and run the following from the `packages/hardhat` directory:
```
tenderly export <transactionHash>
```
Which will upload them to tenderly.co/dashboard!

Tenderly also allows users to debug smart contracts deployed to a local fork of some network (see `yarn fork`). To let Tenderly know that we are dealing with a fork, run the following command:

```
tenderly export init
```

CLI will ask you for your network's name and whether you are forking a public network. After choosing the right fork, your exporting will look something like this:

```
tenderly export <transactionHash> --export-network <networkName>
```

Note that `tenderly.yaml` file stores information about all networks that you initialized for exporting transactions. There can be multiple of them in a single file. You only need the `--export-network` if you have more than one network in your tenderly.yaml config!

**A quick note on local contracts:** if your local contracts are persisted in a place that Tenderly can find them, then they will also be uploaded as part of the local transaction `export`, which is one of the freshest features! We have added a call to `tenderly.persistArtifacts()` as part of the scaffold-eth deploy() script, which stores the contracts & meta-information in a `deployments` folder, so this should work out of the box.

Another pitfall when dealing with a local network (fork or not) is that you will not see the transaction hash if it fails. This happens because the hardhat detects an error while `eth_estimateGas` is executed. To prevent such behaviour, you can skip this estimation by passing a `gasLimit` override when making a call - an example of this is demonstrated in the `FunctionForm.jsx` file of the Contract component:
```
let overrides = {}
// Uncomment the next line if you want to skip the gas estimation for each transaction
// overrides.gasLimit = hexlify(1200000);
const returned = await tx(contractFunction(...args, overrides));
```

**One gotcha** - Tenderly does not (currently) support yarn workspaces, so any imported solidity contracts need to be local to `packages/hardhat` for your contracts to be exported. You can achieve this by using [`nohoist`](https://classic.yarnpkg.com/blog/2018/02/15/nohoist/) - this has been done for `hardhat` so that we can export `console.sol` - see the top-level `package.json` to see how!
```
"workspaces": {
  "packages": [
    "packages/*"
  ],
  "nohoist": [
    "**/hardhat",
    "**/hardhat/**"
  ]
}
```


---

## 🌐 Etherscan
Hardhat has a truly wonderful [`hardhat-etherscan` plugin](https://www.npmjs.com/package/@nomiclabs/hardhat-etherscan) that takes care of contract verification after deployment. You need to add the following to your `hardhat.config.js` imports:
```
require("@nomiclabs/hardhat-etherscan");
```
Then add your etherscan API key to the module.exports:
```
etherscan: {
  // Your API key for Etherscan
  // Obtain one at https://etherscan.io/
  apiKey: "YOUR-API-KEY-HERE"
}
```
Verifying is simple, assuming you are verifying a contract that you have just deployed from your hardhat setup - you just need to run the verify script, passing constructor arguments as an array if necessary (there is an example commented out in the `deploy.js`):
```
await run("verify:verify", {
  address: yourContract.address,
  // constructorArguments: args // If your contract has constructor arguments, you can pass them as an array
})
```
You only have to pass the contract because the plugin figures out which of the locally compiled contracts is the right one to verify. Pretty cool stuff!

---

## 🔶 Using Infura

You will need to update the `constants.js` in `packages/react-app/src` with [your own Infura ID](https://infura.io).

---

## 🟪 Blocknative

> update the `BLOCKNATIVE_DAPPID` in `packages/react-app/src/constants.js` with [your own Blocknative DappID](https://docs.blocknative.com/notify)

---
===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
---


## 📠 Legacy Content


[<h5>🧫 Building on Ethereum in 2020 (research for this repo)</h5>  ](https://medium.com/@austin_48503/building-on-ethereum-in-2020-dca52eda5f00)


[![splash](https://user-images.githubusercontent.com/2653167/88085723-7ab2b180-cb43-11ea-832d-8db6efcbdc02.png)](https://www.youtube.com/watch?v=ShJZf5lsXiM&feature=youtu.be&t=19)

---

[<H6>Tutorial 1: 🛠 Programming Decentralized Money</H6>](https://medium.com/@austin_48503/programming-decentralized-money-300bacec3a4f)

Learn the basics of 🏗 <b>scaffold-eth</b> and building on <b>Ethereum</b>. 👷‍♂️ HardHat, 📦 create-eth-app, 🔥 hot reloading smart contracts, 🛰 providers, 🔗 hooks, 🎛 components, and building a decentralized application.
[🎥 Guided Tutorial](https://youtu.be/7rq3TPL-tgI)

---

<H6>Tutorial 2: 🏵 The Token</H6>

Learn about tokens. [coming soon] What is a token? Why is it cool? How can I deploy one? Exotic mechanisms? (todo)

---

[<H6>Tutorial 3: ⚖️ Minimum Viable Decentralized Exchange</H6>](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90)

Learn the basics of Automated Market Makers like 🦄 Uniswap. Learn how 💰Reserves affect the 📉 price, ⚖️ trading, and 💦 slippage from low liquidity.

[🏃‍♀️ SpeedRun  📹](https://youtu.be/eP5w6Ger1EQ)

---

[<H6>Tutorial 4: 🚀 Connecting ETH to IPFS</H6>](https://medium.com/@austin_48503/tl-dr-scaffold-eth-ipfs-20fa35b11c35)

Build a simple IPFS application in 🏗 <b>scaffold-eth</b> to learn more about distributed file storage and content addressing.
  [🎥 Live Tutorial](https://youtu.be/vqrLr5eOjLo?t=342)

---

<H6>Tutorial 5: ⛽️GSN and Meta Transactions</H6>

Learn about to provide your users with better UX by abstracting away gas fees and blockchain mechanics.  (todo)


---


[<H6>Tutorial 6: 🛰 Decentralized Deployment</H6>](https://medium.com/@austin_48503/decentralized-deployment-7d975c9d5016)

Learn how to deploy your smart contract to a production blockchain. Then deploy your applicaton to Surge, S3, and IPFS. Finally, register an ENS and point it at the decentralized content!  [🎥 Live Tutorial](https://youtu.be/vqrLr5eOjLo?t=1350)

---


## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA)  to ask questions and find others building with 🏗 scaffold-eth!

---

===================================================== [⏫ back to the top ⏫](https://github.com/austintgriffith/scaffold-eth#-scaffold-eth)

---
