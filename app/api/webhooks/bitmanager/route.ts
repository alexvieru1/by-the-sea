import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import BookingConfirmedEmail from '@/lib/emails/booking-confirmed';

const PHONE_REGEX = /^07\d{8}$/;

async function syncProfileBookingConfirmed(
  supabase: SupabaseClient,
  { email, phone }: { email?: string; phone?: string }
) {
  if (email) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    if (data) {
      await supabase
        .from('profiles')
        .update({ booking_confirmed: true })
        .eq('id', data.id);
      return;
    }
  }
  if (phone) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone)
      .single();
    if (data) {
      await supabase
        .from('profiles')
        .update({ booking_confirmed: true })
        .eq('id', data.id);
    }
  }
}

function isValidApiKey(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

function getClients() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
    throw new Error(
      'Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY'
    );
  }

  return {
    supabase: createClient(supabaseUrl, supabaseServiceKey),
    resend: new Resend(resendApiKey),
  };
}

interface WebhookBody {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  confirmed: boolean;
}

async function sendConfirmationEmail(resend: Resend, email: string, firstName: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vrajamarii.ro';
  const evaluationUrl = `${baseUrl}/evaluation`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Vraja Marii <noreply@vrajamarii.ro>',
      to: email,
      subject: 'Rezervarea ta a fost confirmata',
      react: BookingConfirmedEmail({
        firstName: firstName || 'Vizitator',
        locale: 'ro',
        evaluationUrl,
      }),
    });
  } catch (emailError) {
    // Log but don't fail the webhook — booking is already confirmed
    console.error('Failed to send confirmation email:', emailError);
  }
}

export async function POST(request: NextRequest) {
  // Validate API key (timing-safe comparison)
  const apiKey = request.headers.get('x-api-key');
  if (!isValidApiKey(apiKey, process.env.BITMANAGER_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { supabase, resend } = getClients();

  // Parse and validate body
  let body: WebhookBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body.confirmed !== 'boolean') {
    return NextResponse.json(
      { error: 'Missing required field: confirmed (boolean)' },
      { status: 400 }
    );
  }

  if (!body.email && !body.phone) {
    return NextResponse.json(
      { error: 'At least one of email or phone is required' },
      { status: 400 }
    );
  }

  // Validate phone format if provided
  if (body.phone && !PHONE_REGEX.test(body.phone)) {
    return NextResponse.json(
      { error: 'Invalid phone format. Expected 07XXXXXXXX' },
      { status: 400 }
    );
  }

  // === Email-based flow (unchanged behavior) ===
  if (body.email) {
    const { data: entry, error: findError } = await supabase
      .from('waitlist')
      .select('id, first_name, email')
      .eq('email', body.email)
      .single();

    if (entry) {
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({ booking_confirmed: body.confirmed })
        .eq('id', entry.id);

      if (updateError) {
        console.error('Supabase update error:', updateError);
        return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
      }

      if (body.confirmed) {
        await sendConfirmationEmail(resend, entry.email, entry.first_name);
        await syncProfileBookingConfirmed(supabase, { email: body.email, phone: body.phone });
      }

      return NextResponse.json({ success: true });
    }

    if (findError) {
      console.error('Supabase lookup error:', findError);
    }

    // Email not found — fall through to phone if provided
    if (!body.phone) {
      return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
    }
  }

  // === Phone-based flow ===
  const { data: phoneEntry, error: phoneFindError } = await supabase
    .from('waitlist')
    .select('id, first_name, email, phone')
    .eq('phone', body.phone!)
    .single();

  if (phoneEntry) {
    // Update booking status + optionally update name
    const updateData: Record<string, unknown> = { booking_confirmed: body.confirmed };
    if (body.first_name) updateData.first_name = body.first_name;
    if (body.last_name) updateData.last_name = body.last_name;

    const { error: updateError } = await supabase
      .from('waitlist')
      .update(updateData)
      .eq('id', phoneEntry.id);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
    }

    // If entry has email, send confirmation email
    if (body.confirmed && phoneEntry.email) {
      await sendConfirmationEmail(resend, phoneEntry.email, phoneEntry.first_name);
    }

    if (body.confirmed) {
      await syncProfileBookingConfirmed(supabase, { email: phoneEntry.email, phone: body.phone });
    }

    return NextResponse.json({ success: true });
  }

  if (phoneFindError) {
    console.error('Supabase phone lookup error:', phoneFindError);
  }

  // No entry found by phone — create new phone-only entry
  if (!body.first_name || !body.last_name) {
    return NextResponse.json(
      { error: 'first_name and last_name are required when creating a new phone-only entry' },
      { status: 400 }
    );
  }

  const { error: insertError } = await supabase.from('waitlist').insert({
    first_name: body.first_name,
    last_name: body.last_name,
    phone: body.phone,
    email: null,
    booking_confirmed: body.confirmed,
    preferred_month: '',
    gdpr_consent: false,
  });

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    return NextResponse.json({ error: 'Failed to create waitlist entry' }, { status: 500 });
  }

  return NextResponse.json({ success: true, created: true });
}
