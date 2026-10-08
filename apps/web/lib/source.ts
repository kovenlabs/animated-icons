import { llms, loader } from 'fumadocs-core/source';
import type { LoaderPlugin } from 'fumadocs-core/source';
import { createElement } from 'react';

import { SidebarIcon } from '@/components/docs/sidebar-icon';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

/** A page's `icon` frontmatter names one of the library's own icons, animated in the sidebar. */
function animatedIconsPlugin(): LoaderPlugin {
  const replace = <T extends { icon?: unknown }>(node: T) => {
    if (typeof node.icon === 'string') node.icon = createElement(SidebarIcon, { key: 'icon', name: node.icon });
    return node;
  };
  return { name: 'animated-icons:icon', transformPageTree: { file: replace, folder: replace, separator: replace } };
}

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [animatedIconsPlugin()],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
