import ShowcaseSection from './showcase-section';

export default function MedicalRehabilitationSection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.medicalRehabilitation"
      imageSrc="/images/medical-programs/medical-rehabilitation.webp"
      imageAlt="Medical Rehabilitation"
      cardBg="bg-[#002343]"
      align="left"
      ctaHref="/medical-programs/medical-rehabilitation"
      orbs={[]}
    />
  );
}
