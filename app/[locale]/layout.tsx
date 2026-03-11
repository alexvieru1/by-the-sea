import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Geist, Playfair_Display, Quicksand } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/header';
import { AuthProvider } from '@/components/providers/auth-provider';
import { TransitionProvider } from '@/components/layout/transition-provider';
import '../globals.css';

const PageLoader = dynamic(() => import('@/components/layout/page-loader'));
const PageTransition = dynamic(() => import('@/components/layout/page-transition'));

const FooterSection = dynamic(() => import('@/components/sections/footer-section'));

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic', 'normal'],
});

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Vraja Marii by the Sea',
  description: 'Bio-hacking complex website',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as 'ro' | 'en')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Provide all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${playfair.variable} ${quicksand.variable} antialiased`}
      >
        <PageLoader />
        <NextIntlClientProvider messages={messages}>
          <TransitionProvider>
            <PageTransition />
            <AuthProvider>
              <Header />
            </AuthProvider>
            <main>
              {children}
              <FooterSection />
            </main>
          </TransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
