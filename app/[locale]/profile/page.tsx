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

  const [{ data: profile }, { data: evaluation }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('evaluation_forms').select('*').eq('user_id', user.id).single(),
  ]);

  // Try email-based waitlist match first
  let waitlistEntry = null;
  if (user.email) {
    const { data } = await supabase
      .from('waitlist')
      .select('id, booking_confirmed, email, phone')
      .eq('email', user.email)
      .single();
    waitlistEntry = data;
  }

  // If no email match and profile has phone, try phone-based match
  if (!waitlistEntry && profile?.phone) {
    const { data } = await supabase
      .from('waitlist')
      .select('id, booking_confirmed, email, phone')
      .eq('phone', profile.phone)
      .single();

    if (data) {
      // Backfill email on the phone-only waitlist entry
      if (!data.email && user.email) {
        await supabase
          .from('waitlist')
          .update({ email: user.email })
          .eq('id', data.id);
      }
      waitlistEntry = data;
    }
  }

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
    <ProfileForm
      profile={profile}
      email={user.email ?? ''}
      waitlistStatus={waitlistStatus}
      phoneRequired={!profile?.phone}
    >
      <EvaluationSummary evaluation={evaluation} />
    </ProfileForm>
  );
}
