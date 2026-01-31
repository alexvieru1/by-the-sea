# CLAUDE.md - Neko Health Website Recreation

## Project Overview
A modern health-tech landing page inspired by Neko Health, built with Next.js, Tailwind CSS, Motion, Lenis smooth scroll, GSAP, and next-intl for internationalization.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Motion (motion.dev) + GSAP
- **Smooth Scroll**: Lenis
- **i18n**: next-intl (Romanian primary, English secondary)
- **Typography**: Custom serif font for headings (similar to a light/thin serif like Tiempos or similar), sans-serif for body

## Internationalization (i18n) Setup

### Supported Locales
- `ro` - Romanian (default/primary)
- `en` - English (secondary)

### Folder Structure for i18n
```
src/
├── i18n/
│   ├── request.ts          # Server-side locale config
│   └── routing.ts          # Routing configuration
├── messages/
│   ├── ro.json             # Romanian translations (primary)
│   └── en.json             # English translations
├── app/
│   └── [locale]/           # Dynamic locale segment
│       ├── layout.tsx
│       ├── page.tsx
│       └── ...
└── middleware.ts           # Locale detection & redirects
```

### Configuration Files

#### `src/i18n/routing.ts`
```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed' // Only show /en for English, / for Romanian
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

#### `src/i18n/request.ts`
```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
```

#### `middleware.ts`
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(ro|en)/:path*']
};
```

#### `next.config.js`
```javascript
const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  // Other Next.js config
});
```

### Translation Files Structure

#### `messages/ro.json` (Primary)
```json
{
  "common": {
    "bookScan": "Programează Scanare",
    "learnMore": "Află Mai Multe",
    "getDirections": "Indicații"
  },
  "nav": {
    "bodyScan": "Scanare Corporală Neko",
    "support": "Suport",
    "about": "Despre Noi",
    "login": "Autentificare",
    "faq": "Întrebări Frecvente"
  },
  "hero": {
    "title1": "Un control medical mai bun.",
    "title2": "În sfârșit.",
    "description": "Beneficiază de un control medical complet, cum nu ai mai experimentat până acum. Primește toate rezultatele instantaneu."
  },
  "dataPoints": {
    "title1": "Urmărește milioane de puncte de date.",
    "title2": "În doar câteva minute.",
    "labels": {
      "bloodVessels": "VASE DE SÂNGE",
      "heartRhythm": "RITM CARDIAC",
      "skinMapping": "CARTOGRAFIERE PIELE",
      "diabetesFactors": "FACTORI DIABET",
      "metabolism": "METABOLISM",
      "immuneSystem": "SISTEM IMUNITAR",
      "peripheralArteries": "ARTERE PERIFERICE",
      "oxygenation": "OXIGENARE",
      "bodyMeasurements": "MĂSURĂTORI CORPORALE"
    }
  },
  "yourBody": {
    "title": "Corpul tău",
    "description": "Inspecțiile regulate sunt obligatorii pentru mașinile de pe drumurile noastre, dar în sistemul nostru de sănătate, așteptăm adesea până când corpul nostru cedează înainte de a lua măsuri. De ce să nu prioritizăm sănătatea în același mod?"
  },
  "yourFuture": {
    "title": "Viitorul tău",
    "description": "Echipând medicii noștri cu cele mai bune instrumente pentru a avea grijă de monitorizarea sănătății tale, modelul nostru de îngrijire condus de medici oferă o experiență mai bună pentru toți."
  },
  "buildData": {
    "title1": "Construiește pe baza datelor tale.",
    "title2": "În fiecare an.",
    "prevention": {
      "label": "Prevenție",
      "title": "Fii cu un pas înaintea sănătății tale"
    },
    "benchmark": {
      "label": "Comparație",
      "title": "Compară-te cu semenii tăi"
    },
    "trackChange": {
      "label": "Urmărește Schimbarea",
      "title": "Îmbunătățește-ți valorile în timp"
    }
  },
  "locations": {
    "label": "Locațiile Noastre",
    "title": "Centre Neko Health",
    "description": "Centrele Neko Health sunt situate convenabil în inima orașelor London, Manchester, Birmingham și Stockholm."
  },
  "testimonials": {
    "label": "Membrii Noștri"
  },
  "media": {
    "title": "Apariții media"
  },
  "footer": {
    "cta": "Fă primul pas pentru a fi cu un pas înaintea sănătății tale",
    "company": "Companie",
    "members": "Membri",
    "follow": "Urmărește-ne",
    "healthCentres": "Centre de Sănătate",
    "careers": "Cariere",
    "pressRoom": "Presă",
    "cookieNotice": "Politica Cookie",
    "privacyPolicy": "Politica de Confidențialitate",
    "termsOfService": "Termeni și Condiții"
  }
}
```

