'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

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
  const [products, setProducts] = useState([]);

  const initializeGraphClient = () => {
    const graphClient = new ApolloClient({
      uri: 'https://api.studio.thegraph.com/query/54090/ethay/version/latest',
      cache: new InMemoryCache(),
    });
    return graphClient;
  };

  const getProductsBySellerId = async (sellerId: string) => {
    const query = gql`
      query {
        products(where: { seller:  "${sellerId}"  }) {
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
      }
    `;

    try {
      const client = initializeGraphClient();
      const { data, errors } = await client.query({
        query,
      });

      if (errors && errors.length) {
        throw new Error(errors.map((error: any) => error.message).join(', '));
      }

      if (!data || !data.products) {
        throw new Error('No products data returned from the query');
      }
      console.log(data.products);

      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products by seller:', error);
      throw new Error(`Failed to fetch products by seller: ${error}`);
    }
  };

  useEffect(() => {
    const sellerId = localStorage.getItem('address')?.toLowerCase();
    if (sellerId) {
      getProductsBySellerId(sellerId);
    } else {
      console.warn('No seller ID found in local storage');
    }
  }, []);

  const showProductDetail = (product: any) => {
    console.log('Product details:', product);
  };

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
        My Products
      </motion.h2>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        variants={containerVariants}
      >
        {products.map((product: any) => (
          <motion.div key={product.id} variants={itemVariants}>
            <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
              <CardHeader className='p-0'>
                <Image
                  src={'https://ipfs.io/ipfs/' + product.ipfsLink}
                  alt={product.name}
                  width={300}
                  height={200}
                  className='w-full h-48 object-cover'
                />
              </CardHeader>
              <CardContent className='p-4'>
                <CardTitle className='text-xl mb-2'>{product.name}</CardTitle>
                <p className='text-gray-600 font-semibold mb-4'>
                  {product.price}
                </p>
                <Button
                  className='w-full'
                  onClick={() => showProductDetail(product)}
                >
                  Product Detail
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
