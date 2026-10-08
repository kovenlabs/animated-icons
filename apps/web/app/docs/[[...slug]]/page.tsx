import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { ExternalAwareLink, getMDXComponents } from '@/components/mdx';
import { PageMark } from '@/components/docs/page-mark';
import type { Metadata } from 'next';
import { pageMetadata, SITE_DESCRIPTION } from '@/lib/seo';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from '@/lib/shared';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {/* the page header is a drawing board: the title in dot-matrix, the page's icon on its grid */}
      <header className="drafting flex items-end gap-6 border p-5 sm:p-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <DocsTitle className="dot-headline text-5xl! leading-none sm:text-6xl!">{page.data.title}</DocsTitle>
          <DocsDescription className="mb-0 text-base text-pretty">{page.data.description}</DocsDescription>
          <div className="flex flex-row flex-wrap items-center gap-2 pt-1">
            <MarkdownCopyButton markdownUrl={markdownUrl} />
            <ViewOptionsPopover
              markdownUrl={markdownUrl}
              githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/apps/web/content/docs/${page.path}`}
            />
          </div>
        </div>
        <PageMark icon={page.data.icon} />
      </header>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page, ExternalAwareLink),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return pageMetadata({
    title: page.data.title,
    description: page.data.description ?? SITE_DESCRIPTION,
    path: page.url,
    image: { url: getPageImageUrl(page).url, alt: `${page.data.title} · Animated Icons docs` },
  });
}
