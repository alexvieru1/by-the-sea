import ShowcaseSection from './showcase-section';

export default function FertilitySection() {
  return (
    <ShowcaseSection
      translationKey="fertility"
      imageSrc="/images/our_mission.webp"
      imageAlt="Fertility therapy"
      cardBg="bg-[#7A8B6F]"
      align="left"
      ctaKey="learnMore"
      ctaHref="/therapies/fertility"
      className="snap-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '12%', left: '55%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '18%', right: '12%', background: 'radial-gradient(circle, rgba(122,139,111,0.15) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
