import ShowcaseSection from './showcase-section';

export default function PostChemoSection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.postChemotherapy"
      imageSrc="/images/medical-programs/rheumatology.webp"
      imageAlt="Recuperare post intervenții majore"
      cardBg="bg-[#CF9C7C]"
      align="left"
      ctaHref="/medical-programs/post-intervention-recovery"
      orbs={[]}
    />
  );
}
