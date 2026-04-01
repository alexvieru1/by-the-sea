import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo';
import LoginForm from './login-form';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.login' });
  return { title: t('title'), description: t('description'), alternates: getAlternates('/login') };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginForm />;
}
