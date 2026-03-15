import ShowcaseSection from './showcase-section';

export default function RheumatologySection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.rheumatology"
      imageSrc="/images/your_body.webp"
      imageAlt="Rheumatology therapy"
      cardBg="bg-[#D1CCC7]"
      align="right"
      ctaKey="learnMore"
      ctaHref="/medical-programs/rheumatology"
      className="snap-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '12%', left: '55%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '18%', right: '15%', background: 'radial-gradient(circle, rgba(209,204,199,0.2) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
