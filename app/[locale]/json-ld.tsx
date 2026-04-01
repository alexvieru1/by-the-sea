export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://www.vrajamariibythesea.ro/#organization',
    name: 'Vraja Mării by the Sea',
    alternateName: 'Complex Vraja Mării',
    url: 'https://www.vrajamariibythesea.ro',
    logo: 'https://www.vrajamariibythesea.ro/opengraph-image.jpg',
    description:
      'Complex de recuperare medicală și wellness dedicat optimizării sănătății și bunăstării tale. Recuperare medicală, endometrioză, longevitate, reumatologie.',
    telephone: '+40341520000',
    email: 'bythesea@complexvrajamarii.ro',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Aleea Mercur Nr.2',
      addressLocality: 'Eforie Sud',
      addressRegion: 'Constanța',
      addressCountry: 'RO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 44.0495,
      longitude: 28.6533,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '16:30',
      },
    ],
    sameAs: [
      'https://www.instagram.com/complexvrajamarii/',
      'https://www.facebook.com/complexvrajamarii/',
    ],
    medicalSpecialty: [
      'PhysicalMedicine',
      'Rheumatology',
    ],
    availableService: [
      {
        '@type': 'MedicalTherapy',
        name: 'Recuperare Medicală',
        description: 'Program complet de recuperare medicală și reabilitare fizică',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Endometrioză și Infertilitate',
        description: 'Abordare holistică pentru endometrioză și infertilitate',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Longevitate',
        description: 'Program de longevitate și optimizare a sănătății',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Reumatologie',
        description: 'Tratamente specializate pentru afecțiuni reumatologice',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Recuperare Post-Intervenție',
        description: 'Program de recuperare după intervenții chirurgicale',
      },
    ],
    priceRange: '$$',
    image: 'https://www.vrajamariibythesea.ro/opengraph-image.jpg',
    areaServed: {
      '@type': 'Country',
      name: 'Romania',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.vrajamariibythesea.ro/#website',
    url: 'https://www.vrajamariibythesea.ro',
    name: 'Vraja Mării by the Sea',
    publisher: { '@id': 'https://www.vrajamariibythesea.ro/#organization' },
    inLanguage: ['ro', 'en'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
