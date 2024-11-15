import { Web3Provider } from '@/providers/web3-provider';
import './globals.css';
import localFont from 'next/font/local';

const druk = localFont({
  src: [
    {
      path: './fonts/DrukWide-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/DrukWide-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-druk',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='light'>
      <body
        className={`${druk.variable} font-body bg-prime-black text-text-primary`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
