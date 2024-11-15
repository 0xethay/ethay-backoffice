"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useWallet } from '@/providers/web3-provider';
import { BiWallet, BiLogIn } from 'react-icons/bi';

export default function Login() {
  const router = useRouter();
  const { connectWallet, disconnectWallet, isConnected, address } = useWallet();
  const [isNavigating, setIsNavigating] = useState(false);

  const goToSellerDashboard = () => {
    setIsNavigating(true);
    router.push('/dashboard/seller');
  };

  useEffect(() => {
    if (isConnected && !isNavigating) {
      const lastPath = localStorage.getItem('lastPath');
      if (lastPath) {
        router.push(lastPath);
        localStorage.removeItem('lastPath');
      }
    }
  }, [isConnected, isNavigating, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-2">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js Logo"
              width={120}
              height={25}
              priority
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white text-center">
              Welcome to Seller Portal
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Connect your wallet to continue
            </p>
          </div>

          {/* Wallet Connection Section */}
          <div className="space-y-4">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                <BiWallet className="w-5 h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-4">
                {/* Connected Wallet Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                        <BiWallet className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Connected Wallet
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                {/* Enter Dashboard Button */}
                <button
                  onClick={goToSellerDashboard}
                  disabled={isNavigating}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  <BiLogIn className="w-5 h-5" />
                  {isNavigating ? 'Redirecting...' : 'Enter Dashboard'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
} 