import VideoShowcaseSection from './video-showcase-section';

export default function LongevitySection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.longevity"
      videoSrc="/videos/longevity.mp4"
      cardBg="bg-[#002343]"
      sectionBg="bg-[#E1CAAE]"
      videoSide="right"
      ctaHref="/medical-programs/longevity"
    />
  );
}
