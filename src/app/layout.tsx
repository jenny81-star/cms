import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '개발 블로그 - Personal Developer Blog',
  description:
    'Notion 기반의 개인 개발 블로그. 최신 기술 글과 개발 이야기를 만나보세요.',
  openGraph: {
    title: '개발 블로그',
    description:
      'Notion 기반의 개인 개발 블로그. 최신 기술 글과 개발 이야기를 만나보세요.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: '개발 블로그',
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발 블로그',
    description:
      'Notion 기반의 개인 개발 블로그. 최신 기술 글과 개발 이야기를 만나보세요.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
