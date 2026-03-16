'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Category } from '@/lib/types/blog'

interface CategoryFilterProps {
  categories: Category[]
}

/**
 * Category filter component with URL parameter synchronization
 */
export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const handleCategoryClick = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams)

    if (categorySlug) {
      params.set('category', categorySlug)
      params.delete('page')
    } else {
      params.delete('category')
      params.delete('page')
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!activeCategory ? 'default' : 'outline'}
        onClick={() => handleCategoryClick(null)}
      >
        All Posts
      </Button>
      {categories.map(category => (
        <Button
          key={category.slug || category.id}
          variant={activeCategory === category.slug ? 'default' : 'outline'}
          onClick={() => handleCategoryClick(category.slug)}
          className="relative"
        >
          {category.name || category.slug}
          <span className="ml-2 text-xs opacity-75">
            ({category.postCount})
          </span>
        </Button>
      ))}
    </div>
  )
}
