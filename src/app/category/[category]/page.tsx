import Link from 'next/link'
import type { Metadata } from 'next'
import { Container } from '@/components/layout/container'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { PostCard } from '@/components/blog/post-card'
import { CategoryFilter } from '@/components/blog/category-filter'
import { SearchBar } from '@/components/blog/search-bar'
import { Pagination } from '@/components/blog/pagination'
import { fetchPosts, fetchCategories } from '@/lib/notion/posts'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    page?: string
    search?: string
  }>
}

const POSTS_PER_PAGE = 10

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  return {
    title: `Posts in ${category}`,
    description: `Browse all posts in the ${category} category`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params
  const searchParamsResolved = await searchParams

  const page = parseInt(searchParamsResolved.page || '1', 10)
  const search = searchParamsResolved.search || undefined

  const [posts, categories] = await Promise.all([
    fetchPosts(category),
    fetchCategories(),
  ])

  // Filter by search
  let filteredPosts = posts
  if (search) {
    const lowerSearch = search.toLowerCase()
    filteredPosts = posts.filter(
      post =>
        post.title.toLowerCase().includes(lowerSearch) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerSearch)) ||
        post.excerpt.toLowerCase().includes(lowerSearch)
    )
  }

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <section className="py-12 md:py-16">
            {/* Breadcrumb */}
            <div className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">{category}</span>
            </div>

            {/* Header */}
            <div className="mb-12 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                Category: {category}
              </h1>
              <p className="text-muted-foreground text-lg">
                Showing {filteredPosts.length} posts in this category
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar />
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <CategoryFilter categories={categories} />
            </div>

            {/* Posts Grid */}
            <div className="mb-8 space-y-4">
              {paginatedPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {paginatedPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">
                    No posts found in this category.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredPosts.length > POSTS_PER_PAGE && (
              <div className="flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            )}
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
