# About Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the About page with intro story, vision/mission cards, core values, team section, commented-out timeline, and CTA.

**Architecture:** Single client component (`about-content.tsx`) following the same pattern as `patient-guide-content.tsx`. Server page renders `PageHero` + `AboutContent`. Translations extended in both `ro.json` and `en.json`.

**Tech Stack:** Next.js, next-intl, motion/react, lucide-react, ParallaxImage component

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `messages/ro.json` | Modify | Add new keys under `aboutContent` (values, team, timeline, CTA) |
| `messages/en.json` | Modify | Add new keys + complete missing translations under `aboutContent` |
| `components/sections/about-content.tsx` | Create | Main client component with all sections |
| `app/[locale]/about/page.tsx` | Modify | Replace placeholder with PageHero + AboutContent |

---

### Task 1: Add translation keys

**Files:**
- Modify: `messages/ro.json` — `aboutContent` section (~line 161)
- Modify: `messages/en.json` — `aboutContent` section (~line 161)

- [ ] **Step 1: Add new RO translation keys**

Add the following keys inside the existing `aboutContent` object in `messages/ro.json`. Keep existing keys (`title`, `description`, `description-2`, `description-3`, `description-4`, `visionTitle`, `visionDescription`, `visionDescription-2`, `visionDescription-3`, `missionTitle`, `missionDescription`, `missionDescription-2`, `missionDescription-3`) and add:

```json
"valuesTitle": "Valorile Noastre",
"values": {
  "evidenceBased": {
    "title": "Medicină bazată pe dovezi",
    "description": "Fiecare protocol este fundamentat pe cele mai recente cercetări clinice."
  },
  "personalizedCare": {
    "title": "Îngrijire personalizată",
    "description": "Tratamente adaptate nevoilor și obiectivelor fiecărui pacient."
  },
  "natureHealing": {
    "title": "Vindecare prin natură",
    "description": "Marea, aerul și resursele naturale ca parteneri în procesul de recuperare."
  },
  "holisticApproach": {
    "title": "Abordare holistică",
    "description": "Tratăm persoana în ansamblu, nu doar simptomele."
  }
},
"teamTitle": "Echipa Noastră",
"teamDescription": "Specialiști dedicați sănătății și recuperării tale",
"ctaTitle": "Fă primul pas către o viață mai sănătoasă",
"ctaDescription": "Echipa noastră te așteaptă pentru o evaluare personalizată și un plan de recuperare adaptat nevoilor tale."
```

- [ ] **Step 2: Complete EN translations**

The EN `aboutContent` is incomplete. Replace the entire `aboutContent` object in `messages/en.json` with:

```json
"aboutContent": {
  "title": "About Us",
  "description": "We live in a world of continuous transformation, where the accelerated pace, social pressures, and global instability challenge our health more than ever.",
  "description-2": "In this context, recovery and restoring health become essential. They require an approach that places the person at the center of the process, to offer the possibility of living life to its fullest potential.",
  "description-3": "Vraja Mării by The Sea was born from this need: to create a space where evidence-based medicine and the tranquility of the natural environment come together to support the deep restoration of the body and inner balance.",
  "description-4": "Here, healing begins with calm, time, and attention.",
  "visionTitle": "Our Vision",
  "visionDescription": "We envision a medicine of the future that goes beyond treating symptoms, looking at the person as a whole.",
  "visionDescription-2": "Vraja Mării by The Sea aims to become a benchmark in medical rehabilitation and integrative wellness, a place where science, empathy, and nature work together for recovery, prevention, and health optimization.",
  "visionDescription-3": "We believe in a gentle, personalized, and conscious approach, adapted to the rhythm of each body.",
  "missionTitle": "Our Mission",
  "missionDescription": "At Vraja Mării by The Sea, excellence in Medical Rehabilitation, Physical Medicine, and Balneology meets the principles of Functional Medicine to offer our patients an integrative medical concept, unique in the region.",
  "missionDescription-2": "Our mission is to support through advanced recovery protocols, innovative technologies, and expertise in Balneology and Physical Medicine.",
  "missionDescription-3": "We don't just treat symptoms — we identify and correct the root causes of chronic conditions, for lasting results and overall well-being.",
  "valuesTitle": "Our Values",
  "values": {
    "evidenceBased": {
      "title": "Evidence-Based Medicine",
      "description": "Every protocol is grounded in the latest clinical research."
    },
    "personalizedCare": {
      "title": "Personalized Care",
      "description": "Treatments tailored to each patient's needs and goals."
    },
    "natureHealing": {
      "title": "Nature-Integrated Healing",
      "description": "The sea, air, and natural resources as partners in recovery."
    },
    "holisticApproach": {
      "title": "Holistic Approach",
      "description": "We treat the whole person, not just symptoms."
    }
  },
  "teamTitle": "Our Team",
  "teamDescription": "Specialists dedicated to your health and recovery",
  "ctaTitle": "Take the first step towards a healthier life",
  "ctaDescription": "Our team is ready for a personalized assessment and a recovery plan tailored to your needs."
}
```

- [ ] **Step 3: Commit translations**

```bash
git add messages/ro.json messages/en.json
git commit -m "feat: add about page translation keys (values, team, CTA)"
```

---

### Task 2: Create about-content.tsx

**Files:**
- Create: `components/sections/about-content.tsx`

- [ ] **Step 1: Create the component**

Create `components/sections/about-content.tsx` with the following content:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { FlaskConical, Heart, Waves, CircleDot } from 'lucide-react';
import ParallaxImage from '@/components/ui/parallax-image';
import TransitionLink from '@/components/layout/transition-link';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

