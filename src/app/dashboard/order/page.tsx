'use client';



import dynamic from 'next/dynamic';


const OrderContent = dynamic(() => import('@/components/OrderContent'), {
  ssr: false,
});

export default function Dashboard() {

  return <OrderContent />;
}
