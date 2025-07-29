
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileFabMenu from '@/components/layout/mobile-fab-menu';
import '@/lib/firebase'; // Ensure Firebase is initialized

export const metadata: Metadata = {
  title: 'Ndera-Store',
  description: 'Tu vidriera digital para potenciar el comercio local.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
