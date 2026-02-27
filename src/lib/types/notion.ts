/**
 * Notion API 관련 타입 정의
 * Notion 블록, 리치 텍스트, 프로퍼티 등을 포함
 */

// Notion 리치 텍스트 어노테이션
export interface NotionAnnotations {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

// Notion 리치 텍스트 요소
export interface NotionRichText {
  type: 'text' | 'mention' | 'equation'
  plain_text: string
  href: string | null
  annotations: NotionAnnotations
  text?: {
    content: string
    link: { url: string } | null
  }
}

// Notion 블록 공통 속성
export interface NotionBlockBase {
  id: string
  type: NotionBlockType
  created_time: string
  last_edited_time: string
  has_children: boolean
  archived: boolean
}

// 지원하는 Notion 블록 타입
export type NotionBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'code'
  | 'quote'
  | 'divider'
  | 'image'
  | 'video'
  | 'bookmark'
  | 'callout'
  | 'toggle'
  | 'table'
  | 'table_row'
  | 'to_do'
  | 'embed'

// 단락 블록
export interface ParagraphBlock extends NotionBlockBase {
  type: 'paragraph'
  paragraph: {
    rich_text: NotionRichText[]
    color: string
  }
}

// 제목 블록 (H1)
export interface Heading1Block extends NotionBlockBase {
  type: 'heading_1'
  heading_1: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

// 제목 블록 (H2)
export interface Heading2Block extends NotionBlockBase {
  type: 'heading_2'
  heading_2: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

// 제목 블록 (H3)
export interface Heading3Block extends NotionBlockBase {
  type: 'heading_3'
  heading_3: {
    rich_text: NotionRichText[]
    color: string
    is_toggleable: boolean
  }
}

// 불릿 리스트 블록
export interface BulletedListItemBlock extends NotionBlockBase {
  type: 'bulleted_list_item'
  bulleted_list_item: {
    rich_text: NotionRichText[]
    color: string
    children?: NotionBlock[]
  }
}

// 번호 리스트 블록
export interface NumberedListItemBlock extends NotionBlockBase {
  type: 'numbered_list_item'
  numbered_list_item: {
    rich_text: NotionRichText[]
    color: string
    children?: NotionBlock[]
  }
}

// 코드 블록
export interface CodeBlock extends NotionBlockBase {
  type: 'code'
  code: {
    rich_text: NotionRichText[]
    language: string
    caption: NotionRichText[]
  }
}

// 인용 블록
export interface QuoteBlock extends NotionBlockBase {
  type: 'quote'
  quote: {
    rich_text: NotionRichText[]
    color: string
  }
}

// 구분선 블록
export interface DividerBlock extends NotionBlockBase {
  type: 'divider'
  divider: Record<string, never>
}

// 이미지 블록
export interface ImageBlock extends NotionBlockBase {
  type: 'image'
  image: {
    type: 'external' | 'file'
    external?: { url: string }
    file?: { url: string; expiry_time: string }
    caption: NotionRichText[]
  }
}

// 콜아웃 블록
export interface CalloutBlock extends NotionBlockBase {
  type: 'callout'
  callout: {
    rich_text: NotionRichText[]
    icon: { type: string; emoji?: string } | null
    color: string
  }
}

// 투두 블록
export interface ToDoBlock extends NotionBlockBase {
  type: 'to_do'
  to_do: {
    rich_text: NotionRichText[]
    checked: boolean
    color: string
  }
}

// 북마크 블록
export interface BookmarkBlock extends NotionBlockBase {
  type: 'bookmark'
  bookmark: {
    url: string
    caption: NotionRichText[]
  }
}

// Notion 블록 유니온 타입
export type NotionBlock =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | BulletedListItemBlock
  | NumberedListItemBlock
  | CodeBlock
  | QuoteBlock
  | DividerBlock
  | ImageBlock
  | CalloutBlock
  | ToDoBlock
  | BookmarkBlock
  | NotionBlockBase
