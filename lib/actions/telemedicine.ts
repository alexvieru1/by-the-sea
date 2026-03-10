'use server';

import { createClient } from '@/lib/supabase/server';
import { generateJaaSToken } from '@/lib/jaas/generate-token';

export async function getTelemedicineToken(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'unauthorized' };
  }

  // Fetch booking (RLS ensures user can only access their own)
  const { data: booking } = await supabase
    .from('telemedicine_bookings')
    .select('id, room_name, doctor_name, scheduled_at, status, user_id')
    .eq('id', bookingId)
    .single();

  if (!booking) {
    return { error: 'not_found' };
  }

  if (booking.status !== 'confirmed') {
    return { error: 'not_confirmed' };
  }

  // Check time window: 30 min before scheduled_at until 2 hours after
  const scheduledAt = new Date(booking.scheduled_at).getTime();
  const now = Date.now();
  const thirtyMinBefore = scheduledAt - 30 * 60 * 1000;
  const twoHoursAfter = scheduledAt + 2 * 60 * 60 * 1000;

  if (now < thirtyMinBefore || now > twoHoursAfter) {
    return { error: 'outside_window' };
  }

  // Fetch patient profile for display name
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const displayName = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Patient'
    : 'Patient';

  const token = generateJaaSToken({
    roomName: booking.room_name,
    userName: displayName,
    userEmail: user.email ?? '',
    userId: user.id,
    isModerator: false,
  });

  return {
    token,
    roomName: booking.room_name,
    doctorName: booking.doctor_name,
    appId: process.env.JAAS_APP_ID!,
  };
}
