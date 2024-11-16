import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-16 pb-24">
          <div className="text-center">
            <Image
              src="/ethay-logo.png"
              alt="Ethay Logo"
              width={200}
              height={80}
              priority
              className="mx-auto mb-8"
            />
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Super Extension</span>
              <span className="block text-indigo-600 dark:text-indigo-400">for Decentralized</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-white dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Buy and sell products securely using cryptocurrency. Join the future of e-commerce with ETHAY.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex gap-4 justify-center">
              {/* <a
                href="/login"
                className="rounded-full bg-indigo-600 px-8 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </a> */}
              <a
                href="/login"
                className="rounded-full bg-white px-8 py-3 text-indigo-600 font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Get Started
                </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {/* <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-indigo-600 dark:text-indigo-400 text-2xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Secure Transactions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Experience worry-free trading with military-grade encryption and immutable blockchain records. Every transaction is verified and protected by smart contracts.
              </p>
            </div> */}
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-indigo-600 dark:text-indigo-400 text-2xl mb-4">💎</div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Crypto Payments</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Trade seamlessly with ETH and popular ERC-20 tokens. Instant settlements, low fees, and no traditional banking delays.
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-indigo-600 dark:text-indigo-400 text-2xl mb-4">🌐</div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Global Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Join a borderless community of buyers and sellers. Trade 24/7 with verified users from around the world, all powered by blockchain technology.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              About
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              Terms
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              Privacy
            </a>
          </div>
        </footer> */}
      </div>
    </div>
  );
}
