import { getNotionClient } from './client'
import type { NotionBlock } from '@/lib/types/notion'

const client = getNotionClient()

/**
 * Fetch blocks for a given page ID (post)
 */
export async function fetchBlocks(pageId: string): Promise<NotionBlock[]> {
  try {
    const response = await client.blocks.children.list({
      block_id: pageId,
    })

    return response.results as NotionBlock[]
  } catch (error) {
    console.error(`Failed to fetch blocks for page ${pageId}:`, error)
    return []
  }
}
