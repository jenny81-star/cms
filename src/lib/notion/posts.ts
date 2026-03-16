/* eslint-disable @typescript-eslint/no-explicit-any */
import { unstable_cache } from 'next/cache'
import type { Post, Category } from '@/lib/types/blog'
import { env } from '@/lib/env'
import { fetchBlocks } from './blocks'

/**
 * Convert title to kebab-case slug
 */
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Extract text from rich text array
 */
function extractText(richText: any[]): string {
  return richText.map(rt => rt.plain_text).join('')
}

/**
 * Direct Notion REST API calls using fetch
 */
async function notionApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Notion API failed (${response.status}): ${error.message}`)
  }

  return response.json() as Promise<T>
}

/**
 * Fetch all posts from Notion database
 */
async function fetchPostsUncached(category?: string): Promise<Post[]> {
  try {
    if (!env.NOTION_API_KEY || !env.NOTION_DATABASE_ID) {
      console.warn('Notion configuration not found')
      return []
    }

    const response = await notionApi<any>(
      `/databases/${env.NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          filter: {
            property: 'Status',
            status: {
              equals: 'Published',
            },
          },
          sorts: [
            {
              property: 'Published Date',
              direction: 'descending',
            },
          ],
        }),
      }
    )

    if (!response.results) {
      return []
    }

    const posts: Post[] = []

    for (const page of response.results) {
      const props = page.properties
      const title = extractText(props.Title?.title || [])
      const slug = titleToSlug(title)
      const categoryProp = props.Category?.relation || []
      const tagsProp = props.Tags?.multi_select || []
      const publishedDate = props['Published Date']?.date?.start || ''
      const excerpt = extractText(props.Excerpt?.rich_text || [])

      // Fetch category name from Notion if category relation exists
      let categoryName = ''
      if (categoryProp.length > 0) {
        try {
          const categoryPage = await notionApi<any>(
            `/pages/${categoryProp[0].id}`
          )
          const categoryTitleProp =
            categoryPage.properties?.Name?.title ||
            categoryPage.properties?.Title?.title ||
            []
          categoryName = categoryTitleProp
            .map((t: any) => t.plain_text)
            .join('')
            .trim()
        } catch {
          categoryName = ''
        }
      }

      if (slug) {
        posts.push({
          id: page.id,
          slug,
          title,
          category: categoryName,
          tags: tagsProp.map((tag: any) => tag.name),
          publishedDate,
          excerpt: excerpt.substring(0, 150),
          createdAt: page.created_time,
          updatedAt: page.last_edited_time,
        })
      }
    }

    // Client-side category filtering by slug
    if (category) {
      return posts.filter(post => {
        const postCategorySlug = titleToSlug(post.category)
        return postCategorySlug === category
      })
    }

    return posts
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

/**
 * Cached wrapper for fetching posts (1 hour cache)
 */
export const fetchPosts = unstable_cache(
  async (category?: string) => fetchPostsUncached(category),
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

/**
 * Fetch single post by slug with content blocks
 */
async function fetchPostBySlugUncached(slug: string): Promise<Post | null> {
  const posts = await fetchPostsUncached()
  const post = posts.find(p => p.slug === slug)

  if (!post) return null

  // Fetch blocks for this post
  const blocks = await fetchBlocks(post.id)
  post.content = blocks

  return post
}

/**
 * Cached wrapper for fetching single post by slug
 */
export const fetchPostBySlug = unstable_cache(
  async (slug: string) => fetchPostBySlugUncached(slug),
  ['post-slug'],
  { revalidate: 3600, tags: ['posts'] }
)

/**
 * Fetch all categories from Notion
 */
async function fetchCategoriesUncached(): Promise<Category[]> {
  try {
    if (!env.NOTION_API_KEY || !env.NOTION_DATABASE_ID) {
      console.warn('Notion configuration not found')
      return []
    }

    // Query all published posts to count by category
    const response = await notionApi<any>(
      `/databases/${env.NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          filter: {
            property: 'Status',
            status: {
              equals: 'Published',
            },
          },
        }),
      }
    )

    const categoryMap = new Map<string, Category>()

    response.results.forEach((page: any) => {
      const props = page.properties
      const categoryRefs = props.Category?.relation || []

      categoryRefs.forEach((ref: any) => {
        const categoryId = ref.id

        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            id: categoryId,
            name: '',
            slug: '',
            postCount: 0,
          })
        }

        const category = categoryMap.get(categoryId)!
        category.postCount += 1
      })
    })

    // Fetch category names from Notion
    for (const [id, category] of categoryMap) {
      try {
        const page = await notionApi<any>(`/pages/${id}`)
        const titleProp =
          page.properties?.Name?.title || page.properties?.Title?.title || []
        const name = titleProp
          .map((t: any) => t.plain_text)
          .join('')
          .trim()
        category.name = name || `Category ${id.slice(0, 6)}`
        category.slug = name ? titleToSlug(name) : id.slice(0, 8)
      } catch {
        category.name = `Category ${id.slice(0, 6)}`
        category.slug = id.slice(0, 8)
      }
    }

    const categories = Array.from(categoryMap.values())

    return categories.sort((a, b) => b.postCount - a.postCount)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

/**
 * Cached wrapper for fetching categories
 */
export const fetchCategories = unstable_cache(
  async () => fetchCategoriesUncached(),
  ['categories'],
  { revalidate: 3600, tags: ['posts'] }
)
