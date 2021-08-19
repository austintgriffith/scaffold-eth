# Welcome to Scaffold-eth - eip gas prices calculator
Scaffold-eth is everything you need to get started building decentralized applications on Ethereum! 🚀

# About Scaffold-eth
Scaffold-eth provides an out-of-the-shelf stack for rapid prototyping on Ethereum, giving developers access to state-of-the-art tools to quickly learn and ship an Ethereum-based dApp. 

# The Scaffold-eth stack
Scaffold-eth is not a product itself but more of a combination or stack of other great products. It allows you to quickly build and iterate over your smart contracts and frontends. It leverages:

- Hardhat for running local networks, deploying and testing smart contracts.
- React for building a frontend, using many useful pre-made components and hooks.
- Ant for your UI. But can be easily changed to Bootstrap or some other library you prefer.
- Surge for publishing your app.
- Tenderly / The Graph / Etherscan / Infura / Blocknative and more!
- Support for L2 / Sidechains like Optimism and Arbitrum.

# Installation and setup

⚠️ First, make sure you have: [Node](https://nodejs.org/dist/latest-v12.x/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git
cd scaffold-eth
git checkout -b gas-calculator
yarn install
yarn start
```

> in a second terminal window:

```bash
cd scaffold-eth
yarn chain
```

> in a third terminal window:

```bash
cd scaffold-eth
yarn deploy
```

If everything goes smoothly you should now have a local network running, with the starter contracts deployed and the frontend React app running on https://localhost:3000.

# Preview 
🎛 http://eth-gas-burn-calc.surge.sh/
![preview](https://user-images.githubusercontent.com/35558569/129438957-0fd500fe-db60-436e-a457-c7a5c2df7d24.png)


# Documentation

For a more in-depth explanation, documentation, quick start guide, tutorials, tips and many more resources, visit our documentation site: [docs.scaffoldeth.io](https://docs.scaffoldeth.io) 

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!
