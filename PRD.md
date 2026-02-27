# Product Requirements Document (PRD)

## Personal Developer Blog (개인 개발 블로그)

**Document Version:** 1.0
**Last Updated:** 2026-02-25
**Status:** Ready for Development
**Target Audience:** Solo Developer / Development Team

---

## 1. Core Information

### 1.1 Project Overview

**Project Name:** 개인 개발 블로그 (Personal Developer Blog)

**Purpose:** A lightweight, Notion-based personal tech blog platform that enables developers to write and publish blog posts directly from Notion, with automatic synchronization to a Next.js web application. The blog prioritizes ease of content management, minimal setup overhead, and professional presentation.

**Target Users:**

- Software developers (junior to senior level)
- Tech content creators
- Developers seeking a minimalist blogging solution
- Technical writers with Notion familiarity

**Success Metrics:**

- Blog loads in < 2 seconds
- Posts sync from Notion within 60 seconds
- Mobile responsiveness on all devices
- 100% uptime on Vercel deployment

### 1.2 Project Scope

**MVP Scope:**

- Notion API integration for content fetching
- Posts list and detail pages
- Category-based filtering
- Search functionality across posts
- Responsive design (mobile, tablet, desktop)
- Basic styling with Tailwind CSS and shadcn/ui

**Out of Scope (Future Phases):**

- User authentication/comments system
- Advanced analytics
- Social sharing optimization
- SEO sitemap generation
- Draft preview in blog interface
- Comment system
- Email subscriptions
- Blog post versioning

### 1.3 Key Constraints

- **CMS Dependency:** Content management strictly through Notion
- **Static Generation:** Assumes Next.js SSG/ISR for optimal performance
- **Manual Trigger:** Initial sync requires manual API call (no webhook automation in MVP)
- **Notion Workspace:** Developer must set up Notion database with specified structure

---

## 2. User Journey

### 2.1 Primary User Flow

**Flow: Discover and Read Blog Posts**

```
1. User visits blog homepage
   ↓
2. See list of recent published posts (title, date, category, excerpt)
   ↓
3. [Optional] Filter by category or use search
   ↓
4. Click on post card/title
   ↓
5. View full post detail page with:
   - Post title
   - Publication date
   - Category badge
   - Tags
   - Full content (Notion blocks rendered)
   ↓
6. See related posts (same category)
   ↓
7. [Optional] Return to list via breadcrumb or back button
```

### 2.2 Alternative Flows

**Flow 2: Browse by Category**

- User clicks category link/filter
- See posts filtered by selected category
- Same detail page flow as primary

**Flow 3: Search for Posts**

- User enters search term in search bar
- See filtered results by title/tags
- Click to view post detail

---

## 3. Function Specification

### 3.1 Feature List

| ID   | Feature              | Description                               | Priority | Status |
| ---- | -------------------- | ----------------------------------------- | -------- | ------ |
| F001 | Notion Integration   | Fetch posts from Notion database via API  | Critical | MVP    |
| F002 | Posts List Display   | Show all published posts with metadata    | Critical | MVP    |
| F003 | Category Filtering   | Filter posts by category                  | High     | MVP    |
| F004 | Search Functionality | Search posts by title and tags            | High     | MVP    |
| F005 | Post Detail View     | Display full post content with formatting | Critical | MVP    |
| F006 | Related Posts        | Show 3-5 related posts by category        | Medium   | MVP    |
| F007 | Responsive Design    | Mobile, tablet, desktop optimization      | Critical | MVP    |
| F008 | Tags Display         | Show post tags with hover tooltips        | Medium   | MVP    |
| F009 | Pagination           | Paginate post list (10 posts per page)    | Medium   | MVP    |
| F010 | 404 Page             | Handle non-existent post URLs             | Low      | MVP    |

### 3.2 Feature Descriptions

#### F001: Notion Integration

- **Description:** Server-side integration with Notion API to fetch published blog posts
- **Requirements:**
  - Authenticate with Notion API using integration token
  - Query Notion database for posts with Status = "Published"
  - Parse Notion database properties (Title, Category, Tags, Published, Content)
  - Handle Notion block types: headings, paragraphs, images, code blocks, lists
  - Implement error handling for API failures
  - Cache results for 1 hour to reduce API calls
