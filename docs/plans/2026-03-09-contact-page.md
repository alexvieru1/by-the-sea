# Contact Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full contact page with info cards, embedded map, directions, contact form (UI-only, Resend later), and FAQ accordions — then remove the standalone `/faq` route.

**Architecture:** Server component page with PageHero + client component for interactive content (form state, FAQ accordions). Contact form uses a server action stub that returns success without sending. FAQ uses native `<details>/<summary>` for zero-JS accordion.

**Tech Stack:** Next.js (App Router), next-intl, Motion (motion/react), Lucide icons, Tailwind CSS

---

### Task 1: Add contact page translations

**Files:**
- Modify: `messages/ro.json`
- Modify: `messages/en.json`

**Step 1: Add `contact` top-level namespace**

Add a new top-level `"contact"` key (separate from `pages.contact` which has title/subtitle/description for PageHero). Structure:

```json
{
  "contact": {
    "info": {
      "title": "Informații de Contact",
      "phone": "+40 241 123 456",
      "email": "contact@vrajamariibythesea.ro",
      "address": "Aleea Mercur Nr.2, Eforie Sud, România",
      "hours": "Luni – Vineri: 09:00 – 18:00",
      "hoursSaturday": "Sâmbătă: 09:00 – 14:00",
      "hoursSunday": "Duminică: Închis"
    },
    "social": {
      "title": "Urmărește-ne",
      "instagram": "Instagram",
      "facebook": "Facebook"
    },
    "directions": {
      "title": "Cum Ajungi",
      "fromConstanta": "Din Constanța: ~30 min cu mașina pe DN39 spre sud, direcția Eforie.",
      "fromBucharest": "Din București: ~3h pe A2 spre Constanța, apoi DN39 spre Eforie Sud.",
      "train": "Cu trenul: Gara Eforie Sud (CFR) — la aproximativ 10 minute de mers pe jos.",
      "parking": "Parcare gratuită disponibilă în incinta complexului."
    },
    "form": {
      "title": "Trimite-ne un Mesaj",
      "description": "Completează formularul de mai jos și te vom contacta cât mai curând.",
      "name": "Nume complet",
      "email": "Email",
      "phone": "Telefon (opțional)",
      "subject": "Subiect",
      "subjects": {
        "general": "Întrebare generală",
        "booking": "Întrebare despre programare",
        "medical": "Întrebare medicală",
        "other": "Altele"
      },
      "message": "Mesaj",
      "messagePlaceholder": "Scrie mesajul tău aici...",
      "submit": "Trimite Mesajul",
      "success": "Mesajul a fost trimis! Te vom contacta în curând.",
      "error": "A apărut o eroare. Te rugăm să încerci din nou."
    },
    "faq": {
      "title": "Întrebări Frecvente",
      "items": {
        "q1": { "question": "Cum pot face o programare?", "answer": "Poți solicita o programare completând formularul de pe site sau sunând la numărul nostru de telefon. Echipa noastră te va contacta pentru confirmare." },
        "q2": { "question": "Ce trebuie să aduc la internare?", "answer": "Ai nevoie de: biletul de trimitere către Recuperare Medicală, cardul de sănătate, cartea de identitate și adeverința de salariat sau ultimul cupon de pensie (pentru asigurații OPSNAJ). Detalii complete în Ghidul Pacientului." },
        "q3": { "question": "Cât durează un sejur tipic?", "answer": "Durata sejurului variază în funcție de programul de tratament recomandat de medic, de obicei între 7 și 21 de zile." },
        "q4": { "question": "Acceptați pacienți neasigurați?", "answer": "Da, acceptăm și pacienți neasigurați. În acest caz, serviciile sunt accesate contra cost. Contactați-ne pentru detalii despre tarife." },
        "q5": { "question": "Cum pot verifica dacă sunt asigurat?", "answer": "Puteți verifica calitatea de asigurat pe site-ul CNAS la adresa siui.casan.ro/asigurati/ introducând CNP-ul dumneavoastră." },
        "q6": { "question": "Este necesar un bilet de trimitere?", "answer": "Da, pentru pacienții asigurați este necesar un bilet de trimitere către Recuperare Medicală eliberat de medicul de familie sau medicul specialist." },
        "q7": { "question": "Oferă complexul parcare?", "answer": "Da, parcarea este gratuită și disponibilă în incinta complexului." },
        "q8": { "question": "Pot vizita complexul înainte de a face o programare?", "answer": "Desigur! Vă așteptăm cu drag. Vă recomandăm să ne contactați telefonic în prealabil pentru a vă asigura că un membru al echipei este disponibil să vă ghideze." }
      }
    }
  }
}
```

English translations follow the same structure with appropriate translations.

**Step 2: Commit**

```bash
git add messages/ro.json messages/en.json
git commit -m "feat: add contact page translations (info, directions, form, FAQ)"
```

---

### Task 2: Build contact page content component

**Files:**
- Create: `components/sections/contact-page-content.tsx`

**Step 1: Create the client component**

`'use client'` component with `useTranslations('contact')`.

**Sections in order:**

