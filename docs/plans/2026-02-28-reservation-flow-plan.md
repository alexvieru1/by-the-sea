# Reservation Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix critical routing/redirect bugs, add waitlist status to the profile page, and build a BitManager webhook + email notification system for booking confirmations.

**Architecture:** Phased approach — Phase 1 fixes routing and email enforcement, Phase 2 adds profile waitlist status UI, Phase 3 adds BitManager webhook endpoint with Resend email notifications. Each phase is independently deployable.

**Tech Stack:** Next.js 16 (proxy.ts), next-intl 4.8, Supabase, Resend, @react-email/components

---

## Phase 1: Critical Bug Fixes

### Task 1: Add `proxy.ts` for locale routing

**Files:**
- Create: `proxy.ts` (project root)

**Step 1: Create proxy.ts**

Create `proxy.ts` at the project root. This combines next-intl locale routing with Supabase session refresh (already implemented in `lib/supabase/proxy.ts`).

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/proxy';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Refresh Supabase session first
  const { supabaseResponse } = await updateSession(request);

  // Run next-intl locale routing
  const intlResponse = intlMiddleware(request);

  // Merge Supabase cookies into the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: '/((?!api|trpc|auth|_next|_vercel|.*\\..*).*)',
};
```

Note: The matcher excludes `api`, `trpc`, `auth` (for `/auth/callback`), `_next`, `_vercel`, and static files (anything with a dot like `.css`, `.js`, `.png`).

**Step 2: Verify locale routing works**

Run: `pnpm dev`

Test these URLs manually:
- `/` → should render the Romanian homepage (no redirect)
- `/en` → should render the English homepage
- `/evaluation` → should route to Romanian evaluation page (redirects based on auth/booking)
- `/en/evaluation` → should route to English evaluation page

**Step 3: Commit**

```bash
git add proxy.ts
git commit -m "add proxy.ts for next-intl locale routing + Supabase session refresh"
```

---

### Task 2: Fix broken `/waitlist` redirect

**Files:**
- Modify: `app/[locale]/evaluation/page.tsx:23`

**Step 1: Change redirect target**

In `app/[locale]/evaluation/page.tsx`, line 23, change:
```typescript
redirect('/waitlist');
```
to:
```typescript
redirect('/book');
```

This redirects unconfirmed users to the booking page (which contains the waitlist form) instead of a non-existent `/waitlist` page.

**Step 2: Verify**

Run: `pnpm dev`

Log in as a user without a confirmed booking, navigate to `/evaluation`. Confirm it redirects to `/book`.

**Step 3: Commit**

```bash
git add app/[locale]/evaluation/page.tsx
git commit -m "fix: redirect unconfirmed users to /book instead of non-existent /waitlist"
```

---

### Task 3: Pass email from waitlist to signup

**Files:**
- Modify: `components/sections/waitlist-section.tsx:109`
- Modify: `app/[locale]/waitlist/success/success-page-client.tsx`
- Modify: `app/[locale]/waitlist/success/page.tsx`

**Step 1: Pass email via URL on waitlist submit**

In `components/sections/waitlist-section.tsx`, line 109, change:
```typescript
router.push('/waitlist/success');
```
to:
```typescript
router.push(`/waitlist/success?email=${encodeURIComponent(data.email)}`);
```

**Step 2: Read email in success page server component**

In `app/[locale]/waitlist/success/page.tsx`, update to accept and pass `searchParams`:

```typescript
import { createClient } from '@/lib/supabase/server';
import SuccessPageClient from './success-page-client';

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function WaitlistSuccessPage({ searchParams }: Props) {
  const supabase = await createClient();
  const [{ data: { user } }, params] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
  ]);

  return <SuccessPageClient isLoggedIn={!!user} email={params.email} />;
}
```

**Step 3: Pass email to signup link**

In `app/[locale]/waitlist/success/success-page-client.tsx`, update the interface and the signup link:

Add `email?: string` to the `SuccessPageClientProps` interface:
```typescript
interface SuccessPageClientProps {
  isLoggedIn: boolean;
  email?: string;
}
```

Update the component signature:
```typescript
export default function SuccessPageClient({ isLoggedIn, email }: SuccessPageClientProps) {
```

Update the "Create Account" link (around line 36) to include the email:
```typescript
<Link
  href={email ? `/signup?email=${encodeURIComponent(email)}` : '/signup'}
  className="flex items-center justify-center gap-3 w-full bg-[#6B5B4E] text-white px-8 py-4 text-sm font-semibold transition-colors hover:bg-[#5A4A3E]"
>
```

**Step 4: Commit**

```bash
git add components/sections/waitlist-section.tsx app/[locale]/waitlist/success/page.tsx app/[locale]/waitlist/success/success-page-client.tsx
git commit -m "feat: pass waitlist email to signup page via URL param"
```

---

### Task 4: Pre-fill and lock email on signup page

**Files:**
- Modify: `app/[locale]/signup/page.tsx`
- Modify: `messages/en.json`
- Modify: `messages/ro.json`

**Step 1: Add translations**

In `messages/en.json`, inside `auth.signup`, add:
```json
"emailLocked": "Use the same email you registered on the waitlist"
```

In `messages/ro.json`, inside `auth.signup`, add:
```json
"emailLocked": "Folosește același email cu care te-ai înscris pe lista de așteptare"
```

**Step 2: Read email param in signup page**

The signup page at `app/[locale]/signup/page.tsx` is a client component. Use `useSearchParams` from `next/navigation` to read the email query param.

Add import at top of file:
```typescript
import { useSearchParams } from 'next/navigation';
```

Inside the `SignupPage` component, add after the existing hooks:
```typescript
const searchParams = useSearchParams();
const lockedEmail = searchParams.get('email');
```

Update the `useForm` `defaultValues` to use the locked email:
```typescript
defaultValues: {
  firstName: '',
  lastName: '',
  email: lockedEmail ?? '',
  phone: '',
  county: '',
  city: '',
  password: '',
  confirmPassword: '',
  isCommunityMember: false,
},
```

**Step 3: Lock the email field when pre-filled**

Find the email input field (around line 268-277). Replace it with:

```typescript
<input
  id="signup-email"
  type="email"
  {...register('email')}
  readOnly={!!lockedEmail}
  className={`w-full border border-gray-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#0097a7] ${
    lockedEmail ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'
  }`}
/>
{lockedEmail && (
  <p className="mt-1 text-xs text-gray-500">{t('emailLocked')}</p>
)}
```

**Step 4: Verify**

Run: `pnpm dev`

- Navigate to `/signup` directly → email field should be editable as normal
- Navigate to `/signup?email=test@example.com` → email field should be pre-filled and read-only, with the helper text underneath

**Step 5: Commit**

```bash
git add app/[locale]/signup/page.tsx messages/en.json messages/ro.json
git commit -m "feat: pre-fill and lock email field on signup when coming from waitlist"
```

---

## Phase 2: Profile Waitlist Status

### Task 5: Add waitlist status translations

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ro.json`

**Step 1: Add translations**

In `messages/en.json`, inside the `auth.profile` object, add:
```json
"waitlistStatus": {
  "noneTitle": "Join Our Waitlist",
  "noneDescription": "Reserve your spot at Vraja Marii.",
  "noneAction": "Book a Stay",
  "pendingTitle": "Reservation Pending",
  "pendingDescription": "Your reservation is being processed. A member of our team will contact you soon to confirm your booking.",
  "confirmedTitle": "Booking Confirmed",
  "confirmedDescription": "Your booking has been confirmed! Please complete your initial evaluation form before your visit.",
  "confirmedAction": "Complete Evaluation",
  "evaluatedTitle": "All Set",
  "evaluatedDescription": "Your evaluation form has been submitted. We look forward to welcoming you."
}
```

In `messages/ro.json`, inside the `auth.profile` object, add:
```json
"waitlistStatus": {
  "noneTitle": "Inscrie-te pe Lista de Asteptare",
  "noneDescription": "Rezerva-ti locul la Vraja Marii.",
  "noneAction": "Rezerva un Sejur",
  "pendingTitle": "Rezervare in Asteptare",
  "pendingDescription": "Rezervarea ta este in curs de procesare. Un membru al echipei noastre te va contacta in curand pentru a confirma rezervarea.",
  "confirmedTitle": "Rezervare Confirmata",
  "confirmedDescription": "Rezervarea ta a fost confirmata! Te rugam sa completezi fisa de evaluare initiala inainte de vizita.",
  "confirmedAction": "Completeaza Evaluarea",
  "evaluatedTitle": "Totul este in Regula",
  "evaluatedDescription": "Fisa de evaluare a fost trimisa. Abia asteptam sa te primim."
}
```

**Step 2: Commit**

```bash
git add messages/en.json messages/ro.json
git commit -m "feat: add waitlist status translations (RO + EN)"
```

---

### Task 6: Update profile page to query full waitlist status

**Files:**
- Modify: `app/[locale]/profile/page.tsx`

**Step 1: Update the server component**

Replace the contents of `app/[locale]/profile/page.tsx` with:

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from './profile-form';
import EvaluationSummary from './evaluation-summary';

export type WaitlistStatus = 'none' | 'pending' | 'confirmed' | 'evaluated';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profile }, { data: evaluation }, { data: waitlistEntry }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('evaluation_forms').select('*').eq('user_id', user.id).single(),
    supabase.from('waitlist').select('id, booking_confirmed').eq('email', user.email!).single(),
  ]);

  let waitlistStatus: WaitlistStatus = 'none';
  if (waitlistEntry) {
    if (evaluation) {
      waitlistStatus = 'evaluated';
    } else if (waitlistEntry.booking_confirmed) {
      waitlistStatus = 'confirmed';
    } else {
      waitlistStatus = 'pending';
    }
  }

  return (
    <ProfileForm profile={profile} email={user.email ?? ''} waitlistStatus={waitlistStatus}>
      <EvaluationSummary evaluation={evaluation} />
    </ProfileForm>
  );
}
```

Key changes:
- Query waitlist **without** `booking_confirmed` filter: `.select('id, booking_confirmed')`
- Derive `waitlistStatus` from the combination of waitlist entry, booking_confirmed, and evaluation
- Pass `waitlistStatus` instead of `isBookingConfirmed`

**Step 2: Commit**

```bash
git add app/[locale]/profile/page.tsx
git commit -m "feat: query full waitlist status on profile page"
```

---

### Task 7: Create waitlist status banner component

**Files:**
- Create: `app/[locale]/profile/waitlist-status-banner.tsx`

**Step 1: Create the component**

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Link } from '@/i18n/routing';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import type { WaitlistStatus } from './page';

interface WaitlistStatusBannerProps {
  status: WaitlistStatus;
}

export default function WaitlistStatusBanner({ status }: WaitlistStatusBannerProps) {
  const t = useTranslations('auth.profile.waitlistStatus');

  if (status === 'evaluated') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-green-200 bg-green-50 p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-900">{t('evaluatedTitle')}</p>
            <p className="mt-1 text-sm text-green-700">{t('evaluatedDescription')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (status === 'confirmed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-[#0097a7]/20 bg-[#d8f0f2] p-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0097a7]" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{t('confirmedTitle')}</p>
            <p className="mt-1 text-sm text-gray-700">{t('confirmedDescription')}</p>
            <Link
              href="/evaluation"
              className="mt-3 inline-flex items-center gap-2 bg-gray-900 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
            >
              {t('confirmedAction')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (status === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 border border-amber-200 bg-amber-50 p-5"
      >
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">{t('pendingTitle')}</p>
            <p className="mt-1 text-sm text-amber-700">{t('pendingDescription')}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // status === 'none'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 border border-gray-200 bg-gray-50 p-5"
    >
      <div>
        <p className="text-sm font-semibold text-gray-900">{t('noneTitle')}</p>
        <p className="mt-1 text-sm text-gray-600">{t('noneDescription')}</p>
        <Link
          href="/book"
          className="mt-3 inline-flex items-center gap-2 border border-gray-300 bg-white px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-700 transition-colors hover:bg-gray-50"
        >
          {t('noneAction')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
```

