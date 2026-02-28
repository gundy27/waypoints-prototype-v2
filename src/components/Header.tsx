interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-wp-bg/90 backdrop-blur-sm px-4 flex items-center"
      style={{ height: 56 }}
    >
      <div>
        <h1 className="font-heading font-bold text-wp-black" style={{ fontSize: 24, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-wp-tan-dark" style={{ fontSize: 12, fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
}
