import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ProfileForm from './profile-form';
import EvaluationSummary from './evaluation-summary';

export type WaitlistStatus = 'none' | 'pending' | 'confirmed' | 'evaluated';

export interface TelemedicineBooking {
  id: string;
  doctor_name: string;
  scheduled_at: string;
  status: 'scheduled' | 'confirmed' | 'completed';
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: evaluation }, { data: telemedicineBooking }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('evaluation_forms').select('*').eq('user_id', user.id).single(),
    supabase
      .from('telemedicine_bookings')
      .select('id, doctor_name, scheduled_at, status')
      .eq('user_id', user.id)
      .in('status', ['scheduled', 'confirmed', 'completed'])
      .order('scheduled_at', { ascending: false })
      .limit(1)
      .single(),
  ]);

  // Check profile.booking_confirmed first (source of truth)
  if (profile?.booking_confirmed) {
    const waitlistStatus: WaitlistStatus = evaluation ? 'evaluated' : 'confirmed';
    return (
      <ProfileForm
        profile={profile}
        email={user.email ?? ''}
        waitlistStatus={waitlistStatus}
        phoneRequired={!profile?.phone}
        telemedicineBooking={telemedicineBooking}
      >
        <EvaluationSummary evaluation={evaluation} />
      </ProfileForm>
    );
  }

  // Fallback: check waitlist for backwards compatibility
  let waitlistEntry = null;
  if (user.email) {
    const { data } = await supabase
      .from('waitlist')
      .select('id, booking_confirmed, email, phone')
      .eq('email', user.email)
      .single();
    waitlistEntry = data;
  }

  if (!waitlistEntry && profile?.phone) {
    const { data } = await supabase
      .from('waitlist')
      .select('id, booking_confirmed, email, phone')
      .eq('phone', profile.phone)
      .single();

    if (data) {
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

      // Lazy-sync: waitlist says confirmed but profile doesn't — update profile
      if (profile) {
        await supabase
          .from('profiles')
          .update({ booking_confirmed: true })
          .eq('id', user.id);
      }
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
      telemedicineBooking={telemedicineBooking}
    >
      <EvaluationSummary evaluation={evaluation} />
    </ProfileForm>
  );
}
