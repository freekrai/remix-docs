type SitemapUrl = {
  url: string;
};

export function createSitemap(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(({ url }) => {
      const loc = `<loc>${url}</loc>`;
      return `
      <url>
        ${loc}
      </url>
    `;
    })
    .join('');

  return `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>
  `;
}