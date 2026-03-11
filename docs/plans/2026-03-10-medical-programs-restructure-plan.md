# Medical Programs Restructure - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename "therapies" to "medical programs" across routes, nav, and translations. Restructure homepage to show 5 full-screen showcases instead of 3 showcases + 2x2 grid. Merge endometriosis & infertility into one section/route.

**Architecture:** Update route directory from `app/[locale]/therapies/` to `app/[locale]/medical-programs/`. Create 2 new showcase section components. Update all translation namespaces to use `medicalPrograms.*`. Modify ShowcaseSection to accept broader translation keys.

**Tech Stack:** Next.js App Router, next-intl, Motion (motion/react)

---

### Task 1: Update Translation Files

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ro.json`

**Step 1: Update `messages/en.json`**

Changes:
1. Rename `nav.therapies` → `nav.medicalPrograms` with value `"Medical Programs"`
2. Rename `common.allTherapies` → `common.allPrograms` with value `"All Programs"`
3. Rename `pages.therapies` → `pages.medicalPrograms` with updated values:
   ```json
   "medicalPrograms": {
     "title": "Medical Programs",
     "subtitle": "Our specialized programs",
     "description": "Discover our comprehensive range of medical programs designed to restore, rejuvenate, and optimise your health."
   }
   ```
4. Move `medicalRehabilitation` under new `medicalPrograms` namespace (remove old top-level key)
5. Merge `endometriosis` + `therapies.infertility` into `medicalPrograms.endometriosisInfertility`:
   ```json
   "endometriosisInfertility": {
     "title": "Endometriosis & Infertility",
     "subtitle": "Understand. Nurture. Thrive.",
     "description": "Living with endometriosis or facing fertility challenges means navigating pain, uncertainty, and often feeling unheard. Our integrative protocols combine functional medicine, physiotherapy, and balneology to help restore comfort, hormonal balance, and quality of life."
   }
   ```
6. Move `longevity` under `medicalPrograms` namespace (remove old top-level key)
7. Move `therapies.rheumatology` → `medicalPrograms.rheumatology` (remove from `therapies`)
8. Move `therapies.postChemotherapy` → `medicalPrograms.postChemotherapy` (remove from `therapies`)
9. Keep `therapies.wellness` in place (still used by therapies-preview component)

Final `medicalPrograms` namespace in en.json:
```json
"medicalPrograms": {
  "medicalRehabilitation": {
    "title": "Medical Rehabilitation",
    "subtitle": "Rebuild. Restore. Recover.",
    "description": "Advanced rehabilitation protocols combining physiotherapy, balneology, and regenerative medicine for post-surgical, post-injury, and chronic condition recovery."
  },
  "endometriosisInfertility": {
    "title": "Endometriosis & Infertility",
    "subtitle": "Understand. Nurture. Thrive.",
    "description": "Living with endometriosis or facing fertility challenges means navigating pain, uncertainty, and often feeling unheard. Our integrative protocols combine functional medicine, physiotherapy, and balneology to help restore comfort, hormonal balance, and quality of life."
  },
  "longevity": {
    "title": "Longevity",
    "subtitle": "Optimise. Regenerate. Flourish.",
    "description": "Aging well isn't about turning back the clock — it's about giving your body the tools to thrive. Our longevity programs blend advanced diagnostics, cryotherapy, and regenerative therapies designed uniquely for you."
  },
  "rheumatology": {
    "title": "Rheumatology",
    "subtitle": "Ease. Strengthen. Move.",
    "description": "Specialised rheumatology programs combining balneotherapy, physiotherapy, and functional medicine to manage autoimmune and inflammatory conditions — reducing pain and restoring mobility."
  },
  "postChemotherapy": {
    "title": "Post-Chemotherapy Rehabilitation",
    "subtitle": "Support. Recover. Heal.",
    "description": "Compassionate integrative care designed to support patients after chemotherapy — managing side effects, restoring vitality, and nurturing recovery."
  }
}
```

**Step 2: Update `messages/ro.json`**

Same structural changes. Final `medicalPrograms` namespace in ro.json:
```json
"medicalPrograms": {
  "medicalRehabilitation": {
    "title": "Recuperare Medicală",
    "subtitle": "Reconstruiește. Restaurează. Recuperează.",
    "description": "Protocoale avansate de reabilitare care combină fizioterapia, balneologia și medicina regenerativă pentru recuperarea post-chirurgicală, post-traumatică și a afecțiunilor cronice."
  },
  "endometriosisInfertility": {
    "title": "Endometrioză și Infertilitate",
    "subtitle": "Înțelege. Hrănește. Prosperă.",
    "description": "A trăi cu endometrioză sau a te confrunta cu provocări de fertilitate înseamnă a naviga prin durere, incertitudine și adesea sentimentul că nu ești ascultată. Protocoalele noastre integrative combină medicina funcțională, fizioterapia și balneologia pentru a-ți reda confortul, echilibrul hormonal și calitatea vieții."
  },
  "longevity": {
    "title": "Longevitate",
    "subtitle": "Optimizează. Regenerează. Înflorește.",
    "description": "A îmbătrâni frumos nu înseamnă a întoarce timpul înapoi — înseamnă a oferi corpului tău instrumentele necesare pentru a prospera. Programele noastre de longevitate îmbină diagnosticarea avansată, crioterapia și terapiile regenerative, proiectate unic pentru tine."
  },
  "rheumatology": {
    "title": "Reumatologie",
    "subtitle": "Ameliorează. Întărește. Mișcă.",
    "description": "Programe specializate de reumatologie care combină balneoterapia, fizioterapia și medicina funcțională pentru gestionarea afecțiunilor autoimune și inflamatorii — reducând durerea și restabilind mobilitatea."
  },
  "postChemotherapy": {
    "title": "Reabilitare Post-Chimioterapie",
    "subtitle": "Susținere. Reabilitare. Vindecare.",
    "description": "Îngrijire integrativă plină de compasiune, concepută să sprijine pacienții după chimioterapie — gestionând efectele secundare, restaurând vitalitatea și susținând recuperarea."
  }
}
```

Also update:
- `nav.therapies` → `nav.medicalPrograms`: `"Programe Medicale"`
- `common.allTherapies` → `common.allPrograms`: `"Toate Programele"`
- `pages.therapies` → `pages.medicalPrograms` with `"title": "Programe Medicale"`, `"subtitle": "Programele noastre specializate"`, `"description": "Descoperă gama noastră cuprinzătoare de programe medicale menite să restaureze, regenereze și optimizeze sănătatea ta."`
- Remove old top-level `endometriosis`, `longevity`, `medicalRehabilitation` keys
- Remove `therapies.infertility`, `therapies.rheumatology`, `therapies.postChemotherapy` (keep `therapies.wellness`)

**Step 3: Commit**
```bash
git add messages/en.json messages/ro.json
git commit -m "refactor: restructure translations from therapies to medicalPrograms namespace"
```

---

### Task 2: Update ShowcaseSection to Accept New Translation Keys

**Files:**
- Modify: `components/sections/showcase-section.tsx` (line 12)

**Step 1: Update the translationKey type**

In `showcase-section.tsx`, change the `translationKey` prop type from:
```typescript
translationKey: 'medicalRehabilitation' | 'longevity';
```
to:
```typescript
translationKey: string;
```

Also update `useTranslations` call — currently `useTranslations(translationKey)` passes the key directly. Since translations are now nested under `medicalPrograms`, either:
- Option A: Pass the full namespace from the parent (e.g., `"medicalPrograms.medicalRehabilitation"`) — but `useTranslations` uses dot notation for namespaces
- Option B: Add a `translationNamespace` prop

**Best approach:** Use a `translationNamespace` prop defaulting to `'medicalPrograms'`, and keep `translationKey` for the sub-key:

```typescript
interface ShowcaseSectionProps {
  translationNamespace?: string;
  translationKey: string;
  // ... rest unchanged
}
```

Then change:
```typescript
const t = useTranslations(translationKey);
```
to:
```typescript
const t = useTranslations(`${translationNamespace}.${translationKey}`);
```

Wait — `next-intl` `useTranslations` uses the namespace as a prefix for all subsequent `t()` calls. So `useTranslations('medicalPrograms.medicalRehabilitation')` would let `t('title')` resolve to `medicalPrograms.medicalRehabilitation.title`. This works.

**Simpler approach:** Just change the type to `string` and let parent components pass the full dotted path:

```typescript
translationKey: string;  // e.g. 'medicalPrograms.medicalRehabilitation'
```

No other changes needed since `useTranslations(translationKey)` already works with dotted namespaces.

**Step 2: Commit**
```bash
git add components/sections/showcase-section.tsx
git commit -m "refactor: allow any translation key in ShowcaseSection"
```

---

### Task 3: Update Existing Section Components

**Files:**
- Modify: `components/sections/medical-rehabilitation-section.tsx`
- Modify: `components/sections/longevity-section.tsx`
- Modify: `components/sections/endometriosis-section.tsx`

**Step 1: Update medical-rehabilitation-section.tsx**

Change `translationKey` from `"medicalRehabilitation"` to `"medicalPrograms.medicalRehabilitation"`.
Change `ctaHref` from `"/therapies/medical-rehabilitation"` to `"/medical-programs/medical-rehabilitation"`.

```typescript
import ShowcaseSection from './showcase-section';

