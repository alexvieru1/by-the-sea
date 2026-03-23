import ShowcaseSection from './showcase-section';

export default function LongevitySection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.longevity"
      imageSrc="/images/homepage-sections/longevitate.webp"
      imageAlt="Longevity"
      cardBg="bg-[#002343]"
      align="left"
      ctaHref="/medical-programs/longevity"
      orbs={[]}
    />
  );
}
