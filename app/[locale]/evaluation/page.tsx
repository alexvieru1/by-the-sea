import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EvaluationPageClient from './evaluation-page-client';

export default async function EvaluationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: existing }] = await Promise.all([
    supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single(),
    supabase.from('evaluation_forms').select('id').eq('user_id', user.id).single(),
  ]);

  // Already completed — redirect to profile (read-only)
  if (existing) {
    redirect('/profile');
  }

  const defaultValues: Record<string, unknown> = {};

  if (profile) {
    if (profile.first_name) defaultValues.first_name = profile.first_name;
    if (profile.last_name) defaultValues.last_name = profile.last_name;
  }

  return <EvaluationPageClient defaultValues={defaultValues} />;
}
