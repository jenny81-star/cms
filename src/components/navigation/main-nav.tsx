import Link from 'next/link'

/**
 * Desktop navigation for blog header
 */
export function MainNav() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/#blog' },
    { label: 'About', href: '#about' },
  ]

  return (
    <nav className="hidden gap-6 md:flex">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="hover:text-primary text-sm font-medium transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