- **Related Pages:** Home, Post Detail
- **Dependencies:** @notionhq/client library

#### F002: Posts List Display

- **Description:** Home page showing all published posts in card format
- **Requirements:**
  - Display posts in reverse chronological order (newest first)
  - Show post card with: title, excerpt (150 chars), category, publish date
  - Display category as colored badge
  - Clickable post cards linking to detail page
  - Sort by publication date descending
  - Display total post count
- **Related Pages:** Home
- **Dependencies:** F001, F007, F009

#### F003: Category Filtering

- **Description:** Filter posts by category selection
- **Requirements:**
  - Extract all unique categories from Notion posts
  - Display category filter as buttons/dropdown on home page
  - "All" option to show all posts
  - Highlight active category filter
  - URL parameter support (?category=tech)
  - Maintain filter across pagination
  - Show post count per category
- **Related Pages:** Home, Category
- **Dependencies:** F001, F002

#### F004: Search Functionality

- **Description:** Client-side search across post titles and tags
- **Requirements:**
  - Search input field on home page
  - Case-insensitive search
  - Match against post title and tags
  - Real-time results as user types
  - Show "no results" message
  - Clear search with button or esc key
  - Highlight matching text in results
- **Related Pages:** Home
- **Dependencies:** F001, F002

#### F005: Post Detail View

- **Description:** Full post content page with metadata
- **Requirements:**
  - Display post title, publish date, category, tags
  - Render Notion content blocks with proper formatting
  - Support block types: paragraph, heading (h1-h3), image, code, list, quote
  - Syntax highlighting for code blocks
  - Proper typography and spacing
  - Breadcrumb navigation (Home > Category > Post)
  - Share buttons (optional for MVP)
- **Related Pages:** Post Detail
- **Dependencies:** F001, F006

#### F006: Related Posts

- **Description:** Show 3-5 related posts based on category
- **Requirements:**
  - Display below post content
  - Filter posts by same category, excluding current post
  - Limit to 5 posts maximum
  - Show post cards with title, date, excerpt
  - Clickable cards linking to detail pages
  - "Explore More in [Category]" heading
- **Related Pages:** Post Detail
- **Dependencies:** F001, F005

#### F007: Responsive Design

- **Description:** Optimize layout for all device sizes
- **Requirements:**
  - Mobile (320px - 640px): Single column, touch-friendly
  - Tablet (641px - 1024px): Optimized layout
  - Desktop (1025px+): Multi-column with sidebar
  - Touch-friendly buttons and spacing (48px minimum)
  - Readable font sizes across devices
  - Test on major browsers (Chrome, Firefox, Safari, Edge)
  - Lighthouse score > 90
- **Related Pages:** All
- **Dependencies:** Tailwind CSS v4

#### F008: Tags Display

- **Description:** Display and manage post tags
- **Requirements:**
  - Show tags below post title on detail page
  - Display as small badges/pills
  - Clickable tags (optional - filter by tag)
  - Hover effect showing tooltip
  - Multiple tags per post
  - No duplicate tags across posts
- **Related Pages:** Post Detail, Home
- **Dependencies:** F001

#### F009: Pagination

- **Description:** Paginate post list to improve performance
- **Requirements:**
  - Display 10 posts per page
  - Previous/Next buttons
  - Page numbers (1, 2, 3...)
  - Show current page indicator
  - URL parameter support (?page=2)
  - Maintain filters/search across pagination
  - Smooth scroll to top on page change
- **Related Pages:** Home
- **Dependencies:** F002

#### F010: 404 Page

- **Description:** Handle and display page not found errors
- **Requirements:**
  - Custom 404 page design
  - Link back to home page
  - Suggest popular posts
  - Professional error message
- **Related Pages:** 404
- **Dependencies:** Next.js routing

---

## 4. Menu Structure

### 4.1 Navigation Hierarchy

```
Root
├── Home
│   ├── Featured/Recent Posts (F002)
│   ├── Category Filter (F003)
│   ├── Search Bar (F004)
│   └── Pagination (F009)
│
├── Category
│   ├── Category-Filtered Posts (F003)
│   └── Pagination (F009)
│
├── Post Detail
│   ├── Post Content (F005)
│   ├── Tags (F008)
│   ├── Related Posts (F006)
│   └── Navigation Links
│
└── 404
    └── Error Message (F010)
```

