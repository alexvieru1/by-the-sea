# About Page Design Spec

## Overview

A production-ready About page for Vraja Marii by the Sea, following existing patterns (page-hero, alternating content sections, brand palette). Balances clinical credibility with warm, human tone.

## Content Source

Translations already exist in `messages/ro.json` and `messages/en.json` under `aboutContent` namespace. New keys needed for: core values, team section, timeline (commented out), and CTA.

## Page Structure

### Section 1: Page Hero

- Reuse existing `page-hero.tsx` component
- Translation key: `aboutContent.title` ("Despre noi")
- Default cream background (`#F2E4D1`)

### Section 2: Intro / Story

Two alternating text + image blocks, same layout pattern as `patient-guide-content.tsx`:

**Block A:**
- Left: `ParallaxImage` (placeholder, will be replaced with real photo by March 20)
- Right: `aboutContent.description` + `aboutContent.description-2`

**Block B:**
- Left: `aboutContent.description-3` + `aboutContent.description-4`
- Right: `ParallaxImage` (placeholder)

- Container: `max-w-6xl`, `px-6 py-20 lg:px-12 lg:py-28`
- Grid: `grid items-center gap-12 lg:grid-cols-2`
- Text: Quicksand font-thin for any sub-headings, gray-700 body text
- Animation: `fadeInUp` on each block (same as patient-guide)

### Section 3: Vision & Mission

Background: `#F2E4D1` (cream)

Two cards side by side in a `grid lg:grid-cols-2 gap-8` layout:

**Vision card:**
- White background
- Top border: 4px navy (`#002343`)
- Title: `aboutContent.visionTitle` in Quicksand font-thin
- Body: `aboutContent.visionDescription`, `visionDescription-2`, `visionDescription-3`

**Mission card:**
- White background
- Top border: 4px copper (`#CF9C7C`)
- Title: `aboutContent.missionTitle` in Quicksand font-thin
- Body: `aboutContent.missionDescription`, `missionDescription-2`, `missionDescription-3`

Cards stack vertically on mobile. Fade-in animation.

### Section 4: Core Values

Background: white

Centered heading: "Valorile Noastre" (new translation key: `aboutContent.valuesTitle`)

4 cards in `grid grid-cols-2 lg:grid-cols-4 gap-8`:

Each card:
- Lucide icon (size 24, navy `#002343`)
- Title (font-semibold, gray-900)
- Short description (text-sm, gray-600)

Values (new translation keys under `aboutContent.values`):

1. `evidenceBased` — icon: `FlaskConical` — "Medicină bazată pe dovezi" / "Evidence-Based Medicine" — "Fiecare protocol este fundamentat pe cele mai recente cercetări clinice." / "Every protocol is grounded in the latest clinical research."
2. `personalizedCare` — icon: `Heart` — "Îngrijire personalizată" / "Personalized Care" — "Tratamente adaptate nevoilor și obiectivelor fiecărui pacient." / "Treatments tailored to each patient's needs and goals."
3. `natureHealing` — icon: `Waves` — "Vindecare prin natură" / "Nature-Integrated Healing" — "Marea, aerul și resursele naturale ca parteneri în procesul de recuperare." / "The sea, air, and natural resources as partners in recovery."
4. `holisticApproach` — icon: `CircleDot` — "Abordare holistică" / "Holistic Approach" — "Tratăm persoana în ansamblu, nu doar simptomele." / "We treat the whole person, not just symptoms."

Staggered fade-in animation on scroll.

### Section 5: Team

Background: `#F2E4D1` (cream)

Centered heading: "Echipa Noastră" (new key: `aboutContent.teamTitle`)
Optional subheading (new key: `aboutContent.teamDescription`)

4 cards in `grid grid-cols-2 lg:grid-cols-4 gap-8`:

Each card:
- `aspect-square` placeholder photo (gray-200 bg, will be replaced)
- Name: font-semibold, gray-900
- Title/specialty: text-sm, gray-600

Initial team data (hardcoded array in component):

| Name | Title (RO) | Title (EN) |
|------|-----------|-----------|
| Dr. Tatiana Tulea | Medic Specialist | Medical Specialist |
| Dr. Daniel Rafti | Medic Specialist | Medical Specialist |
| Dr. Alexandra Pastramă | Medic Specialist | Medical Specialist |
| Dr. Camelia Ciobotaru | Medic Specialist | Medical Specialist |

Titles are generic placeholders — to be updated with real specialties.

Staggered fade-in animation.

### Section 6: Timeline (Commented Out)

Vertical timeline on white background. Implementation ready but fully commented out in JSX. Awaiting management decision (check week of March 23).

Structure when enabled:
- Centered vertical line
- Alternating left/right milestone cards
- Each: year, title, description
- Translation keys under `aboutContent.timeline`

### Section 7: CTA

Background: navy `#002343`
Centered layout, similar to insurance CTA in patient-guide:

- Heading: Quicksand font-thin, white text (new key: `aboutContent.ctaTitle`)
- Subtext: white/80 (new key: `aboutContent.ctaDescription`)
- Button: white bg, navy text, links to `/waitlist`, uppercase tracking-wider

## File Structure

```
components/sections/about-content.tsx   — main client component
messages/ro.json                        — add new keys under aboutContent
messages/en.json                        — add new keys under aboutContent
app/[locale]/about/page.tsx             — update to use PageHero + AboutContent
```

## Brand Constraints

- Colors: only `#002343`, `#172C33`, `#F2E4D1`, `#CF9C7C`, `#D1CCC7` + black/white
- Font: Quicksand font-thin for all headings
- No rounded corners on any element
- Photos: all placeholders until March 20

## Dependencies

- `ParallaxImage` from `@/components/ui/parallax-image`
- `PageHero` from `@/components/layout/page-hero`
- `motion` for fade-in animations
- `lucide-react` for value icons
- `next-intl` for translations
