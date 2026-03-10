import ShowcaseSection from './showcase-section';

export default function LongevitySection() {
  return (
    <ShowcaseSection
      translationKey="longevity"
      imageSrc="/images/your_future.webp"
      imageAlt="Longevity therapy"
      cardBg="bg-[#798B6F]"
      align="left"
      ctaKey="learnMore"
      ctaHref="/therapies/longevity"
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
