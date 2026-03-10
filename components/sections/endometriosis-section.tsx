"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import PrimaryButton from "@/components/ui/primary-button";
import { TextRoll } from "@/components/ui/text-roll";

export default function EndometriosisSection() {
  const t = useTranslations("medicalPrograms.endometriosisInfertility");
  const tCommon = useTranslations("common");
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [showBox, setShowBox] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    containerRef.current = document.querySelector("main");
  }, []);

  useEffect(() => {
    if (isInView) {
      const timer0 = setTimeout(() => setShowBox(true), 100);
      const timer1 = setTimeout(() => setShowText(true), 800);
      const timer2 = setTimeout(() => setShowButton(true), 1400);

      return () => {
        clearTimeout(timer0);
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isInView]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: containerRef,
    offset: ["start end", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={sectionRef} className="snap-section relative min-h-screen">
      {/* Desktop: side-by-side | Mobile: stacked */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Text card - mobile: order-1 on top, desktop: right half */}
        <div className="order-1 flex items-center justify-end bg-[#C7B39A] px-6 py-14 lg:order-2 lg:w-1/2 lg:px-0 lg:py-0">
          <div className="flex flex-col items-end">
            <motion.div
              className="w-[90vw] max-w-2xl bg-[#B19C82] px-8 py-10 shadow-2xl sm:px-12 sm:py-14 lg:px-16 lg:py-16"
              initial={{ x: 800 }}
              animate={{ x: showBox ? 0 : 800 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                className="mb-3 text-xs font-medium uppercase tracking-wider text-white/70 sm:text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
                transition={{ duration: 0.4 }}
              >
                {t("subtitle")}
              </motion.p>

              <h2 className="font-[family-name:var(--font-quicksand)] text-4xl font-thin leading-tight text-white sm:text-5xl lg:text-6xl">
                {showText ? (
                  <TextRoll
                    duration={0.4}
                    getEnterDelay={() => 0}
                    getExitDelay={(i) => i * 0.025}
                    variants={{
                      enter: {
                        initial: { rotateX: -90, opacity: 0 },
                        animate: { rotateX: -90, opacity: 0 },
                      },
                      exit: {
                        initial: { rotateX: 90, opacity: 0 },
                        animate: { rotateX: 0, opacity: 1 },
                      },
                    }}
                  >
                    {t("title")}
                  </TextRoll>
                ) : (
                  <span className="invisible">{t("title")}</span>
                )}
              </h2>

              {[
                "description",
                "description-2",
                "description-3",
                "description-4",
              ].map((key, i) => {
                const text = t.has(key) ? t(key) : null;
                if (!text) return null;
                return (
                  <motion.p
                    key={key}
                    className="mt-6 text-base leading-relaxed text-white/90 first:sm:mt-8 sm:text-lg lg:text-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: showText ? 1 : 0,
                      y: showText ? 0 : 10,
                    }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  >
                    {text}
                  </motion.p>
                );
              })}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <PrimaryButton href="/medical-programs/endometriosis-infertility" variant="dark" size="xl" arrow>
                {tCommon("learnMore")}
              </PrimaryButton>
            </motion.div>
          </div>
        </div>

        {/* Video - mobile: order-2 below, desktop: left half */}
        <div className="order-2 relative min-h-[50vh] overflow-hidden lg:order-1 lg:min-h-0 lg:w-1/2">
          <motion.div
            className="absolute inset-0"
            style={{ scale: videoScale }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source
                src="/videos/endometriosis_gradient.mp4"
                type="video/mp4"
              />
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
