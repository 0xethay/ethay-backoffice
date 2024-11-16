'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await provider.send('eth_requestAccounts', []);
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
    };
    connectWallet();
  }, []);

  const handleLogout = () => {
    setAccount(null);
    router.push('/login');
  };

  const getWalletDisplay = () => {
    if (account) {
      return `${account.slice(0, 6)}...${account.slice(-4)}`;
    }
    return 'Connect Wallet';
  };

  return (
    <div className='min-h-screen bg-purple-300'>
      <header className='bg-purple-900 shadow'>
        <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
          <img src='/ethay-logo.png' alt='Ethay Logo' className='h-8 w-auto' />{' '}
          <nav className='space-x-4'>
            <Link href='/dashboard' className='text-white hover:text-white'>
              Home
            </Link>
            <Link
              href='/dashboard/create'
              className='text-white hover:text-white-900'
            >
              Create Product
            </Link>
            <Link
              href='/dashboard/order'
              className='text-white hover:text-white-900'
            >
              Order
            </Link>
          </nav>
          <div className='relative'>
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
            >
              {getWalletDisplay()}
            </button>
            <AnimatePresence>
              {isAccountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10'
                >
                  <button
                    onClick={handleLogout}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main>
        <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>{children}</div>
      </main>
    </div>
  );
}
