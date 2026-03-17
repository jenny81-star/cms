'use client'

// 대시보드 레이아웃 클라이언트 래퍼 컴포넌트
// 모바일 사이드바 열림 상태를 관리하는 클라이언트 컴포넌트
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'

// 레이아웃 클라이언트 래퍼 props
interface DashboardLayoutClientProps {
  children: ReactNode
  // 현재 로그인 사용자명
  username?: string
}

export function DashboardLayoutClient({
  children,
  username,
}: DashboardLayoutClientProps) {
  // 모바일 사이드바 열림/닫힘 상태
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="bg-background flex min-h-screen">
      {/* 사이드바 - 데스크톱: 고정, 모바일: Sheet */}
      <Sidebar mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 상단 헤더 */}
        <DashboardHeader
          username={username}
          onMenuToggle={() => setMobileOpen(true)}
        />

        {/* 페이지 콘텐츠 */}
        <main
          id="main-content"
          className="flex-1 overflow-auto"
          role="main"
          aria-label="대시보드 메인 콘텐츠"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
