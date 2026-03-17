// 포스트 관리 페이지 (/admin/posts)
// 전체 포스트 목록을 테이블 형태로 표시
import type { Metadata } from 'next'
import { FileText, Plus, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { fetchPosts } from '@/lib/notion/posts'

export const metadata: Metadata = {
  title: '포스트 관리',
}

// 날짜 포맷 헬퍼
function formatDate(dateString: string): string {
  if (!dateString) return '날짜 미정'
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function PostsPage() {
  // 전체 포스트 페칭 (1시간 캐시)
  const posts = await fetchPosts()

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            포스트 관리
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            총 {posts.length}개의 포스트가 발행되어 있습니다.
          </p>
        </div>

        {/* 새 포스트 작성 버튼 (Notion에서 작성) */}
        <Button size="sm" asChild className="gap-2">
          <a
            href="https://notion.so"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Notion에서 새 포스트 작성하기"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:block">새 포스트</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </Button>
      </div>

      <Separator />

      {/* 포스트 목록 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" aria-hidden="true" />
            전체 포스트 목록
          </CardTitle>
          <CardDescription>
            Notion에서 발행된 모든 포스트를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {posts.length === 0 ? (
            // 포스트가 없을 때 빈 상태
            <div className="text-muted-foreground flex flex-col items-center justify-center py-16 text-sm">
              <FileText
                className="mb-3 h-10 w-10 opacity-30"
                aria-hidden="true"
              />
              <p className="font-medium">발행된 포스트가 없습니다</p>
              <p className="mt-1 text-xs">
                Notion 데이터베이스에서 포스트를 발행해주세요.
              </p>
            </div>
          ) : (
            <>
              {/* 데스크톱: 테이블 레이아웃 */}
              <div className="hidden overflow-x-auto md:block">
                <table
                  className="w-full text-sm"
                  aria-label="포스트 목록 테이블"
                >
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th
                        scope="col"
                        className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wide"
                      >
                        제목
                      </th>
                      <th
                        scope="col"
                        className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wide"
                      >
                        카테고리
                      </th>
                      <th
                        scope="col"
                        className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wide"
                      >
                        태그
                      </th>
                      <th
                        scope="col"
                        className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wide"
                      >
                        발행일
                      </th>
                      <th
                        scope="col"
                        className="text-muted-foreground px-6 py-3 text-right text-xs font-medium tracking-wide"
                      >
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {posts.map(post => (
                      <tr
                        key={post.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        {/* 포스트 제목 */}
                        <td className="px-6 py-4">
                          <p className="text-foreground max-w-xs truncate font-medium">
                            {post.title}
                          </p>
                          <p className="text-muted-foreground mt-0.5 max-w-xs truncate text-xs">
                            /blog/{post.slug}
                          </p>
                        </td>

                        {/* 카테고리 */}
                        <td className="px-6 py-4">
                          {post.category ? (
                            <Badge variant="secondary" className="text-xs">
                              {post.category}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              미분류
                            </span>
                          )}
                        </td>

                        {/* 태그 */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map(tag => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="text-muted-foreground text-xs">
                                +{post.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 발행일 */}
                        <td className="px-6 py-4">
                          <time
                            dateTime={post.publishedDate}
                            className="text-muted-foreground text-xs"
                          >
                            {formatDate(post.publishedDate)}
                          </time>
                        </td>

                        {/* 작업 버튼 */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* 블로그에서 보기 */}
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-7 px-2 text-xs"
                            >
                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`"${post.title}" 포스트 블로그에서 열기`}
                              >
                                <ExternalLink
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                                <span className="ml-1">보기</span>
                              </a>
                            </Button>

                            {/* TODO: 포스트 편집 기능 구현 필요 */}
                            {/* TODO: 포스트 삭제 기능 구현 필요 */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 모바일: 카드 레이아웃 */}
              <ul
                className="divide-y md:hidden"
                role="list"
                aria-label="포스트 목록"
              >
                {posts.map(post => (
                  <li key={post.id} className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {/* 제목 */}
                        <p className="text-foreground truncate text-sm font-medium">
                          {post.title}
                        </p>
                        {/* 슬러그 */}
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          /blog/{post.slug}
                        </p>
                        {/* 메타 정보 */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {post.category && (
                            <Badge variant="secondary" className="text-xs">
                              {post.category}
                            </Badge>
                          )}
                          <time
                            dateTime={post.publishedDate}
                            className="text-muted-foreground text-xs"
                          >
                            {formatDate(post.publishedDate)}
                          </time>
                        </div>
                      </div>

                      {/* 보기 버튼 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 shrink-0 px-2"
                      >
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`"${post.title}" 블로그에서 열기`}
                        >
                          <ExternalLink
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