**Step 2: Commit**

```bash
git add app/[locale]/profile/waitlist-status-banner.tsx
git commit -m "feat: create WaitlistStatusBanner component"
```

---

### Task 8: Update profile form to use waitlist status

**Files:**
- Modify: `app/[locale]/profile/profile-form.tsx`

**Step 1: Update imports and interface**

Add import at top:
```typescript
import WaitlistStatusBanner from './waitlist-status-banner';
import type { WaitlistStatus } from './page';
```

Update the `ProfileFormProps` interface — replace `isBookingConfirmed?: boolean` with `waitlistStatus`:
```typescript
interface ProfileFormProps {
  profile: Profile | null;
  email: string;
  waitlistStatus: WaitlistStatus;
  children?: React.ReactNode;
}
```

Update the component signature:
```typescript
export default function ProfileForm({ profile, email, waitlistStatus, children }: ProfileFormProps) {
```

**Step 2: Update layout logic**

Find the layout container (around line 128). Replace:
```typescript
<div className={`mx-auto ${isBookingConfirmed ? 'grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16' : 'max-w-2xl'}`}>
```
with:
```typescript
<div className={`mx-auto ${waitlistStatus === 'confirmed' || waitlistStatus === 'evaluated' ? 'grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16' : 'max-w-2xl'}`}>
```

