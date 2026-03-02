'use server';

import { createClient } from '@/lib/supabase/server';
import { ROMANIAN_PHONE_REGEX } from '@/lib/validation/phone';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const phone = formData.get('phone') as string;

  // Server-side phone validation
  if (phone && !ROMANIAN_PHONE_REGEX.test(phone)) {
    return { error: 'invalid_phone' };
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: phone || null,
      county: formData.get('county') as string,
      city: formData.get('city') as string,
      is_community_member: formData.get('is_community_member') === 'true',
    });

  if (error) {
    return { error: error.message };
  }

  // After successful upsert, backfill email on phone-only waitlist entries
  if (phone && user.email) {
    await supabase
      .from('waitlist')
      .update({ email: user.email })
      .eq('phone', phone)
      .is('email', null);
  }

  return { success: true };
}