### 4.2 Navigation Items

| Page Name   | Navigation Label | Visibility  | Role                    |
| ----------- | ---------------- | ----------- | ----------------------- |
| Home        | Home / Logo      | Always      | Primary entry point     |
| Category    | Category Page    | Dynamic     | Category-specific view  |
| Post Detail | Post Title       | Breadcrumb  | Current viewing context |
| 404         | Error Page       | Conditional | Error state             |

### 4.3 User Navigation Flows

**Main Navigation:**

- Logo/Home link: Always returns to home page
- Category filter: Available on home page
- Search: Available on home page and category page
- Breadcrumb: Available on detail and category pages
- Back button: Available on detail page

---

## 5. Page Details

### 5.1 Home Page

**Purpose:** Landing page showing recent blog posts with filtering and search options

**Components:**

- Header with logo/site title
- Search bar (F004)
- Category filter buttons (F003)
- Posts grid/list display (F002)
  - Post cards showing: title, date, category, excerpt
  - Click action: Navigate to Post Detail page
- Pagination controls (F009)
- Footer with links

**Wireframe Structure:**

```
┌─────────────────────────────────┐
│  LOGO    Personal Dev Blog      │
├─────────────────────────────────┤
│  [Search] [All] [Tech] [Web]    │
├─────────────────────────────────┤
│ [Post Card 1]  [Post Card 2]    │
│ [Post Card 3]  [Post Card 4]    │
│ [Post Card 5]  [Post Card 6]    │
├─────────────────────────────────┤
│ < 1 2 3 > (pagination)          │
├─────────────────────────────────┤
│ Footer: About | Contact | RSS    │
└─────────────────────────────────┘
```

**Interactions:**

- Click post card → Post Detail page
- Click category → Category page with filter
- Type in search → Filter posts in real-time
- Click page number → Navigate to page
- Click category badge on post → Category page

**Responsive Behavior:**

- Desktop: 2-3 column grid
- Tablet: 2 column grid
- Mobile: 1 column list

**Related Features:** F001, F002, F003, F004, F007, F009

---

### 5.2 Category Page

**Purpose:** Display posts filtered by specific category

**Components:**

- Header with category name
- Search bar (optional)
- Posts list filtered by category (F003)
  - Same post cards as home page
- Pagination controls (F009)
- Breadcrumb: Home > [Category]

**Wireframe Structure:**

```
┌─────────────────────────────────┐
│  LOGO    Personal Dev Blog      │
├─────────────────────────────────┤
│  > Home > Web Development       │
│                                 │
│  Web Development Posts (12)     │
│  [Search]                       │
├─────────────────────────────────┤
│ [Post Card 1]  [Post Card 2]    │
│ [Post Card 3]  [Post Card 4]    │
├─────────────────────────────────┤
│ < 1 2 > (pagination)            │
├─────────────────────────────────┤
│ Footer: About | Contact | RSS    │
└─────────────────────────────────┘
```

**Interactions:**

- Click post card → Post Detail page
- Pagination same as home page
- Breadcrumb links back to home

**URL Pattern:** `/category/[categoryName]`

**Related Features:** F001, F002, F003, F007, F009

---

### 5.3 Post Detail Page

**Purpose:** Display full blog post content with metadata and related posts

**Components:**

- Header with post metadata:
  - Post title (H1)
  - Publication date
  - Category badge
  - Tags (F008)
- Breadcrumb: Home > Category > Post Title
- Full post content (F005)
  - Rendered Notion blocks
  - Syntax-highlighted code blocks
  - Proper typography
- Related posts section (F006)
  - 3-5 posts from same category
  - Post cards linking to detail pages
- Back to posts link

**Wireframe Structure:**

```
┌─────────────────────────────────┐
│  LOGO    Personal Dev Blog      │
├─────────────────────────────────┤
│  > Home > Web > Current Post    │
│                                 │
│  Post Title                     │
│  Feb 25, 2026 | Web Dev | #tag  │
│  ─────────────────────────────  │
│                                 │
│  [Full Post Content Here]       │
│  [Multiple paragraphs]          │
│  [Code blocks]                  │
│  [Images]                       │
│                                 │
│  ─────────────────────────────  │
│  Related Posts                  │
│  [Post Card 1]  [Post Card 2]   │
│  [Post Card 3]                  │
├─────────────────────────────────┤
│ < Back to posts                 │
│                                 │
│ Footer: About | Contact | RSS    │
└─────────────────────────────────┘
```

