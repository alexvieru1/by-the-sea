import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { yesNoFields } from '@/lib/schemas/evaluation-form-schema';
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
    supabase.from('evaluation_forms').select('*').eq('user_id', user.id).single(),
  ]);

  const defaultValues: Record<string, unknown> = {};

  if (existing) {
    // Convert DB booleans back to 'yes'/'no' for the form
    for (const [key, value] of Object.entries(existing)) {
      if (yesNoFields.includes(key as (typeof yesNoFields)[number])) {
        defaultValues[key] = value ? 'yes' : 'no';
      } else {
        defaultValues[key] = value;
      }
    }
  } else if (profile) {
    if (profile.first_name) defaultValues.first_name = profile.first_name;
    if (profile.last_name) defaultValues.last_name = profile.last_name;
  }

  return <EvaluationPageClient defaultValues={defaultValues} />;
}
