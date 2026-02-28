# Reservation Flow Design

## Problem Statement

The current waitlist-to-evaluation flow has several gaps:

1. **Missing `proxy.ts`** - No locale routing middleware, causing 404s on direct URL access (e.g., `/evaluation`)
2. **Broken `/waitlist` redirect** - `evaluation/page.tsx` redirects to `/waitlist` which doesn't exist as a page
3. **No waitlist status on profile** - Users don't know if their booking is pending or confirmed
4. **No email notification** - Users aren't notified when their booking is confirmed
5. **No BitManager webhook endpoint** - No API route for BitManager to call when confirming reservations
6. **Account-waitlist email mismatch** - Users can sign up with a different email than their waitlist entry

## Desired Flow

```
User fills waitlist form (public, no auth)
  └→ Staff contacts user via phone call
       └→ Staff confirms in BitManager
            └→ BitManager calls webhook → booking_confirmed = true
                 └→ Email sent to user with link to /evaluation
                      └→ User logs in → profile shows "fill evaluation" banner
                           └→ User completes 4-step evaluation form
                                └→ Profile shows evaluation summary
```

## Design (Phased Implementation)

### Phase 1: Critical Bug Fixes

#### 1.1 Add `proxy.ts` (Next.js 16 convention)

Create `proxy.ts` at the project root for next-intl locale routing.

- Import `createMiddleware` from `next-intl/middleware`
- Import routing config from `@/i18n/routing`
- Matcher: `['/', '/(ro|en)/:path*']`
- Handles locale detection, URL rewriting (`/evaluation` → `/ro/evaluation`), prefix management (`as-needed`)

#### 1.2 Fix broken redirect

In `app/[locale]/evaluation/page.tsx`, change `redirect('/waitlist')` to `redirect('/book')`.

The `/waitlist` route doesn't exist as a standalone page. `/book` is the correct destination for users who haven't joined the waitlist yet.

#### 1.3 Force same email at signup

**Goal:** Prevent account-waitlist email mismatch by pre-filling and locking the email field on the signup page.

**Changes:**
- `waitlist/success/success-page-client.tsx`: Pass the waitlist email as a URL param on the "Create Account" link → `/signup?email={waitlistEmail}`
- `waitlist/success/page.tsx`: Query the most recent waitlist entry for context (or pass email from the form submission flow)
- `signup/page.tsx`:
  - Read `email` from URL search params
  - If present: pre-fill email field, make it read-only, show note "Use the same email you registered on the waitlist"
  - If absent: normal signup flow (for users who navigate directly)
- Google OAuth edge case: After signup via Google, check if the Google email matches a waitlist entry. If not, show a warning on the profile page.

### Phase 2: Profile Waitlist Status

#### Profile Page States

Query the waitlist table **without** the `booking_confirmed` filter to determine the full state:

| State | Condition | Layout | Banner |
|-------|-----------|--------|--------|
| 1. No waitlist entry | `waitlistEntry === null` | Single column | "Join the waitlist" link to `/book` |
| 2. Pending confirmation | `waitlistEntry && !booking_confirmed` | Single column + banner | "Your reservation is pending. Our team will contact you soon." |
| 3. Confirmed, no evaluation | `booking_confirmed && !evaluation` | Two column + banner | "Booking confirmed! Complete your evaluation form." + CTA |
| 4. Evaluation complete | `booking_confirmed && evaluation` | Two column + summary | "All set" indicator |

#### Changes Required

- `app/[locale]/profile/page.tsx`:
  - Query: `supabase.from('waitlist').select('id, booking_confirmed').eq('email', user.email!).single()`
  - Derive `waitlistStatus: 'none' | 'pending' | 'confirmed' | 'evaluated'`
  - Pass `waitlistStatus` to `ProfileForm` instead of `isBookingConfirmed`

- `app/[locale]/profile/profile-form.tsx`:
  - Replace `isBookingConfirmed?: boolean` with `waitlistStatus: 'none' | 'pending' | 'confirmed' | 'evaluated'`
  - Render `WaitlistStatusBanner` component based on status
  - Show two-column layout when status is `confirmed` or `evaluated`