**Interactions:**

- Click tag → Filter posts by tag (future feature)
- Click related post card → Navigate to that post
- Breadcrumb links → Navigate to home or category
- Back button → Return to previous page

**URL Pattern:** `/post/[postSlug]`

**Related Features:** F001, F005, F006, F007, F008

---

### 5.4 404 Error Page

**Purpose:** Display when user navigates to non-existent post or page

**Components:**

- Error heading "404 - Page Not Found"
- Error message explaining issue
- Link back to home page
- List of popular posts (optional)

**Wireframe Structure:**

```
┌─────────────────────────────────┐
│  LOGO    Personal Dev Blog      │
├─────────────────────────────────┤
│                                 │
│  404                            │
│  Page Not Found                 │
│                                 │
│  The post you're looking for    │
│  doesn't exist or has been      │
│  removed.                       │
│                                 │
│  [← Back to Home]               │
│                                 │
│  Popular Posts:                 │
│  • Post Title 1                 │
│  • Post Title 2                 │
│  • Post Title 3                 │
│                                 │
│ Footer: About | Contact | RSS    │
└─────────────────────────────────┘
```

**Related Features:** F010

---

## 6. Data Model

### 6.1 Notion Database Schema

**Database Name:** Blog Posts

**Properties:**

| Property Name | Type         | Description               | Example                           |
| ------------- | ------------ | ------------------------- | --------------------------------- |
| Title         | Title        | Post title                | "Getting Started with Next.js 15" |
| Category      | Select       | Post category             | "Web Development"                 |
| Tags          | Multi-select | Post tags                 | ["Next.js", "React", "Tutorial"]  |
| Published     | Date         | Publication date          | 2026-02-25                        |
| Status        | Select       | Post status               | "Published" / "Draft"             |
| Content       | Page content | Post body (Notion blocks) | [Notion blocks]                   |
| Excerpt       | Rich text    | Short summary (optional)  | "Learn how to build..."           |
| Author        | Text         | Post author (optional)    | "John Doe"                        |

**Database View:**

- Filter: Status = "Published"
- Sort: Published date (descending)
- Show properties: Title, Category, Published, Status

### 6.2 Application Data Model

**Post Object (Frontend):**

```typescript
interface Post {
  id: string // Notion page ID
  title: string
  slug: string // URL-friendly title
  category: string
  tags: string[]
  publishedDate: Date
  excerpt: string
  content: NotionBlock[] // Rendered Notion blocks
  author?: string
  createdAt: Date
  updatedAt: Date
}
```

**NotionBlock Object:**

```typescript
interface NotionBlock {
  id: string
  type:
    | 'paragraph'
    | 'heading_1'
    | 'heading_2'
    | 'heading_3'
    | 'image'
    | 'code'
    | 'bulleted_list_item'
    | 'numbered_list_item'
    | 'quote'
    | 'divider'
  content: string
  metadata?: {
    language?: string // for code blocks
    alt?: string // for images
  }
  children?: NotionBlock[]
}
```

**Category Object:**

```typescript
interface Category {
  name: string
  postCount: number
  slug: string
}
```

### 6.3 API Endpoints (Internal)

| Endpoint                     | Method | Purpose                   | Response            |
| ---------------------------- | ------ | ------------------------- | ------------------- |
| `/api/posts`                 | GET    | Fetch all published posts | Array<Post>         |
| `/api/posts?category=[name]` | GET    | Fetch posts by category   | Array<Post>         |
| `/api/posts?search=[term]`   | GET    | Search posts              | Array<Post>         |
| `/api/posts/[slug]`          | GET    | Fetch single post         | Post                |
| `/api/categories`            | GET    | Fetch all categories      | Array<Category>     |
| `/api/revalidate`            | POST   | Trigger ISR revalidation  | {status: "success"} |

---

## 7. Technical Specification

### 7.1 Technology Stack

