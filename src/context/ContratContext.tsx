import React, { createContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
 import {abi as WorldIDAbi } from '@/contract/artifacts/contracts/WorldID.sol/VerifyWorldID.json'
 import {abi as EthayAbi } from '@/contract/artifacts/contracts/Ethay.sol/Contract.json'
import { useAccount } from 'wagmi'
import { CONTRACT_ADDRESSES, RPCNETWORK } from '../contract/address'
import { VerifyWorldID ,Contract as Ethay} from '@/contract/typechain-types'
 
 
interface IContract {
  isVerifiedHuman: boolean
  isJudge: boolean
  isSeller: boolean
  sendTxRegisterAsJudge: () => Promise<string | undefined>
  sendTxRegisterAsSeller: () => Promise<string | undefined>
  sendTxResolveDispute: (productId: string, purchaseId: string, buyerAmount: string) => Promise<string | undefined>
}

export const ContractContext = createContext<IContract>({
  isVerifiedHuman: false,
  isJudge: false,
  isSeller: false,
  sendTxRegisterAsJudge: async () => '',
  sendTxRegisterAsSeller: async () => '',
  sendTxResolveDispute: async () => '',
})

interface ChildrenProps {
  children: React.ReactNode
}

export const ContractProvider = ({ children }: ChildrenProps) => {
  let providerWindow: ethers.BrowserProvider
  let providerRPC = new ethers.JsonRpcProvider(RPCNETWORK)

  if (typeof window !== 'undefined') {
    try {
      providerWindow = new ethers.BrowserProvider(window.ethereum as any)
    } catch (error) {}
  }

  

  const [initialLoading, setInitialLoading] = useState(true)
  const [isVerifiedHuman, setIsVerifiedHuman] = useState(false)
  const [isJudge, setIsJudge] = useState(false)
  const [isSeller, setIsSeller] = useState(false)
  const WorldIDContract = () => {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.BaseSepolia.WORLD_ID_ADDRESS,
      WorldIDAbi,
      providerRPC
    ) as unknown as VerifyWorldID

    return contract
  }

  const EthayContract = async () => {
   const contract = new ethers.Contract(
     CONTRACT_ADDRESSES.BaseSepolia.ETHAY,
     EthayAbi,
     providerRPC
   ) as unknown as Ethay
   return contract
  }
  
  const EthayContractSigner = async () => {
    const signer = await providerWindow.getSigner()
   const contract = new ethers.Contract(
     CONTRACT_ADDRESSES.BaseSepolia.ETHAY,
     EthayAbi,
     signer
   ) as unknown as Ethay
   return contract
  }
   

  useEffect(() => {
    if (!window.ethereum) console.log('Please install metamask')
    const loadInit = async () => {
       getVerifyWorldIDOnChain()
       getVerifyJudgeAndSeller()
    }
    loadInit()
    setInitialLoading(false)
  }, [])

   
  
  const sendTxRegisterAsJudge = async () => {
    try {
      if (!window.ethereum) return
      const contract = await EthayContractSigner()
      const transaction = await contract.registerAsJudge()
      await transaction.wait()
      await getVerifyJudgeAndSeller()
      return transaction.hash
    } catch (error: any) {
      throw new Error(error.reason)
      // throw new Error(error.error.data.message)
    }
  }
  const sendTxResolveDispute = async (productId: string, purchaseId: string, buyerAmount: string) => {
    try {
      console.log('productId: ' + productId)
      console.log('purchaseId: ' + purchaseId)
      console.log('buyerAmount: ' + buyerAmount)  
      if (!window.ethereum) return
      const contract = await EthayContractSigner()
      const transaction = await contract.resolveDispute(productId, purchaseId, buyerAmount)
      await transaction.wait()
      return transaction.hash
    } catch (error: any) {
      throw new Error(error.reason)
      // throw new Error(error.error.data.message)
    }
  }
  const sendTxRegisterAsSeller = async () => {
    try {
      if (!window.ethereum) return
      const contract = await EthayContractSigner()
      const transaction = await contract.registerAsSeller()
      await transaction.wait()
      await getVerifyJudgeAndSeller()
      return transaction.hash
    } catch (error: any) {
      throw new Error(error.reason)
      // throw new Error(error.error.data.message)
    }
  }
 
 
  const getVerifyJudgeAndSeller = async () => {
    try {
      if (!window.ethereum) return
      const contract = await EthayContract()
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      })
      const [resultJudge, resultSeller] =  await Promise.all([contract.isJudge(accounts[0]), contract.isSeller(accounts[0])])
      setIsJudge(resultJudge)
      setIsSeller(resultSeller)
      console.log('isJudge: ' + accounts[0] + ' ' + resultJudge)
      console.log('isSeller: ' + accounts[0] + ' ' + resultSeller)
    } catch (error) {
      console.log(error)
    }
  }
  const getVerifyWorldIDOnChain = async () => {
    try {
      if (!window.ethereum) return
      const contract = WorldIDContract()
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      })
      const result = await contract.isVerifiedHuman(accounts[0])
      setIsVerifiedHuman(result)
      console.log('isVerifiedHuman: ' + accounts[0] + ' ' + result)
    } catch (error) {
      console.log(error)
    }
  }
    
  return (
    <ContractContext.Provider
      value={{
        isVerifiedHuman,
        isJudge,
        isSeller,
        sendTxRegisterAsJudge,
        sendTxRegisterAsSeller,
        sendTxResolveDispute,
      }}
    >
      {!initialLoading && children}
    </ContractContext.Provider>
  )
}
