import VideoShowcaseSection from './video-showcase-section';

export default function RheumatologySection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.rheumatology"
      videoSrc="/videos/reumatologie.mp4"
      cardBg="bg-[#D1CCC7]"
      sectionBg="bg-[#F5E8D9]"
      videoSide="left"
      ctaHref="/medical-programs/rheumatology"
    />
  );
}
