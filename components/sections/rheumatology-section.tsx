import ShowcaseSection from './showcase-section';

export default function RheumatologySection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.rheumatology"
      imageSrc="/images/homepage-sections/reumatologie2.webp"
      imageAlt="Rheumatology"
      cardBg="bg-[#D1CCC7]"
      align="right"
      ctaHref="/medical-programs/rheumatology"
      orbs={[]}
    />
  );
}
