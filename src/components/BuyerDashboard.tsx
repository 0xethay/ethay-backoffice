'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

type OrderStatus = 'waiting' | 'shipping' | 'history';

interface Order {
  id: string;
  productName: string;
  status: OrderStatus;
  date: string;
}

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('waiting');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      } else {
        console.log('Please install MetaMask!');
      }
    };

    connectWallet();
  }, []);

  // Mock data for orders
  const orders: Order[] = [
    {
      id: '1',
      productName: 'Wireless Headphones',
      status: 'waiting',
      date: '2023-05-01',
    },
    {
      id: '2',
      productName: 'Smart Watch',
      status: 'shipping',
      date: '2023-05-05',
    },
    { id: '3', productName: 'Laptop', status: 'history', date: '2023-04-20' },
    {
      id: '4',
      productName: 'Smartphone',
      status: 'waiting',
      date: '2023-05-10',
    },
    { id: '5', productName: 'Tablet', status: 'shipping', date: '2023-05-08' },
    {
      id: '6',
      productName: 'Gaming Console',
      status: 'history',
      date: '2023-04-15',
    },
  ];

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  const handleLogout = () => {
    setAccount(null);

    router.push('/login');
    // Implement logout logic and redirect to login page
  };

  const getWalletDisplay = () => {
    if (account) {
      return `${account.slice(0, 6)}...${account.slice(-4)}`;
    }
    return 'Connect Wallet';
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>Buyer Dashboard</h1>
          <div className='relative'>
            <Button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
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
                  className='absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10'
                >
                  <button
                    onClick={handleLogout}
                    className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className='flex space-x-4 mb-8'>
          {['waiting', 'shipping', 'history'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as OrderStatus)}
              className={`${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>{order.productName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Order ID: {order.id}</p>
                <p>Status: {order.status}</p>
                <p>Date: {order.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
