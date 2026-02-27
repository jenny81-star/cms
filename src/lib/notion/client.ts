import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

/**
 * Singleton Notion API client instance
 */
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    // Use a dummy key during build if not configured
    const apiKey = env.NOTION_API_KEY || 'dummy_key_for_build'

    notionClient = new Client({
      auth: apiKey,
    })
  }
  return notionClient
}
