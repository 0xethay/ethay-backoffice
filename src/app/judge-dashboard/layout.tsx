"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { JudgeNavigation } from '@/components/judge/JudgeNavigation'
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion"
import { ethers } from 'ethers'

export default function JudgeDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'new' | 'ongoing' | 'history'>('new')
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        try {
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Failed to connect wallet:', error)
        }
      }
    }
    connectWallet()
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && (tab === 'new' || tab === 'ongoing' || tab === 'history')) {
      setActiveTab(tab)
    } else if (pathname.includes('/judge-dashboard/')) {
      const state = searchParams.get('state')
      if (state === 'Disputed') {
        setActiveTab('new')
      } else if (state === 'InProgress') {
        setActiveTab('ongoing')
      } else if (state === 'Completed') {
        setActiveTab('history')
      }
    }
  }, [searchParams, pathname])

  const handleLogout = () => {
    setAccount(null)
    router.push('/login')
  }

  const getWalletDisplay = () => {
    if (account) {
      return `${account.slice(0, 6)}...${account.slice(-4)}`
    }
    return 'Connect Wallet'
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <div className="relative">
          <Button
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            {getWalletDisplay()}
          </Button>
          <AnimatePresence>
            {isAccountOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10"
              >
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <JudgeNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {children}
    </div>
  )
}
