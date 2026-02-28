import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface BookingConfirmedEmailProps {
  firstName: string;
  locale: 'ro' | 'en';
  evaluationUrl: string;
}

const content = {
  ro: {
    preview: 'Rezervarea ta la Vraja Marii a fost confirmata',
    greeting: (name: string) => `Buna, ${name}!`,
    line1: 'Rezervarea ta la Vraja Marii by the Sea a fost confirmata.',
    line2: 'Te rugam sa completezi formularul de evaluare initiala inainte de vizita. Aceasta ne ajuta sa personalizam experienta ta.',
    cta: 'Completeaza Evaluarea',
    footer: 'Daca ai intrebari, contacteaza-ne la contact@vrajamarii.ro.',
  },
  en: {
    preview: 'Your booking at Vraja Marii has been confirmed',
    greeting: (name: string) => `Hi, ${name}!`,
    line1: 'Your booking at Vraja Marii by the Sea has been confirmed.',
    line2: 'Please complete the initial evaluation form before your visit. This helps us personalize your experience.',
    cta: 'Complete Evaluation',
    footer: 'If you have questions, contact us at contact@vrajamarii.ro.',
  },
};

export default function BookingConfirmedEmail({
  firstName,
  locale,
  evaluationUrl,
}: BookingConfirmedEmailProps) {
  const t = content[locale];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>Vraja Marii</Heading>
          </Section>
          <Section style={bodyStyle}>
            <Text style={greeting}>{t.greeting(firstName)}</Text>
            <Text style={paragraph}>{t.line1}</Text>
            <Text style={paragraph}>{t.line2}</Text>
            <Section style={ctaSection}>
              <Button style={button} href={evaluationUrl}>
                {t.cta}
              </Button>
            </Section>
          </Section>
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>{t.footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f9fafb',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const logo = {
  fontSize: '24px',
  fontWeight: '300' as const,
  fontStyle: 'italic' as const,
  color: '#1a1a1a',
  margin: '0',
};

const bodyStyle = {
  backgroundColor: '#ffffff',
  padding: '32px',
  border: '1px solid #e5e7eb',
};

const greeting = {
  fontSize: '18px',
  color: '#1a1a1a',
  margin: '0 0 16px',
};

const paragraph = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#4b5563',
  margin: '0 0 12px',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '24px 0 0',
};

const button = {
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '14px 28px',
  fontSize: '12px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  textDecoration: 'none',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const footer = {
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#9ca3af',
};
