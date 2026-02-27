'use server';

import { createClient } from '@/lib/supabase/server';

interface WaitlistData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  selectedOffers: string[];
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
    selected_offers: data.selectedOffers,
  });

  if (error) {
    return { error: 'generic' };
  }

  return { success: true };
}
