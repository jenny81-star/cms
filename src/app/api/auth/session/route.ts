import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get session cookie
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      return NextResponse.json({ error: '세션이 없습니다.' }, { status: 401 })
    }

    // Verify token
    const payload = await verifySessionToken(token)

    return NextResponse.json(
      {
        username: payload.username,
        expiresAt: payload.exp * 1000, // Convert to milliseconds
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Session verification error:', error)
    return NextResponse.json(
      { error: '세션 검증에 실패했습니다.' },
      { status: 401 }
    )
  }
}