export default function MedicalRehabilitationSection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.medicalRehabilitation"
      imageSrc="/images/your_body.webp"
      imageAlt="Medical rehabilitation therapy"
      cardBg="bg-[#0097a7]"
      align="left"
      ctaKey="learnMore"
      ctaHref="/medical-programs/medical-rehabilitation"
      className="snap-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '10%', left: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '20%', right: '10%', background: 'radial-gradient(circle, rgba(240,112,96,0.15) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
```

**Step 2: Update longevity-section.tsx**

Change `translationKey` from `"longevity"` to `"medicalPrograms.longevity"`.
Change `ctaHref` from `"/therapies/longevity"` to `"/medical-programs/longevity"`.
Change `align` from `"left"` to `"right"` (per design: section 3 is right-aligned).

```typescript
import ShowcaseSection from './showcase-section';

export default function LongevitySection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.longevity"
      imageSrc="/images/your_future.webp"
      imageAlt="Longevity therapy"
      cardBg="bg-[#798B6F]"
      align="right"
      ctaKey="learnMore"
      ctaHref="/medical-programs/longevity"
      className="snap-section light-header-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '15%', left: '20%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '25%', left: '15%', background: 'radial-gradient(circle, rgba(0,151,167,0.15) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
```

**Step 3: Update endometriosis-section.tsx**

- Change translation namespace from `"endometriosis"` to `"medicalPrograms.endometriosisInfertility"` (line 10)
- Change CTA href from `"/therapies/endometriosis"` to `"/medical-programs/endometriosis-infertility"` (line 123)

```typescript
// Line 10: change
const t = useTranslations("medicalPrograms.endometriosisInfertility");

