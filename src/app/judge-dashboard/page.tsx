"use client"

import { useState, useEffect, useContext } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArbitratorSignup } from '@/components/ArbitratorSignup'
import { Task } from '@/types/Task'
import { NewListingStage } from '@/components/judge/NewListingStage'
import { OngoingCasesStage } from '@/components/judge/OngoingCasesStage'
import { HistoryStage } from '@/components/judge/HistoryStage'
import { ContractContext } from '@/context/ContratContext'

export default function JudgeDashboard() {
  const { isVerifiedHuman, isJudge } = useContext(ContractContext)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<'new' | 'ongoing' | 'history'>('new')

  useEffect(() => {
    if (isVerifiedHuman && isJudge) {
      setIsSignedUp(true)
    }
    const tab = searchParams.get('tab')
    if (tab && (tab === 'new' || tab === 'ongoing' || tab === 'history')) {
      setActiveTab(tab)
    }
    // Fetch tasks (replace with actual API call)
    setTasks([
      {
        id: '1',
        contractAddress: '0x863Ad2F812314ce94bf269225F7219Af0719ee0',
        freelancer: '0xDfa729B88f470e5e57c5183B6D043b59024465F',
        client: '0x89c27f76EEF3e09D798FB06a66Dd461d7d21f111',
        amount: '0.0001 ETH',
        terms: 'Create the frontend for an Application',
        deadline: '11/3/5626, 5:30:00 AM',
        state: 'Disputed',
      },
      {
        id: '2',
        contractAddress: '0x123456789abcdef',
        freelancer: '0xabcdef123456789',
        client: '0x987654321fedcba',
        amount: '0.05 ETH',
        terms: 'Design a logo for a startup',
        deadline: '10/1/2023, 12:00:00 PM',
        state: 'InProgress',
      },
      {
        id: '3',
        contractAddress: '0x987654321fedcba',
        freelancer: '0x123456789abcdef',
        client: '0xfedcba987654321',
        amount: '0.1 ETH',
        terms: 'Develop a smart contract for token distribution',
        deadline: '9/15/2023, 3:00:00 PM',
        state: 'InProgress',
      },
      {
        id: '4',
        contractAddress: '0xabcdef123456789',
        freelancer: '0x123456789abcdef',
        client: '0xfedcba987654321',
        amount: '0.2 ETH',
        terms: 'Create a marketing campaign for NFT launch',
        deadline: '8/30/2023, 6:00:00 PM',
        state: 'Completed',
      },
    ])
  }, [searchParams, isVerifiedHuman, isJudge])

  const handleSignup = (address: string) => {
    console.log('Signup submitted', { address })
    setIsSignedUp(true)
  }

  const handleTaskClick = (task: Task) => {
    // Navigate to task detail page using router.push
    router.push(`/judge-dashboard/${task.id}?state=${task.state}`)
  }

  if (!isSignedUp) {
    return <ArbitratorSignup onSignup={handleSignup} />
  }

  return (
    <>
      {activeTab === 'new' && <NewListingStage tasks={tasks} onTaskClick={handleTaskClick} />}
      {activeTab === 'ongoing' && <OngoingCasesStage tasks={tasks} onTaskClick={handleTaskClick} />}
      {activeTab === 'history' && <HistoryStage tasks={tasks} onTaskClick={handleTaskClick} />}
    </>
  )
}
