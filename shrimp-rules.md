# Project Development Standards for AI Agents

**Project**: Notion-based Blog CMS | **Stack**: Next.js 15.5.3 + React 19 + TypeScript + TailwindCSS + Notion API | **Status**: MVP Complete

---

## 1. Project Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **Database**: Notion API (`@notionhq/client` v5.9.0)
- **Forms**: React Hook Form + Zod + Server Actions
- **Caching**: Next.js unstable_cache with ISR (1-hour revalidation)
- **Code Quality**: ESLint 9 + Prettier 3.6.2 + Husky 9 + lint-staged 16

### Core Functionality
- Blog post management via Notion database
- Server-rendered pages with ISR for blog content
- Client-side search, filtering, and pagination
- Post detail pages with Notion block rendering
- Category-based post browsing

### Key Directory Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Blog home (server)
│   ├── blog/[slug]/page.tsx     # Post detail (server)
│   ├── category/[category]/...  # Category pages (server)
│   └── api/posts|categories/    # API routes
├── components/
│   ├── blog/                    # Blog-specific: post-card, search-bar, category-filter, pagination
│   ├── layout/                  # Header, footer, container
│   ├── navigation/              # Main-nav, mobile-nav
│   ├── ui/                      # shadcn/ui base components
│   └── providers/               # Theme provider
└── lib/
    ├── notion/                  # Notion client & utilities
    │   ├── client.ts           # Singleton client instance
    │   ├── posts.ts            # Post fetching, caching, extraction
    │   └── blocks.ts           # Block rendering utilities
    ├── types/
    │   ├── blog.ts             # Post, Category, PaginationParams interfaces
    │   └── notion.ts           # Notion-specific types
    ├── utils.ts                # Common utilities (cn function)
    └── env.ts                  # Environment variable validation (Zod)
```

---

## 2. Component Architecture Standards

### Server vs Client Components

| Scenario | Type | Rule | Example |
|----------|------|------|---------|
| **Data fetching** | Server | Always use Server Components for Notion API calls | `src/app/page.tsx`, `src/lib/notion/posts.ts` |
| **Interactivity** | Client | Use `'use client'` only for interactive features | `SearchBar`, `CategoryFilter`, `Pagination` |
| **Layout pages** | Server | Default to Server Components | `page.tsx`, `layout.tsx` |
| **Async operations** | Server | Never use async in Client Components | ✅ Server: `async function`, ❌ Client: must use useState/useEffect |

### Client Component Rules
- **Mark with `'use client'`** at the top of the file
- Only client-side state management (useState, useCallback, useEffect)
- Must accept data as props from Server Components
- If data fetching needed: call API routes, not Notion client directly

### Server Component Rules
- **Default choice** for new components
- Direct access to Notion client and utilities
- Use `unstable_cache` for all Notion queries
- Can have `async` functions and await operations
- Return JSX directly (no hydration issues)

---

## 3. Notion Data Integration Standards

### Data Fetching & Caching Pattern

**REQUIRED**: All Notion database queries MUST use `unstable_cache` with 1-hour revalidation:

```typescript
// ✅ CORRECT - Always use unstable_cache
import { unstable_cache } from 'next/cache'

export const fetchPosts = unstable_cache(
  async (category?: string) => fetchPostsUncached(category),
  ['posts'],           // Cache key
  { revalidate: 3600, tags: ['posts'] }  // 1 hour
)

// ❌ WRONG - Direct uncached queries
const posts = await client.databases.query(...)
```

### Notion Properties → TypeScript Mapping

**CRITICAL**: When adding new Notion properties, BOTH files must be updated:

1. **src/lib/types/blog.ts** - Update `Post` interface
2. **src/lib/notion/posts.ts** - Update property extraction logic

Example: Adding author field
```typescript
// Step 1: Update type (blog.ts)
export interface Post {
  // ... existing fields
  author?: string  // NEW
}

