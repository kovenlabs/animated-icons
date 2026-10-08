import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

import { SiteCode } from './docs/site-code';
import { CornersPreview, SlotsPreview, StrokePreview, TriggersPreview } from './docs/previews';

/** Links that leave the site open in a new tab; links within it stay put. */
export function ExternalAwareLink(props: ComponentProps<'a'>) {
  const external = /^https?:\/\//.test(props.href ?? '');
  return external ? <a {...props} target="_blank" rel="noopener noreferrer" /> : <defaultMdxComponents.a {...props} />;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: ExternalAwareLink,
    SiteCode,
    TriggersPreview,
    CornersPreview,
    StrokePreview,
    SlotsPreview,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
