import { createClient } from '@/lib/supabase/server';
import SuccessPageClient from './success-page-client';

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function WaitlistSuccessPage({ searchParams }: Props) {
  const supabase = await createClient();
  const [{ data: { user } }, params] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
  ]);

  return <SuccessPageClient isLoggedIn={!!user} email={params.email} />;
}
