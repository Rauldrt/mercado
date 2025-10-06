
import type { Metadata } from 'next';
import './globals.css';
import './sticky.css';
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
  icons: {
    apple: "/icons/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${oswald.variable}`}>
       <head>
        <meta name="application-name" content="App de Preventa" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="App de Preventa" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
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
