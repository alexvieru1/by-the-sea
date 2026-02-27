import { createClient } from '@/lib/supabase/server';
import SuccessPageClient from './success-page-client';

export default async function WaitlistSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasEvaluation = false;

  if (user) {
    const { data: evaluation } = await supabase
      .from('evaluation_forms')
      .select('id')
      .eq('user_id', user.id)
      .single();

    hasEvaluation = !!evaluation;
  }

  return (
    <SuccessPageClient
      isLoggedIn={!!user}
      hasEvaluation={hasEvaluation}
    />
  );
}
