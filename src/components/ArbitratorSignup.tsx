import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IDKitWidget, ISuccessResult, useIDKit } from '@worldcoin/idkit'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from 'wagmi'
import { abi as abiWorldID } from '../contract/artifacts/contracts/WorldID.sol/VerifyWorldID.json'
import { decodeAbiParameters, parseAbiParameters } from 'viem'
import { ContractContext } from '@/context/ContratContext'
import { CONTRACT_ADDRESSES } from '@/contract/address'
import { Button } from "@/components/ui/Button";
interface ArbitratorSignupProps {
  onSignup: (address: string) => void
}

export function ArbitratorSignup({ onSignup }: ArbitratorSignupProps) {
  const { isVerifiedHuman, isJudge,isSeller, sendTxRegisterAsJudge } = useContext(ContractContext)
  const account = useAccount()
  const { setOpen } = useIDKit()
  const [done, setDone] = useState(false)
  const {
    isSuccess,
    data: hash,
    isPending,
    error,
    writeContractAsync,
  } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

 
  const submitTx = async (proof: ISuccessResult) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.BaseSepolia.WORLD_ID_ADDRESS as `0x${string}`,
        account: account.address!,
        abi: abiWorldID,
        functionName: 'verifyHuman',
        args: [
          account.address!,
          BigInt(proof!.merkle_root),
          BigInt(proof!.nullifier_hash),
          decodeAbiParameters(
            parseAbiParameters('uint256[8]'),
            proof!.proof as `0x${string}`
          )[0],
        ],
      })
      setDone(true)
      onSignup(account.address!)
    } catch (error) {
      console.log(error)
      throw new Error((error as BaseError).shortMessage)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isVerifiedHuman
              ? isSeller
                ? 'Seller cannot be a judge'
                : 'Judge Signup'
              : 'Judge WorldID Verification'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isVerifiedHuman ? (
            <Button
              onClick={sendTxRegisterAsJudge}
              className="w-full"
              disabled={isJudge || isSeller}
            >
              Apply to be a judge
            </Button>
          ) : (
            <IDKitWidget
              app_id={process.env.NEXT_PUBLIC_WORLDID_APP_ID! as `app_${string}`}
              action={process.env.NEXT_PUBLIC_WORLDID_ACTION!}
              signal={account.address!}
              onSuccess={submitTx}
            >
              {({ open }) => (
                <>
                  <Button
                    onClick={open}
                    className="w-full"
                    disabled={isSuccess}
                  >
                    {' '}
                    {isPending
                      ? 'Pending, please check your wallet...'
                      : isSuccess
                      ? 'Verify successful with World ID ...'
                      : '  Proceed with Worldcoin Verification'}{' '}
                  </Button>
                </>
              )}
            </IDKitWidget>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