| Layer                  | Technology               | Version | Purpose                      |
| ---------------------- | ------------------------ | ------- | ---------------------------- |
| **Frontend Framework** | Next.js                  | 15.x    | React framework with SSG/ISR |
| **Language**           | TypeScript               | 5.6+    | Type safety                  |
| **Styling Framework**  | Tailwind CSS             | v4      | Utility-first CSS            |
| **UI Components**      | shadcn/ui                | Latest  | Pre-built React components   |
| **Icons**              | Lucide React             | Latest  | SVG icon library             |
| **CMS API Client**     | @notionhq/client         | Latest  | Notion API SDK               |
| **Code Highlighting**  | highlight.js or Prism.js | Latest  | Syntax highlighting          |
| **Date Handling**      | date-fns                 | Latest  | Date utilities               |
| **Deployment**         | Vercel                   | -       | Hosting and CI/CD            |
| **Package Manager**    | npm or pnpm              | Latest  | Dependency management        |

### 7.2 Architecture Overview

```
┌─────────────────────────────────────┐
│      Notion Database (CMS)          │
│  Posts with Title, Content, etc.    │
└──────────────┬──────────────────────┘
               │
        ┌──────▼──────┐
        │ Notion API  │
        └──────┬──────┘
               │
        ┌──────▼──────────────────────┐
        │  Next.js API Routes         │
        │ - Fetch posts from Notion   │
        │ - Cache results (1 hour)    │
        │ - Parse Notion blocks       │
        └──────┬──────────────────────┘
               │
        ┌──────▼──────────────────────┐
        │  Next.js Pages (SSG/ISR)    │
        │ - Home page                 │
        │ - Post detail pages         │
        │ - Category pages            │
        └──────┬──────────────────────┘
               │
        ┌──────▼──────────────────────┐
        │  Client Components          │
        │ - Search (client-side)      │
        │ - Category filter           │
        │ - Interactive UI            │
        └──────┬──────────────────────┘
               │
        ┌──────▼──────────────────────┐
        │  Vercel Deployment          │
        │ - Static hosting            │
        │ - Serverless functions      │
        └─────────────────────────────┘
```

### 7.3 Key Technical Decisions

**Static Generation Strategy:**

- Use Next.js SSG for home, category, and post detail pages
- Rebuild pages on-demand using ISR (Incremental Static Regeneration)
- Revalidate every hour or on manual trigger

**Search Implementation:**

- Client-side search using in-memory post data
- Posts fetched and cached at build time
- Lightweight JSON payload for search

**Notion Block Parsing:**

- Server-side parsing of Notion blocks
- Convert to standardized internal format
- Client renders with appropriate components

**Caching Strategy:**

- 1-hour cache for Notion API responses
- ISR for next.js pages (60-second revalidation)
- Static generation for all post pages

---

## 8. Development Roadmap

### Phase 1: MVP (Sprint 1-2)

- [x] Project setup with Next.js 15
- [x] Notion API integration
- [x] Posts list page (Home)
- [x] Post detail page
- [x] Category filtering
- [x] Responsive design
- [x] Basic styling with Tailwind CSS
- [x] shadcn/ui component integration

### Phase 2: Enhancements (Sprint 3)

- [ ] Search functionality (F004)
- [ ] Tags display with filtering (F008)
- [ ] Related posts section (F006)
- [ ] Pagination (F009)
- [ ] 404 page (F010)
- [ ] Performance optimization

### Phase 3: Polish (Sprint 4)

- [ ] SEO optimization
- [ ] Lighthouse score > 90
- [ ] Accessibility audit (WCAG 2.1)
- [ ] Documentation
- [ ] Deployment to Vercel

---

## 9. Consistency Validation Checklist

### 9.1 Feature-to-Page Mapping

✓ **F001 (Notion Integration)** → Used by Home, Category, Post Detail pages
✓ **F002 (Posts List Display)** → Home page, Category page
✓ **F003 (Category Filtering)** → Home page, Category page
✓ **F004 (Search Functionality)** → Home page
✓ **F005 (Post Detail View)** → Post Detail page
✓ **F006 (Related Posts)** → Post Detail page
✓ **F007 (Responsive Design)** → All pages
✓ **F008 (Tags Display)** → Post Detail page, Home page
✓ **F009 (Pagination)** → Home page, Category page
✓ **F010 (404 Page)** → 404 page

