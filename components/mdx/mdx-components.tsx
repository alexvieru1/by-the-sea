import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

function getTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return getTextContent((children as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const policyMdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mb-8 font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl lg:text-5xl"
      {...props}
    />
  ),
  h2: ({ children, ...props }) => {
    const id = slugify(getTextContent(children));
    return (
      <h2
        id={id}
        className="mb-4 mt-12 scroll-mt-32 text-sm font-medium uppercase tracking-wider text-[#002343]"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    const id = slugify(getTextContent(children));
    return (
      <h3
        id={id}
        className="mb-3 mt-8 scroll-mt-32 text-sm font-semibold text-gray-900"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: (props) => (
    <p className="mb-4 text-base leading-relaxed text-gray-700" {...props} />
  ),
  ul: (props) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />
  ),
  li: (props) => (
    <li className="text-base leading-relaxed text-gray-700" {...props} />
  ),
  a: (props) => (
    <a
      className="text-[#002343] underline transition-colors hover:text-[#172C33]"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  hr: () => <hr className="my-8 border-gray-200" />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-[#002343] pl-4  text-gray-600"
      {...props}
    />
  ),
};
