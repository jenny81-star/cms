'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

/**
 * Mobile navigation for blog header
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/#blog' },
    { label: 'About', href: '#about' },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden"
          size="icon"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4">
          {navItems.map(item => (
            <SheetClose key={item.href} asChild>
              <Link
                href={item.href}
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
