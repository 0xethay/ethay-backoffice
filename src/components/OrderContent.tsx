'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ethers } from 'ethers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initializeGraphClient = () => {
  const graphClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/54090/ethay/version/latest',
    cache: new InMemoryCache(),
  });
  return graphClient;
};

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

// Add a global style or use a CSS-in-JS library to apply the font
const globalStyles = `
  @font-face {
    font-family: 'GeistMono';
    src: url('/fonts/GeistMonoVF.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }

  .geist-mono-font {
    font-family: 'GeistMono', monospace;
  }
`;

export default function DashboardContent() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);

  const client = initializeGraphClient();

  async function fetchOrders() {
    const walletAddress = localStorage.getItem('address')?.toLowerCase();

    const tokenQuery = `{
      purchases(first: 1000) {
        id
        product {
          id
          name
          price
          quantity
          isForSale
          usdtBalance
          ipfsLink
          description
          seller {
            id
            isSeller
          }
        }
        buyer {
          id
          isSeller
        }
        transactions(where: { type: "PURCHASE" }) {
         id
          type
        }
        quantity
        totalPrice
        isConfirmed
        purchaseTime
        isDisputed
        referrer {
          id
          isSeller
          isJudge
          referralRewards
        }
      }
    }`;

    const subgraph_data = await client
      .query({
        query: gql(tokenQuery),
      })
      .then((data) => data)
      .catch((err) => {
        console.log('Error fetching data: ', err);
        return null;
      });
    console.log(subgraph_data);

    const { data: orderData, error: memberError } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', walletAddress);

    if (memberError) {
      console.error('Error fetching orders:', memberError);
      return;
    }

    // Group orders by purchase_id
    const groupedOrders = orderData.reduce((acc, order) => {
      const existingOrder = acc.find(
        (o) => o.purchase_id === order.purchase_id
      );
      if (existingOrder) {
        existingOrder.quantity += order.quantity;
        existingOrder.totalPrice += order.totalPrice;
      } else {
        acc.push(order);
      }
      return acc;
    }, []);

    console.log(groupedOrders);
    setOrders(groupedOrders);

    // if (!subgraph_data) {
    //   throw new Error('Failed to fetch subgraph data');
    // }

    const ordersData = await Promise.all(
      subgraph_data.data.purchases.map(async (purchase) => {
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select('delivery_address')
          .eq('wallet_address', purchase.buyer.id)
          .single();

        if (memberError) {
          // throw new Error(memberError.message);
          return;
        }

        const purchaseTime = purchase.purchaseTime;
        const deliveryAddress = memberData?.delivery_address;
        const status = deliveryAddress
          ? 'waiting_for_delivery'
          : 'waiting_for_address';

        const orderData = {
          purchase_id: purchase.id,
          product_id: purchase.product.id,
          buyer_id: purchase.buyer.id,
          seller_id: walletAddress,
          product_name: purchase.product.name,
          order_date: purchaseTime
            ? new Date(purchaseTime * 1000).toISOString()
            : new Date().toISOString(),
          totalPrice: parseInt(ethers.formatUnits(purchase.totalPrice, 18)),
          quantity: purchase.quantity,
          image: purchase.product.ipfsLink,
          subgraph_data: purchase,
          delivery_address: deliveryAddress || null,
          status: status,
          tx: purchase.transactions[0].id,
        };

        const { data: existingOrder, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('purchase_id', orderData.purchase_id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw new Error(fetchError.message);
        }

        if (existingOrder) {
          if (
            existingOrder.status === 'waiting_for_delivery' ||
            existingOrder.status === 'waiting_for_address'
          ) {
            const { data: updatedOrder, error: updateError } = await supabase
              .from('orders')
              .update(orderData)
              .eq('purchase_id', orderData.purchase_id)
              .select();

            if (updateError) {
              throw new Error(updateError.message);
            }

            return updatedOrder;
          } else {
            return existingOrder;
          }
        } else {
          const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select();

          if (error) {
            throw new Error(error.message);
          }
          return data;
        }
      })
    );
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Inject global styles
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
  }, [orders]);

  const setDelivered = async (orderIds: string[], trackingInfo: string) => {
    try {
      const updates = orderIds.map(async (orderId) => {
        const { data, error } = await supabase
          .from('orders')
          .update({ status: 'delivered' })
          .eq('purchase_id', orderId);

        if (error) {
          throw new Error(
            `Failed to update order ${orderId}: ${error.message}`
          );
        }
        return data;
      });

      await Promise.all(updates);
      console.log(
        `Orders ${orderIds.join(
          ', '
        )} delivered with tracking info: ${trackingInfo}`
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating orders:', error);
    }
  };

  const handleDeliverClick = (order) => {
    // alert(JSON.stringify(order));
    const orderIds = Array.isArray(order)
      ? order.map((tx) => tx.purchase_id)
      : [order.purchase_id];
    setSelectedOrders(orderIds);
    setIsModalOpen(true);
  };

  const handleDoneClick = () => {
    if (selectedOrders.length > 0) {
      setDelivered(selectedOrders, trackingInfo);
      setIsModalOpen(false);
      setTrackingInfo('');
    }
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='p-6 bg-gradient-to-br from-purple-100 to-white global-font geist-mono-font'
    >
      {/* <nav className='mb-8'>
        <ul className='flex space-x-4'>
          <li>
            <Link
              href='/dashboard'
              className='text-purple-600 hover:text-purple-800 font-medium'
            >
              Products
            </Link>
          </li>
        </ul>
      </nav> */}

      <motion.h2
        className='text-3xl font-bold mb-6 text-purple-800'
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
        {orders
          .reduce((acc, order) => {
            const compositeKey = `${order.product_id}-${order.buyer_id}`;
            const existingOrder = acc.find(
              (o) => o.compositeKey === compositeKey
            );
            if (existingOrder) {
              existingOrder.quantity += order.quantity;
              existingOrder.totalPrice += order.totalPrice;
            } else {
              acc.push({ ...order, compositeKey });
            }
            return acc;
          }, [])
          .map((order: any) => (
            <motion.div key={order.product_id} variants={itemVariants}>
              <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                <CardHeader className='p-0'>
                  <Image
                    src={'https://ipfs.io/ipfs/' + order.image}
                    alt='Order Image'
                    width={300}
                    height={200}
                    className='w-full h-48 object-cover'
                    onError={(e) => {
                      e.currentTarget.src = '/fallback-image.png';
                    }}
                  />
                </CardHeader>
                <CardContent className='p-4'>
                  <CardTitle className='text-xl mb-2 text-purple-700'>
                    Product ID: {order.product_id}
                  </CardTitle>
                  <div className='flex flex-wrap'>
                    <p className='text-purple-600 font-semibold mb-4 w-1/2 truncate'>
                      Name: {order.product_name}
                    </p>
                    <p className='text-purple-600 font-semibold mb-4 w-1/2 truncate'>
                      Total : {order.totalPrice}
                    </p>
                    <p className='text-purple-600 font-semibold mb-4 w-1/2 truncate'>
                      Qty.: {order.quantity}
                    </p>
                    <p
                      className={`font-semibold mb-4 w-1/2 truncate ${
                        order.status === 'waiting_for_delivery'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                  {/* <Button
                    className='w-full bg-purple-600 text-white hover:bg-purple-700'
                    onClick={() => console.log('Order details:', order)}
                  >
                    Order Detail
                  </Button> */}
                  {order.status === 'waiting_for_delivery' && (
                    <Button
                      className='w-full bg-green-600 text-white hover:bg-green-700 mt-2'
                      onClick={() => handleDeliverClick(order)}
                    >
                      Deliver
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </motion.div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded shadow-lg'>
            <h2 className='text-xl mb-4'>Enter Tracking Information</h2>
            <input
              type='text'
              value={trackingInfo}
              onChange={(e) => setTrackingInfo(e.target.value)}
              className='border p-2 w-full mb-4'
              placeholder='Tracking Number'
            />
            <Button
              className='w-full bg-blue-600 text-white hover:bg-blue-700'
              onClick={handleDoneClick}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
