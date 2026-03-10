import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ConsultationClient from './consultation-client';

export default async function ConsultationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check for confirmed telemedicine booking
  const { data: booking } = await supabase
    .from('telemedicine_bookings')
    .select('id, doctor_name, scheduled_at, status, room_name')
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'scheduled'])
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .single();

  if (!booking) {
    redirect('/profile');
  }

  return <ConsultationClient booking={booking} />;
}