const values = [
  { key: 'evidenceBased', icon: FlaskConical },
  { key: 'personalizedCare', icon: Heart },
  { key: 'natureHealing', icon: Waves },
  { key: 'holisticApproach', icon: CircleDot },
] as const;

const team = [
  { name: 'Dr. Tatiana Tulea', titleKey: 'specialist' },
  { name: 'Dr. Daniel Rafti', titleKey: 'specialist' },
  { name: 'Dr. Alexandra Pastramă', titleKey: 'specialist' },
  { name: 'Dr. Camelia Ciobotaru', titleKey: 'specialist' },
];

export default function AboutContent() {
  const t = useTranslations('aboutContent');
  const tCommon = useTranslations('common');

  return (
    <>
      {/* Section 1: Intro Block A — Image left, text right */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ParallaxImage label="About Vraja Marii" src="/images/about/intro-1.webp" />
            <div>
              <p className="text-gray-700 leading-relaxed">
                {t('description')}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('description-2')}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Intro Block B — Text left, image right */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-gray-700 leading-relaxed">
                {t('description-3')}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {t('description-4')}
              </p>
            </div>
            <ParallaxImage label="Seaside Healing" src="/images/about/intro-2.webp" />
          </div>
        </div>
      </motion.section>

      {/* Section 3: Vision & Mission */}
      <motion.section {...fadeInUp} className="bg-[#F2E4D1]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision Card */}
            <div className="border-t-4 border-[#002343] bg-white p-8 lg:p-10">
              <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('visionTitle')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">{t('visionDescription')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('visionDescription-2')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('visionDescription-3')}</p>
            </div>
            {/* Mission Card */}
            <div className="border-t-4 border-[#CF9C7C] bg-white p-8 lg:p-10">
              <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
                {t('missionTitle')}
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">{t('missionDescription')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('missionDescription-2')}</p>
              <p className="mt-4 text-gray-700 leading-relaxed">{t('missionDescription-3')}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 4: Core Values */}
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="text-center font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
            {t('valuesTitle')}
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {values.map(({ key, icon: Icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <Icon size={24} className="mx-auto text-[#002343]" />
                <h3 className="mt-4 font-semibold text-gray-900">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t(`values.${key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 5: Team */}
      <section className="bg-[#F2E4D1]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-12 lg:py-28">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
              {t('teamTitle')}
            </h2>
            <p className="mt-4 text-gray-600">{t('teamDescription')}</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {team.map(({ name }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="aspect-square w-full bg-gray-200" />
                <h3 className="mt-4 font-semibold text-gray-900">{name}</h3>
                <p className="mt-1 text-sm text-gray-600">Medic Specialist</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Timeline (commented out — awaiting management decision) */}
      {/*
      <motion.section {...fadeInUp}>
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-12 lg:py-28">
          <h2 className="text-center font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl">
            {t('timelineTitle')}
          </h2>
          <div className="relative mt-12">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#D1CCC7]" />
            {timelineEntries.map((entry, i) => (
              <div key={i} className={`relative mb-12 flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="w-5/12 bg-white p-6">
                  <p className="text-sm font-medium uppercase tracking-wider text-[#CF9C7C]">{entry.year}</p>
                  <h3 className="mt-2 font-semibold text-gray-900">{entry.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
      */}

      {/* Section 7: CTA */}
      <section className="bg-[#002343] px-6 py-20 lg:px-12 lg:py-28 light-header-section">
        <motion.div {...fadeInUp} className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-white sm:text-4xl">
            {t('ctaTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            {t('ctaDescription')}
          </p>
          <TransitionLink
            href="/book"
            className="mt-8 inline-flex items-center gap-2 bg-white px-8 py-4 text-sm font-medium uppercase tracking-wider text-[#002343] transition-colors hover:bg-gray-100"
          >
            {tCommon('requestStay')}
          </TransitionLink>
        </motion.div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Commit component**

```bash
git add components/sections/about-content.tsx
git commit -m "feat: create about-content component with all sections"
```

---

### Task 3: Update page.tsx

**Files:**
- Modify: `app/[locale]/about/page.tsx`

- [ ] **Step 1: Replace placeholder with PageHero + AboutContent**

Replace the entire file content with:

```tsx
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/layout/page-hero';

const AboutContent = dynamic(() => import('@/components/sections/about-content'));

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutPageInner />;
}

function AboutPageInner() {
  const t = useTranslations('aboutContent');

  return (
    <>
      <PageHero title={t('title')} />
      <AboutContent />
    </>
  );
}
```

Note: `AboutPageInner` is a server component that reads translations and passes them as props to `PageHero`. `AboutContent` is dynamically imported (client component) and reads its own translations via `useTranslations`.

- [ ] **Step 2: Commit page update**

```bash
git add app/[locale]/about/page.tsx
git commit -m "feat: wire up about page with PageHero and AboutContent"
```

---

### Task 4: Verify

- [ ] **Step 1: Run dev server and check**

```bash
pnpm dev
```

Open `http://localhost:3000/despre` (RO) and `http://localhost:3000/en/about` (EN). Verify:
- PageHero renders with "Despre noi" / "About Us"
- Intro blocks alternate image/text correctly
- Vision & Mission cards display side by side on desktop, stacked on mobile
- Core values show 4 cards with icons in a row on desktop, 2x2 on mobile
- Team section shows 4 placeholder doctor cards
- Timeline section is not visible (commented out)
- CTA section shows navy background with white text and button
- Parallax effect works on scroll for intro images
- All animations trigger on scroll
- Language switcher works between RO and EN

- [ ] **Step 2: Final commit if any adjustments needed**
