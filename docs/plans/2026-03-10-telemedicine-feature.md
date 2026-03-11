# Telemedicine Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable video consultations between doctors and patients using JaaS (Jitsi as a Service), with a booking flow managed by a separate medics app, and a patient-facing join experience in the existing by-the-sea app.

**Architecture:** A new `telemedicine_bookings` table in the shared Supabase project stores scheduled consultations. The patient app (by-the-sea) reads bookings and renders a JaaS video call component behind auth + booking gates. The medics app (separate Next.js project) uses the Supabase service role key to manage patients, view evaluation forms, and create/manage telemedicine bookings. JaaS JWT tokens are generated server-side using an RSA private key.

**Tech Stack:** Next.js 16, Supabase (shared project), @jitsi/react-sdk, jsonwebtoken (JWT generation), JaaS free tier (25 MAU)

---

## Context & Key Files

### Patient App (by-the-sea)
- Supabase browser client: `lib/supabase/client.ts`
- Supabase server client: `lib/supabase/server.ts`
- Profile page: `app/[locale]/profile/page.tsx` — checks `booking_confirmed`, evaluation status
- Profile form: `app/[locale]/profile/profile-form.tsx` — Profile interface definition
- Waitlist status banner: `app/[locale]/profile/waitlist-status-banner.tsx` — status-based UI
- Evaluation gate: `app/[locale]/evaluation/page.tsx` — requires auth + phone + booking_confirmed
- Auth provider: `components/providers/auth-provider.tsx`
- Translations: `messages/en.json`, `messages/ro.json`

### Medics App (to be created)
- Separate Next.js project at `~/Coding/vraja-medics` (or similar)
- Same Supabase project, uses service role key
- shadcn/ui for components
- Env-based auth (bcrypt hashed password)

### JaaS Configuration
- AppID: stored in `JAAS_APP_ID` env var
- RSA private key: stored in `JAAS_PRIVATE_KEY` env var (contents of .pk file)
- RSA key ID: stored in `JAAS_KEY_ID` env var (from JaaS console)

---

## PART 1: Patient App (by-the-sea)

### Task 1: Create `telemedicine_bookings` table in Supabase

**Files:**
- Reference: `app/[locale]/profile/page.tsx` (for existing Supabase patterns)

**Step 1: Create the table via Supabase Dashboard SQL Editor**

Run this SQL in the Supabase SQL Editor:

```sql
CREATE TABLE telemedicine_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  evaluation_form_id UUID REFERENCES evaluation_forms(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  room_name TEXT NOT NULL UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: patients can only read their own bookings
ALTER TABLE telemedicine_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own telemedicine bookings"
  ON telemedicine_bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Index for quick lookups
CREATE INDEX idx_telemedicine_bookings_user_id ON telemedicine_bookings(user_id);
CREATE INDEX idx_telemedicine_bookings_room_name ON telemedicine_bookings(room_name);
```

**Step 2: Verify the table exists**

In Supabase Dashboard → Table Editor, confirm `telemedicine_bookings` appears with all columns.

**Step 3: Commit**

```bash
# No file changes — table created via dashboard
# Document the schema in a comment or proceed to next task
```

---

### Task 2: Add JaaS dependencies and env configuration

**Files:**
- Modify: `package.json`
- Modify: `.env` (local only, not committed)

**Step 1: Install dependencies**

```bash
pnpm add @jitsi/react-sdk jsonwebtoken
pnpm add -D @types/jsonwebtoken
```

**Step 2: Add env variables to `.env`**

```env
# JaaS (Jitsi as a Service)
JAAS_APP_ID=vpaas-magic-cookie-XXXXXXXX
JAAS_KEY_ID=your-key-id-from-jaas-console
JAAS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIE...contents of .pk file...==\n-----END RSA PRIVATE KEY-----"
```

To get the private key content into a single line for `.env`:
```bash
cat /path/to/your-key.pk | tr '\n' '\\n' | sed 's/\\n$//'
# Copy the output and paste as the JAAS_PRIVATE_KEY value (wrapped in double quotes)
```

