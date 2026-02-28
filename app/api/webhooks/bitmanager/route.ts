import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import BookingConfirmedEmail from '@/lib/emails/booking-confirmed';

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

export async function POST(request: NextRequest) {
  // Validate API key (timing-safe comparison)
  const apiKey = request.headers.get('x-api-key');
  if (!isValidApiKey(apiKey, process.env.BITMANAGER_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { supabase, resend } = getClients();

  // Parse and validate body
  let body: { email: string; confirmed: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.email || typeof body.email !== 'string' || typeof body.confirmed !== 'boolean') {
    return NextResponse.json(
      { error: 'Missing required fields: email (string), confirmed (boolean)' },
      { status: 400 }
    );
  }

  // Find waitlist entry
  const { data: entry, error: findError } = await supabase
    .from('waitlist')
    .select('id, first_name, email')
    .eq('email', body.email)
    .single();

  if (findError || !entry) {
    if (findError) console.error('Supabase lookup error:', findError);
    return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
  }

  // Update booking_confirmed
  const { error: updateError } = await supabase
    .from('waitlist')
    .update({ booking_confirmed: body.confirmed })
    .eq('id', entry.id);

  if (updateError) {
    console.error('Supabase update error:', updateError);
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }

  // Send confirmation email if confirmed
  // TODO: Store user's preferred locale in waitlist/profiles table to send locale-aware emails
  if (body.confirmed) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vrajamarii.ro';
    const evaluationUrl = `${baseUrl}/evaluation`;

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Vraja Marii <noreply@vrajamarii.ro>',
        to: entry.email,
        subject: 'Rezervarea ta a fost confirmata',
        react: BookingConfirmedEmail({
          firstName: entry.first_name || 'Vizitator',
          locale: 'ro',
          evaluationUrl,
        }),
      });
    } catch (emailError) {
      // Log but don't fail the webhook — booking is already confirmed
      console.error('Failed to send confirmation email:', emailError);
    }
  }

  return NextResponse.json({ success: true });
}
