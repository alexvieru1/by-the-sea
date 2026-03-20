import VideoShowcaseSection from './video-showcase-section';

export default function MedicalRehabilitationSection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.medicalRehabilitation"
      videoSrc="/videos/medical-rehabilitation.mp4"
      cardBg="bg-[#002343]"
      sectionBg="bg-[#C6B19C]"
      videoSide="right"
      ctaHref="/medical-programs/medical-rehabilitation"
    />
  );
}
