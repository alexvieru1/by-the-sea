# Medical Program Detail Pages - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace "Coming Soon" detail pages with full content layouts: hero, two parallax photo+text sections, and a therapies grid — all with dummy content.

**Architecture:** Create a reusable `ProgramContentSection` component for the parallax photo+text rows. Create a `ProgramTherapiesGrid` component for the therapies list. Update `therapy-page-client.tsx` to use these instead of the Coming Soon block. Add dummy translations for all 5 programs.

**Tech Stack:** Next.js, next-intl, Motion (motion/react), Tailwind CSS, Next/Image

---

### Task 1: Add Dummy Translation Content

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/ro.json`

**Step 1: Add `page` sub-keys to each program in both translation files**

Add a `page` object inside each of the 5 `medicalPrograms.*` entries. Structure:

**EN — `medicalPrograms.medicalRehabilitation.page`:**
```json
"page": {
  "section1Subtitle": "Our Approach",
  "section1Title": "Evidence-Based Recovery",
  "section1Text": "Our medical rehabilitation programs are built on the latest clinical research, combining traditional physiotherapy techniques with cutting-edge regenerative medicine.",
  "section1Text2": "Each treatment plan is personalised by our team of specialists, ensuring optimal recovery outcomes tailored to your specific condition and goals.",
  "section2Subtitle": "Your Journey",
  "section2Title": "A Path to Renewed Strength",
  "section2Text": "From initial assessment through to discharge, our multidisciplinary team guides you through every stage of rehabilitation with expertise and compassion.",
  "section2Text2": "Our seaside location provides the ideal environment for recovery — fresh air, natural light, and the therapeutic benefits of the Black Sea coast.",
  "therapiesTitle": "Included Therapies",
  "therapies": {
    "t1": { "name": "Physiotherapy", "description": "Targeted exercises and manual therapy to restore movement and function." },
    "t2": { "name": "Balneotherapy", "description": "Therapeutic bathing using mineral-rich waters from natural sources." },
    "t3": { "name": "Electrotherapy", "description": "Electrical stimulation techniques to reduce pain and accelerate healing." },
    "t4": { "name": "Kinesiotherapy", "description": "Movement-based therapy designed to improve mobility and coordination." },
    "t5": { "name": "Massage Therapy", "description": "Therapeutic massage to relieve tension, improve circulation, and support recovery." }
  }
}
```

**EN — `medicalPrograms.endometriosisInfertility.page`:**
```json
"page": {
  "section1Subtitle": "Understanding Your Body",
  "section1Title": "Integrative Care for Complex Conditions",
  "section1Text": "Endometriosis and infertility require a holistic approach that addresses both the physical symptoms and emotional wellbeing of each patient.",
  "section1Text2": "Our protocols combine functional medicine diagnostics with evidence-based treatments, creating a comprehensive plan unique to your needs.",
  "section2Subtitle": "Support & Healing",
  "section2Title": "Beyond Symptom Management",
  "section2Text": "We go beyond managing symptoms to identify root causes — working with hormonal balance, inflammation reduction, and stress management as interconnected pathways to wellness.",
  "section2Text2": "Our compassionate team understands the emotional weight of these conditions and provides a supportive, judgement-free environment throughout your journey.",
  "therapiesTitle": "Included Therapies",
  "therapies": {
    "t1": { "name": "Functional Medicine Assessment", "description": "Comprehensive diagnostic approach to uncover underlying hormonal and metabolic imbalances." },
    "t2": { "name": "Pelvic Physiotherapy", "description": "Specialised therapy targeting pelvic floor dysfunction and pain management." },
    "t3": { "name": "Balneotherapy", "description": "Therapeutic mineral baths to reduce inflammation and promote relaxation." },
    "t4": { "name": "Stress Reduction Program", "description": "Guided techniques including breathing exercises and mindfulness for emotional balance." },
    "t5": { "name": "Nutritional Counselling", "description": "Personalised dietary guidance to support hormonal health and fertility." }
  }
}
```

**EN — `medicalPrograms.longevity.page`:**
```json
"page": {
  "section1Subtitle": "Science of Aging Well",
  "section1Title": "Optimise Your Biological Age",
  "section1Text": "Our longevity programs combine advanced diagnostics with regenerative therapies to help you age on your own terms — proactively, not reactively.",
  "section1Text2": "Through comprehensive biomarker analysis and personalised interventions, we create a roadmap for sustained vitality and peak performance.",
  "section2Subtitle": "Regenerative Protocols",
  "section2Title": "Unlock Your Body's Potential",
  "section2Text": "From cryotherapy to IV nutrient therapy, our regenerative protocols are designed to enhance cellular function, reduce oxidative stress, and support your body's natural repair mechanisms.",
  "section2Text2": "Regular monitoring and program adjustments ensure you're always progressing toward your optimal health benchmarks.",
  "therapiesTitle": "Included Therapies",
  "therapies": {
    "t1": { "name": "Cryotherapy", "description": "Whole-body cold exposure to boost metabolism, reduce inflammation, and enhance recovery." },
    "t2": { "name": "IV Nutrient Therapy", "description": "Targeted intravenous delivery of vitamins, minerals, and antioxidants." },
    "t3": { "name": "Biomarker Analysis", "description": "Comprehensive blood and metabolic testing to track your biological age." },
    "t4": { "name": "Hyperbaric Oxygen Therapy", "description": "Pressurised oxygen sessions to accelerate cellular regeneration." },
    "t5": { "name": "Infrared Sauna", "description": "Deep-penetrating heat therapy for detoxification and cardiovascular health." }
  }
}
```

**EN — `medicalPrograms.rheumatology.page`:**
```json
"page": {
  "section1Subtitle": "Living Without Limits",
  "section1Title": "Managing Autoimmune Conditions",
  "section1Text": "Rheumatic and autoimmune conditions demand specialised, ongoing care. Our programs combine proven balneological traditions with modern functional medicine.",
  "section1Text2": "We focus on reducing inflammation, managing pain, and restoring mobility — so you can return to the activities that matter most.",
  "section2Subtitle": "Natural Healing",
  "section2Title": "The Power of Balneotherapy",
  "section2Text": "Romania's rich balneological heritage offers unique therapeutic resources. Our programs harness mineral-rich waters, therapeutic mud, and climate therapy backed by decades of clinical evidence.",
  "section2Text2": "Combined with physiotherapy and functional medicine, these natural treatments provide lasting relief beyond what medication alone can achieve.",
  "therapiesTitle": "Included Therapies",
  "therapies": {
    "t1": { "name": "Balneotherapy", "description": "Mineral-rich therapeutic baths to reduce joint inflammation and stiffness." },
    "t2": { "name": "Mud Therapy", "description": "Application of therapeutic mud packs for deep pain relief and improved circulation." },
    "t3": { "name": "Physiotherapy", "description": "Guided exercises to maintain joint mobility and muscular strength." },
    "t4": { "name": "Hydrotherapy", "description": "Water-based exercises in heated pools for low-impact joint rehabilitation." },
    "t5": { "name": "Anti-Inflammatory Nutrition", "description": "Dietary protocols designed to reduce systemic inflammation naturally." }
  }
}
```

**EN — `medicalPrograms.postChemotherapy.page`:**
```json
"page": {
  "section1Subtitle": "Recovery After Treatment",
  "section1Title": "Restoring Vitality",
  "section1Text": "The journey doesn't end with chemotherapy. Our post-treatment rehabilitation focuses on rebuilding strength, managing lingering side effects, and supporting your body's return to balance.",
  "section1Text2": "Each program is carefully adapted to your treatment history and current condition, ensuring a safe and effective path to renewed energy.",
  "section2Subtitle": "Compassionate Care",
  "section2Title": "Healing Body and Mind",
  "section2Text": "Recovery from chemotherapy affects every aspect of wellbeing. Our integrative approach addresses physical fatigue, immune function, and emotional resilience as interconnected elements of healing.",
  "section2Text2": "In a peaceful seaside setting, surrounded by nature and supported by experienced professionals, you'll find the space to truly recover.",
  "therapiesTitle": "Included Therapies",
  "therapies": {
    "t1": { "name": "Immune Support Therapy", "description": "Targeted protocols to rebuild immune function after chemotherapy." },
    "t2": { "name": "Gentle Physiotherapy", "description": "Low-intensity exercises adapted to post-treatment energy levels." },
    "t3": { "name": "Nutritional Rehabilitation", "description": "Dietary planning focused on restoring nutrient levels and digestive health." },
    "t4": { "name": "Relaxation Therapy", "description": "Guided relaxation and breathing techniques for stress and anxiety management." },
    "t5": { "name": "Lymphatic Drainage", "description": "Gentle massage technique to reduce swelling and support lymphatic circulation." }
  }
}
```

**Step 2: Add Romanian translations**

Same structure under `medicalPrograms.*.page` in `ro.json`. Use natural Romanian medical terminology.

**RO — `medicalPrograms.medicalRehabilitation.page`:**
```json
"page": {
  "section1Subtitle": "Abordarea Noastră",
  "section1Title": "Recuperare Bazată pe Dovezi",
  "section1Text": "Programele noastre de recuperare medicală sunt construite pe cele mai recente cercetări clinice, combinând tehnici tradiționale de fizioterapie cu medicina regenerativă de ultimă generație.",
  "section1Text2": "Fiecare plan de tratament este personalizat de echipa noastră de specialiști, asigurând rezultate optime de recuperare adaptate condiției și obiectivelor dumneavoastră.",
  "section2Subtitle": "Călătoria Ta",
  "section2Title": "Un Drum Către Forță Reînnoită",
  "section2Text": "De la evaluarea inițială până la externare, echipa noastră multidisciplinară vă ghidează prin fiecare etapă a recuperării cu expertiză și compasiune.",
  "section2Text2": "Locația noastră la malul mării oferă mediul ideal pentru recuperare — aer proaspăt, lumină naturală și beneficiile terapeutice ale coastei Mării Negre.",
  "therapiesTitle": "Terapii Incluse",
  "therapies": {
    "t1": { "name": "Fizioterapie", "description": "Exerciții țintite și terapie manuală pentru restabilirea mișcării și funcției." },
    "t2": { "name": "Balneoterapie", "description": "Băi terapeutice cu ape minerale din surse naturale." },
    "t3": { "name": "Electroterapie", "description": "Tehnici de stimulare electrică pentru reducerea durerii și accelerarea vindecării." },
    "t4": { "name": "Kinetoterapie", "description": "Terapie bazată pe mișcare pentru îmbunătățirea mobilității și coordonării." },
    "t5": { "name": "Masaj Terapeutic", "description": "Masaj terapeutic pentru relaxarea tensiunilor, îmbunătățirea circulației și susținerea recuperării." }
  }
}
```

**RO — `medicalPrograms.endometriosisInfertility.page`:**
```json
"page": {
  "section1Subtitle": "Înțelegerea Corpului Tău",
  "section1Title": "Îngrijire Integrativă pentru Afecțiuni Complexe",
  "section1Text": "Endometrioza și infertilitatea necesită o abordare holistică ce adresează atât simptomele fizice, cât și starea emoțională a fiecărei paciente.",
  "section1Text2": "Protocoalele noastre combină diagnosticarea prin medicină funcțională cu tratamente bazate pe dovezi, creând un plan cuprinzător unic pentru nevoile dumneavoastră.",
  "section2Subtitle": "Suport și Vindecare",
  "section2Title": "Dincolo de Gestionarea Simptomelor",
  "section2Text": "Mergem dincolo de gestionarea simptomelor pentru a identifica cauzele profunde — lucrând cu echilibrul hormonal, reducerea inflamației și gestionarea stresului ca și căi interconectate către bunăstare.",
  "section2Text2": "Echipa noastră compătimitoare înțelege greutatea emoțională a acestor afecțiuni și oferă un mediu de susținere, fără judecăți, pe tot parcursul călătoriei dumneavoastră.",
  "therapiesTitle": "Terapii Incluse",
  "therapies": {
    "t1": { "name": "Evaluare de Medicină Funcțională", "description": "Abordare diagnostică cuprinzătoare pentru descoperirea dezechilibrelor hormonale și metabolice." },
    "t2": { "name": "Fizioterapie Pelvină", "description": "Terapie specializată vizând disfuncția planșeului pelvin și gestionarea durerii." },
    "t3": { "name": "Balneoterapie", "description": "Băi terapeutice cu minerale pentru reducerea inflamației și promovarea relaxării." },
    "t4": { "name": "Program de Reducere a Stresului", "description": "Tehnici ghidate incluzând exerciții de respirație și mindfulness pentru echilibru emoțional." },
    "t5": { "name": "Consiliere Nutrițională", "description": "Ghidare dietetică personalizată pentru susținerea sănătății hormonale și a fertilității." }
  }
}
```

**RO — `medicalPrograms.longevity.page`:**
```json
"page": {
  "section1Subtitle": "Știința Îmbătrânirii Sănătoase",
  "section1Title": "Optimizează-ți Vârsta Biologică",
  "section1Text": "Programele noastre de longevitate combină diagnosticarea avansată cu terapii regenerative pentru a vă ajuta să îmbătrâniți în propriii termeni — proactiv, nu reactiv.",
  "section1Text2": "Prin analiza cuprinzătoare a biomarkerilor și intervenții personalizate, creăm o foaie de parcurs pentru vitalitate susținută și performanță optimă.",
  "section2Subtitle": "Protocoale Regenerative",
  "section2Title": "Deblochează Potențialul Corpului Tău",
  "section2Text": "De la crioterapie la terapia cu nutrienți IV, protocoalele noastre regenerative sunt concepute pentru a îmbunătăți funcția celulară, a reduce stresul oxidativ și a susține mecanismele naturale de reparare ale corpului.",
  "section2Text2": "Monitorizarea regulată și ajustările programului asigură că progresați mereu către parametrii optimi de sănătate.",
  "therapiesTitle": "Terapii Incluse",
  "therapies": {
    "t1": { "name": "Crioterapie", "description": "Expunere la frig a întregului corp pentru stimularea metabolismului, reducerea inflamației și îmbunătățirea recuperării." },
    "t2": { "name": "Terapie cu Nutrienți IV", "description": "Administrare intravenoasă țintită de vitamine, minerale și antioxidanți." },
    "t3": { "name": "Analiză Biomarkeri", "description": "Testare cuprinzătoare a sângelui și metabolismului pentru urmărirea vârstei biologice." },
    "t4": { "name": "Terapie cu Oxigen Hiperbaric", "description": "Ședințe de oxigen sub presiune pentru accelerarea regenerării celulare." },
    "t5": { "name": "Saună cu Infraroșu", "description": "Terapie cu căldură profundă pentru detoxifiere și sănătate cardiovasculară." }
  }
}
```

**RO — `medicalPrograms.rheumatology.page`:**
```json
"page": {
  "section1Subtitle": "Viață Fără Limite",
  "section1Title": "Gestionarea Afecțiunilor Autoimune",
  "section1Text": "Afecțiunile reumatice și autoimune necesită îngrijire specializată și continuă. Programele noastre combină tradițiile balneologice dovedite cu medicina funcțională modernă.",
  "section1Text2": "Ne concentrăm pe reducerea inflamației, gestionarea durerii și restabilirea mobilității — pentru a vă putea întoarce la activitățile care contează cel mai mult.",
  "section2Subtitle": "Vindecare Naturală",
  "section2Title": "Puterea Balneoterapiei",
  "section2Text": "Bogatul patrimoniu balneologic al României oferă resurse terapeutice unice. Programele noastre valorifică apele minerale, nămolul terapeutic și climatoterapia, susținute de decenii de dovezi clinice.",
  "section2Text2": "Combinate cu fizioterapia și medicina funcțională, aceste tratamente naturale oferă ameliorare de durată dincolo de ceea ce poate realiza doar medicația.",
  "therapiesTitle": "Terapii Incluse",
  "therapies": {
    "t1": { "name": "Balneoterapie", "description": "Băi terapeutice cu minerale pentru reducerea inflamației articulare și a rigidității." },
    "t2": { "name": "Terapie cu Nămol", "description": "Aplicarea de cataplasme cu nămol terapeutic pentru ameliorarea profundă a durerii și îmbunătățirea circulației." },
    "t3": { "name": "Fizioterapie", "description": "Exerciții ghidate pentru menținerea mobilității articulare și a forței musculare." },
    "t4": { "name": "Hidroterapie", "description": "Exerciții în apă în piscine încălzite pentru reabilitare articulară cu impact redus." },
    "t5": { "name": "Nutriție Antiinflamatoare", "description": "Protocoale dietetice concepute pentru reducerea inflamației sistemice în mod natural." }
  }
}
```

**RO — `medicalPrograms.postChemotherapy.page`:**
```json
"page": {
  "section1Subtitle": "Recuperare După Tratament",
  "section1Title": "Restabilirea Vitalității",
  "section1Text": "Călătoria nu se termină odată cu chimioterapia. Reabilitarea noastră post-tratament se concentrează pe reconstruirea forței, gestionarea efectelor secundare persistente și susținerea întoarcerii corpului la echilibru.",
  "section1Text2": "Fiecare program este adaptat cu grijă la istoricul tratamentului și condiția actuală, asigurând o cale sigură și eficientă către energie reînnoită.",
  "section2Subtitle": "Îngrijire Plină de Compasiune",
  "section2Title": "Vindecarea Corpului și a Minții",
  "section2Text": "Recuperarea după chimioterapie afectează fiecare aspect al bunăstării. Abordarea noastră integrativă adresează oboseala fizică, funcția imunitară și reziliența emoțională ca elemente interconectate ale vindecării.",
  "section2Text2": "Într-un cadru liniștit la malul mării, înconjurat de natură și susținut de profesioniști experimentați, veți găsi spațiul pentru a vă recupera cu adevărat.",
  "therapiesTitle": "Terapii Incluse",
  "therapies": {
    "t1": { "name": "Terapie de Susținere Imunitară", "description": "Protocoale țintite pentru reconstruirea funcției imunitare după chimioterapie." },
    "t2": { "name": "Fizioterapie Blândă", "description": "Exerciții de intensitate redusă adaptate nivelului de energie post-tratament." },
    "t3": { "name": "Reabilitare Nutrițională", "description": "Planificare dietetică concentrată pe restabilirea nivelurilor de nutrienți și a sănătății digestive." },
    "t4": { "name": "Terapie de Relaxare", "description": "Relaxare ghidată și tehnici de respirație pentru gestionarea stresului și anxietății." },
    "t5": { "name": "Drenaj Limfatic", "description": "Tehnică de masaj blând pentru reducerea umflăturilor și susținerea circulației limfatice." }
  }
}
```

**Step 3: Commit**
```bash
git add messages/en.json messages/ro.json
git commit -m "feat: add dummy content for medical program detail pages"
```

---

### Task 2: Create ProgramContentSection Component

**Files:**
- Create: `components/sections/program-content-section.tsx`

**Step 1: Create the reusable parallax photo + text component**

This component takes a photo side (`'left' | 'right'`), image source, and translation keys. It renders a two-column layout with parallax scroll effect on the image.

```tsx
'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import Image from 'next/image';