**Step 3: Add status banner**

Inside the left column `<motion.div>` (around line 130-134), add the banner right after the `<h2>` "Personal Info" heading (after line 137):

```typescript
<WaitlistStatusBanner status={waitlistStatus} />
```

**Step 4: Update evaluation summary condition**

Find the right column render (around line 279-283). Replace:
```typescript
{isBookingConfirmed && (
  <div>
    {children}
  </div>
)}
```
with:
```typescript
{(waitlistStatus === 'confirmed' || waitlistStatus === 'evaluated') && (
  <div>
    {children}
  </div>
)}
```

**Step 5: Verify**

Run: `pnpm dev`

Test the profile page in these states (toggle via Supabase dashboard):
- No waitlist entry → single column, "Join the waitlist" banner
- On waitlist, `booking_confirmed = false` → single column, "Pending" banner
- On waitlist, `booking_confirmed = true`, no evaluation → two column, "Confirmed" banner + empty evaluation
- On waitlist, `booking_confirmed = true`, evaluation complete → two column, "All set" banner + evaluation summary

**Step 6: Commit**

```bash
git add app/[locale]/profile/profile-form.tsx
git commit -m "feat: update profile form to use waitlist status with status banner"
```

---

## Phase 3: Notification System

### Task 9: Install dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install resend and react-email**

