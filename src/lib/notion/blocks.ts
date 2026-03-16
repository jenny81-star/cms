import { getNotionClient } from './client'
import type { NotionBlock } from '@/lib/types/notion'

const client = getNotionClient()

/**
 * Fetch blocks for a given page ID (post)
 */
export async function fetchBlocks(pageId: string): Promise<NotionBlock[]> {
  try {
    console.log(`[fetchBlocks] Fetching blocks for page ${pageId}`)
    const response = await client.blocks.children.list({
      block_id: pageId,
    })

    console.log(
      `[fetchBlocks] Got ${response.results?.length || 0} blocks for page ${pageId}`
    )
    return response.results as NotionBlock[]
  } catch (error) {
    console.error(
      `[fetchBlocks] Failed to fetch blocks for page ${pageId}:`,
      error instanceof Error ? error.message : error
    )
    return []
  }
}
