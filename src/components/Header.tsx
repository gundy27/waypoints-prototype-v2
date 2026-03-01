import { Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuOpen: () => void
}

export default function Header({ title, subtitle, onMenuOpen }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-wp-bg/90 backdrop-blur-sm px-4 flex items-center justify-between border-b border-wp-tan-light/50"
      style={{ height: subtitle ? 64 : 56 }}
    >
      <div className="flex flex-col justify-center">
        <h1 className="font-heading font-bold text-wp-black" style={{ fontSize: 24, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 font-body text-wp-tan-dark" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.01em' }}>
            {subtitle}
          </p>
        )}
      </div>

      <button
        onClick={onMenuOpen}
        className="p-2 -mr-1 bg-transparent border-none cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={22} className="text-wp-black" />
      </button>
    </header>
  )
}
