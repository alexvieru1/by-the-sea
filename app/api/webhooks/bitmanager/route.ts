import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import BookingConfirmedEmail from '@/lib/emails/booking-confirmed';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Validate API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.BITMANAGER_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate body
  let body: { email: string; confirmed: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.email || typeof body.confirmed !== 'boolean') {
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
    return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
  }

  // Update booking_confirmed
  const { error: updateError } = await supabase
    .from('waitlist')
    .update({ booking_confirmed: body.confirmed })
    .eq('id', entry.id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }

  // Send confirmation email if confirmed
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
