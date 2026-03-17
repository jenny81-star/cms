// 대시보드 로딩 UI - Next.js Suspense 경계에서 자동 표시
// 카드와 테이블 영역에 스켈레톤 애니메이션을 표시
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6 lg:p-8" aria-busy="true" aria-label="로딩 중">
      {/* 페이지 헤더 스켈레톤 */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Separator />

      {/* 통계 카드 스켈레톤 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-border rounded-xl border p-6"
            aria-hidden="true"
          >
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* 메인 콘텐츠 그리드 스켈레톤 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 최근 포스트 목록 스켈레톤 */}
        <div
          className="border-border rounded-xl border lg:col-span-2"
          aria-hidden="true"
        >
          {/* 카드 헤더 */}
          <div className="border-b p-6">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-1.5 h-4 w-24" />
          </div>
          {/* 목록 항목 스켈레톤 */}
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
          {/* 카드 푸터 */}
          <div className="border-t p-4">
            <Skeleton className="ml-auto h-8 w-20" />
          </div>
        </div>

        {/* 사이드 패널 스켈레톤 */}
        <div className="space-y-4" aria-hidden="true">
          {/* 캐시 카드 스켈레톤 */}
          <div className="border-border rounded-xl border p-6">
            <Skeleton className="mb-1.5 h-4 w-20" />
            <Skeleton className="mb-4 h-3 w-40" />
            <Skeleton className="h-8 w-full rounded-md" />
          </div>

          {/* 빠른 링크 카드 스켈레톤 */}
          <div className="border-border rounded-xl border p-6">
            <Skeleton className="mb-4 h-4 w-20" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