- New component: `app/[locale]/profile/waitlist-status-banner.tsx`
  - Renders the appropriate banner for each state
  - Uses translations for all text (RO + EN)

- Translation updates in `messages/ro.json` and `messages/en.json`:
  - Add `profile.waitlistStatus.none`, `.pending`, `.confirmed`, `.evaluated` keys

### Phase 3: Notification System

#### 3.1 BitManager Webhook Endpoint

**File:** `app/api/webhooks/bitmanager/route.ts`

```
POST /api/webhooks/bitmanager
Headers:
  x-api-key: BITMANAGER_WEBHOOK_SECRET

Body:
  { email: string, confirmed: boolean }

Logic:
  1. Validate x-api-key against BITMANAGER_WEBHOOK_SECRET env var
  2. Find waitlist entry by email
  3. Update booking_confirmed = body.confirmed
  4. If confirmed === true:
     a. Fetch user's first_name from waitlist table
     b. Determine locale (store on waitlist entry or default to 'ro')
     c. Render React Email template
     d. Send via Resend API
  5. Return 200 { success: true } or appropriate error

Security:
  - API key validation (reject with 401 if invalid)
  - Rate limiting (optional, via Vercel)
  - Input validation (email format, confirmed is boolean)

Environment variables:
  - BITMANAGER_WEBHOOK_SECRET
  - RESEND_API_KEY
```

#### 3.2 Email Template

**File:** `lib/emails/booking-confirmed.tsx`

React Email component with configurable template:

```
Props:
  - firstName: string
  - locale: 'ro' | 'en'
  - evaluationUrl: string

Content (RO):
  Subject: "Rezervarea ta a fost confirmata"
  Body:
    - Branded header (logo + colors)
    - "Buna, {firstName}!"
    - "Rezervarea ta la Vraja Marii a fost confirmata."
    - "Te rugam sa completezi formularul de evaluare initiala."
    - CTA button: "Completeaza Evaluarea" → evaluationUrl
    - Footer with contact info

Content (EN):
  Subject: "Your booking has been confirmed"
  Body:
    - Same structure, English text
```

#### 3.3 Dependencies

```
New packages:
  - resend (email API client)
  - @react-email/components (template building blocks)

Environment variables:
  - RESEND_API_KEY
  - BITMANAGER_WEBHOOK_SECRET
  - RESEND_FROM_EMAIL (e.g., noreply@vrajamarii.ro)
```

## Files to Create/Modify

### New Files
- `proxy.ts` - Next.js 16 locale routing proxy
- `app/[locale]/profile/waitlist-status-banner.tsx` - Status banner component
- `app/api/webhooks/bitmanager/route.ts` - Webhook endpoint
- `lib/emails/booking-confirmed.tsx` - React Email template

### Modified Files
- `app/[locale]/evaluation/page.tsx` - Fix redirect `/waitlist` → `/book`
- `app/[locale]/waitlist/success/page.tsx` - Pass email to success page client
- `app/[locale]/waitlist/success/success-page-client.tsx` - Add email param to signup link
- `app/[locale]/signup/page.tsx` - Read email param, pre-fill and lock email field
- `app/[locale]/profile/page.tsx` - Query full waitlist status, derive state
- `app/[locale]/profile/profile-form.tsx` - Accept waitlistStatus prop, render banner
- `messages/ro.json` - Add waitlist status translations
- `messages/en.json` - Add waitlist status translations

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| proxy.ts vs middleware.ts | `proxy.ts` | Next.js 16 convention |
| Email trigger | Webhook handler (not DB webhook) | Simpler, fewer moving parts, guaranteed to fire |
| Email template | React Email + Resend | Native integration, configurable JSX templates |
| Email mismatch prevention | Force same email at signup | Pre-fill from URL param, most reliable |
| Non-confirmed redirect | `/book` | The booking/waitlist page, not homepage |
| Profile status granularity | 4 states | Covers all user scenarios without over-engineering |