interface ProgramContentSectionProps {
  photoSide: 'left' | 'right';
  imageSrc: string;
  imageAlt: string;
  subtitle: string;
  title: string;
  texts: string[];
}

export default function ProgramContentSection({
  photoSide,
  imageSrc,
  imageAlt,
  subtitle,
  title,
  texts,
}: ProgramContentSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    containerRef.current = document.querySelector('main');
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  const photoContent = (
    <div className="relative aspect-[3/4] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[600px]">
      <motion.div
        className="absolute inset-0 h-[120%] w-full"
        style={{ scale: imageScale, y: imageY, willChange: 'transform' }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </motion.div>
    </div>
  );

  const textContent = (
    <div className="flex items-center px-6 py-16 lg:px-16 lg:py-24">
      <div className="max-w-xl">
        <motion.p
          className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
        <motion.h2
          className="font-[family-name:var(--font-quicksand)] text-3xl font-thin leading-tight text-gray-900 sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {title}
        </motion.h2>
        {texts.map((text, i) => (
          <motion.p
            key={i}
            className="mt-6 text-base leading-relaxed text-gray-600 lg:text-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-white">
      <div className="grid lg:grid-cols-2">
        {photoSide === 'left' ? (
          <>
            {photoContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {photoContent}
          </>
        )}
      </div>
    </section>
  );
}
```

**Step 2: Commit**
```bash
git add components/sections/program-content-section.tsx
git commit -m "feat: create ProgramContentSection with parallax photo + text layout"
```

---

### Task 3: Create ProgramTherapiesGrid Component

**Files:**
- Create: `components/sections/program-therapies-grid.tsx`

**Step 1: Create the therapies grid component**

```tsx
'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface Therapy {
  name: string;
  description: string;
}

interface ProgramTherapiesGridProps {
  title: string;
  therapies: Therapy[];
  accentColor: string; // e.g. '#0097a7'
}

export default function ProgramTherapiesGrid({
  title,
  therapies,
  accentColor,
}: ProgramTherapiesGridProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-gray-50 px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {therapies.map((therapy, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            >
              <div
                className="mb-4 h-1 w-10"
                style={{ backgroundColor: accentColor }}
              />
              <h3 className="text-base font-medium text-gray-900">
                {therapy.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {therapy.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**
```bash
git add components/sections/program-therapies-grid.tsx
git commit -m "feat: create ProgramTherapiesGrid component"
```

---

### Task 4: Update therapy-page-client.tsx

**Files:**
- Modify: `app/[locale]/medical-programs/[slug]/therapy-page-client.tsx`

**Step 1: Replace the Coming Soon section with new content sections**

Replace everything from line 100 (the `{/* Coming Soon + CTA */}` comment) through line 142 (end of the Coming Soon div) with the new content sections. Also add necessary imports and update the therapyMap to include accent color hex values.

The updated file should:
1. Import `ProgramContentSection` and `ProgramTherapiesGrid`
2. Add `accentColor` (hex string) to the therapyMap entries (for the grid accent bars)
3. Read the `page.*` translation keys
4. Build therapy list from `page.therapies.t1` through `page.t5` (checking existence)
5. Render: Hero → ProgramContentSection (left) → ProgramContentSection (right) → ProgramTherapiesGrid → CTAs

Add `accentColor` to each therapyMap entry:
- medical-rehabilitation: `'#D2B88B'`
- endometriosis-infertility: `'#D2B88B'`
- longevity: `'#0097a7'`
- rheumatology: `'#8FA3A8'`
- wellness: `'#BCA390'`
- post-chemotherapy: `'#BCA390'`

For reading therapies, iterate `['t1','t2','t3','t4','t5']` and use `t.has()` to check existence:
```tsx
const therapyKeys = ['t1', 't2', 't3', 't4', 't5'];
const therapies = therapyKeys
  .filter((key) => t.has(`${prefix}page.therapies.${key}.name`))
  .map((key) => ({
    name: t(`${prefix}page.therapies.${key}.name`),
    description: t(`${prefix}page.therapies.${key}.description`),
  }));
```

Replace the Coming Soon section with:
```tsx
{/* Content Section 1: Photo Left / Text Right */}
<ProgramContentSection
  photoSide="left"
  imageSrc="/images/your_body.webp"
  imageAlt={title}
  subtitle={t(`${prefix}page.section1Subtitle`)}
  title={t(`${prefix}page.section1Title`)}
  texts={[
    t(`${prefix}page.section1Text`),
    ...(t.has(`${prefix}page.section1Text2`) ? [t(`${prefix}page.section1Text2`)] : []),
  ]}
/>

{/* Content Section 2: Text Left / Photo Right */}
<ProgramContentSection
  photoSide="right"
  imageSrc="/images/your_future.webp"
  imageAlt={title}
  subtitle={t(`${prefix}page.section2Subtitle`)}
  title={t(`${prefix}page.section2Title`)}
  texts={[
    t(`${prefix}page.section2Text`),
    ...(t.has(`${prefix}page.section2Text2`) ? [t(`${prefix}page.section2Text2`)] : []),
  ]}
/>

{/* Therapies Grid */}
{therapies.length > 0 && (
  <ProgramTherapiesGrid
    title={t(`${prefix}page.therapiesTitle`)}
    therapies={therapies}
    accentColor={therapy.accentColor}
  />
)}

{/* CTAs */}
<div className="bg-white px-6 py-20 lg:px-12 lg:py-32">
  <div className="mx-auto max-w-4xl text-center">
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <TransitionLink
        href="/medical-programs"
        className="inline-flex items-center gap-2 bg-gray-900 px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {tCommon('allPrograms')}
      </TransitionLink>
      <TransitionLink
        href="/book"
        className="inline-flex items-center gap-2 border border-gray-900 bg-transparent px-8 py-4 text-sm font-medium uppercase tracking-wider text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
      >
        {tCommon('requestStay')}
        <ArrowRight className="h-4 w-4" />
      </TransitionLink>
    </div>
  </div>
</div>
```

**Step 2: Commit**
```bash
git add "app/[locale]/medical-programs/[slug]/therapy-page-client.tsx"
git commit -m "feat: replace Coming Soon with content sections and therapies grid"
```

---

### Task 5: Verify

**Step 1: Run build**
```bash
pnpm build
```

Ensure all routes compile successfully.

**Step 2: Visual check**
```bash
pnpm dev
```

Verify in browser:
- [ ] `/medical-programs/medical-rehabilitation` — hero + 2 content sections + therapies grid + CTAs
- [ ] `/medical-programs/endometriosis-infertility` — same layout
- [ ] `/medical-programs/longevity` — same layout
- [ ] `/medical-programs/rheumatology` — same layout
- [ ] `/medical-programs/post-chemotherapy` — same layout
- [ ] Parallax effect works on images (scroll up/down)
- [ ] Mobile layout stacks correctly
- [ ] Romanian translations show on `/ro/medical-programs/*`
- [ ] Therapy grid accent colors match hero colors
