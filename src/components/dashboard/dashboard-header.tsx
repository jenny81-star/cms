'use client'

// 관리자 대시보드 상단 헤더 컴포넌트
// 모바일 사이드바 토글, 사용자명, 로그아웃 버튼 포함
import { Menu, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'

// 헤더 컴포넌트 props 타입
interface DashboardHeaderProps {
  // 현재 로그인된 사용자명
  username?: string
  // 모바일 사이드바 토글 콜백
  onMenuToggle?: () => void
}

export function DashboardHeader({
  username = 'Admin',
  onMenuToggle,
}: DashboardHeaderProps) {
  return (
    <header
      className="bg-background sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b px-4 lg:px-6"
      role="banner"
    >
      {/* 모바일 햄버거 메뉴 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuToggle}
        aria-label="사이드바 메뉴 열기"
        aria-expanded={undefined}
        aria-controls="mobile-sidebar"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Button>

      <Separator orientation="vertical" className="h-6 lg:hidden" />

      {/* 페이지 타이틀 영역 - 모바일에서 브랜드 표시 */}
      <div className="flex flex-1 items-center">
        <span className="text-foreground text-sm font-semibold lg:hidden">
          Dev Blog Admin
        </span>
      </div>

      {/* 우측 액션 영역 */}
      <div className="flex items-center gap-2">
        {/* 테마 전환 버튼 */}
        <ThemeToggle />

        <Separator orientation="vertical" className="h-6" />

        {/* 사용자 정보 표시 */}
        <div
          className="text-muted-foreground flex items-center gap-2 px-2"
          aria-label={`현재 사용자: ${username}`}
        >
          <div
            className="bg-muted flex h-8 w-8 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <User className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium sm:block">
            {username}
          </span>
        </div>

        {/* 로그아웃 버튼 */}
        {/* TODO: 로그아웃 로직 구현 필요 (POST /api/auth/logout 호출 후 /admin/login 리다이렉트) */}
        <form action="/api/auth/logout" method="POST">
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
            aria-label="로그아웃"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:block">로그아웃</span>
          </Button>
        </form>
      </div>
    </header>
  )
}
