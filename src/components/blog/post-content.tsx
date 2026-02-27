/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */
'use client'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import type { NotionBlock } from '@/lib/types/notion'
import { cn } from '@/lib/utils'

interface PostContentProps {
  blocks: NotionBlock[]
}

/**
 * Notion block renderer for blog post content
 */
export function PostContent({ blocks }: PostContentProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-muted-foreground">
        No content available for this post.
      </div>
    )
  }

  return (
    <div className="prose prose-invert dark:prose-invert max-w-none space-y-4">
      {blocks.map(block => (
        <div key={block.id} className="space-y-2">
          {renderBlock(block)}
        </div>
      ))}
    </div>
  )
}

function renderBlock(block: NotionBlock): React.ReactNode {
  switch (block.type) {
    case 'paragraph': {
      const para = block as any
      const text = para.paragraph?.rich_text || []
      return (
        <p className="text-base leading-7">
          {text.length > 0 ? renderRichText(text) : '\u00A0'}
        </p>
      )
    }

    case 'heading_1': {
      const h1 = block as any
      const text = h1.heading_1?.rich_text || []
      return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          {renderRichText(text)}
        </h1>
      )
    }

    case 'heading_2': {
      const h2 = block as any
      const text = h2.heading_2?.rich_text || []
      return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {renderRichText(text)}
        </h2>
      )
    }

    case 'heading_3': {
      const h3 = block as any
      const text = h3.heading_3?.rich_text || []
      return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {renderRichText(text)}
        </h3>
      )
    }

    case 'bulleted_list_item': {
      const item = block as any
      const text = item.bulleted_list_item?.rich_text || []
      return <li className="ml-6 list-disc">{renderRichText(text)}</li>
    }

    case 'numbered_list_item': {
      const item = block as any
      const text = item.numbered_list_item?.rich_text || []
      return <li className="ml-6 list-decimal">{renderRichText(text)}</li>
    }

    case 'code': {
      const code = block as any
      const text = code.code?.rich_text || []
      const language = code.code?.language || 'plaintext'
      const codeText = text.map((t: any) => t.plain_text).join('')

      let highlighted = codeText
      try {
        if (language && language !== 'plaintext') {
          highlighted = hljs.highlight(codeText, {
            language,
          }).value
        } else {
          highlighted = hljs.highlightAuto(codeText).value
        }
      } catch {
        highlighted = hljs.highlightAuto(codeText).value
      }

      return (
        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4">
          <code
            className={`language-${language} text-sm text-slate-200`}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      )
    }

    case 'quote': {
      const quote = block as any
      const text = quote.quote?.rich_text || []
      return (
        <blockquote className="border-l-4 border-slate-400 pl-4 text-slate-400 italic">
          {renderRichText(text)}
        </blockquote>
      )
    }

    case 'divider': {
      return <hr className="my-4" />
    }

    case 'image': {
      const img = block as any
      const imageUrl = img.image?.external?.url || img.image?.file?.url
      const caption = img.image?.caption || []

      if (!imageUrl) return null

      return (
        <figure className="space-y-2">
          <img
            src={imageUrl}
            alt={caption.map((c: any) => c.plain_text).join('') || 'Image'}
            className="w-full rounded-lg"
            loading="lazy"
          />
          {caption.length > 0 && (
            <figcaption className="text-center text-sm text-slate-500">
              {renderRichText(caption)}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'callout': {
      const callout = block as any
      const text = callout.callout?.rich_text || []
      const icon = callout.callout?.icon?.emoji || '💡'

      return (
        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 dark:border-blue-600 dark:bg-slate-900">
          <div className="flex gap-3">
            <span className="text-xl">{icon}</span>
            <div>{renderRichText(text)}</div>
          </div>
        </div>
      )
    }

    case 'to_do': {
      const todo = block as any
      const text = todo.to_do?.rich_text || []
      const checked = todo.to_do?.checked || false

      return (
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={checked} readOnly className="mt-1" />
          <span className={checked ? 'line-through opacity-50' : ''}>
            {renderRichText(text)}
          </span>
        </div>
      )
    }

    default:
      return null
  }
}

function renderRichText(richTextArray: any[]): React.ReactNode {
  return richTextArray.map((rt, idx) => {
    const text = rt.plain_text || ''

    const annotations = rt.annotations || {}
    const className = cn(
      annotations.bold && 'font-bold',
      annotations.italic && 'italic',
      annotations.strikethrough && 'line-through',
      annotations.underline && 'underline',
      annotations.code &&
        'rounded bg-slate-200 px-2 py-1 font-mono text-sm dark:bg-slate-800'
    )

    if (rt.href) {
      return (
        <a
          key={idx}
          href={rt.href}
          className={cn(className, 'text-blue-500 hover:underline')}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      )
    }

    return (
      <span key={idx} className={className}>
        {text}
      </span>
    )
  })
}
