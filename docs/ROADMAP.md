# Project Roadmap - 개인 개발 블로그 CMS

**Last Updated:** 2026-03-16
**Status:** Phase 1 - MVP Implementation (Complete) ✅

---

## 📋 Phase 1: MVP (Minimum Viable Product)

### Core Features

- [x] Notion API integration
- [x] Posts list and pagination
- [x] Post detail pages with rich content rendering
- [x] Category-based filtering
- [x] Search functionality
- [x] Responsive design (mobile, tablet, desktop)
- [x] Dark/Light theme support
- [x] Basic styling with Tailwind CSS and shadcn/ui
- [x] Static site generation with ISR support

### Infrastructure

- [x] Environment variables configuration
- [x] Notion database integration
- [x] API routes for fetching content
- [x] Cache revalidation endpoint
- [x] Error handling and not-found page

### Documentation

- [x] ROADMAP.md
- [x] Setup instructions (see .env.example)
- [x] Component documentation (inline comments)

---

## 🚀 Phase 2: Enhancement (Planned)

### Performance & SEO

- [ ] Add sitemap generation
- [ ] Generate RSS feed
- [ ] Add OG meta tags dynamically
- [ ] Implement image optimization with Next.js Image component
- [ ] Add canonical URLs

### Content Features

- [ ] Draft post preview (with preview mode)
- [ ] Post update timestamps
- [ ] Author information display
- [ ] Reading time estimation
- [ ] Table of contents for long posts

### User Engagement

- [ ] Social sharing buttons
- [ ] Comment system (Giscus or Disqus)
- [ ] Email subscription form
- [ ] "Back to top" button
- [ ] Copy code button for code blocks

### Analytics

- [ ] Page view tracking
- [ ] Popular posts section
- [ ] Most read posts ranking
- [ ] Search analytics

---

## 💬 Phase 3: Advanced Features (Future)

### Community Features

- [ ] User comments and discussions
- [ ] Comment moderation system
- [ ] User authentication
- [ ] Post bookmarking

### Content Management

- [ ] Draft post support in Notion
- [ ] Post scheduling
- [ ] Content versioning
- [ ] Edit history tracking

### Advanced Search

- [ ] Faceted search with filters
- [ ] Tag-based search
- [ ] Full-text search optimization
- [ ] Search suggestions/autocomplete

### Customization

- [ ] Custom theme support
- [ ] Site configuration dashboard
- [ ] Custom domain support
- [ ] Analytics dashboard

---

## 🛠️ Tech Stack

```
Frontend:
- Next.js 15.5.3 with App Router + Turbopack
- React 19 with Server Components
- TypeScript 5
- TailwindCSS v4
- shadcn/ui components
- Lucide Icons

Backend/API:
- Next.js API Routes
- Notion API (@notionhq/client)
- Next.js Caching (unstable_cache)
- ISR (Incremental Static Regeneration)

Development:
- ESLint + Prettier
- Husky + lint-staged
- Date formatting (date-fns)
- Code highlighting (highlight.js)

Deployment:
- Vercel (recommended)
- ISR enabled for automatic updates
```

---

## ✅ Completion Checklist

### Development Setup

- [x] Install dependencies
- [x] Configure environment variables
- [x] Set up Notion API credentials
- [x] Create .env file with Notion keys

### Core Implementation

- [x] Create blog types and interfaces
- [x] Implement Notion API client
- [x] Create API routes for content fetching
- [x] Build blog components
- [x] Create navigation components
- [x] Build pages (home, blog detail, category)

### Testing & Validation

- [x] Test all pages with real Notion data
- [x] Verify search functionality
- [x] Test category filtering
- [x] Check pagination logic
- [x] Validate mobile responsiveness
- [x] Run `npm run check-all` successfully
- [x] Build and test `npm run build`

### Deployment

- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Configure ISR revalidation
- [ ] Set up custom domain (optional)
- [ ] Monitor performance metrics

---

## 📝 Setup Instructions

### 1. Notion Database Setup

Create a Notion database with the following schema:

```
Database Properties:
├── Title (Title) - Post title
├── Status (Select) - Draft/Published
├── Published Date (Date) - Publication date
├── Category (Relation) - Link to categories database
├── Tags (Multi-select) - Post tags
├── Excerpt (Rich Text) - Short description
└── Content (Rich Text) - Full post content
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Notion credentials:

```bash
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxx
NEXT_PUBLIC_SITE_URL=https://yourblog.com (optional)
```

### 3. Installation & Development

```bash
npm install
npm run dev
# Navigate to http://localhost:3000
```

### 4. Build & Deploy

```bash
npm run build
npm run check-all  # Run all checks
npm start
```

---

## 🐛 Known Issues & Limitations

- ISR cache revalidation is manual via `/api/revalidate` endpoint
- Search is client-side only (no full-text search)
- No webhook support for automatic Notion-to-blog syncing in MVP

---

## 📊 Performance Targets

| Metric                        | Target        | Status |
| ----------------------------- | ------------- | ------ |
| Blog homepage load            | < 2 seconds   | ⏳     |
| Post page load                | < 1.5 seconds | ⏳     |
| First Contentful Paint (FCP)  | < 1 second    | ⏳     |
| Cumulative Layout Shift (CLS) | < 0.1         | ⏳     |
| Mobile Lighthouse Score       | > 90          | ⏳     |

---

## 🤝 Contributing

This is a personal blog project. Modifications and customizations are welcome!

For suggestions or improvements, feel free to modify the code as needed.

---

## 📞 Support

For issues with:

- **Notion API**: Check [Notion API docs](https://developers.notion.com/)
- **Next.js**: See [Next.js documentation](https://nextjs.org/docs)
- **Project setup**: Review the README.md and inline comments