The `JAAS_KEY_ID` is visible in the JaaS console under API Keys — it's the `kid` value.

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add jitsi react sdk and jsonwebtoken dependencies"
```

---

### Task 3: Create JaaS JWT generation utility

**Files:**
- Create: `lib/jaas/generate-token.ts`

**Step 1: Create the JWT generation function**

```typescript
import jwt from 'jsonwebtoken';

interface JaaSTokenOptions {
  roomName: string;
  userName: string;
  userEmail: string;
  userId: string;
  isModerator: boolean;
}

export function generateJaaSToken({
  roomName,
  userName,
  userEmail,
  userId,
  isModerator,
}: JaaSTokenOptions): string {
  const appId = process.env.JAAS_APP_ID!;
  const privateKey = process.env.JAAS_PRIVATE_KEY!.replace(/\\n/g, '\n');
  const keyId = process.env.JAAS_KEY_ID!;

  const now = Math.floor(Date.now() / 1000);

  const payload = {
    aud: 'jitsi',
    iss: 'chat',
    sub: appId,
    room: roomName,
    exp: now + 3 * 60 * 60, // 3 hours
    nbf: now - 10,
    context: {
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        moderator: isModerator ? 'true' : 'false',
      },
      features: {
        recording: 'false',
        livestreaming: 'false',
      },
    },
  };

  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    header: {
      alg: 'RS256',
      kid: keyId,
      typ: 'JWT',
    },
  });
}
```

**Step 2: Commit**

```bash
git add lib/jaas/generate-token.ts
git commit -m "feat: add JaaS JWT token generation utility"
```

---

### Task 4: Create server action to generate patient meeting token

**Files:**
- Create: `lib/actions/telemedicine.ts`

**Step 1: Create the server action**

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { generateJaaSToken } from '@/lib/jaas/generate-token';

export async function getTelemedicineToken(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'unauthorized' };
  }

  // Fetch booking (RLS ensures user can only access their own)
  const { data: booking } = await supabase
    .from('telemedicine_bookings')
    .select('id, room_name, doctor_name, scheduled_at, status, user_id')
    .eq('id', bookingId)
    .single();

  if (!booking) {
    return { error: 'not_found' };
  }

  if (booking.status !== 'confirmed') {
    return { error: 'not_confirmed' };
  }

  // Check time window: 30 min before scheduled_at until 2 hours after
  const scheduledAt = new Date(booking.scheduled_at).getTime();
  const now = Date.now();
  const thirtyMinBefore = scheduledAt - 30 * 60 * 1000;
  const twoHoursAfter = scheduledAt + 2 * 60 * 60 * 1000;

  if (now < thirtyMinBefore || now > twoHoursAfter) {
    return { error: 'outside_window' };
  }

  // Fetch patient profile for display name
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const displayName = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'Patient'
    : 'Patient';

  const token = generateJaaSToken({
    roomName: booking.room_name,
    userName: displayName,
    userEmail: user.email ?? '',
    userId: user.id,
    isModerator: false,
  });

  return {
    token,
    roomName: booking.room_name,
    doctorName: booking.doctor_name,
    appId: process.env.JAAS_APP_ID!,
  };
}
```

**Step 2: Commit**

```bash
git add lib/actions/telemedicine.ts
git commit -m "feat: add server action for patient telemedicine token generation"
```

---

### Task 5: Create the video call client component

**Files:**
- Create: `components/telemedicine/video-call.tsx`

**Step 1: Create the component**

