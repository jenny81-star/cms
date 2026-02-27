import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { formatDate } from 'date-fns'
import { Container } from '@/components/layout/container'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { PostContent } from '@/components/blog/post-content'
import { TagBadge } from '@/components/blog/tag-badge'
import { RelatedPosts } from '@/components/blog/related-posts'
import { fetchPostBySlug, fetchPosts } from '@/lib/notion/posts'
import { Badge } from '@/components/ui/badge'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedDate,
    },
  }
}

// Optional: Generate static params for popular posts
export async function generateStaticParams() {
  try {
    const posts = await fetchPosts()
    return posts.slice(0, 10).map(post => ({
      slug: post.slug,
    }))
  } catch {
    // During build, if Notion API is not configured, return empty array
    console.warn('Could not generate static params for blog posts.')
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await fetchPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <article className="py-12 md:py-16">
            {/* Breadcrumb */}
            <div className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              {post.category && (
                <>
                  <Link
                    href={`/category/${post.category}`}
                    className="hover:text-primary"
                  >
                    {post.category}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-foreground">{post.title}</span>
            </div>

            {/* Header */}
            <div className="mb-8 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                {post.title}
              </h1>

              <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                <time dateTime={post.publishedDate}>
                  {formatDate(new Date(post.publishedDate), 'MMMM dd, yyyy')}
                </time>
                {post.category && (
                  <Badge variant="outline">{post.category}</Badge>
                )}
                {post.author && <span>By {post.author}</span>}
              </div>

              {post.tags.length > 0 && (
                <div className="pt-2">
                  <TagBadge tags={post.tags} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-invert dark:prose-invert max-w-none">
              {post.content ? (
                <PostContent blocks={post.content} />
              ) : (
                <p className="text-muted-foreground">
                  No content available for this post.
                </p>
              )}
            </div>

            {/* Related Posts */}
            <div className="mt-12">
              <RelatedPosts currentPost={post} />
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
