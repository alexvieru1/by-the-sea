import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Geist, Quicksand } from 'next/font/google';
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
const CookieConsent = dynamic(() => import('@/components/cookie-consent'));

const FooterSection = dynamic(() => import('@/components/sections/footer-section'));

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const quicksand = Quicksand({
  variable: '--font-quicksand',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Vraja Mării by the Sea',
    default: 'Vraja Mării by the Sea',
  },
  description: 'Complex de recuperare medicală și wellness dedicat optimizării sănătății și bunăstării tale.',
  metadataBase: new URL('https://complexvrajamarii.ro'),
  openGraph: {
    siteName: 'Vraja Mării by the Sea',
    type: 'website',
  },
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
        className={`${geistSans.variable} ${quicksand.variable} antialiased`}
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
            <CookieConsent />
          </TransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
