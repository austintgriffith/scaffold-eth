import Typography from '@mui/material/Typography'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { BadgeContext } from 'contexts/BadgeContext'
import externalContracts from 'contracts/external_contracts'
import { getCurrentChainId } from 'helpers/SwitchToOptimism'

export default function AllowedMintCount() {
  // @ts-ignore
  const { contractRef, localProvider, connectedAddress } = useContext(BadgeContext)
  /*
   * this returns the number of user badge that the selected account is allowed to mint.
   * this function throws an error if the current network selected in the injected provider (metamask) is not optimism (chain id of optimism is 10)
   */
  const allowedMinting = useCallback(async (contractReference, provider, address) => {
    try {
      let contract = new ethers.Contract(contractReference.address, contractReference.abi, provider)
      return await contract.allowedMinting(address)
    } catch (error) {
      console.error(error)
    }
  }, [])
  const [mintCount, setMintCount] = useState('0')

  useEffect(() => {
    if (localProvider === undefined || connectedAddress === undefined) {
      console.log('Not connected to metamask or the blockchain!')
      return
    }
    const run = async () => {
      try {
        const chainInfo = await getCurrentChainId()
        console.log({ chainInfo })
        if (chainInfo[0].chainId === 5) {
          // create contractRef for goerli
          const contractReference = externalContracts['5'].contracts.REMIX_REWARD
          const result = await allowedMinting(contractReference, localProvider, connectedAddress)
          if (ethers.BigNumber.isBigNumber(result)) {
            const final = ethers.BigNumber.from(result).toNumber().toString()
            console.log({ final })
            setMintCount(final)
            return
          }
        }
        if (chainInfo[0].chainId === 10) {
          // create contractRef for goerli
          const contractReference = externalContracts['10'].contracts.REMIX_REWARD
          const result = await allowedMinting(contractReference, localProvider, connectedAddress)
          if (ethers.BigNumber.isBigNumber(result)) {
            const final = ethers.BigNumber.from(result).toNumber().toString()
            console.log({ final })
            setMintCount(final)
            return
          }
        }
      } catch (error) {
        console.log(`An error was caught in AllowedMintCount. See the details below`)
        console.log({ error })
      }
    }
    run()
    return () => {
      console.log('cleaned up!')
    }
  }, [allowedMinting, connectedAddress, contractRef, localProvider])

  return (
    <>
      <Typography variant="h2" fontWeight={900} sx={{ padding: 2, color: '#81a6f7' }}>
        {mintCount}
      </Typography>
    </>
  )
}