#### `messages/en.json` (Secondary)
```json
{
  "common": {
    "bookScan": "Book a Scan",
    "learnMore": "Learn More",
    "getDirections": "Get Directions"
  },
  "nav": {
    "bodyScan": "Neko Body Scan",
    "support": "Support",
    "about": "About",
    "login": "Log In",
    "faq": "FAQ"
  },
  "hero": {
    "title1": "A better health check.",
    "title2": "Finally.",
    "description": "Get a thorough health check, like you've never experienced before. Receive all your results instantly."
  },
  "dataPoints": {
    "title1": "Track millions of data points.",
    "title2": "In just a few minutes.",
    "labels": {
      "bloodVessels": "BLOOD VESSELS",
      "heartRhythm": "HEART RHYTHM",
      "skinMapping": "SKIN MAPPING",
      "diabetesFactors": "DIABETES FACTORS",
      "metabolism": "METABOLISM",
      "immuneSystem": "IMMUNE SYSTEM",
      "peripheralArteries": "PERIPHERAL ARTERIES",
      "oxygenation": "OXYGENATION",
      "bodyMeasurements": "BODY MEASUREMENTS"
    }
  },
  "yourBody": {
    "title": "Your body",
    "description": "Regular inspections are mandatory for cars on our roads, but in our healthcare system, we often wait until our bodies break down before taking action. So why not prioritise our health the same way?"
  },
  "yourFuture": {
    "title": "Your future",
    "description": "By equipping our doctors with the best tools to take care of tracking your health, our doctor led model of care provides a better experience for everyone."
  },
  "buildData": {
    "title1": "Build upon your data.",
    "title2": "Every Year.",
    "prevention": {
      "label": "Prevention",
      "title": "Stay ahead of your health"
    },
    "benchmark": {
      "label": "Benchmark",
      "title": "Compare with your peers"
    },
    "trackChange": {
      "label": "Track Change",
      "title": "Improve your values over time"
    }
  },
  "locations": {
    "label": "Our Locations",
    "title": "Neko Health Centres",
    "description": "Neko Health Centres are conveniently located in the heart of London, Manchester, Birmingham and Stockholm."
  },
  "testimonials": {
    "label": "Our Members"
  },
  "media": {
    "title": "Featured media"
  },
  "footer": {
    "cta": "Take the first step in getting ahead of your health",
    "company": "Company",
    "members": "Members",
    "follow": "Follow",
    "healthCentres": "Health Centres",
    "careers": "Careers",
    "pressRoom": "Press Room",
    "cookieNotice": "Cookie Notice",
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Terms of Service"
  }
}
```

### Usage in Components

#### Server Components
```typescript
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');
  
  return (
    <section>
      <h1>
        <span>{t('title1')}</span>
        <span>{t('title2')}</span>
      </h1>
      <p>{t('description')}</p>
    </section>
  );
}
```

#### Client Components
```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function Button() {
  const t = useTranslations('common');
  return <button>{t('bookScan')}</button>;
}
```

### Language Switcher Component
```typescript
'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'ro' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLocale('ro')}
        className={locale === 'ro' ? 'font-bold' : ''}
      >
        RO
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={locale === 'en' ? 'font-bold' : ''}
      >
        EN
      </button>
    </div>
  );
}
```

## URL Structure
- `/` - Romanian homepage (default)
- `/en` - English homepage
- `/despre` - Romanian about page
- `/en/about` - English about page

## Design System

### Colors
```css
--color-primary: #0097a7;        /* Teal/Cyan - primary brand color */
--color-primary-dark: #00838f;   /* Darker teal for hover states */
--color-coral: #f07060;          /* Coral/salmon - accent for "Your body" section */
--color-light-blue: #d8f0f2;     /* Light cyan background */
--color-pink-beige: #e8d8d4;     /* Dusty pink/beige for scan sections */
--color-text-dark: #1a1a1a;      /* Near black for headings */
--color-text-light: #6b7280;     /* Gray for secondary text */
--color-text-muted: #9ca3af;     /* Muted gray/blue for accent text */
--color-white: #ffffff;
--color-dark: #2d3436;           /* Dark gray for dark buttons */
```

