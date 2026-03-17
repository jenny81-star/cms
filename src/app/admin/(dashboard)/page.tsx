// 관리자 대시보드 메인 페이지 (/admin)
// 블로그 통계, 최근 포스트, 빠른 링크를 표시
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  FolderOpen,
  CalendarDays,
  ExternalLink,
  Database,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentPostsList } from '@/components/dashboard/recent-posts-list'
import { fetchPosts, fetchCategories } from '@/lib/notion/posts'

export const metadata: Metadata = {
  title: '대시보드',
}

// 최근 N일 이내 포스트 수 계산
function countRecentPosts(posts: { publishedDate: string }[], days: number) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return posts.filter(post => {
    if (!post.publishedDate) return false
    return new Date(post.publishedDate) >= cutoff
  }).length
}

export default async function DashboardPage() {
  // Notion에서 데이터 페칭 (1시간 캐시)
  const [posts, categories] = await Promise.all([
    fetchPosts(),
    fetchCategories(),
  ])

  // 통계 계산
  const totalPosts = posts.length
  const totalCategories = categories.length
  const recentPosts7Days = countRecentPosts(posts, 7)

  // 최근 5개 포스트
  const latestPosts = posts.slice(0, 5)

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          대시보드
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          블로그 현황을 한눈에 확인하세요.
        </p>
      </div>

      <Separator />

      {/* 통계 카드 섹션 */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          블로그 통계
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 총 포스트 수 */}
          <StatsCard
            title="총 포스트 수"
            value={totalPosts}
            description="발행된 전체 포스트"
            icon={<FileText className="h-4 w-4" />}
            iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          />

          {/* 총 카테고리 수 */}
          <StatsCard
            title="총 카테고리 수"
            value={totalCategories}
            description="등록된 카테고리"
            icon={<FolderOpen className="h-4 w-4" />}
            iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
          />

          {/* 최근 7일 포스트 수 */}
          <StatsCard
            title="최근 7일 포스트"
            value={recentPosts7Days}
            description="최근 일주일 발행된 포스트"
            icon={<CalendarDays className="h-4 w-4" />}
            iconClassName="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
          />
        </div>
      </section>

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 최근 포스트 목록 - 넓은 영역 */}
        <div className="lg:col-span-2">
          <RecentPostsList posts={latestPosts} />
        </div>

        {/* 빠른 링크 사이드 패널 */}
        <div className="space-y-4">
          {/* 캐시 재검증 카드 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">캐시 관리</CardTitle>
              <CardDescription className="text-xs">
                Notion 데이터 변경 시 캐시를 갱신하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: 캐시 재검증 버튼 클릭 로직 구현 필요 (POST /api/revalidate) */}
              <form action="/api/revalidate" method="POST">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  aria-label="블로그 캐시 재검증 실행"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  캐시 재검증
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 빠른 링크 카드 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">빠른 링크</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Notion 데이터베이스 링크 */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start gap-2 text-xs"
              >
                <a
                  href="https://notion.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Notion 데이터베이스 새 탭에서 열기"
                >
                  <Database className="h-3.5 w-3.5" aria-hidden="true" />
                  Notion 데이터베이스
                  <ExternalLink
                    className="ml-auto h-3 w-3 opacity-50"
                    aria-hidden="true"
                  />
                </a>
              </Button>

              {/* 포스트 관리 링크 */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start gap-2 text-xs"
              >
                <Link
                  href="/admin/posts"
                  aria-label="포스트 관리 페이지로 이동"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  포스트 관리
                </Link>
              </Button>

              {/* 블로그 바로가기 */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start gap-2 text-xs"
              >
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="블로그 메인 새 탭에서 열기"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  블로그 보기
                  <ExternalLink
                    className="ml-auto h-3 w-3 opacity-50"
                    aria-hidden="true"
                  />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
