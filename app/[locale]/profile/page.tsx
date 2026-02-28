import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './profile-form';
import EvaluationSummary from './evaluation-summary';

export type WaitlistStatus = 'none' | 'pending' | 'confirmed' | 'evaluated';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: evaluation }, { data: waitlistEntry }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('evaluation_forms').select('*').eq('user_id', user.id).single(),
    supabase.from('waitlist').select('id, booking_confirmed').eq('email', user.email!).single(),
  ]);

  let waitlistStatus: WaitlistStatus = 'none';
  if (waitlistEntry) {
    if (evaluation) {
      waitlistStatus = 'evaluated';
    } else if (waitlistEntry.booking_confirmed) {
      waitlistStatus = 'confirmed';
    } else {
      waitlistStatus = 'pending';
    }
  }

  return (
    <ProfileForm profile={profile} email={user.email ?? ''} waitlistStatus={waitlistStatus}>
      <EvaluationSummary evaluation={evaluation} />
    </ProfileForm>
  );
}
