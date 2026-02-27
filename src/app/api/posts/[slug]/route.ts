import { NextRequest, NextResponse } from 'next/server'
import { fetchPostBySlug } from '@/lib/notion/posts'

export const revalidate = 3600 // 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      )
    }

    const post = await fetchPostBySlug(slug)

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: post },
      { headers: { 'Cache-Control': 'public, max-age=3600' } }
    )
  } catch (error) {
    console.error(`API /posts/[slug] error:`, error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}
