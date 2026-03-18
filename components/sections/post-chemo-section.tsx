import VideoShowcaseSection from './video-showcase-section';

export default function PostChemoSection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.postChemotherapy"
      videoSrc="/videos/post-chemo.mp4"
      cardBg="bg-[#CF9C7C]"
      sectionBg="bg-[#D8E1D6]"
      videoSide="right"
      ctaHref="/medical-programs/post-chemotherapy"
    />
  );
}
