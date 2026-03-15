import type { MDXComponents } from 'mdx/types';

export const policyMdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mb-8 font-[family-name:var(--font-quicksand)] text-3xl font-thin text-gray-900 sm:text-4xl lg:text-5xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-4 mt-12 text-sm font-medium uppercase tracking-wider text-[#002343]"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-3 mt-8 text-lg font-semibold text-gray-900"
      {...props}
    />
  ),
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
      className="my-6 border-l-4 border-[#002343] pl-4 italic text-gray-600"
      {...props}
    />
  ),
};
