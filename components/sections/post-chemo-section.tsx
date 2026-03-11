import ShowcaseSection from './showcase-section';

export default function PostChemoSection() {
  return (
    <ShowcaseSection
      translationKey="medicalPrograms.postChemotherapy"
      imageSrc="/images/your_future.webp"
      imageAlt="Post-chemotherapy rehabilitation"
      cardBg="bg-[#BCA390]"
      align="left"
      ctaKey="learnMore"
      ctaHref="/medical-programs/post-chemotherapy"
      className="snap-section light-header-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '10%', left: '25%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '22%', right: '12%', background: 'radial-gradient(circle, rgba(188,163,144,0.15) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
