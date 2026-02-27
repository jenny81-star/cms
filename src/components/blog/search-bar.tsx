'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * Search bar with real-time filtering via URL parameters
 */
export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const query = searchParams.get('search') || ''

  const handleSearch = useCallback(
    (value: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams)

        if (value) {
          params.set('search', value)
          params.delete('page')
        } else {
          params.delete('search')
        }

        router.push(`/?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  const handleClear = () => {
    handleSearch('')
  }

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="Search posts..."
        className="pl-10"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        disabled={isPending}
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
