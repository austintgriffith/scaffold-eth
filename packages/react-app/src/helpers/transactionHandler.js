import React from 'react'
import { ethers } from "ethers";
import { Modal, notification, Button, Space, Typography } from 'antd';
import { getSignature } from "./getSignature";
import { default as Transactor } from "./Transactor";
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { DepositXDai } from '../components'
import { addXDAItoMetamask } from './addToMetamask.js'
const { Text } = Typography;

export async function transactionHandler(c) {

    console.log(c)

    const showRampModal = () => {
      new RampInstantSDK({
        hostAppName: 'nifty.ink',
        hostLogoUrl: 'https://nifty.ink/logo512.png',
        //swapAmount: '50000000000000000000', // 50 DAI
        swapAsset: 'XDAI',
        userAddress: c['address'],
      }).on('*', event => console.log(event)).show();
    }

    function chainWarning(network, chainId) {
        Modal.warning({
          title: 'MetaMask Network Mismatch',
          content: <><img src="/customRPCHint.png"  style={{position: "fixed", right:0, top:0}} /><p>Nifty Ink is built on xDai: please change your MetaMask Network to point to the <a href="https://www.xdaichain.com/" target="_blank">xDai Chain</a></p><p>You will need to create a custom RPC with the following URL: <b>https://dai.poa.network</b></p></>,
        });
      }

    function showXDaiModal() {
      Modal.info({
        title: 'You need some xDai to make this transaction!',
        content: (
          <Space direction="vertical">
          <Text><a target="_blank" href={"https://xdai.io"}>Take it to the bridge</a> (to transfer DAI from mainnet).</Text>
          {ethers.Signer.isSigner(c['injectedProvider']) ? null : <Button onClick={showRampModal}>Buy xDai with Ramp</Button>}
          {/*<DepositXDai selectedProvider={c['injectedProvider']} address={c['address']}/>*/}
          <Text><a target="_blank" href={"https://www.xdaichain.com/for-users/get-xdai-tokens"}>Learn more about using xDai</a></Text>
          </Space>
        ),
        onOk() {},
      });
    }

    try {

      let contractAddress = require("../contracts/"+c['contractName']+".address.js")
      let contractAbi = require("../contracts/"+c['contractName']+".abi.js")

      let balance = await c['localProvider'].getBalance(c['address'])
      console.log('artist balance', balance)
      let injectedNetwork
      if(ethers.Signer.isSigner(c['injectedProvider'])) {
       injectedNetwork = await c['injectedProvider'].provider.getNetwork()
     } else {
       injectedNetwork = await c['injectedProvider'].getNetwork()
     }

      let localNetwork = await c['localProvider'].getNetwork()
      console.log('networkcomparison',injectedNetwork,localNetwork)

      let overrideOptions = {
          gasPrice: 1,
      }

      if (c['payment'] && parseFloat(ethers.utils.formatEther(balance)) < parseFloat(ethers.utils.formatEther(c['payment']))) {
        showXDaiModal()
        let m = 'You need more than ' + ethers.utils.formatEther(c['payment']) + ' xDai to make this transaction'
        console.log(m)
        throw {message: m}
      }

      if (parseFloat(ethers.utils.formatEther(balance))>0.001){
        if (injectedNetwork.chainId === localNetwork.chainId) {
          console.log('Got xDai + on the right network, so kicking it old school')

            let contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                (ethers.Signer.isSigner(c['injectedProvider']) ? c['injectedProvider'] : c['injectedProvider'].getSigner()),
              );

            let metaData = {}
            if(c['payment']) {
              metaData['value'] = c['payment']
            }

            let result
            if(c['injectedProvider'].provider && c['injectedProvider'].provider.wc) {
              let populatedTransaction = await contract.populateTransaction[c['regularFunction']](...c['regularFunctionArgs'])
              if(c['payment']) {
                populatedTransaction['value'] = c['payment']
              }
              console.log(populatedTransaction)
              result = await c['injectedProvider'].send('eth_sendTransaction', [populatedTransaction])
            } else {
              result = await contract[c['regularFunction']](...c['regularFunctionArgs'], metaData)
            }
            console.log("Regular RESULT!!!!!!",result)
          return result
        } else {
            if(c['injectedProvider'].connection && c['injectedProvider'].connection.url === "metamask") {
                await addXDAItoMetamask({
                  injectedProvider: c['injectedProvider']
                })
                throw { message: 'Switched networks' }
            } else {
              throw {message: 'Wrong network'}
            }
        }
      }
      else if (process.env.REACT_APP_USE_GSN === 'true') {

        if (injectedNetwork.chainId === localNetwork.chainId && ['injectedGsnSigner'] in c && c['injectedGsnSigner']) {
          console.log('Got a signer on the right network and GSN is go!')
          let contract = new ethers.Contract(
              contractAddress,
              contractAbi,
              c['injectedGsnSigner'],
            );

            //let result = await contract[c['regularFunction']](...c['regularFunctionArgs'], overrideOptions)
            let result
            if(c['injectedProvider'].provider && c['injectedProvider'].provider.wc) {
              let populatedTransaction = await contract.populateTransaction[c['regularFunction']](...c['regularFunctionArgs'])
              console.log(populatedTransaction)
              result = await c['injectedGsnSigner'].send('eth_sendTransaction', [populatedTransaction])
            } else {
              result = await contract[c['regularFunction']](...c['regularFunctionArgs'], overrideOptions)
            }

          console.log("Regular GSN RESULT!!!!!!",result)
        return result
      } else if (c['signatureFunction'] &&
          c['signatureFunctionArgs'] &&
          c['getSignatureTypes'] &&
          c['getSignatureArgs'] &&
          c['metaSigner']) {
          console.log('Doing it the chain-agnostic signature way!')
          let signature = await getSignature(
            c['injectedProvider'],
            c['address'],
            c['getSignatureTypes'],
            c['getSignatureArgs'])

          console.log("Got signature: ",signature)
          console.log(c['metaSigner'])

          let contract = new ethers.Contract(
              contractAddress,
              contractAbi,
              c['metaSigner'],
            );

          let result = await contract[c['signatureFunction']](...[...c['signatureFunctionArgs'],signature], overrideOptions)
          console.log("Fancy signature RESULT!!!!!!",result)
          return result
        } else if (injectedNetwork.chainId !== localNetwork.chainId) {

          if(c['injectedProvider'].connection && c['injectedProvider'].connection.url === "metamask") {
              await addXDAItoMetamask({
                injectedProvider: c['injectedProvider']
              })
              throw { message: 'Switched networks' }
          } else {
            throw {message: 'Wrong network'}
          }
        } else {
            showXDaiModal()
            throw {message: 'Need XDai'}
          }
      }
      else {
        showXDaiModal()
        throw {message: 'Need XDai'}
      }

    } catch(e) {
      console.log(e)
      if(e.message.indexOf("Wrong network")>=0) {
        chainWarning()
      }
      else if(e.message.indexOf("Switched networks")>=0) {
        notification.open({
          message: 'Please try again. 😅',
          description:
          "⏳ Nifty Ink is built on xDai: we tried to change your Metamask network, so please try again! Or click Help for more information.",
        });
      }
      else if(e.message.indexOf("Relay not ready")>=0){
        notification.open({
          message: '📛 Sorry! Relay not ready. 😅',
          description:
          "⏳ Please wait a moment and try again. If you continue seeing this error please get in touch via chat! 📡",
        });
      }else if(e.message.indexOf("Ping errors")>=0){
        notification.open({
          message: '📛 Sorry! 📡 Relay Error. 😅',
          description:
          "⏳ Please try again in a few seconds. 📡",
        });
      }else if(e.message.indexOf("no registered relayers")>=0){
        notification.open({
          message: '📛 Sorry! 📡 Relay Error. 😅',
          description:
          "⏳ Please wait a moment and try again. 📡",
        });
      }else{
        notification.open({
          message: '📛 Transaction unsuccessful',
          description:
          e.message,
        });
      }
      throw e
    }

  }
