import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface PolicyFrontmatter {
  version: string;
  title: string;
  lastUpdated: string;
}

interface PolicyContent {
  frontmatter: PolicyFrontmatter;
  content: string;
}

export function getPolicyContent(
  type: 'privacy' | 'terms' | 'cookies',
  locale: string
): PolicyContent {
  const filePath = path.join(
    process.cwd(),
    'content',
    'policies',
    type,
    `${locale}.mdx`
  );
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data as PolicyFrontmatter,
    content,
  };
}
