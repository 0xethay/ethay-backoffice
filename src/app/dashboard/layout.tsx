'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/providers/web3-provider';
import { BiHomeAlt, BiLogOut, BiPlus } from 'react-icons/bi';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, disconnectWallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      localStorage.setItem('lastPath', window.location.pathname);
      router.push('/login');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const navigationItems = [
    { name: 'Dashboard', icon: BiHomeAlt, href: '/dashboard/seller' },
    { name: 'Create', icon: BiPlus, href: '/dashboard/create' },
    { name: 'Products', icon: BiPlus, href: '/dashboard/my-product' },
    { name: 'Orders', icon: BiPlus, href: '/dashboard/order' },
  ];

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex'>
      {/* Sidebar */}
      <div className='fixed inset-y-0 left-0 w-64 bg-[#3e307b] shadow-lg'>
        <div className='flex flex-col h-full'>
          {/* Logo */}
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <h1 className='text-xl font-bold text-white'>Seller Portal</h1>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-4 space-y-1'>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='flex items-center gap-3 px-4 py-3 text-white rounded-lg hover:bg-[#2e2560] transition-colors duration-200 ease-in-out'
                aria-label={item.name}
              >
                <item.icon className='w-5 h-5' aria-hidden='true' />
                <span className='font-medium'>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
            <button
              onClick={() => {
                disconnectWallet();
                router.push('/login');
              }}
              className='flex items-center gap-3 px-4 py-3 w-full text-white rounded-lg hover:bg-[#2e2560]'
              aria-label='Logout'
            >
              <BiLogOut className='w-5 h-5' aria-hidden='true' />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1'>
        <div className='max-w-7xl mx-auto px-1800 py-8'>{children}</div>
      </div>
    </div>
  );
}