### Typography
```css
/* Headings - Light/thin serif italic font */
font-family: 'Tiempos Fine', 'Times New Roman', serif;
font-weight: 300;
font-style: italic;

/* Body text - Clean sans-serif */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400;

/* Heading sizes */
h1: 4rem - 6rem (64px - 96px) - hero headlines
h2: 2.5rem - 4rem (40px - 64px) - section titles
h3: 1.5rem - 2rem (24px - 32px) - card titles
body: 1rem - 1.125rem (16px - 18px)
small/labels: 0.75rem - 0.875rem (12px - 14px) uppercase tracking-wider
```

### Spacing
- Section padding: `py-24` to `py-32` (96px - 128px)
- Container max-width: `max-w-7xl` with `px-4` or `px-6`
- Component gaps: `gap-8` to `gap-16`

## Page Structure & Sections

### 1. Navigation Header
- **Position**: Fixed top, transparent background initially, solid on scroll
- **Layout**: Logo left, nav links center, CTA button right
- **Elements**:
  - Logo (simple wordmark)
  - Nav links: "Scanare Corporală Neko", "Suport", "Despre Noi"
  - "Programează Scanare" CTA button (teal with arrow)
  - Language switcher (RO/EN) - RO first
- **Mobile**: Hamburger menu with slide-out drawer
- **Animation**: Background opacity transition on scroll

### 2. Announcement Banner
- **Position**: Above header, full width
- **Style**: Dark/black background, white text
- **Content**: Announcement text + link
- **Dismissible**: X button to close