```bash
pnpm add resend @react-email/components
```

**Step 2: Add environment variables**

Add to `.env.local` (and Vercel environment settings):
```
RESEND_API_KEY=re_your_api_key_here
BITMANAGER_WEBHOOK_SECRET=your_secret_here
RESEND_FROM_EMAIL=noreply@vrajamarii.ro
```

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add resend and react-email dependencies"
```

---

### Task 10: Create booking confirmation email template

**Files:**
- Create: `lib/emails/booking-confirmed.tsx`

**Step 1: Create the email template**

```typescript
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BookingConfirmedEmailProps {
  firstName: string;
  locale: 'ro' | 'en';
  evaluationUrl: string;
}

const content = {
  ro: {
    preview: 'Rezervarea ta la Vraja Marii a fost confirmata',
    greeting: (name: string) => `Buna, ${name}!`,
    line1: 'Rezervarea ta la Vraja Marii by the Sea a fost confirmata.',
    line2: 'Te rugam sa completezi formularul de evaluare initiala inainte de vizita. Aceasta ne ajuta sa personalizam experienta ta.',
    cta: 'Completeaza Evaluarea',
    footer: 'Daca ai intrebari, contacteaza-ne la contact@vrajamarii.ro.',
  },
  en: {
    preview: 'Your booking at Vraja Marii has been confirmed',
    greeting: (name: string) => `Hi, ${name}!`,
    line1: 'Your booking at Vraja Marii by the Sea has been confirmed.',
    line2: 'Please complete the initial evaluation form before your visit. This helps us personalize your experience.',
    cta: 'Complete Evaluation',
    footer: 'If you have questions, contact us at contact@vrajamarii.ro.',
  },
};

