import { Client } from '@notionhq/client'
import { env } from '@/lib/env'

/**
 * Singleton Notion API client instance
 */
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    const apiKey = env.NOTION_API_KEY

    if (!apiKey) {
      throw new Error(
        'NOTION_API_KEY is not configured. Please set it in .env.local'
      )
    }

    notionClient = new Client({
      auth: apiKey,
    })
  }
  return notionClient
}
