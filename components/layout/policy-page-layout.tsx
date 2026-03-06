import { useTranslations } from 'next-intl';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { policyMdxComponents } from '@/components/mdx/mdx-components';

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
      <div className="relative overflow-hidden bg-[#c5d5d8] px-6 pb-20 pt-32 lg:px-12 lg:pb-32 lg:pt-40">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#0097a7]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-700">
            {t('subtitle')}
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-normal italic text-gray-900 sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 text-sm text-gray-600">
            {tPolicy('versionLabel')}: {version}
          </p>
        </div>
      </div>

      <div className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <MDXRemote source={content} components={policyMdxComponents} />
        </div>
      </div>
    </div>
  );
}