### 3. Hero Section
- **Layout**: Full viewport height, centered content
- **Background**: Light blue/cyan gradient (#d8f0f2)
- **Content**:
  - Large headline: "Un control medical mai bun." (black) + "În sfârșit." (muted blue)
  - Subtext paragraph
  - CTA button
- **Image**: Full-body person image with dot-matrix/scan effect overlay
- **Animation**: 
  - Text fade-in and slide-up on load
  - Parallax on scroll
  - Body scan dots animate as particle effect

### 4. Data Points Section
- **Layout**: Full width, white background
- **Headline**: "Urmărește milioane de puncte de date." (black) + "În doar câteva minute." (muted)
- **Visual**: 3D animated point cloud/mesh forming body shape
- **Labels**: Floating pill badges that appear on scroll:
  - "VASE DE SÂNGE", "RITM CARDIAC", "CARTOGRAFIERE PIELE"
  - "FACTORI DIABET", "METABOLISM", "SISTEM IMUNITAR"
  - "ARTERE PERIFERICE", "OXIGENARE", "MĂSURĂTORI CORPORALE"
- **Animation**: 
  - GSAP ScrollTrigger for 3D point cloud rotation
  - Labels fade in/out based on scroll position
  - Sticky section with scroll-driven animation

### 5. "Corpul tău" Section
- **Layout**: Split layout - content card left, image right
- **Background**: Dusty pink (#e8d8d4)
- **Left side**: 
  - Coral/salmon card (#f07060)
  - Heading: "Corpul tău" (white, italic serif)
  - Body text (white)
  - "Programează Scanare" button (dark)
- **Right side**: Person image with scanning dot overlay animation
- **Animation**: 
  - Card slides in from left
  - Scanning dots animate across body
  - Parallax on image

### 6. "Viitorul tău" Section
- **Layout**: Split layout - image left, content card right
- **Background**: Light cyan (#d8f0f2)
- **Left side**: Person image with scanning effect
- **Right side**:
  - Teal card (#0097a7)
  - Heading: "Viitorul tău" (white, italic serif)
  - Body text (white)
  - "Programează Scanare" button (dark)
- **Animation**: Similar to "Corpul tău" but mirrored

### 7. Build Upon Your Data Section (To be implemented)
- **Layout**: Centered heading + horizontal card carousel
- **Headline**: "Construiește pe baza datelor tale." + "În fiecare an."
- **Cards**: Prevenție, Comparație, Urmărește Schimbarea
- **Animation**: Horizontal scroll carousel

### 8. Locations Section (To be implemented)
- **Layout**: Tab navigation + location cards grid
- **Tabs**: London, Manchester, Birmingham, Stockholm
- **Cards**: Location name, address, "Indicații" link

### 9. Testimonials Section (To be implemented)
- **Layout**: Horizontal carousel
- **Cards**: Quote, name, "[Membru Neko]" label

### 10. Featured Media Section (To be implemented)
- **Layout**: Horizontal scrolling logos/links
- **Outlets**: Bloomberg, The Guardian, The Standard, Wallpaper, NYT

### 11. Footer CTA Section (To be implemented)
- **Layout**: Full width, dark image background
- **Content**: Headline + CTA button

### 12. Footer (To be implemented)
- **Layout**: Multi-column links
- **Columns**: Companie, Membri, Urmărește-ne, Centre de Sănătate
- **Bottom**: Copyright, Cookie/Privacy/Terms links, Country selector

## Key Animation Patterns

### Scroll-Triggered Animations (GSAP + ScrollTrigger)
```javascript
// Sticky section with progress-based animation
gsap.to(".point-cloud", {
  scrollTrigger: {
    trigger: ".data-section",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    pin: true
  },
  rotationY: 360
});
```

### Smooth Scroll (Lenis)
```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});
```

### Entrance Animations (Motion)
```javascript
import { motion, useInView } from "motion/react";

// Basic fade-in on scroll
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// Staggered children
<motion.ul
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map((item) => (
    <motion.li
      key={item}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.ul>
```

### Button Hover Effects (Motion)
```javascript
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Programează Scanare
</motion.button>
```

### Scroll-Linked Animations (Motion)
```javascript
import { motion, useScroll, useTransform } from "motion/react";

function ParallaxSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  return <motion.div style={{ y }}>Parallax content</motion.div>;
}
```

## Component Structure
```
src/
├── app/
│   └── [locale]/               # Dynamic locale routing
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── announcement-banner.tsx
│   │   └── language-switcher.tsx
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── data-points-section.tsx
│   │   ├── your-body-section.tsx
│   │   ├── your-future-section.tsx
│   │   ├── build-data-section.tsx
│   │   ├── locations-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── media-section.tsx
│   │   └── footer-section.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── container.tsx
│   └── animations/
│       ├── point-cloud.tsx
│       ├── scan-overlay.tsx
│       └── parallax-image.tsx
├── i18n/
│   ├── request.ts
│   └── routing.ts
├── messages/
│   ├── ro.json                 # Primary language
│   └── en.json                 # Secondary language
├── hooks/
│   ├── useLenis.ts
│   └── useScrollProgress.ts
├── lib/
│   └── animations.ts
└── middleware.ts
```

## Implementation Notes

### Point Cloud / Body Scan Effect
The 3D point cloud effect showing the body being scanned can be achieved with:
- Three.js for 3D point cloud rendering
- OR CSS/Canvas with positioned dots and GSAP animation
- Points should appear to "wave" or flow across the surface
- Labels float and fade based on scroll position

### Scanning Dots Overlay
For the body images with scanning effect:
- Absolutely positioned dot grid
- CSS mask or clip-path following body contour
- Animate dots with staggered opacity/position
- Use motion blur effect on body images

### Sticky Scroll Sections
The data points section uses a pinned/sticky scroll effect:
- Section stays fixed while content animates
- ScrollTrigger with `pin: true`
- Progress-based animation state

### Image Treatment
- Soft, diffused lighting
- Slight motion blur on body images (CSS blur filter)
- Dot overlay animations
- Pink/beige or blue/cyan color grading

## Tailwind Config Extensions
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'neko-teal': '#0097a7',
        'neko-coral': '#f07060',
        'neko-blue': '#d8f0f2',
        'neko-pink': '#e8d8d4',
      },
      fontFamily: {
        serif: ['Tiempos Fine', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

## Package Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "motion": "^11.0.0",
    "gsap": "^3.12.0",
    "lenis": "^1.0.0",
    "next-intl": "^3.0.0"
  }
}
```

## Getting Started
```bash
npm install
npm run dev
```

## Next Steps
1. Set up base layout with Header, Footer, and i18n (RO default)
2. Implement Hero section with basic animations
3. Create the Data Points section with point cloud visualization
4. Build Corpul tău / Viitorul tău split sections
5. Add remaining sections (Locations, Testimonials, Media)
6. Polish animations and transitions
7. Mobile responsive optimization
8. Test all translations (RO & EN)