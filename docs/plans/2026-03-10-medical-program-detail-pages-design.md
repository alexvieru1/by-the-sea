# Medical Program Detail Pages - Design

## Summary
Replace the current "Coming Soon" detail pages for each medical program with a full content layout: hero, two parallax photo+text sections (alternating), and a therapies grid.

## Page Structure (per program)

### Section 1: Page Hero (existing)
Keep current hero from `therapy-page-client.tsx` — colored background with animated orb, subtitle, title, description. No changes needed.

### Section 2: Photo Left / Text Right
- **Left (50%):** Portrait image inside overflow-hidden container with parallax depth effect (same `useScroll` + `useTransform` pattern from showcase-section.tsx — image scales from 1.1→1 and translates Y on scroll)
- **Right (50%):** Small caps subtitle label, heading (Playfair italic), 2-3 paragraphs of body text
- White background, generous padding
- Mobile: stacked (image on top, text below)

### Section 3: Text Left / Photo Right
- Mirror of Section 2
- **Left (50%):** Text content (different subtitle, heading, paragraphs)
- **Right (50%):** Portrait image with same parallax treatment
- White background
- Mobile: stacked (image on top, text below — consistent order)

### Section 4: Program Therapies Grid
- Section heading: "Included Therapies" / "Terapii Incluse"
- Light gray background (`bg-gray-50`)
- 3-column grid (desktop), 1-column (mobile)
- Each card: colored accent bar top, therapy name, short description
- Card accent color matches the program's hero color
- 4-6 dummy therapies per program

## Translation Structure

All content under `medicalPrograms.[key].page`:
```json
"medicalRehabilitation": {
  "title": "...",
  "subtitle": "...",
  "description": "...",
  "page": {
    "section1Title": "...",
    "section1Subtitle": "...",
    "section1Text": "...",
    "section1Text2": "...",
    "section2Title": "...",
    "section2Subtitle": "...",
    "section2Text": "...",
    "section2Text2": "...",
    "therapiesTitle": "Included Therapies",
    "therapies": {
      "t1": { "name": "...", "description": "..." },
      "t2": { "name": "...", "description": "..." }
    }
  }
}
```

## Components

- **New:** `ProgramContentSection` — reusable parallax photo + text component, accepts `align: 'left' | 'right'` (photo side), translation keys, image src
- **Modify:** `therapy-page-client.tsx` — replace "Coming Soon" section with content sections + therapies grid
- No new route files needed

## Images
Use existing placeholder images (`your_body.webp`, `your_future.webp`) — replace later with real photos.
