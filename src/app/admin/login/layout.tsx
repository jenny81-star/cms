import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '관리자 로그인',
  description: '블로그 관리자 로그인 페이지',
  robots: {
    // 검색 엔진에 로그인 페이지 노출 방지
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // 전체 화면 중앙 정렬 레이아웃 - 다크/라이트 모드 모두 지원
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* 로그인 콘텐츠 영역 - 최대 너비 제한 */}
      <div className="w-full max-w-[400px]">
        {/* 블로그 로고 및 제목 영역 */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          {/* 로고 아이콘 */}
          <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              {/* 펜 아이콘 - 블로그를 상징 */}
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </div>

          {/* 블로그 제목 */}
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            개발 블로그
          </h1>

          {/* 부제목 */}
          <p className="text-muted-foreground text-sm">
            관리자 페이지에 로그인하세요
          </p>
        </div>

        {/* 로그인 폼 컨텐츠 */}
        {children}

        {/* 하단 안내 텍스트 */}
        <p className="text-muted-foreground mt-6 text-center text-xs">
          보안을 위해 로그인 정보를 안전하게 보관하세요
        </p>
      </div>
    </div>
  )
}
