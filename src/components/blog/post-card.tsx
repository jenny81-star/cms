import Link from 'next/link'
import { formatDate } from 'date-fns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/lib/types/blog'

interface PostCardProps {
  post: Post
}

/**
 * Blog post card component for listing
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="hover:border-primary h-full transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <h3 className="hover:text-primary line-clamp-2 text-xl font-semibold">
              {post.title}
            </h3>
            {post.category && (
              <Badge variant="outline" className="whitespace-nowrap">
                {post.category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {post.excerpt}
          </p>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <time dateTime={post.publishedDate}>
              {formatDate(new Date(post.publishedDate), 'MMM dd, yyyy')}
            </time>
            {post.tags.length > 0 && (
              <div className="flex gap-1">
                {post.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="bg-secondary rounded-full px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && <span>+{post.tags.length - 2}</span>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