export default function BookingConfirmedEmail({
  firstName,
  locale,
  evaluationUrl,
}: BookingConfirmedEmailProps) {
  const t = content[locale];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Vraja Marii</Heading>
          </Section>
          <Section style={body}>
            <Text style={greeting}>{t.greeting(firstName)}</Text>
            <Text style={paragraph}>{t.line1}</Text>
            <Text style={paragraph}>{t.line2}</Text>
            <Section style={ctaSection}>
              <Button style={button} href={evaluationUrl}>
                {t.cta}
              </Button>
            </Section>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>{t.footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const logo = {
  fontSize: '24px',
  fontWeight: '300' as const,
  fontStyle: 'italic' as const,
  color: '#1a1a1a',
  margin: '0',
};

const body = {
  backgroundColor: '#ffffff',
  padding: '32px',
  border: '1px solid #e5e7eb',
};

const greeting = {
  fontSize: '18px',
  color: '#1a1a1a',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#4b5563',
  margin: '0 0 12px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '24px 0 0',
};

const button = {
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '14px 28px',
  fontSize: '12px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const footer = {
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#9ca3af',
};
```

**Step 2: Commit**

```bash
git add lib/emails/booking-confirmed.tsx
git commit -m "feat: create booking confirmation email template with RO/EN support"
```

---

### Task 11: Create BitManager webhook endpoint

**Files:**
- Create: `app/api/webhooks/bitmanager/route.ts`

**Step 1: Create the API route**

```typescript
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
```

Important notes for the implementing engineer:
- This uses `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) because this is a server-to-server call with no user session. You need to add this env var.
- The email send is in a try/catch — if email fails, the booking is still confirmed. We don't want email failures to break the webhook.
- The matcher in `proxy.ts` excludes `/api` routes, so this won't conflict with locale routing.

**Step 2: Add SUPABASE_SERVICE_ROLE_KEY to .env.local**

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get the service role key from Supabase dashboard → Settings → API → `service_role` key.

**Step 3: Verify with curl**

```bash
curl -X POST http://localhost:3000/api/webhooks/bitmanager \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_here" \
  -d '{"email": "test@example.com", "confirmed": true}'
```

Expected: `{"success": true}` if the email exists in waitlist, `{"error": "Waitlist entry not found"}` if not.

**Step 4: Commit**

```bash
git add app/api/webhooks/bitmanager/route.ts
git commit -m "feat: add BitManager webhook endpoint for booking confirmation + email notification"
```

---

## Environment Variables Summary

Add these to `.env.local` and Vercel:

```
# Already exist:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...

# New for Phase 3:
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
BITMANAGER_WEBHOOK_SECRET=...
RESEND_FROM_EMAIL=Vraja Marii <noreply@vrajamarii.ro>
NEXT_PUBLIC_SITE_URL=http://localhost:3000  (production: https://vrajamarii.ro)
```

---

## Final Verification Checklist

After all tasks are complete, verify the full flow:

1. **Locale routing:** Visit `/evaluation` — should properly route (not 404)
2. **Waitlist form:** Submit form → success page shows email in signup link
3. **Signup:** Click "Create Account" → email is pre-filled and locked
4. **Profile (no waitlist):** Login with no waitlist entry → "Join waitlist" banner
5. **Profile (pending):** Add waitlist entry, `booking_confirmed = false` → "Pending" banner
6. **Profile (confirmed):** Set `booking_confirmed = true` → "Confirmed" banner + evaluation CTA
7. **Evaluation:** Click CTA → evaluation form loads → submit → profile shows summary
8. **Profile (evaluated):** After evaluation → "All set" banner + summary
9. **Webhook:** POST to `/api/webhooks/bitmanager` → updates DB + sends email
10. **Email:** Check inbox for confirmation email with correct content and link
