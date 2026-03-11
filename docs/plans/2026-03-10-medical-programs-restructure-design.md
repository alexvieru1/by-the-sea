# Medical Programs Restructure - Design

## Summary
Rename "therapies" to "medical programs" across routes, translations, and navigation. Restructure the homepage to show 5 full-screen medical program showcases (replacing the 3 showcases + 2x2 grid). Merge endometriosis & infertility into one combined section/route.

## Homepage Section Order

| # | Section | Component | Layout | Card Color | Route |
|---|---------|-----------|--------|------------|-------|
| 1 | Medical Rehabilitation | `ShowcaseSection` | left | `#0097a7` (teal) | `/medical-programs/medical-rehabilitation` |
| 2 | Endometriosis & Infertility | Custom video+card | side-by-side | `#B19C82` (warm tan) | `/medical-programs/endometriosis-infertility` |
| 3 | Longevity | `ShowcaseSection` | right | `#798B6F` (sage green) | `/medical-programs/longevity` |
| 4 | Rheumatology | `ShowcaseSection` | left | `#8FA3A8` (steel blue) | `/medical-programs/rheumatology` |
| 5 | Post-Chemo Rehabilitation | `ShowcaseSection` | right | `#BCA390` (dusty tan) | `/medical-programs/post-chemotherapy` |

## Route Changes
- `/therapies` → `/medical-programs`
- `/therapies/[slug]` → `/medical-programs/[slug]`
- Valid slugs: `medical-rehabilitation`, `endometriosis-infertility`, `longevity`, `rheumatology`, `post-chemotherapy`
- Remove: `infertility` (merged), `endometriosis` (merged), `wellness` (stays in grid component, not on homepage)

## Translation Changes
- New namespace: `medicalPrograms` (replaces separate top-level keys + `therapies.*`)
- Keys: `medicalPrograms.medicalRehabilitation`, `medicalPrograms.endometriosisInfertility`, `medicalPrograms.longevity`, `medicalPrograms.rheumatology`, `medicalPrograms.postChemotherapy`
- Each has: `title`, `subtitle`, `description` (+ `description-2` etc. as needed)
- Nav: "Therapies" → "Medical Programs" / "Programe Medicale"

## Component Changes
- New: `rheumatology-section.tsx`, `post-chemo-section.tsx` (using `ShowcaseSection`)
- Modify: `endometriosis-section.tsx` to include infertility content
- Remove from homepage: `TherapiesPreview` import (keep component file)
- Update: `showcase-section.tsx` links from `/therapies/` to `/medical-programs/`

## Homepage Structure (after)
```
HeroSection
MedicalRehabilitationSection
EndometriosisInfertilitySection
LongevitySection
RheumatologySection
PostChemoSection
FacilitiesSection
FooterSection
```

## Detail Pages
- Move `app/[locale]/therapies/` → `app/[locale]/medical-programs/`
- Update `therapy-page-client.tsx` slug map and colors
- Merge endometriosis+infertility slug
