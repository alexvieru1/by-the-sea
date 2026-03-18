import VideoShowcaseSection from './video-showcase-section';

export default function MedicalRehabilitationSection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.medicalRehabilitation"
      videoSrc="/videos/medical-rehabilitation.mp4"
      cardBg="bg-[#002343]"
      sectionBg="bg-[#C9B49F]"
      videoSide="right"
      ctaHref="/medical-programs/medical-rehabilitation"
    />
  );
}
