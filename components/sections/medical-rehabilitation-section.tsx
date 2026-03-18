import VideoShowcaseSection from './video-showcase-section';

export default function MedicalRehabilitationSection() {
  return (
    <VideoShowcaseSection
      translationKey="medicalPrograms.medicalRehabilitation"
      videoSrc="/videos/recup-med.mp4"
      cardBg="bg-[#002343]"
      sectionBg="bg-[#F0E3D4]"
      videoSide="right"
      ctaHref="/medical-programs/medical-rehabilitation"
    />
  );
}
