import { NextRequest, NextResponse } from 'next/server'
import { fetchPosts } from '@/lib/notion/posts'

export const revalidate = 3600 // 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search')?.toLowerCase() || undefined

    let posts = await fetchPosts(category)

    // Client-side search filtering
    if (search) {
      posts = posts.filter(
        post =>
          post.title.toLowerCase().includes(search) ||
          post.tags.some(tag => tag.toLowerCase().includes(search)) ||
          post.excerpt.toLowerCase().includes(search)
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: posts,
        count: posts.length,
      },
      { headers: { 'Cache-Control': 'public, max-age=3600' } }
    )
  } catch (error) {
    console.error('API /posts error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
