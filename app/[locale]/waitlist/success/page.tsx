import { createClient } from '@/lib/supabase/server';
import SuccessPageClient from './success-page-client';

export default async function WaitlistSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasEvaluation = false;
  let isOnOwnWaitlist = false;

  if (user) {
    const [{ data: evaluation }, { data: waitlistEntry }] = await Promise.all([
      supabase.from('evaluation_forms').select('id').eq('user_id', user.id).single(),
      supabase.from('waitlist').select('id').eq('email', user.email!).single(),
    ]);

    hasEvaluation = !!evaluation;
    isOnOwnWaitlist = !!waitlistEntry;
  }

  return (
    <SuccessPageClient
      isLoggedIn={!!user}
      isOnOwnWaitlist={isOnOwnWaitlist}
      hasEvaluation={hasEvaluation}
    />
  );
}
