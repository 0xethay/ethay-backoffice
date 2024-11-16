"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';


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

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new BrowserProvider(window.ethereum);
        const signer = await ethersProvider.getSigner();
        const walletAddress = await signer.getAddress();
        
        setProvider(ethersProvider);
        setAddress(walletAddress);
        setIsConnected(true);
        
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
        isConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
} 