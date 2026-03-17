'use client'

// 대시보드 에러 바운더리 - 클라이언트 컴포넌트 필수
// Next.js App Router의 error.tsx는 반드시 클라이언트 컴포넌트여야 함
import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

// Next.js error.tsx에서 자동으로 주입되는 props 타입
interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  // 에러 발생 시 콘솔에 기록
  useEffect(() => {
    // TODO: 에러 추적 서비스(Sentry 등) 연동 필요
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* 에러 아이콘 */}
          <div
            className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <AlertCircle className="text-destructive h-6 w-6" />
          </div>

          <CardTitle className="text-lg">오류가 발생했습니다</CardTitle>
          <CardDescription>
            페이지를 불러오는 중 문제가 생겼습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* 에러 상세 메시지 (개발 환경에서 유용) */}
          {error.message && (
            <div
              className="bg-muted rounded-lg p-3"
              role="alert"
              aria-label="에러 상세 정보"
            >
              <p className="text-muted-foreground font-mono text-xs break-all">
                {error.message}
              </p>
              {/* digest: Next.js 서버 에러 추적 ID */}
              {error.digest && (
                <p className="text-muted-foreground mt-1 font-mono text-xs opacity-60">
                  ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          {/* 재시도 버튼 - reset() 호출로 에러 경계 재설정 */}
          <Button
            onClick={reset}
            className="w-full gap-2 sm:flex-1"
            aria-label="페이지 다시 시도"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            다시 시도
          </Button>

          {/* 대시보드 홈으로 이동 */}
          <Button variant="outline" asChild className="w-full gap-2 sm:flex-1">
            <Link href="/admin" aria-label="대시보드 홈으로 이동">
              <Home className="h-4 w-4" aria-hidden="true" />
              대시보드 홈
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
