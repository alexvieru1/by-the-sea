import { useTranslations } from 'next-intl';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { policyMdxComponents } from '@/components/mdx/mdx-components';
import PageHero from '@/components/layout/page-hero';

interface PolicyPageLayoutProps {
  translationKey: string;
  content: string;
  version: string;
}

export default function PolicyPageLayout({
  translationKey,
  content,
  version,
}: PolicyPageLayoutProps) {
  const t = useTranslations(`pages.${translationKey}`);
  const tPolicy = useTranslations('policy');

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title={t('title')}
        subtitle={t('subtitle')}
        meta={`${tPolicy('versionLabel')}: ${version}`}
      />

      <div className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <MDXRemote source={content} components={policyMdxComponents} />
        </div>
      </div>
    </div>
  );
}
