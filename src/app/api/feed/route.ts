import { fetchPosts } from '@/lib/notion/posts'
import { generateRSSFeed } from '@/lib/rss/generator'

export const revalidate = 3600 // 1 hour

export async function GET(): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    const posts = await fetchPosts()
    const rssFeed = generateRSSFeed(posts, baseUrl)

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new Response('Failed to generate RSS feed', { status: 500 })
  }
}
