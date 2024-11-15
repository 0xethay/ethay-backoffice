"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { BrowserProvider } from 'ethers';
import { createContext, useContext, useState, useEffect } from 'react';
import type { MetaMaskInpageProvider } from "@metamask/providers";

// Create a client
const queryClient = new QueryClient();

// Create wagmi config
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create wallet context
type WalletContextType = {
  provider: BrowserProvider | null;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
};

const WalletContext = createContext<WalletContextType>({
  provider: null,
  address: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
});

export const useWallet = () => useContext(WalletContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    const ethereum = window.ethereum;
    
    if (ethereum) {
      try {
        // Request account access
        await ethereum.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new BrowserProvider(ethereum);
        const signer = await ethersProvider.getSigner();
        const walletAddress = await signer.getAddress();
        
        setProvider(ethersProvider);
        setAddress(walletAddress);
        setIsConnected(true);
        
        // Store connection state
        localStorage.setItem('walletConnected', 'true');
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAddress(null);
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (localStorage.getItem('walletConnected') === 'true' && window.ethereum) {
        await connectWallet();
      }
    };
    checkConnection();
  }, []);

  return (
    <WalletContext.Provider 
      value={{ 
        provider, 
        address, 
        connectWallet, 
        disconnectWallet, 
        isConnected 
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </WalletContext.Provider>
  );
} 