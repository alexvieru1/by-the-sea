import VideoShowcaseSection from './video-showcase-section';

export default function EndometriosisSection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.endometriosisInfertility"
      videoSrc="/videos/endometriosis.mp4"
      cardBg="bg-[#CF9C7C]"
      sectionBg="bg-[#C7B39A]"
      videoSide="left"
      ctaHref="/medical-programs/endometriosis-infertility"
    />
  );
}
