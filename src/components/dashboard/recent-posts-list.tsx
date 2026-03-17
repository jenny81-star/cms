// 최근 발행된 포스트 목록 컴포넌트
// 대시보드 메인 페이지에서 최근 포스트 5개를 표시
import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Post } from '@/lib/types/blog'

// 최근 포스트 목록 props 타입
interface RecentPostsListProps {
  // 표시할 포스트 배열
  posts: Post[]
}

// 날짜 포맷 헬퍼 - YYYY-MM-DD 형식으로 변환
function formatDate(dateString: string): string {
  if (!dateString) return '날짜 미정'
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function RecentPostsList({ posts }: RecentPostsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" aria-hidden="true" />
          최근 발행된 포스트
        </CardTitle>
        <CardDescription>최근 5개 포스트</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {posts.length === 0 ? (
          // 포스트가 없을 때 빈 상태 표시
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-sm">
            <FileText className="mb-3 h-8 w-8 opacity-40" aria-hidden="true" />
            <p>발행된 포스트가 없습니다.</p>
          </div>
        ) : (
          <ul role="list" className="divide-y">
            {posts.map(post => (
              <li key={post.id}>
                <div className="hover:bg-muted/50 flex items-start justify-between gap-4 px-6 py-4 transition-colors">
                  {/* 포스트 정보 */}
                  <div className="min-w-0 flex-1">
                    {/* 포스트 제목 */}
                    <p className="text-foreground truncate text-sm font-medium">
                      {post.title}
                    </p>
                    {/* 발행일 */}
                    <time
                      dateTime={post.publishedDate}
                      className="text-muted-foreground mt-0.5 block text-xs"
                    >
                      {formatDate(post.publishedDate)}
                    </time>
                  </div>

                  {/* 카테고리 배지 */}
                  {post.category && (
                    <Badge
                      variant="secondary"
                      className="shrink-0 text-xs"
                      aria-label={`카테고리: ${post.category}`}
                    >
                      {post.category}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {/* 포스트 관리 페이지로 이동 링크 */}
      <CardFooter className="border-t pt-4">
        <Button variant="ghost" size="sm" asChild className="ml-auto gap-1">
          <Link href="/admin/posts" aria-label="전체 포스트 관리 페이지로 이동">
            전체 보기
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
