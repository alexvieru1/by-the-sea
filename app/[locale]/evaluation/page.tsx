import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import EvaluationPageClient from './evaluation-page-client';

export default async function EvaluationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: existing }] = await Promise.all([
    supabase.from('profiles').select('first_name, last_name, phone').eq('id', user.id).single(),
    supabase.from('evaluation_forms').select('id').eq('user_id', user.id).single(),
  ]);

  // Already completed — redirect to profile (read-only)
  if (existing) {
    redirect('/profile');
  }

  // Gate: require phone on profile
  if (!profile?.phone) {
    redirect('/profile?completePhone=1');
  }

  // Try email-based waitlist match first
  let waitlistEntry = null;
  if (user.email) {
    const { data } = await supabase
      .from('waitlist')
      .select('id, email')
      .eq('email', user.email)
      .eq('booking_confirmed', true)
      .single();
    waitlistEntry = data;
  }

  // If no email match, try phone-based match
  if (!waitlistEntry && profile.phone) {
    const { data } = await supabase
      .from('waitlist')
      .select('id, email')
      .eq('phone', profile.phone)
      .eq('booking_confirmed', true)
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

  // Not on waitlist or not confirmed — redirect to booking page
  if (!waitlistEntry) {
    redirect('/book');
  }

  const defaultValues: Record<string, unknown> = {};

  if (profile) {
    if (profile.first_name) defaultValues.first_name = profile.first_name;
    if (profile.last_name) defaultValues.last_name = profile.last_name;
  }

  return <EvaluationPageClient defaultValues={defaultValues} />;
}
