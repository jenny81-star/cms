/* eslint-disable @typescript-eslint/no-explicit-any */
import { unstable_cache } from 'next/cache'
import { getNotionClient } from './client'
import type { Post, Category } from '@/lib/types/blog'
import { env } from '@/lib/env'

const client = getNotionClient()

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
 * Fetch all posts from Notion database
 */
async function fetchPostsUncached(category?: string): Promise<Post[]> {
  const filter = {
    and: [
      {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
      ...(category
        ? [
            {
              property: 'Category',
              relation: {
                contains: category,
              },
            },
          ]
        : []),
    ],
  } as any

  const response = await (client.databases as any).query({
    database_id: env.NOTION_DATABASE_ID,
    filter: category ? filter : filter.and[0],
    sorts: [
      {
        property: 'Published Date',
        direction: 'descending',
      },
    ],
  })

  const posts: Post[] = response.results
    .map((page: any) => {
      const props = page.properties
      const title = extractText(props.Title?.title || [])
      const slug = titleToSlug(title)
      const categoryProp = props.Category?.relation || []
      const tagsProp = props.Tags?.multi_select || []
      const publishedDate = props['Published Date']?.date?.start || ''
      const excerpt = extractText(props.Excerpt?.rich_text || [])

      return {
        id: page.id,
        slug,
        title,
        category: categoryProp[0]?.id || '',
        tags: tagsProp.map((tag: any) => tag.name),
        publishedDate,
        excerpt: excerpt.substring(0, 150),
        createdAt: page.created_time,
        updatedAt: page.last_edited_time,
      }
    })
    .filter((post: Post) => post.slug) // Filter out invalid posts

  return posts
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
  try {
    const blocks = await client.blocks.children.list({
      block_id: post.id,
    })

    post.content = blocks.results as any[]
  } catch (error) {
    console.error(`Failed to fetch blocks for post ${slug}:`, error)
  }

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
    // Query all published posts to count by category
    const response = await (client.databases as any).query({
      database_id: env.NOTION_DATABASE_ID,
      filter: {
        property: 'Status',
        status: {
          equals: 'Published',
        },
      },
    })

    const categoryMap = new Map<string, Category>()

    response.results.forEach((page: any) => {
      const props = page.properties
      const categoryRefs = props.Category?.relation || []

      categoryRefs.forEach((ref: any) => {
        const categoryId = ref.id

        if (!categoryMap.has(categoryId)) {
          categoryMap.set(categoryId, {
            name: '', // Will be fetched below
            slug: '',
            postCount: 0,
          })
        }

        const category = categoryMap.get(categoryId)!
        category.postCount += 1
      })
    })

    // Fetch category names from relations (optional enhancement)
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