```typescript
'use client';

import { useEffect, useRef } from 'react';

interface VideoCallProps {
  jwt: string;
  roomName: string;
  appId: string;
  onCallEnd?: () => void;
}

export default function VideoCall({ jwt, roomName, appId, onCallEnd }: VideoCallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || apiRef.current) return;

    const loadJitsi = async () => {
      // Load the JaaS iframe API script
      const script = document.createElement('script');
      script.src = 'https://8x8.vc/vpaas-magic-cookie-default/external_api.js';
      script.async = true;
      script.onload = () => {
        // @ts-expect-error JitsiMeetExternalAPI is loaded via script
        const api = new window.JitsiMeetExternalAPI('8x8.vc', {
          roomName: `${appId}/${roomName}`,
          jwt,
          parentNode: containerRef.current,
          configOverwrite: {
            startWithAudioMuted: true,
            prejoinPageEnabled: true,
            disableDeepLinking: true,
            lobby: { enabled: true },
          },
          interfaceConfigOverwrite: {
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat',
              'fullscreen', 'hangup', 'tileview', 'settings',
            ],
          },
        });

        api.addListener('readyToClose', () => {
          onCallEnd?.();
        });

        apiRef.current = api;
      };

      document.head.appendChild(script);
    };

    loadJitsi();

    return () => {
      if (apiRef.current) {
        // @ts-expect-error dispose exists on the API
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [jwt, roomName, appId, onCallEnd]);

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-80px)] w-full"
    />
  );
}
```

> **Note:** We use the iframe API directly instead of `@jitsi/react-sdk` because the react-sdk has SSR issues with Next.js 16 and React 19. The iframe API approach is more reliable and gives us the same functionality. The `@jitsi/react-sdk` package can be removed later if unused — it was installed as a fallback option.

**Step 2: Commit**

```bash
git add components/telemedicine/video-call.tsx
git commit -m "feat: add video call component using JaaS iframe API"
```

---

### Task 6: Create the consultation page

**Files:**
- Create: `app/[locale]/consultation/page.tsx`
- Create: `app/[locale]/consultation/consultation-client.tsx`

**Step 1: Create the server page (auth + booking gate)**

```typescript
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import ConsultationClient from './consultation-client';

export default async function ConsultationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check for confirmed telemedicine booking
  const { data: booking } = await supabase
    .from('telemedicine_bookings')
    .select('id, doctor_name, scheduled_at, status, room_name')
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'scheduled'])
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .single();

  if (!booking) {
    redirect('/profile');
  }

  return <ConsultationClient booking={booking} />;
}
```

**Step 2: Create the client component**

```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { Video, Clock, Calendar, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from '@/i18n/routing';
import { getTelemedicineToken } from '@/lib/actions/telemedicine';

const VideoCall = dynamic(() => import('@/components/telemedicine/video-call'), {
  ssr: false,
});

interface Booking {
  id: string;
  doctor_name: string;
  scheduled_at: string;
  status: string;
  room_name: string;
}

export default function ConsultationClient({ booking }: { booking: Booking }) {
  const t = useTranslations('telemedicine');
  const router = useRouter();
  const [callState, setCallState] = useState<'waiting' | 'joining' | 'in-call' | 'error'>('waiting');
  const [callData, setCallData] = useState<{
    token: string;
    roomName: string;
    appId: string;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const scheduledDate = new Date(booking.scheduled_at);
  const now = new Date();
  const thirtyMinBefore = new Date(scheduledDate.getTime() - 30 * 60 * 1000);
  const canJoin = booking.status === 'confirmed' && now >= thirtyMinBefore;

  const handleJoin = async () => {
    setCallState('joining');
    setError('');

    const result = await getTelemedicineToken(booking.id);

    if ('error' in result) {
      setCallState('error');
      setError(result.error ?? 'unknown');
      return;
    }

    setCallData(result);
    setCallState('in-call');
  };

  const handleCallEnd = () => {
    setCallState('waiting');
    setCallData(null);
    router.push('/profile');
  };

  if (callState === 'in-call' && callData) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16">
        <VideoCall
          jwt={callData.token}
          roomName={callData.roomName}
          appId={callData.appId}
          onCallEnd={handleCallEnd}
        />
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Video className="h-6 w-6 text-[#0097a7]" />
            <h1 className="text-xl font-semibold text-gray-900">
              {t('title')}
            </h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User className="h-4 w-4 text-gray-400" />
              <span>{booking.doctor_name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {scheduledDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                {scheduledDate.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {booking.status === 'scheduled' && (
            <div className="border border-amber-200 bg-amber-50 p-4 mb-4">
              <p className="text-sm text-amber-800">{t('pendingConfirmation')}</p>
            </div>
          )}

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 mb-4">
              <p className="text-sm text-red-800">{t(`errors.${error}`)}</p>
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={!canJoin || callState === 'joining'}
            className="w-full bg-[#0097a7] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#00838f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Video className="h-4 w-4" />
            {callState === 'joining' ? t('joining') : canJoin ? t('joinCall') : t('notYet')}
          </button>

          {!canJoin && booking.status === 'confirmed' && (
            <p className="mt-3 text-xs text-center text-gray-500">
              {t('availableAt', {
                time: thirtyMinBefore.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              })}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
```

