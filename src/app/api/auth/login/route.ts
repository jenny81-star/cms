import { NextRequest, NextResponse } from 'next/server'
import { LoginSchema } from '@/lib/schemas/auth'
import { login, getSessionConfig } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Validate Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: '요청 형식이 잘못되었습니다. application/json이어야 합니다.' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validationResult = LoginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: '입력값이 유효하지 않습니다.' },
        { status: 400 }
      )
    }

    const { username, password } = validationResult.data

    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Authenticate
    const result = await login(username, password, ip)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '로그인에 실패했습니다.' },
        { status: 401 }
      )
    }

    // Create response
    const response = NextResponse.json({ success: true }, { status: 200 })

    // Set session cookie
    const config = getSessionConfig()
    response.cookies.set('admin_session', result.token!, {
      ...config,
      maxAge: config.maxAge,
    })

    return response
  } catch (error) {
    console.error('[API] Login error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
