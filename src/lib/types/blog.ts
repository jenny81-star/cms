import type { NotionBlock } from './notion'

/**
 * Blog-specific types for CMS application
 */

export interface Post {
  id: string
  slug: string
  title: string
  category: string
  tags: string[]
  publishedDate: string
  excerpt: string
  content?: NotionBlock[]
  author?: string
  readingTime?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id?: string
  name: string
  slug: string
  postCount: number
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
