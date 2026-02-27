import ShowcaseSection from './showcase-section';

export default function YourFutureSection() {
  return (
    <ShowcaseSection
      translationKey="yourFuture"
      imageSrc="/images/your_future.webp"
      imageAlt="Your future background"
      cardBg="bg-[#0097a7]"
      align="right"
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
