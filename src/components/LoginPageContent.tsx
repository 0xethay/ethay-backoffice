"use client"

import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoginPageContent() {
  const [loginSuccess, setLoginSuccess] = useState(false)
  const router = useRouter()

  const connectWallet = async (type: 'seller' | 'judge' | 'buyer') => {
    // Implement your wallet connection logic here
    console.log(`Connecting wallet for ${type}`)
    setLoginSuccess(true)
    
    // Redirect to the appropriate dashboard after a short delay
    setTimeout(() => {
      switch (type) {
        case 'seller':
          router.push('/dashboard')
          break
        case 'judge':
          router.push('/judge-dashboard')
          break
      }
    }, 1000)
  }

  const getWalletDisplay = () => {
    if (loginSuccess) {
      return 'Connected!'
    }
    return 'Connect Wallet'
  }

  const LoginCard = ({ title, description, type }: { title: string, description: string, type: 'seller' | 'judge' | 'buyer' }) => (
    <Card className="w-[350px] m-4">
      <CardHeader>
        <CardTitle>
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {title}
          </motion.h2>
        </CardTitle>
        <CardDescription>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full"
        >
          <Button className="w-full" onClick={() => connectWallet(type)} disabled={loginSuccess}>
            {getWalletDisplay()}
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to Our Platform
      </motion.h1>
      <div className="flex flex-wrap justify-center">
      
          <LoginCard
          title="Seller Login"
          description="Connect your wallet to access the seller dashboard."
            type="seller"
          />
       
        
          <LoginCard
            title="Judge Login"
          description="Connect your wallet to access the judge dashboard."
          type="judge"
        />
    
      </div>
    </div>
  )
}