// Step 2: Update extraction (posts.ts line ~66-72)
const author = extractText(props.Author?.rich_text || [])  // NEW
return {
  // ... existing fields
  author,  // NEW
}
```

### Property Extraction Functions
- **extractText()**: For rich_text and title arrays → string
- **titleToSlug()**: Title → kebab-case URL slug
- Filter invalid posts: `posts.filter(post => post.slug)`

---

## 4. File Organization & Naming Standards

### Component Location Decision Tree

```
Is this a reusable UI component?
├─ YES → src/components/ui/ (shadcn/ui or custom base components)
└─ NO → Is it blog-specific?
        ├─ YES → src/components/blog/
        │        (post-card, search-bar, category-filter, pagination, etc.)
        └─ NO → Is it layout-related?
                ├─ YES → src/components/layout/
                │        (header, footer, container)
                └─ NO → Is it navigation-related?
                        └─ YES → src/components/navigation/
```

### Naming Conventions (Strict)

| Type | Format | Example | Status |
|------|--------|---------|--------|
| Component file | kebab-case | `post-card.tsx` | ✅ REQUIRED |
| Component name | PascalCase | `export function PostCard()` | ✅ REQUIRED |
| Folder | kebab-case | `src/components/blog/` | ✅ REQUIRED |
| API route | kebab-case | `src/app/api/posts/route.ts` | ✅ REQUIRED |
| Type file | kebab-case | `src/lib/types/blog.ts` | ✅ REQUIRED |
| Utility file | kebab-case | `src/lib/notion/posts.ts` | ✅ REQUIRED |

**PROHIBITED**:
- `snake_case` file names (will fail linting)
- `camelCase` folders or routes
- Files > 300 lines (refactor into separate files)

### Import Path Aliases (Mandatory)

```typescript
// ✅ ALWAYS use path aliases
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/blog/post-card'
import { fetchPosts } from '@/lib/notion/posts'
import type { Post } from '@/lib/types/blog'

// ❌ NEVER use relative paths
import { Button } from '../../../components/ui/button'  // FORBIDDEN
```

**Valid aliases** (from tsconfig.json):
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/ui` → `src/components/ui`
- `@/utils` → `src/lib/utils`

---

## 5. Next.js 15.5.3 Specific Standards

### App Router Pages

| File | Purpose | Rules |
|------|---------|-------|
| `page.tsx` | Route page | Use Server Component, async operations OK |
| `layout.tsx` | Nested layouts | Server Component, wraps children |
| `error.tsx` | Error boundary | Client Component ('use client') |
| `loading.tsx` | Loading UI | Shown during data fetch |
| `not-found.tsx` | 404 handler | Server Component |

### Dynamic Routes

```typescript
// src/app/blog/[slug]/page.tsx
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await fetchPostBySlug(params.slug)
  if (!post) notFound()  // Returns 404
  return <PostContent post={post} />
}

// src/app/category/[category]/page.tsx
export default async function CategoryPage({ params }: { params: { category: string } }) {
  const posts = await fetchPosts(params.category)
  return <PostsList posts={posts} />
}
```

### API Routes

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
export const revalidate = 3600  // ISR: 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    // ... fetch and return
    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    return NextResponse.json({ success: false, error: '...' }, { status: 500 })
  }
}
```

**REQUIRED**:
- Use `NextRequest` and `NextResponse` types
- Always wrap in try/catch
- Set `export const revalidate = 3600` for ISR
- Return proper HTTP status codes

---

## 6. Key File Interaction Standards

### Critical Multi-File Coordination Points

#### 📌 Adding New Post Properties

**When**: User wants to display a new field from Notion (e.g., author, reading-time, featured-image)

**Files to update** (IN ORDER):
1. `src/lib/types/blog.ts` - Add to `Post` interface
2. `src/lib/notion/posts.ts` - Add extraction logic (~line 66-72)
3. `src/components/blog/post-card.tsx` - Display in UI
4. `src/app/page.tsx` - Use in listing if needed

**Example Checklist**:
```typescript
// 1. Type definition
✓ Post interface has new field

