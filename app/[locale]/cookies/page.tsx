import { setRequestLocale } from 'next-intl/server';
import PolicyPageLayout from '@/components/layout/policy-page-layout';
import { getPolicyContent } from '@/lib/policies';

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { frontmatter, content } = getPolicyContent('cookies', locale);

  return (
    <PolicyPageLayout
      translationKey="cookies"
      content={content}
      version={frontmatter.lastUpdated}
    />
  );
}