### 9.2 Menu Structure Validation

✓ All pages referenced in Section 4 (Menu Structure) are detailed in Section 5 (Page Details)
✓ All features are mapped to appropriate pages
✓ Navigation flows are consistent across pages
✓ Breadcrumb hierarchy is logical and consistent

### 9.3 User Journey Coverage

✓ Primary flow covered: Home → Filter → Detail → Related
✓ Alternative flows documented: Browse by category, search
✓ All major user interactions mapped to features
✓ Page transitions are clear and logical

### 9.4 Data Model Consistency

✓ Notion database properties match frontend Post object
✓ API endpoints support all user workflows
✓ Data filtering and sorting requirements specified
✓ Caching strategy defined

### 9.5 Tech Stack Completeness

✓ Frontend framework specified (Next.js 15)
✓ Language specified (TypeScript 5.6+)
✓ Styling tools specified (Tailwind CSS v4, shadcn/ui)
✓ CMS integration specified (@notionhq/client)
✓ Deployment platform specified (Vercel)
✓ All dependencies documented

### 9.6 Scope Clarity

✓ MVP scope clearly defined
✓ Out-of-scope items listed
✓ Constraints documented
✓ Success metrics defined

---

## 10. Deployment & Operations

### 10.1 Environment Setup

**Environment Variables:**

```
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
NEXT_PUBLIC_SITE_URL=https://yourblog.com
```

### 10.2 Notion Setup Required

1. Create Notion workspace/page
2. Create database with structure from Section 6.1
3. Create Notion integration
4. Get API key and database ID
5. Add integration to database
6. Create at least 3 sample posts

### 10.3 Deployment Steps

1. Fork/clone repository
2. Set environment variables in Vercel
3. Deploy to Vercel (automatic on git push)
4. Test post syncing via `/api/revalidate` endpoint

### 10.4 Post Publishing Workflow

1. Write post in Notion
2. Fill in metadata: Title, Category, Tags, Date
3. Set Status to "Published"
4. Call `/api/revalidate` to trigger rebuild (or wait 60 seconds for ISR)
5. Post appears on blog

---

## 11. Glossary & Terminology

| Term           | Definition                                                          |
| -------------- | ------------------------------------------------------------------- |
| **CMS**        | Content Management System (Notion in this case)                     |
| **SSG**        | Static Site Generation - pages built at build time                  |
| **ISR**        | Incremental Static Regeneration - on-demand page updates            |
| **API Route**  | Next.js serverless function endpoints                               |
| **Block**      | Notion content element (paragraph, heading, image, etc.)            |
| **Database**   | Notion database containing blog posts                               |
| **Property**   | Database field (Title, Category, Content, etc.)                     |
| **Slug**       | URL-friendly version of title (e.g., "getting-started-with-nextjs") |
| **Excerpt**    | Short summary of post content (150 characters)                      |
| **Revalidate** | Trigger page rebuild to fetch latest content                        |

---

## 12. Appendix: Success Criteria

### Functional Requirements

- ✓ All blog posts are accessible via `/post/[slug]` route
- ✓ Posts can be filtered by category
- ✓ Posts can be searched by title and tags
- ✓ Notion content renders correctly with formatting
- ✓ Related posts appear on detail page
- ✓ 404 page displays for non-existent posts

### Non-Functional Requirements

- ✓ Page load time < 2 seconds (LCP)
- ✓ Blog syncs new Notion posts within 60 seconds
- ✓ Mobile responsive (320px and up)
- ✓ Lighthouse performance score > 90
- ✓ WCAG 2.1 AA accessibility compliance
- ✓ 100% uptime on Vercel

### User Experience

- ✓ Intuitive navigation structure
- ✓ Clear visual hierarchy
- ✓ Readable typography
- ✓ Professional design
- ✓ Smooth interactions

---

**End of Document**

---

## Document History

| Version | Date       | Author      | Changes              |
| ------- | ---------- | ----------- | -------------------- |
| 1.0     | 2026-02-25 | Claude Code | Initial PRD creation |

---

_This PRD is ready for development handoff. Developers should read sections 1-6 before starting implementation. Reference Section 9 for consistency validation across features and pages._
