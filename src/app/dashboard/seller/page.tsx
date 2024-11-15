'use client';
import { useWallet } from '@/providers/web3-provider';
import { BiWallet, BiPackage, BiMoney, BiHistory } from 'react-icons/bi';

export default function SellerDashboard() {
  const { address } = useWallet();

  return (
    <div className='space-y-8'>
      {/* Header Section */}
      <div className='flex justify-between items-center bg-[#3e307b] p-6 rounded-lg shadow'>
        <div>
          <h1 className='text-3xl font-bold text-white'>Seller Dashboard</h1>
          <p className='text-white mt-1'>Welcome back, seller!</p>
        </div>
        <div className='flex items-center gap-2 bg-[#3e307b] px-4 py-2 rounded-full'>
          <BiWallet className='text-white' />
          <span className='text-sm font-medium text-white'>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <StatsCard
          title='Total Sales'
          value='0 ETH'
          icon={<BiMoney className='w-6 h-6 text-white' />}
          trend='+0% from last month'
        />
        <StatsCard
          title='Active Listings'
          value='0'
          icon={<BiPackage className='w-6 h-6 text-white' />}
          trend='No change'
        />
        <StatsCard
          title='Total Earnings'
          value='0 ETH'
          icon={<BiHistory className='w-6 h-6 text-white' />}
          trend='+0% all time'
        />
      </div>

      {/* Recent Activity Section */}
      <div className='bg-[#3e307b] rounded-lg shadow'>
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-xl font-semibold text-white'>Recent Activity</h2>
        </div>
        <div className='p-6'>
          <div className='text-center text-white py-8'>
            No recent activity to display
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className='bg-[#3e307b] p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full'>
            {icon}
          </div>
          <div>
            <h3 className='text-sm font-medium text-white'>{title}</h3>
            <p className='mt-1 text-2xl font-semibold text-white'>{value}</p>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <p className='text-sm text-white'>{trend}</p>
      </div>
    </div>
  );
}
