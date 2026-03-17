// 대시보드 통계 카드 컴포넌트
// 아이콘 + 숫자 + 라벨을 표시하는 재사용 가능한 카드
import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// 통계 카드 props 타입
interface StatsCardProps {
  // 카드 제목 (통계 라벨)
  title: string
  // 통계 숫자 값
  value: string | number
  // 추가 설명 텍스트 (선택적)
  description?: string
  // Lucide 아이콘 컴포넌트
  icon: ReactNode
  // 아이콘 배경 색상 클래스 (Tailwind)
  iconClassName?: string
  // 추가 CSS 클래스
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  iconClassName,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        {/* 아이콘 영역 */}
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            iconClassName ?? 'bg-primary/10 text-primary'
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {/* 통계 숫자 */}
        <div className="text-foreground text-2xl font-bold tabular-nums">
          {value}
        </div>
        {/* 설명 텍스트 */}
        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