// 2. Notion extraction
✓ extractText or custom extraction for property
✓ Mapped in return object

// 3. Component displays it
✓ post.newField accessible in JSX

// 4. Cache invalidated
✓ Changes use unstable_cache (auto-revalidates at 3600s)
```

#### 📌 Creating New API Endpoints

**Pattern**: All new API routes must follow existing conventions

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    // Extract params from URL
    const { searchParams } = new URL(request.url)

    // Fetch from lib utilities (NOT direct Notion client)
    const data = await fetchResource(...)

    // Return JSON response
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch' },
      { status: 500 }
    )
  }
}
```

**MUST-HAVES**:
- ✅ Use `unstable_cache` in utility functions
- ✅ Error handling with try/catch
- ✅ `export const revalidate = 3600`
- ✅ NextResponse JSON responses
- ❌ Direct Notion client calls (use `src/lib/notion/` utilities)

#### 📌 Adding Interactive Features (Search, Filter, Pagination)

**Pattern**: Keep server/client separation strict

```typescript
// src/components/blog/search-bar.tsx
'use client'  // REQUIRED - has useState/onChange

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (query: string) => {
    startTransition(() => {
      router.push(`/?search=${encodeURIComponent(query)}`)
    })
  }

  return <input onChange={(e) => handleSearch(e.target.value)} />
}
```

**Key Points**:
- ❌ SearchBar does NOT fetch Notion directly
- ✅ SearchBar updates URL params
- ✅ Parent Server Component refetches via searchParams
- ✅ Filtering happens in `src/app/page.tsx` (server-side)

---

## 7. TypeScript & Type Safety Standards

### Type Definition Organization

```typescript
// src/lib/types/blog.ts - Business domain types
export interface Post {
  id: string
  slug: string
  title: string
  category: string
  tags: string[]
  publishedDate: string
  excerpt: string
  content?: NotionBlock[]
  author?: string
  createdAt: string
  updatedAt: string
}

// src/lib/types/notion.ts - Notion API types
export interface NotionBlock {
  id: string
  type: string
  [key: string]: any
}
```

### Type Imports

```typescript
// ✅ CORRECT - Use 'type' for type-only imports
import type { Post, Category } from '@/lib/types/blog'

// ✅ CORRECT - Separate type and value imports
import type { Post } from '@/lib/types/blog'
import { fetchPosts } from '@/lib/notion/posts'

// ❌ WRONG - Mixing types and values
import { Post, fetchPosts } from '@/lib/types/blog'
```

### Required TypeScript Checks

**Before committing, ensure**:
```bash
npm run typecheck  # No TypeScript errors
npm run lint       # No ESLint errors
npm run build      # Production build succeeds
```

---

## 8. Caching & ISR Strategy

### Cache Revalidation Tags

| Resource | Cache Key | Revalidate Time | Tag | When to Invalidate |
|----------|-----------|-----------------|-----|-------------------|
| Posts | `['posts']` | 3600s (1h) | `['posts']` | New post published |
| Categories | `['categories']` | 3600s (1h) | `['posts']` | Category added/removed |
| Single Post | `['post-slug']` | 3600s (1h) | `['posts']` | Post content updated |

### Caching Implementation Pattern

```typescript
// ✅ CORRECT - All Notion queries cached
export const fetchPosts = unstable_cache(
  async (category?: string) => {
    // Heavy operation - only runs at revalidation
    return client.databases.query(...)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

// On-demand revalidation (if needed)
export async function revalidateBlog() {
  revalidateTag('posts')
  return { revalidated: true, now: Date.now() }
}
```

### Cache Invalidation Endpoints

```typescript
// src/app/api/revalidate/route.ts - Manual ISR trigger
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid' }, { status: 401 })
  }
  revalidateTag('posts')
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
```

---

