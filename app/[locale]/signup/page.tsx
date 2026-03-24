import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import SignupForm from './signup-form';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'signup' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
