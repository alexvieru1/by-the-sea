import { createClient } from '@/lib/supabase/server';
import { setRequestLocale } from 'next-intl/server';
import SuccessPageClient from './success-page-client';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>;
}

export default async function WaitlistSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const [{ data: { user } }, resolvedSearchParams] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
  ]);

  return (
    <SuccessPageClient
      isLoggedIn={!!user}
      email={resolvedSearchParams.email}
      firstName={resolvedSearchParams.firstName}
      lastName={resolvedSearchParams.lastName}
      phone={resolvedSearchParams.phone}
    />
  );
}