// Line 123: change href
<PrimaryButton href="/medical-programs/endometriosis-infertility" variant="dark" size="xl" arrow>
```

**Step 4: Commit**
```bash
git add components/sections/medical-rehabilitation-section.tsx components/sections/longevity-section.tsx components/sections/endometriosis-section.tsx
git commit -m "refactor: update section components to use medicalPrograms namespace and routes"
```

---

### Task 4: Create New Section Components

**Files:**
- Create: `components/sections/rheumatology-section.tsx`
- Create: `components/sections/post-chemo-section.tsx`

**Step 1: Create rheumatology-section.tsx**

```typescript
import ShowcaseSection from './showcase-section';

export default function RheumatologySection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.rheumatology"
      imageSrc="/images/your_body.webp"
      imageAlt="Rheumatology therapy"
      cardBg="bg-[#8FA3A8]"
      align="left"
      ctaKey="learnMore"
      ctaHref="/medical-programs/rheumatology"
      className="snap-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '12%', left: '55%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '18%', right: '15%', background: 'radial-gradient(circle, rgba(143,163,168,0.2) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
```

Note: Uses same placeholder image `your_body.webp` — replace later when real images are available.

**Step 2: Create post-chemo-section.tsx**

```typescript
import ShowcaseSection from './showcase-section';

