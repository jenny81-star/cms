import { MetadataRoute } from 'next'
import { fetchPosts, fetchCategories } from '@/lib/notion/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Fetch all posts and categories
  const [posts, categories] = await Promise.all([
    fetchPosts(),
    fetchCategories(),
  ])

  const postEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    priority: 0.9,
    changeFrequency: 'weekly' as const,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: 'weekly' as const,
    },
    ...postEntries,
    ...categoryEntries,
  ]
}