**Step 3: Commit**

```bash
git add "app/[locale]/consultation/page.tsx" "app/[locale]/consultation/consultation-client.tsx"
git commit -m "feat: add consultation page with auth gate and video call join flow"
```

---

### Task 7: Add telemedicine translations

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ro.json`

**Step 1: Add translations to `en.json`**

Add after the `"waitlist"` section:

```json
"telemedicine": {
  "title": "Telemedicine Consultation",
  "pendingConfirmation": "Your consultation is scheduled but not yet confirmed. You will be contacted by phone to confirm.",
  "joinCall": "Join Consultation",
  "joining": "Connecting...",
  "notYet": "Not Available Yet",
  "availableAt": "Join button available at {time}",
  "errors": {
    "unauthorized": "Please log in to access your consultation.",
    "not_found": "Consultation not found.",
    "not_confirmed": "Your consultation has not been confirmed yet.",
    "outside_window": "The consultation is not available at this time.",
    "unknown": "An unexpected error occurred. Please try again."
  }
}
```

**Step 2: Add translations to `ro.json`**

```json
"telemedicine": {
  "title": "Consultație Telemedicină",
  "pendingConfirmation": "Consultația dumneavoastră este programată dar nu este încă confirmată. Veți fi contactat telefonic pentru confirmare.",
  "joinCall": "Intră în Consultație",
  "joining": "Se conectează...",
  "notYet": "Nu este disponibil încă",
  "availableAt": "Butonul de acces disponibil la {time}",
  "errors": {
    "unauthorized": "Vă rugăm să vă autentificați pentru a accesa consultația.",
    "not_found": "Consultația nu a fost găsită.",
    "not_confirmed": "Consultația nu a fost încă confirmată.",
    "outside_window": "Consultația nu este disponibilă în acest moment.",
    "unknown": "A apărut o eroare neașteptată. Vă rugăm să încercați din nou."
  }
}
```

**Step 3: Commit**

```bash
git add messages/en.json messages/ro.json
git commit -m "feat: add telemedicine translations for en and ro"
```

---

### Task 8: Add consultation link to profile page

**Files:**
- Modify: `app/[locale]/profile/page.tsx`
- Modify: `app/[locale]/profile/waitlist-status-banner.tsx`
- Modify: `messages/en.json` (add banner translations)
- Modify: `messages/ro.json`

**Step 1: Fetch telemedicine booking in profile page**

In `app/[locale]/profile/page.tsx`, update the data fetching to include telemedicine bookings. Add after the existing `Promise.all`:

```typescript
// After the existing Promise.all for profile and evaluation
const { data: telemedicineBooking } = await supabase
  .from('telemedicine_bookings')
  .select('id, doctor_name, scheduled_at, status')
  .eq('user_id', user.id)
  .in('status', ['scheduled', 'confirmed'])
  .order('scheduled_at', { ascending: true })
  .limit(1)
  .single();
```

Pass it to `ProfileForm`:
```typescript
<ProfileForm
  profile={profile}
  email={user.email ?? ''}
  waitlistStatus={waitlistStatus}
  phoneRequired={!profile?.phone}
  telemedicineBooking={telemedicineBooking}
