import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Container>
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
          </div>

          <p className="text-muted-foreground text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been removed or the URL might be incorrect.
          </p>

          <Link href="/">
            <Button size="lg">Go Back Home</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