export default function PostChemoSection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.postChemotherapy"
      imageSrc="/images/your_future.webp"
      imageAlt="Post-chemotherapy rehabilitation"
      cardBg="bg-[#BCA390]"
      align="right"
      ctaKey="learnMore"
      ctaHref="/medical-programs/post-chemotherapy"
      className="snap-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '10%', left: '25%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '22%', right: '12%', background: 'radial-gradient(circle, rgba(188,163,144,0.15) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
```

Note: Uses same placeholder image `your_future.webp` — replace later.

**Step 3: Commit**
```bash
git add components/sections/rheumatology-section.tsx components/sections/post-chemo-section.tsx
git commit -m "feat: add rheumatology and post-chemo showcase sections"
```

---

### Task 5: Update Homepage

**Files:**
- Modify: `app/[locale]/page.tsx`

**Step 1: Update imports and section order**

```typescript
import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';

const HeroSection = dynamic(() => import('@/components/sections/hero-section'), {
  loading: () => (
    <section className="hero-section snap-section relative overflow-hidden bg-[#c5d5d8]" />
  ),
});
const MedicalRehabilitationSection = dynamic(() => import('@/components/sections/medical-rehabilitation-section'));
const EndometriosisSection = dynamic(() => import('@/components/sections/endometriosis-section'));
const LongevitySection = dynamic(() => import('@/components/sections/longevity-section'));
const RheumatologySection = dynamic(() => import('@/components/sections/rheumatology-section'));
const PostChemoSection = dynamic(() => import('@/components/sections/post-chemo-section'));
const FacilitiesSection = dynamic(() => import('@/components/sections/facilities-section'));

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <MedicalRehabilitationSection />
      <EndometriosisSection />
      <LongevitySection />
      <RheumatologySection />
      <PostChemoSection />
      <FacilitiesSection />
    </>
  );
}
```

Key changes:
- Remove `TherapiesPreview` import (keep the file)
- Add `RheumatologySection` and `PostChemoSection` imports
- Remove `<TherapiesPreview />` from JSX
- Add `<RheumatologySection />` and `<PostChemoSection />` after `<LongevitySection />`

**Step 2: Commit**
```bash
git add app/[locale]/page.tsx
git commit -m "feat: update homepage with 5 medical program sections, remove TherapiesPreview"
```

---

### Task 6: Move Route Directory and Update Detail Pages

**Files:**
- Move: `app/[locale]/therapies/` → `app/[locale]/medical-programs/`
- Modify: `app/[locale]/medical-programs/page.tsx`
- Modify: `app/[locale]/medical-programs/[slug]/page.tsx`
- Modify: `app/[locale]/medical-programs/[slug]/therapy-page-client.tsx`

**Step 1: Move directory**
```bash
mv app/[locale]/therapies app/[locale]/medical-programs
```

**Step 2: Update `app/[locale]/medical-programs/page.tsx`**

Change `translationKey` from `"therapies"` to `"medicalPrograms"`:

```typescript
import PlaceholderPage from '@/components/layout/placeholder-page';
import { setRequestLocale } from 'next-intl/server';

export default async function MedicalProgramsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PlaceholderPage translationKey="medicalPrograms" />;
}
```

**Step 3: Update `app/[locale]/medical-programs/[slug]/page.tsx`**

Update valid slugs — remove old individual slugs, add merged one:

```typescript
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import TherapyPageClient from './therapy-page-client';

const validSlugs = [
  'medical-rehabilitation',
  'endometriosis-infertility',
  'longevity',
  'rheumatology',
  'wellness',
  'post-chemotherapy',
] as const;

