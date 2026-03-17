// 관리자 대시보드 마스터 레이아웃
// 사이드바와 헤더를 포함한 전체 대시보드 껍데기
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'

export const metadata: Metadata = {
  title: {
    template: '%s | Dev Blog Admin',
    default: '대시보드 | Dev Blog Admin',
  },
  description: '블로그 관리자 대시보드',
  robots: {
    // 검색 엔진에 관리자 페이지 노출 방지
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // TODO: 세션에서 실제 사용자명 읽어오는 로직 구현 필요
  // 예: const session = await getSession(); const username = session?.username
  const username = 'Admin'

  return (
    <DashboardLayoutClient username={username}>
      {children}
    </DashboardLayoutClient>
  )
}