## 9. Environment Variables & Configuration

### Environment Setup

**File**: `src/lib/env.ts` (Zod validation required)

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required'),
  REVALIDATE_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

**Usage**:
```typescript
import { env } from '@/lib/env'
const databaseId = env.NOTION_DATABASE_ID  // Type-safe
```

**RULES**:
- ✅ Always validate with Zod in `src/lib/env.ts`
- ✅ Use `env.VARIABLE_NAME` throughout code
- ❌ Never use `process.env.VARIABLE` directly
- ❌ Never expose secrets in client code

---

## 10. UI/Styling Standards

### Component Styling Pattern

```typescript
// ✅ CORRECT - shadcn/ui + Tailwind
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PostCard({ post }: { post: Post }) {
  return (
    <div className={cn(
      'rounded-lg border p-4',
      'hover:shadow-lg transition-shadow'
    )}>
      <h3 className="font-bold">{post.title}</h3>
    </div>
  )
}
```

### Tailwind Class Usage

- Use Prettier plugin (`prettier-plugin-tailwindcss`) - auto-sorts classes
- Use `cn()` utility for conditional classes
- Component shadcn/ui classes already optimized (don't modify)

**PROHIBITED**:
- Inline `style={}` attributes
- Custom CSS files for component styling
- CSS-in-JS libraries

---

## 11. Error Handling & Validation

### API Error Responses

```typescript
// Consistent error response format
{
  "success": false,
  "error": "Failed to fetch posts"
}

// Successful response format
{
  "success": true,
  "data": [...],
  "count": 10
}
```

### Notion API Error Handling

```typescript
try {
  const response = await client.databases.query(...)
  return response.results
} catch (error) {
  console.error('Notion API error:', error)
  // Return empty array or default, don't throw
  return []
}
```

### Component Error Boundaries

- Use `error.tsx` in pages with potential fetch errors
- Use `notFound()` from Next.js for 404 cases
- Return empty state UI for no results

---

## 12. AI Decision-Making Guide

### When implementing features, follow this decision tree:

```
New Feature Request
├─ Is it data-driven from Notion?
│  └─ YES → Use Server Component + unstable_cache
│
├─ Does it need user interaction (search, filter, paginate)?
│  └─ YES → Client Component, update URL params, Server Component refetches
│
├─ Is it a reusable UI component?
│  ├─ YES (Button, Card) → src/components/ui/
│  └─ NO → Is it blog-specific?
│         ├─ YES → src/components/blog/
│         └─ NO → src/components/layout/ or src/components/navigation/
│
├─ Need to expose Notion data via API?
│  └─ YES → Create src/app/api/[resource]/route.ts
│
└─ New Post property?
   └─ YES → Update src/lib/types/blog.ts AND src/lib/notion/posts.ts
```

### Priority Decision Rules

1. **Server-first by default** - Use Server Components unless interactivity required
2. **Cache everything** - All Notion queries must use unstable_cache
3. **Type safety** - Define types in src/lib/types/ before implementation
4. **Separation of concerns** - Keep Notion logic in src/lib/notion/, UI in src/components/
5. **Multi-file awareness** - Check if feature requires coordinated updates across files

---

## 13. Prohibited Actions (STRICT)

### ❌ FORBIDDEN in Code

| Action | Reason | What to Do Instead |
|--------|--------|-------------------|
| Use `client.databases.query()` outside `src/lib/notion/` | Breaks encapsulation, hard to cache | Create utility in `src/lib/notion/posts.ts` |
| Direct `process.env` access | Not type-safe, env vars not validated | Use `env` from `src/lib/env.ts` |
| Async operations in Client Components | React rules violation, hydration mismatch | Use Server Component or call API route |
| `export default` for non-page components | Inconsistent import patterns | Use named exports, `export function` |
| Skip TypeScript types | Will fail typecheck | Always add types, use `type` imports |
| Notion queries without caching | Performance degradation | Wrap in `unstable_cache` with 3600s |
| Business logic in UI components | Hard to test, mixed concerns | Move to `src/lib/` utilities |
| Create new component folders haphazardly | Inconsistent organization | Use decision tree from section 2 |

### ❌ FORBIDDEN in File Organization

- Folders deeper than 4 levels: `src/a/b/c/d/` (too nested)
- Undefined folders: `src/components/misc/`, `src/components/utils/`
- Mixed case in paths: `src/Components/`, `src/COMPONENTS/`
- Relative path imports: `import x from '../../../'` (use `@/` alias)

---

## 14. Quality Assurance Checklist

### Before marking work complete:

**Code Quality**:
- [ ] Run `npm run check-all` - all checks pass
- [ ] Run `npm run build` - production build succeeds
- [ ] TypeScript: `npm run typecheck` - no errors
- [ ] ESLint: `npm run lint` - no warnings
- [ ] Prettier: `npm run format:check` - all formatted

**Feature Implementation**:
- [ ] Types added to `src/lib/types/`
- [ ] Notion queries cached with `unstable_cache()`
- [ ] Client/Server components properly separated
- [ ] Multi-file updates completed (if data-model change)
- [ ] Environment variables in `src/lib/env.ts`
- [ ] API routes return `NextResponse.json()`
- [ ] Components use path aliases (`@/`)

**File Organization**:
- [ ] Component in correct folder (blog/ui/layout/navigation)
- [ ] File named with kebab-case
- [ ] Export with PascalCase function name
- [ ] No files > 300 lines
- [ ] Import statements in correct order: external → internal → relative

**Documentation**:
- [ ] New API endpoints documented in code comments
- [ ] Complex logic has comments explaining "why", not "what"
- [ ] No unused imports or variables

---

## 15. Development Workflow Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm start               # Start production server

# Code Quality (Run before commit!)
npm run typecheck       # TypeScript validation
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Prettier auto-format
npm run format:check    # Check if formatted
npm run check-all       # Run all checks (recommended!)

# UI Components
npx shadcn@latest add [component]  # Add shadcn/ui component
```

**Git Workflow**:
```bash
npm run check-all       # ← Run BEFORE commit
git add .
git commit -m "..."
npm run build           # ← Verify build succeeds before push
```

---

## 16. Notion Database Schema Reference

### Posts Database Properties (Required)

| Property | Type | Format | Used In |
|----------|------|--------|---------|
| Title | Title | Rich text | `post.title`, URL slug |
| Category | Relation | Reference to Categories DB | `post.category` |
| Tags | Multi-select | Tag names | `post.tags[]` |
| Published Date | Date | YYYY-MM-DD | `post.publishedDate` |
| Excerpt | Rich text | 150 chars max | `post.excerpt` |
| Status | Status | "Published" / "Draft" | Filter in queries |
| Created At | Created time | Auto-generated | `post.createdAt` |
| Updated At | Last edited | Auto-generated | `post.updatedAt` |

### When Adding New Properties

Example: Adding "Author" field
```typescript
// 1. Update Notion schema: Add "Author" property (Rich text type)

// 2. Update src/lib/types/blog.ts
export interface Post {
  // ... existing
  author?: string  // NEW
}

// 3. Update src/lib/notion/posts.ts (~line 67-72)
const author = extractText(props.Author?.rich_text || [])  // NEW
return {
  // ... existing
  author,  // NEW
}

// 4. Use in components: post.author
```

---

## 17. Common Implementation Patterns

### Pattern: Fetching Posts with Caching

```typescript
// ✅ CORRECT PATTERN
import { unstable_cache } from 'next/cache'
import { getNotionClient } from './client'
import type { Post } from '@/lib/types/blog'

const client = getNotionClient()

async function fetchPostsUncached(category?: string): Promise<Post[]> {
  const response = await client.databases.query({
    database_id: env.NOTION_DATABASE_ID,
    filter: { /* ... */ },
    sorts: [{ property: 'Published Date', direction: 'descending' }],
  })

  return response.results.map(page => ({
    id: page.id,
    slug: titleToSlug(extractText(page.properties.Title?.title || [])),
    // ... extract other properties
  }))
}

export const fetchPosts = unstable_cache(
  async (category?: string) => fetchPostsUncached(category),
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)
```

### Pattern: Server Component Fetching Data

```typescript
// ✅ CORRECT - src/app/page.tsx
import { fetchPosts, fetchCategories } from '@/lib/notion/posts'

export default async function Home() {
  const [posts, categories] = await Promise.all([
    fetchPosts(),
    fetchCategories(),
  ])

  return (
    <div>
      <SearchBar />  {/* Client Component */}
      <PostsList posts={posts} />  {/* Server Component */}
    </div>
  )
}
```

### Pattern: Client Component with API Fetch

```typescript
// ✅ CORRECT - src/components/blog/search-bar.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function SearchBar() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (query: string) => {
    startTransition(() => {
      const params = new URLSearchParams()
      params.set('search', query)
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <input
      onChange={(e) => handleSearch(e.target.value)}
      disabled={isPending}
      placeholder="Search posts..."
    />
  )
}
```

---

## 18. Debugging & Troubleshooting

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails: "Module not found" | Wrong import path or alias | Use `@/` aliases, check tsconfig.json |
| Notion query returns empty | Database ID wrong or posts not published | Check `NOTION_DATABASE_ID` in `.env.local`, verify Status = "Published" |
| Component doesn't update after Notion change | Cache not revalidated | Manual revalidation or wait 3600s (1 hour) |
| "Cannot use async in Client Component" | Async in 'use client' component | Move async logic to Server Component or API route |
| Types missing errors | Component file doesn't import types | Add `import type { Post } from '@/lib/types/blog'` |
| Tailwind classes not applied | Prettier didn't sort classes | Run `npm run format` |

---

## 19. Code Review Criteria for AI

When reviewing code changes, ensure:

1. **Architecture**: Server/Client separation correct?
2. **Caching**: All Notion queries use `unstable_cache`?
3. **Types**: All data has TypeScript types?
4. **Naming**: Files kebab-case, components PascalCase?
5. **Organization**: Component in correct folder?
6. **Imports**: Using `@/` aliases?
7. **Multi-file**: All related files updated together?
8. **Quality**: Passes `npm run check-all`?

---

## 20. Summary: Essential Rules for AI

| Rule | Enforce | Example |
|------|---------|---------|
| **All Notion queries cached** | 🔴 STRICT | `unstable_cache(..., { revalidate: 3600 })` |
| **Server-first components** | 🔴 STRICT | Default Server, use `'use client'` only for interactivity |
| **Types in lib/types/** | 🔴 STRICT | `src/lib/types/blog.ts` defines Post interface |
| **Path aliases @/** | 🔴 STRICT | `import { Button } from '@/components/ui/button'` |
| **kebab-case files** | 🔴 STRICT | `post-card.tsx`, not `PostCard.tsx` |
| **PascalCase components** | 🔴 STRICT | `export function PostCard()` |
| **Notion logic in lib/** | 🔴 STRICT | Client → API → `lib/notion/` → Notion |
| **Multi-file awareness** | 🔴 STRICT | New property = update type + extraction + component |
| **TypeScript validation** | 🔴 STRICT | `npm run typecheck` must pass |
| **Component < 300 lines** | 🟡 IMPORTANT | Refactor if exceeds limit |
| **Code comments "why"** | 🟡 IMPORTANT | Explain intent, not obvious code |
| **Error handling try/catch** | 🟡 IMPORTANT | API routes must catch errors |

---

**Last Updated**: 2026-03-16
**Project Status**: MVP Complete (Phase 1)
**Next Phase**: Sitemap, RSS feed, OG tags, image optimization (See ROADMAP.md)
