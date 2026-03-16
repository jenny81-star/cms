'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

/**
 * Pagination component with previous/next buttons and page numbers
 */
export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(p => {
    const distance = Math.abs(p - currentPage)
    return distance <= 2 || p === 1 || p === totalPages
  })

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="icon"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages[0] !== 1 && (
        <>
          <Button
            variant="outline"
            onClick={() => handlePageChange(1)}
            size="sm"
          >
            1
          </Button>
          <span className="px-2">...</span>
        </>
      )}

      {visiblePages.map(page => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          onClick={() => handlePageChange(page)}
          size="sm"
        >
          {page}
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] !== totalPages && (
        <>
          <span className="px-2">...</span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(totalPages)}
            size="sm"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="icon"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
