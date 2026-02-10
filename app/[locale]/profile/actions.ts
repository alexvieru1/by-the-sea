'use server';

import { createClient } from '@/lib/supabase/server';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
      county: formData.get('county') as string,
      city: formData.get('city') as string,
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
