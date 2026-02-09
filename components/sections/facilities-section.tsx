"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

// Facility data structure with image pairs
const facilitiesData = {
  wellness: [
    { key: "saltRoom", smallImg: 1, largeImg: 2 },
    { key: "finnishSauna", smallImg: 3, largeImg: 4 },
    { key: "relaxationPool", smallImg: 5, largeImg: 6 },
  ],
  recovery: [
    { key: "cryotherapy", smallImg: 7, largeImg: 8 },
    { key: "infraredSauna", smallImg: 9, largeImg: 10 },
    { key: "iceBath", smallImg: 11, largeImg: 12 },
  ],
  therapy: [
    { key: "massageRoom", smallImg: 13, largeImg: 14 },
    { key: "physiotherapy", smallImg: 15, largeImg: 16 },
    { key: "floatationTank", smallImg: 17, largeImg: 18 },
  ],
  dining: [
    { key: "restaurant", smallImg: 19, largeImg: 20 },
    { key: "juiceBar", smallImg: 21, largeImg: 22 },
    { key: "terrace", smallImg: 23, largeImg: 24 },
  ],
};

type CategoryKey = keyof typeof facilitiesData;

const categories: CategoryKey[] = ["wellness", "recovery", "therapy", "dining"];

function getImagePath(num: number): string {
  return `/images/gallery/vraja_marii_by_the_sea_eforie_sud_${num}.webp`;
}

// Individual facility card with parallax
function FacilityCard({
  facilityKey,
  smallImg,
  largeImg,
  category,
  scrollContainerRef,
}: {
  facilityKey: string;
  smallImg: number;
  largeImg: number;
  category: string;
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}) {
  const t = useTranslations("facilities");
  const tCommon = useTranslations("common");
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    container: scrollContainerRef,
    offset: ["start end", "end start"],
  });

  // Small image floats upward aggressively - starts low, rises high
  const smallImgY = useTransform(scrollYProgress, [0, 1], ["30%", "-50%"]);
  const smallImgYMove = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const smallImgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.06, 1, 0.97],
  );

  // Large image moves slower - anchored, subtle movement
  const largeImgY = useTransform(scrollYProgress, [0, 1], ["5%", "-30%"]);
  const largeImgScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.03, 1, 0.99],
  );

  return (
    <div
      ref={cardRef}
      className="mb-24 lg:mb-40"
      style={{ perspective: "1000px" }}
    >
      {/* Images container - staggered overlap layout on lg */}
      <div className="relative flex items-end gap-4 md:block lg:gap-0">
        {/* Small image - hidden on mobile, positioned top-left overlapping on lg */}
        <motion.div
          className="relative z-10 hidden aspect-3/4 w-1/4 overflow-hidden md:block lg:absolute  lg:-top-8 lg:w-[35%]"
          style={{
            y: smallImgYMove,
          }}
        >
          <motion.div
            className="absolute inset-0 h-[180%] w-full origin-center"
            style={{
              y: smallImgY,
              scale: smallImgScale,
            }}
          >
            <Image
              src={getImagePath(smallImg)}
              alt={t(`${category}.${facilityKey}.name`)}
              fill
              sizes="(max-width: 768px) 0px, 35vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Large image - stays in flow on lg, positioned to the right */}
        <div className="relative aspect-4/3 w-full overflow-hidden md:w-3/4 lg:ml-auto lg:aspect-16/10 lg:w-[72%]">
          <motion.div
            className="absolute inset-0 h-[120%] w-full origin-center"
            style={{
              y: largeImgY,
              scale: largeImgScale,
            }}
          >
            <Image
              src={getImagePath(largeImg)}
              alt={t(`${category}.${facilityKey}.name`)}
              fill
              sizes="(max-width: 768px) 100vw, 72vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Facility info */}
      <div className="mt-6 lg:mt-8">
        <h3 className="font-(family-name:--font-playfair) text-2xl font-normal italic text-gray-900 lg:text-3xl">
          {t(`${category}.${facilityKey}.name`)}
        </h3>
        <p className="mt-2 text-sm text-gray-600 lg:text-base">
          {t(`${category}.${facilityKey}.description`)}
        </p>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
        >
          {tCommon("learnMore")}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17L17 7M17 7H7M17 7v10"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function FacilitiesSection() {
  const t = useTranslations("facilities");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("wellness");
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize scroll container ref and mark as client-side
  useEffect(() => {
    scrollContainerRef.current = document.querySelector("main");
    // Use requestAnimationFrame to batch with browser paint
    requestAnimationFrame(() => setIsClient(true));
  }, []);

  return (
    <section className=" bg-gray-50 py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 lg:mb-16 lg:flex-row lg:items-start lg:justify-between">
          {/* Label */}
          <p className="text-sm font-medium tracking-wider text-gray-500">
            {t("label")}
          </p>

          {/* Title, description, and tabs */}
          <div className="max-w-2xl">
            <h2 className="font-(family-name:--font-playfair) text-4xl font-normal italic text-gray-900 lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-gray-600 lg:text-lg">{t("description")}</p>

            {/* Category tabs */}
            <div className="mt-8 flex flex-wrap gap-6 border-b border-gray-200">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`relative pb-3 text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t(`categories.${category}`)}
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-900"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities list */}
        <motion.div
          key={`${activeCategory}-${isClient}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:pl-[calc(16.666%+2rem)]"
        >
          {isClient &&
            facilitiesData[activeCategory].map((facility) => (
              <FacilityCard
                key={facility.key}
                facilityKey={facility.key}
                smallImg={facility.smallImg}
                largeImg={facility.largeImg}
                category={activeCategory}
                scrollContainerRef={scrollContainerRef}
              />
            ))}
        </motion.div>
      </div>
    </section>
  );
}