**A) Contact Info + Map** (`py-20 lg:py-28`)
- Container: `mx-auto max-w-6xl px-6 lg:px-12`
- Grid: `grid gap-12 lg:grid-cols-2`
- Left column — info cards:
  - Section title: `text-sm font-medium uppercase tracking-wider text-[#0097a7]` + Playfair h2
  - Info items in `space-y-6 mt-8`, each item: `flex items-start gap-4`
    - Icon container: `shrink-0 text-[#0097a7]` with Lucide icons (Phone size=20, Mail size=20, MapPin size=20, Clock size=20)
    - Text: `text-gray-700`
    - Hours: show all 3 lines (weekday, saturday, sunday) in one block
  - Social links below: `flex gap-4 mt-8`, each link is `inline-flex items-center gap-2 text-sm font-medium text-[#0097a7] hover:text-[#00838f] transition-colors` with Instagram/Facebook Lucide icons (use generic ExternalLink if no brand icons — actually use text links, no brand icons needed)
  - Social links should go to `https://instagram.com/vrajamariibythesea` and `https://facebook.com/vrajamariibythesea` with `target="_blank"`
- Right column — Google Maps embed:
  - `<iframe>` with `src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2856.5!2d28.6372!3d44.0492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDAyJzU3LjEiTiAyOMKwMzgnMTMuOCJF!5e0!3m2!1sro!2sro!4v1"` (approximate Eforie Sud coords — user can update the embed URL later)
  - Iframe styling: `w-full h-full min-h-[400px] border-0`
  - Wrapper: `relative overflow-hidden bg-gray-200 aspect-square lg:aspect-auto lg:h-full min-h-[400px]`

**B) Getting There** (`py-20 lg:py-28 bg-[#f8f5f3]`)
- Container: `mx-auto max-w-6xl px-6 lg:px-12`
- Grid: `grid gap-12 lg:grid-cols-2 items-center`
- Left: title + direction items. Each direction item: `flex items-start gap-4` with icons (Car size=20, Train size=20, CircleParking size=20 from Lucide) + text
- Right: PlaceholderImage (reuse from patient-guide or create inline) with label "Building Entrance"

**C) Contact Form** (`py-20 lg:py-28`)
- Container: `mx-auto max-w-2xl px-6 lg:px-12 text-center`
- Title: Playfair h2 centered + description
- Form: `mt-12 space-y-6 text-left`
  - Name input: full width
  - Email + Phone: `grid gap-6 sm:grid-cols-2`
  - Subject: `<select>` with options from `form.subjects.*`
  - Message: `<textarea>` with 5 rows
  - All inputs styled: `w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#0097a7] focus:outline-none focus:ring-1 focus:ring-[#0097a7] transition-colors` — NO rounded corners
  - Submit button: `w-full bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800`
- State: `useState` for form fields + success/error state. On submit, just set success state (no server action yet). Show success message in a `bg-[#0097a7]/10 p-4 text-[#0097a7] text-center` box.

**D) FAQ Section** (`py-20 lg:py-28 bg-gray-100`, add `id="faq"` for anchor link)
- Container: `mx-auto max-w-3xl px-6 lg:px-12`
- Title: Playfair h2 centered
- FAQ items: `mt-12 divide-y divide-gray-200`
- Each item uses `<details>` / `<summary>`:
  - `<details className="group">`
  - `<summary className="flex cursor-pointer items-center justify-between py-6 text-left text-gray-900 font-medium">` with question text + a `<span>` containing Plus/Minus icons toggled via `group-open:hidden` / `hidden group-open:block`
  - Answer div: `pb-6 text-gray-700 leading-relaxed`
- FAQ item keys: q1 through q8, iterate using array of keys

**All sections** use `motion` fadeInUp on scroll (same pattern as patient guide).

**Step 2: Commit**

```bash
git add components/sections/contact-page-content.tsx
git commit -m "feat: create contact page content component"
```

---

### Task 3: Wire up the contact page and remove FAQ route

**Files:**
- Modify: `app/[locale]/contact/page.tsx`
- Delete: `app/[locale]/faq/page.tsx`
- Modify: `components/sections/footer-section.tsx` (line 77: change `/faq` to `/contact#faq`)

**Step 1: Update contact page.tsx**

Replace PlaceholderPage with server component using PageHero + ContactPageContent:

```tsx
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import PageHero from '@/components/layout/page-hero';
import ContactPageContent from '@/components/sections/contact-page-content';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = useTranslations('pages.contact');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero title={t('title')} subtitle={t('subtitle')} description={t('description')} />
      <ContactPageContent />
    </div>
  );
}
```

**Step 2: Delete FAQ page**

Remove `app/[locale]/faq/page.tsx`.

**Step 3: Update footer FAQ link**

In `components/sections/footer-section.tsx`, change line 77 from `href="/faq"` to `href="/contact#faq"`.

**Step 4: Verify build**

Run `pnpm build` — should pass with `/faq` route gone and `/contact` now rendering real content.

**Step 5: Commit**

```bash
git add app/[locale]/contact/page.tsx components/sections/footer-section.tsx
git rm app/[locale]/faq/page.tsx
git commit -m "feat: wire up contact page, merge FAQ into contact, remove /faq route"
```
