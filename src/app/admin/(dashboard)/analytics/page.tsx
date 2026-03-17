// 분석 대시보드 페이지 (/admin/analytics)
// 향후 페이지뷰, 인기 포스트 등 분석 데이터를 표시할 영역
import type { Metadata } from 'next'
import { BarChart3, Eye, TrendingUp, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: '분석',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          분석
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          블로그 트래픽 및 콘텐츠 성과를 확인하세요.
        </p>
      </div>

      <Separator />

      {/* 플레이스홀더 통계 카드 (스켈레톤 형태) */}
      <section aria-labelledby="analytics-stats-heading">
        <h2 id="analytics-stats-heading" className="sr-only">
          분석 통계
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 총 페이지뷰 - 플레이스홀더 */}
          <Card className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                총 페이지뷰
              </CardTitle>
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <Eye
                  className="text-muted-foreground h-4 w-4"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="bg-muted h-7 w-20 animate-pulse rounded"
                aria-hidden="true"
              />
              <p className="text-muted-foreground mt-1 text-xs">준비 중</p>
            </CardContent>
          </Card>

          {/* 방문자 수 - 플레이스홀더 */}
          <Card className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                방문자 수
              </CardTitle>
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <Users
                  className="text-muted-foreground h-4 w-4"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="bg-muted h-7 w-20 animate-pulse rounded"
                aria-hidden="true"
              />
              <p className="text-muted-foreground mt-1 text-xs">준비 중</p>
            </CardContent>
          </Card>

          {/* 평균 체류 시간 - 플레이스홀더 */}
          <Card className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                평균 체류 시간
              </CardTitle>
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <TrendingUp
                  className="text-muted-foreground h-4 w-4"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="bg-muted h-7 w-20 animate-pulse rounded"
                aria-hidden="true"
              />
              <p className="text-muted-foreground mt-1 text-xs">준비 중</p>
            </CardContent>
          </Card>

          {/* 인기 포스트 - 플레이스홀더 */}
          <Card className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                인기 포스트
              </CardTitle>
              <div className="bg-muted flex h-9 w-9 items-center justify-center rounded-lg">
                <BarChart3
                  className="text-muted-foreground h-4 w-4"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="bg-muted h-7 w-20 animate-pulse rounded"
                aria-hidden="true"
              />
              <p className="text-muted-foreground mt-1 text-xs">준비 중</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 메인 안내 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            분석 데이터 수집 중
          </CardTitle>
          <CardDescription>분석 기능은 현재 개발 중입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
            {/* 분석 아이콘 */}
            <div
              className="bg-muted mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              aria-hidden="true"
            >
              <BarChart3 className="text-muted-foreground h-8 w-8" />
            </div>

            <h3 className="text-foreground mb-2 text-base font-semibold">
              분석 데이터 수집 중...
            </h3>
            <p className="max-w-sm text-sm leading-relaxed">
              블로그 트래픽 분석 기능이 곧 추가될 예정입니다.
              <br />
              페이지뷰, 인기 포스트, 방문자 통계 등을 제공할 계획입니다.
            </p>

            {/* 향후 추가 예정 기능 목록 */}
            <div className="mt-8 w-full max-w-sm">
              <h4 className="text-foreground mb-3 text-left text-sm font-medium">
                예정된 기능
              </h4>
              <ul
                className="space-y-2 text-left"
                aria-label="향후 추가 예정 분석 기능 목록"
              >
                {[
                  '실시간 페이지뷰 추적',
                  '인기 포스트 순위',
                  '방문자 유입 경로 분석',
                  '카테고리별 조회수',
                  '월별 트래픽 차트',
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-xs">
                    {/* 예정 아이콘 */}
                    <div
                      className="bg-muted h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
