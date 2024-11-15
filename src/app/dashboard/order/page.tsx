'use client';

import { SellerSignup } from '@/components/SellerSignup';
import { ContractContext } from '@/context/ContractContext';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';

const OrderContent = dynamic(() => import('@/components/OrderContent'), {
  ssr: false,
});

export default function Dashboard() {
  //   const [isSignedUp, setIsSignedUp] = useState(false);
  //   const { isVerifiedHuman, isSeller } = useContext(ContractContext);
  //   const handleSignup = (address: string) => {
  //     console.log('Signup submitted', { address });
  //     setIsSignedUp(true);
  //   };

  //   useEffect(() => {
  //     if (isVerifiedHuman && isSeller) {
  //       setIsSignedUp(true);
  //     }
  //   }, [isVerifiedHuman, isSeller]);

  //   if (!isSignedUp) {
  //     return <SellerSignup onSignup={handleSignup} />;
  //   }

  return <OrderContent />;
}
