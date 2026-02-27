'use server';

import { createClient } from '@/lib/supabase/server';

interface WaitlistData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ageInterval: string;
  preferredMonth: string;
  selectedOffers: string[];
  gdprConsent: true;
}

export async function submitWaitlist(data: WaitlistData) {
  const supabase = await createClient();

  // Check if email already on waitlist
  const { data: existing } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', data.email)
    .single();

  if (existing) {
    return { error: 'already_registered' };
  }

  const { error } = await supabase.from('waitlist').insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone || null,
    age_interval: data.ageInterval,
    preferred_month: data.preferredMonth,
    selected_offers: data.selectedOffers,
    gdpr_consent: data.gdprConsent,
  });

  if (error) {
    return { error: 'generic' };
  }

  return { success: true };
}
