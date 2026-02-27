import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * ISR (Incremental Static Regeneration) endpoint
 * Manually trigger cache revalidation for blog content
 * Usage: POST /api/revalidate?tag=posts
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add a secret token verification for security
    // const secret = request.nextUrl.searchParams.get('secret')
    const tag = request.nextUrl.searchParams.get('tag') || 'posts'

    // In production, verify secret token
    // if (secret !== process.env.REVALIDATE_SECRET) {
    //   return NextResponse.json(
    //     { success: false, error: 'Invalid secret' },
    //     { status: 401 }
    //   )
    // }

    revalidateTag(tag)

    return NextResponse.json(
      { success: true, message: `Revalidated tag: ${tag}` },
      { status: 200 }
    )
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { success: false, error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}
