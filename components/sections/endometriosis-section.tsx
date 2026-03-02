import ShowcaseSection from './showcase-section';

export default function EndometriosisSection() {
  return (
    <ShowcaseSection
      translationKey="endometriosis"
      imageSrc="/images/your_body.webp"
      imageAlt="Endometriosis therapy"
      cardBg="bg-[#D2B88B]"
      align="left"
      ctaKey="learnMore"
      ctaHref="/therapies/endometriosis"
      className="snap-section"
      orbs={[
        {
          size: 'h-64 w-64',
          position: { top: '10%', left: '60%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)' },
        },
        {
          size: 'h-48 w-48',
          position: { bottom: '20%', right: '10%', background: 'radial-gradient(circle, rgba(240,112,96,0.15) 0%, transparent 70%)' },
        },
      ]}
    />
  );
}
