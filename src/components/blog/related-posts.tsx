import { PostCard } from './post-card'
import { fetchPosts } from '@/lib/notion/posts'
import type { Post } from '@/lib/types/blog'

interface RelatedPostsProps {
  currentPost: Post
}

/**
 * Display up to 5 related posts from the same category
 */
export async function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const posts = await fetchPosts(currentPost.category)

  const related = posts.filter(p => p.id !== currentPost.id).slice(0, 5)

  if (related.length === 0) {
    return null
  }

  return (
    <section className="space-y-4 border-t pt-8">
      <h2 className="text-2xl font-bold">Related Posts</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {related.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
