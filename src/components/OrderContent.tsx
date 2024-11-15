'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function DashboardContent() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const sellerId = localStorage.getItem('address')?.toLowerCase();

    const { data, error } = await supabase
      .from('orders') // Replace 'orders' with your actual table name
      .select('*')
      .eq('seller_id', sellerId);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='p-6 bg-gradient-to-br from-gray-50 to-gray-100'
    >
      <nav className='mb-8'>
        <ul className='flex space-x-4'>
          <li>
            <Link
              href='/dashboard'
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              Products
            </Link>
          </li>
        </ul>
      </nav>

      <motion.h2
        className='text-3xl font-bold mb-6 text-gray-800'
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        My Orders
      </motion.h2>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        variants={containerVariants}
      >
        {orders.map((order: any) => (
          <motion.div key={order.id} variants={itemVariants}>
            <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
              <CardContent className='p-4'>
                <CardTitle className='text-xl mb-2'>
                  Order ID: {order.id}
                </CardTitle>
                <p className='text-gray-600 font-semibold mb-4'>
                  Total: {order.total}
                </p>
                <Button
                  className='w-full'
                  onClick={() => console.log('Order details:', order)}
                >
                  Order Detail
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
