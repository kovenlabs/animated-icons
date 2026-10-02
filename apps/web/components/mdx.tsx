import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { SiteCode } from './docs/site-code';


export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    SiteCode,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
