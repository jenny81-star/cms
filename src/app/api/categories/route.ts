import { NextResponse } from 'next/server'
import { fetchCategories } from '@/lib/notion/posts'

export const revalidate = 3600 // 1 hour

export async function GET() {
  try {
    const categories = await fetchCategories()

    return NextResponse.json(
      { success: true, data: categories, count: categories.length },
      { headers: { 'Cache-Control': 'public, max-age=3600' } }
    )
  } catch (error) {
    console.error('API /categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
