'use server';

import { createClient } from '@/lib/supabase/server';
import { ROMANIAN_PHONE_REGEX } from '@/lib/validation/phone';
import { POLICY_VERSIONS } from '@/lib/constants/policy-versions';

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

  const isCommunityMember = formData.get('is_community_member') === 'true';
  const wasCommunityMember = formData.get('was_community_member') === 'true';

  const updateData: Record<string, unknown> = {
    id: user.id,
    email: user.email,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    phone: phone || null,
    county: formData.get('county') as string,
    city: formData.get('city') as string,
    is_community_member: isCommunityMember,
  };

  // Track when marketing consent is given (toggled from off to on)
  if (isCommunityMember && !wasCommunityMember) {
    updateData.marketing_consent_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(updateData);

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

export async function revokeGdprConsent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ gdpr_consent: false })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  await supabase.from('consent_history').insert({
    user_id: user.id,
    consent_type: 'gdpr',
    policy_version: POLICY_VERSIONS.gdpr,
    action: 'revoked',
  });

  return { success: true };
}

export async function acceptConsents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      gdpr_consent: true,
      gdpr_consent_at: now,
      gdpr_policy_version: POLICY_VERSIONS.gdpr,
      terms_accepted: true,
      terms_accepted_at: now,
      terms_version: POLICY_VERSIONS.terms,
    });

  if (error) {
    return { error: error.message };
  }

  await supabase.from('consent_history').insert([
    {
      user_id: user.id,
      consent_type: 'gdpr',
      policy_version: POLICY_VERSIONS.gdpr,
      action: 'accepted',
    },
    {
      user_id: user.id,
      consent_type: 'terms',
      policy_version: POLICY_VERSIONS.terms,
      action: 'accepted',
    },
  ]);

  return { success: true };
}