>
```

**Step 2: Update WaitlistStatusBanner to show telemedicine info**

Add a new `telemedicineBooking` prop and render a banner when there's an upcoming consultation. Add a new status block after the `evaluated` check:

```typescript
// New telemedicine banner — show when evaluated AND has a booking
if (telemedicineBooking) {
  const scheduledAt = new Date(telemedicineBooking.scheduled_at);
  const isConfirmed = telemedicineBooking.status === 'confirmed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 border border-[#0097a7]/20 bg-[#d8f0f2] p-5"
    >
      <div className="flex items-start gap-3">
        <Video className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0097a7]" />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {t('telemedicine.title')}
          </p>
          <p className="mt-1 text-sm text-gray-700">
            {t('telemedicine.scheduled', {
              doctor: telemedicineBooking.doctor_name,
              date: scheduledAt.toLocaleDateString(),
              time: scheduledAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
            })}
          </p>
          {isConfirmed && (
            <Link
              href="/consultation"
              className="mt-3 inline-flex items-center gap-2 bg-[#0097a7] px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#00838f]"
            >
              {t('telemedicine.action')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          {!isConfirmed && (
            <p className="mt-2 text-xs text-amber-700">{t('telemedicine.awaitingConfirmation')}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

**Step 3: Add banner translations**

In `en.json` under `auth.profile.waitlistStatus`:
```json
"telemedicine": {
  "title": "Telemedicine Consultation",
  "scheduled": "Scheduled with {doctor} on {date} at {time}",
  "action": "Join Consultation",
  "awaitingConfirmation": "Awaiting phone confirmation"
}
```

In `ro.json` under `auth.profile.waitlistStatus`:
```json
"telemedicine": {
  "title": "Consultație Telemedicină",
  "scheduled": "Programată cu {doctor} pe {date} la {time}",
  "action": "Intră în Consultație",
  "awaitingConfirmation": "Se așteaptă confirmarea telefonică"
}
```

**Step 4: Commit**

```bash
git add "app/[locale]/profile/page.tsx" "app/[locale]/profile/waitlist-status-banner.tsx" messages/en.json messages/ro.json
git commit -m "feat: show telemedicine booking status on profile page"
```

---

## PART 2: Medics App (vraja-medics)

> **Note:** This part is the plan for the separate medics app. It will be developed in a different project/session. The plan is included here for the complete picture.

### Task 9: Scaffold the medics app

**Step 1: Create the Next.js project**

```bash
cd ~/Coding
pnpm create next-app vraja-medics --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd vraja-medics
```

**Step 2: Install dependencies**

```bash
pnpm add @supabase/supabase-js jsonwebtoken bcryptjs
pnpm add -D @types/jsonwebtoken @types/bcryptjs
npx shadcn@latest init
npx shadcn@latest add button input label card table badge dialog select textarea
```

**Step 3: Configure environment**

Create `.env.local`:
```env
# Supabase (same project as patient app, service role for admin access)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin auth
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$... (bcrypt hash of the password)

# Session
AUTH_SECRET=random-32-char-string-for-cookie-signing

# JaaS
JAAS_APP_ID=vpaas-magic-cookie-XXXXXXXX
JAAS_KEY_ID=your-key-id
JAAS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
```

Generate the password hash:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(h => console.log(h))"
```

**Step 4: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold vraja-medics next.js project"
```

---

### Task 10: Implement env-based auth for medics app

**Files:**
- Create: `lib/auth.ts`
- Create: `middleware.ts`
- Create: `app/login/page.tsx`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`

**Step 1: Create auth utilities**

`lib/auth.ts`:
```typescript
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function createSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    path: '/',
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
```

> **Note:** Use `jose` instead of `jsonwebtoken` for the session JWT since `jose` works in Edge runtime (middleware). Install it: `pnpm add jose`

**Step 2: Create middleware**

`middleware.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

**Step 3: Create login API route**

`app/api/auth/login/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (username !== process.env.ADMIN_USERNAME) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);
  if (!isValid) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ success: true });
}
```

`app/api/auth/logout/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}
```

**Step 4: Create login page**

`app/login/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Vraja Mării — Medics</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 5: Commit**

```bash
git add lib/auth.ts middleware.ts app/login/page.tsx app/api/auth/login/route.ts app/api/auth/logout/route.ts
git commit -m "feat: add env-based admin authentication"
```

---

### Task 11: Create Supabase admin client for medics app

**Files:**
- Create: `lib/supabase.ts`

**Step 1: Create the admin client**

```typescript
import { createClient } from '@supabase/supabase-js';

// Uses service role key — bypasses RLS for admin operations
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

**Step 2: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: add supabase admin client with service role key"
```

---

### Task 12: Create patient search and evaluation form viewer

**Files:**
- Create: `app/page.tsx` (dashboard with patient search)
- Create: `app/patients/[id]/page.tsx` (patient detail with evaluation form)
- Create: `lib/actions/patients.ts` (server actions)

**Step 1: Create server actions for patient queries**

`lib/actions/patients.ts`:
```typescript
'use server';

import { createAdminClient } from '@/lib/supabase';

export async function searchPatients(query: string) {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, phone, booking_confirmed')
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
    .order('last_name')
    .limit(20);

  return data ?? [];
}

export async function getPatientDetail(userId: string) {
  const supabase = createAdminClient();

  const [{ data: profile }, { data: evaluation }, { data: bookings }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('evaluation_forms').select('*').eq('user_id', userId).single(),
    supabase
      .from('telemedicine_bookings')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: false }),
  ]);

  return { profile, evaluation, bookings: bookings ?? [] };
}

export async function updateEvaluationForm(formId: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('evaluation_forms')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', formId);

  return { error: error?.message };
}
```

**Step 2: Create dashboard page with patient search**

`app/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { searchPatients } from '@/lib/actions/patients';

interface Patient {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  booking_confirmed: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const results = await searchPatients(query);
    setPatients(results);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <Input
              placeholder="Search by name, phone, or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          {patients.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.first_name} {patient.last_name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      <Badge variant={patient.booking_confirmed ? 'default' : 'secondary'}>
                        {patient.booking_confirmed ? 'Confirmed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/patients/${patient.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 3: Create patient detail page** (evaluation viewer + telemedicine booking)

`app/patients/[id]/page.tsx` — This will be a larger component showing the evaluation form data in a readable format, with edit capability and a button to create a telemedicine booking. The exact implementation depends on the evaluation form fields, but the structure is:

```typescript
import { getPatientDetail } from '@/lib/actions/patients';
import PatientDetailClient from './patient-detail-client';

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { profile, evaluation, bookings } = await getPatientDetail(id);

  if (!profile) {
    return <div className="p-6">Patient not found</div>;
  }

  return (
    <PatientDetailClient
      profile={profile}
      evaluation={evaluation}
      bookings={bookings}
    />
  );
}
```

The client component will show:
- Patient info (name, phone, email)
- Evaluation form data (editable fields)
- Existing telemedicine bookings
- "Schedule Consultation" button

**Step 4: Commit**

```bash
git add app/page.tsx app/patients/ lib/actions/patients.ts
git commit -m "feat: add patient search dashboard and detail page"
```

---

### Task 13: Create telemedicine booking management for medics app

**Files:**
- Create: `lib/actions/telemedicine.ts`
- Modify: `app/patients/[id]/patient-detail-client.tsx` (add booking creation)

**Step 1: Create telemedicine server actions**

`lib/actions/telemedicine.ts`:
```typescript
'use server';

import { createAdminClient } from '@/lib/supabase';
import { generateJaaSToken } from '@/lib/jaas/generate-token';
import { randomUUID } from 'crypto';

export async function createTelemedicineBooking(data: {
  userId: string;
  evaluationFormId: string | null;
  doctorName: string;
  scheduledAt: string;
  notes?: string;
}) {
  const supabase = createAdminClient();
  const roomName = `consultation-${randomUUID().slice(0, 8)}`;

  const { data: booking, error } = await supabase
    .from('telemedicine_bookings')
    .insert({
      user_id: data.userId,
      evaluation_form_id: data.evaluationFormId,
      doctor_name: data.doctorName,
      scheduled_at: data.scheduledAt,
      room_name: roomName,
      notes: data.notes,
      status: 'scheduled',
    })
    .select()
    .single();

  return { booking, error: error?.message };
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('telemedicine_bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId);

  return { error: error?.message };
}

export async function getDoctorMeetingToken(bookingId: string) {
  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from('telemedicine_bookings')
    .select('room_name, doctor_name')
    .eq('id', bookingId)
    .single();

  if (!booking) return { error: 'not_found' };

  const token = generateJaaSToken({
    roomName: booking.room_name,
    userName: booking.doctor_name,
    userEmail: 'doctor@complexvrajamarii.ro',
    userId: 'doctor-admin',
    isModerator: true,
  });

  return {
    token,
    roomName: booking.room_name,
    appId: process.env.JAAS_APP_ID!,
  };
}
```

> **Note:** The `generateJaaSToken` function from Task 3 should be **copied** to the medics app at `lib/jaas/generate-token.ts` (identical code). Both apps need it independently since they're separate projects.

**Step 2: The booking creation UI**

In the patient detail page, add a dialog/form with:
- Doctor name (text input, prefilled)
- Date picker (date input)
- Time picker (time input)
- Notes (optional textarea)
- "Schedule" button → calls `createTelemedicineBooking`

And for each existing booking:
- Status badge (scheduled/confirmed/completed/cancelled)
- "Confirm" button → calls `updateBookingStatus(id, 'confirmed')`
- "Join Call" button (when confirmed) → calls `getDoctorMeetingToken`, opens video call
- "Cancel" / "Mark Complete" buttons

**Step 3: Create the doctor video call page**

`app/call/[bookingId]/page.tsx` — similar to patient consultation page but with moderator JWT. Uses the same `VideoCall` component (copy from patient app to `components/video-call.tsx`).

**Step 4: Commit**

```bash
git add lib/actions/telemedicine.ts lib/jaas/ app/call/ app/patients/
git commit -m "feat: add telemedicine booking management and doctor video call"
```

---

## Summary of Files

### Patient App (by-the-sea) — Tasks 1-8
| Action | File |
|--------|------|
| Create | `lib/jaas/generate-token.ts` |
| Create | `lib/actions/telemedicine.ts` |
| Create | `components/telemedicine/video-call.tsx` |
| Create | `app/[locale]/consultation/page.tsx` |
| Create | `app/[locale]/consultation/consultation-client.tsx` |
| Modify | `app/[locale]/profile/page.tsx` |
| Modify | `app/[locale]/profile/waitlist-status-banner.tsx` |
| Modify | `messages/en.json` |
| Modify | `messages/ro.json` |
| SQL    | `telemedicine_bookings` table |

### Medics App (vraja-medics) — Tasks 9-13
| Action | File |
|--------|------|
| Create | Entire Next.js project scaffold |
| Create | `lib/auth.ts` + `middleware.ts` |
| Create | `lib/supabase.ts` |
| Create | `lib/jaas/generate-token.ts` (copy) |
| Create | `lib/actions/patients.ts` |
| Create | `lib/actions/telemedicine.ts` |
| Create | `app/login/page.tsx` |
| Create | `app/page.tsx` (dashboard) |
| Create | `app/patients/[id]/page.tsx` |
| Create | `app/call/[bookingId]/page.tsx` |
| Create | `components/video-call.tsx` (copy) |

### Data Flow
```
Doctor (medics app)                    Patient (by-the-sea)
    |                                       |
    |-- searchPatients() ----------------->  profiles table
    |-- getPatientDetail() --------------->  evaluation_forms table
    |-- createTelemedicineBooking() ------> telemedicine_bookings table
    |                                       |
    |-- updateBookingStatus('confirmed') -> telemedicine_bookings table
    |                                       |<-- profile page reads booking
    |                                       |<-- "Join Consultation" button appears
    |                                       |
    |-- getDoctorMeetingToken() ----------> JWT (moderator: true)
    |                                       |-- getTelemedicineToken() --> JWT (moderator: false)
    |                                       |
    |-- JaaS Video Call <=================> JaaS Video Call
```
