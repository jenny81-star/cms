/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NotionBlock } from '@/lib/types/notion'

/**
 * Calculate reading time from Notion blocks
 * Assumes ~200 words per minute
 */
export function calculateReadingTime(blocks: NotionBlock[]): number {
  if (!blocks || blocks.length === 0) return 1

  let totalWords = 0

  blocks.forEach((block: any) => {
    let text = ''

    switch (block.type) {
      case 'paragraph':
        text = block.paragraph?.rich_text
          ?.map((rt: any) => rt.plain_text)
          .join('')
        break
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        text = block[block.type]?.rich_text
          ?.map((rt: any) => rt.plain_text)
          .join('')
        break
      case 'bulleted_list_item':
      case 'numbered_list_item':
        text = block[block.type]?.rich_text
          ?.map((rt: any) => rt.plain_text)
          .join('')
        break
      case 'code':
        text = block.code?.rich_text?.map((rt: any) => rt.plain_text).join('')
        break
      case 'quote':
        text = block.quote?.rich_text?.map((rt: any) => rt.plain_text).join('')
        break
      default:
        text = ''
    }

    if (text) {
      totalWords += text.split(/\s+/).filter(word => word.length > 0).length
    }
  })

  // 200 words per minute, minimum 1 minute
  const minutes = Math.ceil(totalWords / 200)
  return Math.max(1, minutes)
}
