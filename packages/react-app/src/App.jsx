import React, { useEffect, useState, useCallback, useReducer } from 'react'
// import { useUserProviderAndSigner } from 'eth-hooks'
import { useExchangeEthPrice } from 'eth-hooks/dapps/dex'
import { NETWORKS } from './constants'
import { Layout } from './components'
import { BrowseBadges } from './views'
import MintingPage from './views/MintingPage'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Toast from 'components/Toast'
import { BadgeContext } from 'contexts/BadgeContext'
import externalContracts from 'contracts/external_contracts'
import { useUserProviderAndSigner } from 'eth-hooks'
const { ethers } = require('ethers')

const APPSTATEACTION = {
  GOERLICHAINID: '5',
  OPTIMISMCHAINID: '10',
}

const defaultState = {
  provider: new ethers.providers.Web3Provider(window.ethereum),
  chainId: '5',
  contractRef: externalContracts['5'].contracts.REMIX_REWARD,
}

function appStateReducer(state, actionType) {
  switch (actionType.type) {
    case '10':
      const optimism = {
        provider: new ethers.providers.Web3Provider(window.ethereum),
        chainid: '10',
        contractRef: externalContracts['10'].contracts.REMIX_REWARD,
      }
      return optimism
    case '5':
      const goerli = {
        provider: new ethers.providers.Web3Provider(window.ethereum),
        chainid: '1',
        contractRef: externalContracts['1'].contracts.REMIX_REWARD,
      }
      return goerli
    default:
      throw new Error('The network selected is not supported!')
  }
}

// @ts-ignore
function App({ mainnet }) {
  // @ts-ignore
  const [appState, appDispatch] = useReducer(appStateReducer, defaultState)
  const [localProvider, setLocalProvider] = useState()
  const [loaded, setLoaded] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState()
  const [address, setAddress] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} }

  const targetNetwork = NETWORKS['optimism']
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnet)

  let contractRef
  let providerRef
  const chainId = appState.chainId
  if (
    externalContracts[chainId] &&
    externalContracts[chainId].contracts &&
    externalContracts[chainId].contracts.REMIX_REWARD
  ) {
    contractRef = externalContracts[chainId].contracts.REMIX_REWARD
    providerRef = externalContracts[chainId].provider
  } else {
    console.log('kosi externalContract')
  }
  /* SETUP METAMASK */

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const USE_BURNER_WALLET = false
  const userProviderAndSigner = useUserProviderAndSigner(appState.provider, localProvider, USE_BURNER_WALLET)

  const closeToast = () => {
    setShowToast(false)
  }

  const displayToast = () => {
    setShowToast(true)
  }

  useEffect(() => {
    window.ethereum.on('chainChanged', chainId => {
      window.location.reload()
    })
  }, [])

  useEffect(() => {
    const run = async () => {
      const local = new ethers.providers.StaticJsonRpcProvider(providerRef)
      await local.ready
      // const mainnet = new ethers.providers.StaticJsonRpcProvider(
      //   'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
      // )
      // @ts-ignore
      setLocalProvider(local)
      // setMainnet(mainnet)
      setLoaded(true)
    }
    run()
  }, [appState.provider, providerRef])

  useEffect(() => {
    async function getAddress() {
      const holderForConnectedAddress = await appState.provider.listAccounts()
      if (holderForConnectedAddress.length > 1 && connectedAddress) {
        // @ts-ignore
        setConnectedAddress(holderForConnectedAddress[0])
      }
      console.log('connectedAddress could not be set!')
    }
    getAddress()
  }, [appState.provider, connectedAddress])

  useEffect(() => {
    window.ethereum.on('chainChanged', chainId => {
      // @ts-ignore
      const id = parseInt(Number(chainId))
      if (id === 5) {
        // @ts-ignore
        appDispatch({ type: APPSTATEACTION.GOERLICHAINID })
        window.location.reload()
      }
      if (id === 10) {
        // @ts-ignore
        appDispatch({ type: APPSTATEACTION.OPTIMISMCHAINID })
        window.location.reload()
      }
    })

    return () => {
      window.ethereum.removeListener('chainChanged', chainId => {
        console.log('removed')
      })
    }
  }, [])

  const logoutOfWeb3Modal = async () => {
    // @ts-ignore
    if (appState.provider && appState.provider.provider && typeof appState.provider.provider.disconnect == 'function') {
      // @ts-ignore
      await appState.provider.provider.disconnect()
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const snackBarAction = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={closeToast}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  )

  const loadWeb3Modal = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      // console.log('MetaMask is not installed!')
      displayToast()
      // metamask not installed
      return
    }
    const provider = appState.provider // window.ethereum
    await provider.send('eth_requestAccounts', [])

    /**
     * @param accountPayload string[]
     */
    provider.on('accountsChanged', async accountPayload => {
      // accountPayload Array<string>
      console.log(`account changed!`)
      if (accountPayload.length === 0) {
        console.log('Metamask requires login or no accounts added')
        // show toast if need be
      } else if (accountPayload[0] !== connectedAddress) {
        setConnectedAddress(accountPayload[0])
      }
    })

    provider.on('chainChanged', chainId => {
      console.log(`chain changed to ${chainId}! updating providers`)
      if (chainId === 5 || chainId === '5') {
        // @ts-ignore
        appDispatch({ actionType: APPSTATEACTION.GOERLICHAINID })
        window.location.reload()
      }
      if (chainId === 10 || chainId === '10') {
        // @ts-ignore
        appDispatch({ actionType: APPSTATEACTION.OPTIMISMCHAINID })
        window.location.reload()
      }
      if (chainId !== 10 || chainId !== '10' || chainId !== 5 || chainId !== '5') {
        throw new Error('Network not supported!!!')
      }
    })

    // Subscribe to session disconnection
    provider.on('disconnect', (code, reason) => {
      console.log(code, reason)
      logoutOfWeb3Modal()
    })

    // console.log({ injectedProvider })
    setTabValue(prev => prev)
    // eslint-disable-next-line
  }, [appDispatch])

  /* END - SETUP METAMASK */

  /* SETUP MAINNET & OPTIMISM provider */
  const targetProvider = appState.provider
  const selectedChainId = appState.chainId
  const userSigner = targetProvider.getSigner()
  /* END - SETUP MAINNET & OPTIMISM provider */
  const contextPayload = {
    localProvider,
    mainnet,
    targetProvider,
    selectedChainId,
    address,
    setAddress,
    connectedAddress,
    setConnectedAddress,
    contractConfig,
    externalContracts,
    contractRef,
    price,
    targetNetwork,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    userSigner,
  }

  return (
    <div className="App">
      <BadgeContext.Provider value={contextPayload}>
        <Layout tabValue={tabValue} setTabValue={setTabValue}>
          {loaded && tabValue === 0 && <BrowseBadges appDispatcher={appDispatch} appState={appState} />}

          {tabValue === 1 && (
            <MintingPage
              // @ts-ignore
              tabValue={tabValue}
              setTabValue={setTabValue}
              appDispatcher={appDispatch}
              appState={appState}
            />
          )}
          <Toast
            showToast={showToast}
            closeToast={closeToast}
            snackBarAction={snackBarAction}
            message={'MetaMask   is not installed!'}
          />
        </Layout>
      </BadgeContext.Provider>
    </div>
  )
}

export default App
