'use client'

// 관리자 대시보드 좌측 사이드바 네비게이션 컴포넌트
// 데스크톱: 고정 사이드바 / 모바일: Sheet 슬라이드 패널
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, BarChart3, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// 사이드바 메뉴 항목 타입 정의
interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

// 사이드바 컴포넌트 props 타입
interface SidebarProps {
  // 모바일 Sheet 열림 상태
  mobileOpen?: boolean
  // 모바일 Sheet 열림/닫힘 콜백
  onMobileOpenChange?: (open: boolean) => void
}

// 네비게이션 메뉴 항목 목록
const navItems: NavItem[] = [
  {
    label: '대시보드',
    href: '/admin',
    icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
  },
  {
    label: '포스트 관리',
    href: '/admin/posts',
    icon: <FileText className="h-4 w-4" aria-hidden="true" />,
  },
  {
    label: '분석',
    href: '/admin/analytics',
    icon: <BarChart3 className="h-4 w-4" aria-hidden="true" />,
  },
]

// 사이드바 내부 네비게이션 내용
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* 로고 영역 */}
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          onClick={onClose}
          aria-label="관리자 대시보드 홈으로 이동"
        >
          {/* 블로그 펜 아이콘 */}
          <div
            className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </div>
          <span className="text-foreground text-sm font-semibold">
            Dev Blog Admin
          </span>
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-4"
        aria-label="관리자 메뉴"
      >
        <ul className="space-y-1" role="list">
          {navItems.map(item => {
            // /admin 경로는 정확히 일치해야 활성 처리 (하위 경로 제외)
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* 하단 블로그 바로가기 */}
      <div className="border-t px-3 py-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors"
          aria-label="블로그 메인 페이지 새 탭에서 열기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          블로그 바로가기
        </Link>
      </div>
    </div>
  )
}

// 메인 사이드바 컴포넌트
export function Sidebar({
  mobileOpen = false,
  onMobileOpenChange,
}: SidebarProps) {
  return (
    <>
      {/* 데스크톱 사이드바 - 항상 표시 */}
      <aside
        className="bg-background hidden w-60 shrink-0 border-r lg:flex lg:flex-col"
        aria-label="관리자 사이드바"
      >
        <SidebarContent />
      </aside>

      {/* 모바일 Sheet 사이드바 */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-60 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>관리자 메뉴</SheetTitle>
          </SheetHeader>
          {/* 닫기 버튼 */}
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-10 h-8 w-8"
              aria-label="메뉴 닫기"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
          <SidebarContent onClose={() => onMobileOpenChange?.(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
