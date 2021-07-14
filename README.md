# 🏗 Scaffold-ETH - With GSN gassless support

> everything you need to build on Ethereum! 🚀 - using [GSN](https://opengsn.org) for gasless experience ⛽

This branch adds gasless transactions to your contract.

Now the end user doesn't need to have ETH (so the faucet is no longer required!)

Modifications to the standard "scaffold-eth":
- Added GSN support to the contract and its deployment.
- Add GSN support to the UI to wrap the injected provider
- `yarn chain` updated to start the `hardhat node` along with GSN (so there is no change to the way to bring up the project)

   Just wait for "**Relay is active**" before doing `yarn deploy`

- you no longer need to use the faucet - any account can make transactions without gas (only sign the transactions). - Transactions are paid by the paymaster




#### Below is an actual screenshot after hitting the "Send" button - No eth required by the calling user
![image](https://user-images.githubusercontent.com/40341007/125701114-8dc6ba4d-14f3-4bda-8ed6-21821ea13986.png)
