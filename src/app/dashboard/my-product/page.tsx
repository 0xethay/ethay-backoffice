'use client';



import dynamic from 'next/dynamic';


const DashboardContent = dynamic(
  () => import('@/components/DashboardContent'),
  {
    ssr: false,
  }
);

export default function Dashboard() {


 

  return <DashboardContent />;
}
