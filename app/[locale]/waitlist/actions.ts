'use server';

import { createClient } from '@/lib/supabase/server';
import { ROMANIAN_PHONE_REGEX } from '@/lib/validation/phone';

interface WaitlistData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredMonth: string;
  selectedOffers: string[];
  gdprConsent: true;
}

export async function submitWaitlist(data: WaitlistData) {
  const supabase = await createClient();

  // Server-side phone validation
  if (!ROMANIAN_PHONE_REGEX.test(data.phone)) {
    return { error: 'invalid_phone' };
  }

  // Check if email already on waitlist
  const { data: existingByEmail } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', data.email)
    .single();

  if (existingByEmail) {
    return { error: 'already_registered' };
  }

  // Check if phone already on waitlist
  const { data: existingByPhone } = await supabase
    .from('waitlist')
    .select('id, email')
    .eq('phone', data.phone)
    .single();

  if (existingByPhone) {
    if (existingByPhone.email === null) {
      // Phone-only entry (from reception) — merge by backfilling email + fields
      const { error: mergeError } = await supabase
        .from('waitlist')
        .update({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          preferred_month: data.preferredMonth,
          selected_offers: data.selectedOffers,
          gdpr_consent: data.gdprConsent,
        })
        .eq('id', existingByPhone.id);

      if (mergeError) {
        return { error: 'generic' };
      }

      return { success: true };
    }

    // Phone exists with a different email
    return { error: 'phone_already_registered' };
  }

  // Insert new entry
  const { error } = await supabase.from('waitlist').insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    preferred_month: data.preferredMonth,
    selected_offers: data.selectedOffers,
    gdpr_consent: data.gdprConsent,
  });

  if (error) {
    return { error: 'generic' };
  }

  return { success: true };
}
