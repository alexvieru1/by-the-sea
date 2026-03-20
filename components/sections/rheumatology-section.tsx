import VideoShowcaseSection from './video-showcase-section';

export default function RheumatologySection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.rheumatology"
      videoSrc="/videos/rheumatology.mp4"
      cardBg="bg-[#D1CCC7]"
      sectionBg="bg-[#FCF0BA]"
      videoSide="left"
      ctaHref="/medical-programs/rheumatology"
    />
  );
}
