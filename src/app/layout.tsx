import { Web3Provider } from '@/providers/web3-provider';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="min-h-screen bg-background">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

