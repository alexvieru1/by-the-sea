import VideoShowcaseSection from './video-showcase-section';

export default function LongevitySection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.longevity"
      videoSrc="/videos/longevitate.mp4"
      cardBg="bg-[#002343]"
      sectionBg="bg-[#F2E5D4]"
      videoSide="right"
      ctaHref="/medical-programs/longevity"
    />
  );
}
