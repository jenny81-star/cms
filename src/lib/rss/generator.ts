import { Post } from '@/lib/types/blog'

export function generateRSSFeed(
  posts: Post[],
  baseUrl: string = 'http://localhost:3000'
): string {
  const siteTitle = '블로그'
  const siteDescription = '개인 개발 블로그'
  const lastBuildDate = new Date().toUTCString()

  const items = posts
    .map(
      post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedDate).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
    </item>
  `
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteTitle}</title>
    <link>${baseUrl}</link>
    <description>${siteDescription}</description>
    <language>ko-kr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    ${items}
  </channel>
</rss>`
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
