# Patient Guide Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the patient guide page with structured medical content, placeholder photos, and extract a reusable PageHero component from the duplicated hero pattern.

**Architecture:** Server component page using next-intl translations. Reusable PageHero replaces duplicated hero markup across 3 existing components. Patient guide content organized in alternating text/image sections.

**Tech Stack:** Next.js (App Router), next-intl, Motion (motion/react), Tailwind CSS, Lucide icons

---

### Task 1: Create reusable PageHero component

**Files:**
- Create: `components/layout/page-hero.tsx`

**Step 1: Create the component**

Client component (needs motion animations). Props:
- `title: string`
- `subtitle?: string`
- `description?: string`
- `bgColor?: string` (default: `'#c5d5d8'`)
- `meta?: string` (for policy version line)
- `children?: React.ReactNode` (for extra content below description)

Matches existing hero pattern: animated blobs, staggered fade-in text, Playfair  h1.

**Step 2: Commit**

```bash
git add components/layout/page-hero.tsx
git commit -m "feat: create reusable PageHero component"
```

---

### Task 2: Refactor existing pages to use PageHero

**Files:**
- Modify: `components/layout/placeholder-page.tsx`
- Modify: `components/layout/policy-page-layout.tsx`
- Modify: `components/gallery/gallery-page-client.tsx`

**Step 1: Update placeholder-page.tsx**
Replace the hero section (lines 16-78) with `<PageHero>` using translation keys.

**Step 2: Update policy-page-layout.tsx**
Replace the hero section (lines 20-38) with `<PageHero>`, passing `meta` for version line. Note: this is a server component — PageHero will be a client component imported into it, which is fine.

**Step 3: Update gallery-page-client.tsx**
Replace the hero section (lines 13-49) with `<PageHero>`.

**Step 4: Verify dev server renders all pages correctly**

**Step 5: Commit**

```bash
git add components/layout/placeholder-page.tsx components/layout/policy-page-layout.tsx components/gallery/gallery-page-client.tsx
git commit -m "refactor: use PageHero component in existing pages"
```

---

### Task 3: Add patient guide translations

**Files:**
- Modify: `messages/ro.json`
- Modify: `messages/en.json`

**Step 1: Add `patientGuide` content namespace**

Add a new top-level `"patientGuide"` key (separate from `pages.patientGuide` which already has title/subtitle/description) with sections:
- `admission` — scheduling, confirmation, advance payment
- `insuranceCheck` — CNAS verification explanation + CTA text
- `documents` — required documents list
- `yourStay` — check-in, treatment plan, daily routine, fișa tratament
- `notices` — discharge card, room presence, right to refuse, medical staff contact
- `contraindications.absolute` — title, warning, items list
- `contraindications.relative` — title, note, items list with categories
- `closingNote` — the positive closing paragraph

Both ro.json and en.json.

**Step 2: Commit**

```bash
git add messages/ro.json messages/en.json
git commit -m "feat: add patient guide translations (ro + en)"
```

---

### Task 4: Build patient guide page component

**Files:**
- Create: `components/sections/patient-guide-content.tsx`
- Modify: `app/[locale]/patient-guide/page.tsx`

**Step 1: Create patient-guide-content.tsx**

Client component with sections:

1. **Admission Process** — placeholder image left (gray box labeled "Photo: Reception Area"), text right
2. **Insurance Check CTA** — full-width teal card with explanation + external link button to `https://siui.casan.ro/asigurati/` (target _blank, ExternalLink icon)
3. **Required Documents** — text left with checklist, placeholder image right ("Photo: Documents / Lobby")
4. **Your Stay** — placeholder image left ("Photo: Treatment Room"), text right
5. **Important Notices** — 2-column grid of warning-style cards (coral left border accent)
6. **Contraindications Absolute** — section with coral accent, bullet list
7. **Photo Divider** — full-width placeholder ("Photo: Sea View / Facility")
8. **Contraindications Relative** — section with amber accent, categorized lists
9. **Closing Note** — centered warm paragraph

Each section uses motion fade-in on scroll (`whileInView`).
Placeholder images: `bg-gray-300` divs with centered label text, aspect ratio via Tailwind.

**Step 2: Update page.tsx**

Replace `PlaceholderPage` with `PageHero` + `PatientGuideContent`. Server component calling `setRequestLocale`.

**Step 3: Verify in browser**

**Step 4: Commit**

```bash
git add components/sections/patient-guide-content.tsx app/[locale]/patient-guide/page.tsx
git commit -m "feat: build patient guide page with structured content sections"
```