const validSlugSet = new Set<string>(validSlugs);

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export default async function MedicalProgramPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!validSlugSet.has(slug)) {
    notFound();
  }

  return <TherapyPageClient slug={slug} />;
}
```

**Step 4: Update `app/[locale]/medical-programs/[slug]/therapy-page-client.tsx`**

Update slug map to use `medicalPrograms` namespace and new colors:

```typescript
const therapyMap: Record<string, { translationNamespace: string; translationKey: string; bg: string }> = {
  'medical-rehabilitation': {
    translationNamespace: 'medicalPrograms',
    translationKey: 'medicalRehabilitation',
    bg: 'bg-[#D2B88B]',
  },
  'endometriosis-infertility': {
    translationNamespace: 'medicalPrograms',
    translationKey: 'endometriosisInfertility',
    bg: 'bg-[#D2B88B]',
  },
  longevity: {
    translationNamespace: 'medicalPrograms',
    translationKey: 'longevity',
    bg: 'bg-[#0097a7]',
  },
  rheumatology: {
    translationNamespace: 'medicalPrograms',
    translationKey: 'rheumatology',
    bg: 'bg-[#8FA3A8]',
  },
  wellness: {
    translationNamespace: 'therapies',
    translationKey: 'wellness',
    bg: 'bg-[#BCA390]',
  },
  'post-chemotherapy': {
    translationNamespace: 'medicalPrograms',
    translationKey: 'postChemotherapy',
    bg: 'bg-[#BCA390]',
  },
};
```

Update `darkTextSlugs` — remove old slugs, check new colors:
- `#8FA3A8` (rheumatology) — mid-tone, white text works
- `#BCA390` (post-chemo) — mid-tone, white text works
- Keep `wellness` as dark text (light bg `#BCA390`... actually same color, so remove from dark set)

```typescript
const darkTextSlugs = new Set<string>([]);
```

Wait, `wellness` was `#BCA390` with dark text. But now post-chemo is also `#BCA390`. Let's keep consistency — both use white text on `#BCA390` since it's a medium tone. Actually looking at the original, wellness had dark text on `#e8d8d4` (pink beige) in the grid but `#BCA390` in the detail page. Keep dark text only for very light backgrounds. `#BCA390` is medium — white text is fine.

```typescript
const darkTextSlugs = new Set(['wellness']);
```

Keep wellness as dark text since it's still using the old therapies namespace and might have different styling.

Also update the back link (line 131) from `"/therapies"` to `"/medical-programs"`:
```typescript
href="/medical-programs"
```

And update `allTherapies` → `allPrograms`:
```typescript
{tCommon('allPrograms')}
```

**Step 5: Commit**
```bash
git add app/[locale]/medical-programs/
git commit -m "refactor: move therapies routes to medical-programs, update slug map"
```

---

### Task 7: Update Navigation

**Files:**
- Modify: `components/layout/header.tsx` (line 124)

**Step 1: Update nav link**

Change:
```typescript
{ href: "/therapies", label: t("therapies") },
```
to:
```typescript
{ href: "/medical-programs", label: t("medicalPrograms") },
```

**Step 2: Commit**
```bash
git add components/layout/header.tsx
git commit -m "refactor: update nav link from therapies to medical-programs"
```

---

### Task 8: Verify and Clean Up

**Step 1: Run dev server and verify**
```bash
pnpm dev
```

Check:
- [ ] Homepage shows 5 program sections in correct order with correct colors
- [ ] Section 1 (Medical Rehab): left-aligned, teal card
- [ ] Section 2 (Endometriosis & Infertility): video+card, warm tan
- [ ] Section 3 (Longevity): right-aligned, sage green
- [ ] Section 4 (Rheumatology): left-aligned, steel blue `#8FA3A8`
- [ ] Section 5 (Post-Chemo): right-aligned, dusty tan `#BCA390`
- [ ] Nav link says "Medical Programs" / "Programe Medicale"
- [ ] Clicking nav goes to `/medical-programs`
- [ ] Each section CTA links to correct `/medical-programs/[slug]`
- [ ] Detail pages render correctly with right colors and translations
- [ ] `/medical-programs/endometriosis-infertility` shows merged content
- [ ] Language switcher works on all new pages
- [ ] No console errors about missing translation keys

**Step 2: Search for any remaining `/therapies` references**
```bash
grep -r '"/therapies' --include="*.tsx" --include="*.ts" --include="*.json"
```

The `therapies-preview.tsx` component will still have old references — that's expected since we're keeping the file. No other files should reference `/therapies`.

**Step 3: Run build to verify static generation**
```bash
pnpm build
```

Ensure new routes are generated statically.

**Step 4: Final commit**
```bash
git add -A
git commit -m "chore: clean up remaining therapies references"
```
