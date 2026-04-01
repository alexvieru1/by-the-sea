import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAlternates } from '@/lib/seo';
import PolicyPageLayout from '@/components/layout/policy-page-layout';
import { getPolicyContent } from '@/lib/policies';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return [{ locale: 'ro' }, { locale: 'en' }];
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.privacy' });
  return { title: t('title'), description: t('description'), alternates: getAlternates('/privacy') };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { frontmatter, content } = getPolicyContent('privacy', locale);

  return (
    <PolicyPageLayout
      translationKey="privacy"
      content={content}
      version={frontmatter.lastUpdated}
    />
  );
}
