import { Badge } from '@/components/ui/badge'

interface TagBadgeProps {
  tags: string[]
}

/**
 * Tag badge component wrapping shadcn Badge
 */
export function TagBadge({ tags }: TagBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
