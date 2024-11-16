"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia, mainnet, sepolia } from 'wagmi/chains';
import { BrowserProvider } from 'ethers';
import { createContext, useContext, useState, useEffect } from 'react';
import { fallback, injected, unstable_connector } from '@wagmi/core'
  
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

// Create a client
const queryClient = new QueryClient();

// Create wagmi config
const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: fallback([
      unstable_connector(injected),
      http(baseSepolia.rpcUrls.default.http[0]),
    ]),
  },
})
  

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

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new BrowserProvider(window.ethereum);
        const signer = await ethersProvider.getSigner();
        const walletAddress = await signer.getAddress();
        
        setProvider(ethersProvider);
        setAddress(walletAddress);
        setIsConnected(true);
        
        localStorage.setItem('walletConnected', 'true');

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
        window.ethereum.on('chainChanged', handleChainChanged as (...args: unknown[]) => void);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
      window.ethereum.removeListener('chainChanged', handleChainChanged as (...args: unknown[]) => void);
    }
    setProvider(null);
    setAddress(null);
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  const handleAccountsChanged = (accounts: unknown) => {
    if (Array.isArray(accounts)) {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else {
        // Update the current account
        setAddress(accounts[0] as string);
      }
    }
  };

  const handleChainChanged = (_chainId: unknown) => {
    // Reload the page when chain changes
    window.location.reload();
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && 
          localStorage.getItem('walletConnected') === 'true' && 
          window.ethereum) {
        await connectWallet();
      }
    };
    checkConnection();

    // Cleanup listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
        window.ethereum.removeListener('chainChanged', handleChainChanged as (...args: unknown[]) => void);
      }
    };
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