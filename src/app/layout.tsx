
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileFabMenu from '@/components/layout/mobile-fab-menu';
import '@/lib/firebase'; // Ensure Firebase is initialized
import { Inter, Oswald } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const oswald = Oswald({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-oswald' });

export const metadata: Metadata = {
  title: 'App de Preventa',
  description: 'Herramienta de ventas para preventistas.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${oswald.variable}`}>
      <body className="font-body antialiased">
        <Providers>
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileFabMenu />
            </div>
        </Providers>
      </body>
    </html>
  );
}
