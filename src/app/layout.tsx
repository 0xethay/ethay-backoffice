'use client'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { fallback, injected, unstable_connector } from '@wagmi/core'
import { ContractProvider } from '@/context/ContratContext'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

const queryClient = new QueryClient()

const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: fallback([
      unstable_connector(injected),
      http(baseSepolia.rpcUrls.default.http[0]),
    ]),
  },
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ContractProvider>{children}</ContractProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
