import type { ReactNode } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  rightSlot?: ReactNode
}

export default function Header({ title, subtitle, rightSlot }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm px-4 flex items-center justify-between border-b border-wp-tan-light"
      style={{
        height: subtitle ? 64 : 56,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
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
      {rightSlot && (
        <div className="flex items-center">
          {rightSlot}
        </div>
      )}
    </header>
  )
}
