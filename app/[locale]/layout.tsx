import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Geist, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/header';
import PageLoader from '@/components/layout/page-loader';
import { TransitionProvider } from '@/components/layout/transition-provider';
import PageTransition from '@/components/layout/page-transition';
import { AuthProvider } from '@/components/providers/auth-provider';
import '../globals.css';

const FooterSection = dynamic(() => import('@/components/sections/footer-section'));

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Vraja Marii by the Sea',
  description: 'Bio-hacking complex website',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'ro' | 'en')) {
    notFound();
  }

  // Provide all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${playfair.variable} antialiased`}
      >
        <PageLoader />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <TransitionProvider>
              <PageTransition />
              <Header />
              <main>
                {children}
                <FooterSection />
              </main>
            </TransitionProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
