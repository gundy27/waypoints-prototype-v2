import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { maradmins } from '../data/mockData'
import type { Maradmin } from '../data/mockData'

const tagColors: Record<string, { bg: string; text: string }> = {
  Promotions: { bg: '#FF552220', text: '#FF5522' },
  PME: { bg: '#2D8A4E20', text: '#2D8A4E' },
  Policy: { bg: '#D4940A20', text: '#D4940A' },
}

function MaradminCard({ item, onSelect }: { item: Maradmin; onSelect: (m: Maradmin) => void }) {
  const colors = tagColors[item.tag] || tagColors.Policy
  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full text-left bg-wp-surface rounded-xl p-4 border-none cursor-pointer transition-colors duration-150"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="font-mono font-semibold text-wp-tan-dark" style={{ fontSize: 12 }}>
          {item.number}
        </span>
        <span className="font-body text-wp-tan-dark" style={{ fontSize: 12 }}>
          {item.date}
        </span>
      </div>

      <h3 className="font-heading font-semibold text-wp-black mb-2" style={{ fontSize: 15, lineHeight: 1.3 }}>
        {item.title}
      </h3>

      <p className="font-body text-wp-tan-dark mb-3" style={{ fontSize: 13, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {item.summary}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="px-2 py-0.5 rounded font-body font-semibold uppercase"
          style={{ fontSize: 11, backgroundColor: colors.bg, color: colors.text }}
        >
          {item.tag}
        </span>
        {item.affectsScore && (
          <span
            className="px-2 py-0.5 rounded font-body font-semibold uppercase"
            style={{ fontSize: 11, backgroundColor: '#FF552220', color: '#FF5522' }}
          >
            Affects Your Score
          </span>
        )}
      </div>
    </button>
  )
}

function MaradminDetail({ item, onBack }: { item: Maradmin; onBack: () => void }) {
  const colors = tagColors[item.tag] || tagColors.Policy
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 bg-transparent border-none cursor-pointer mb-4 px-0"
      >
        <ArrowLeft size={18} className="text-wp-accent" />
        <span className="font-body font-medium text-wp-accent" style={{ fontSize: 14 }}>
          Back
        </span>
      </button>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="font-mono font-semibold text-wp-tan-dark" style={{ fontSize: 13 }}>
          {item.number}
        </span>
        <span className="font-body text-wp-tan-dark" style={{ fontSize: 13 }}>
          {item.date}
        </span>
      </div>

      <h2 className="font-heading font-bold text-wp-black mb-3" style={{ fontSize: 20, lineHeight: 1.2 }}>
        {item.title}
      </h2>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span
          className="px-2 py-0.5 rounded font-body font-semibold uppercase"
          style={{ fontSize: 11, backgroundColor: colors.bg, color: colors.text }}
        >
          {item.tag}
        </span>
        {item.affectsScore && (
          <span
            className="px-2 py-0.5 rounded font-body font-semibold uppercase"
            style={{ fontSize: 11, backgroundColor: '#FF552220', color: '#FF5522' }}
          >
            Affects Your Score
          </span>
        )}
      </div>

      <div
        className="bg-wp-surface rounded-xl p-4 mb-4"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <pre className="font-mono text-wp-black whitespace-pre-wrap" style={{ fontSize: 12, lineHeight: 1.6 }}>
          {item.fullText}
        </pre>
      </div>

      <div
        className="bg-wp-surface rounded-xl p-4 border-l-[3px] border-wp-accent mb-4"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
      >
        <h3 className="font-heading font-bold text-wp-black mb-2" style={{ fontSize: 16 }}>
          What This Means For You
        </h3>
        <p className="font-body text-wp-black" style={{ fontSize: 14, lineHeight: 1.6 }}>
          {item.whatItMeans}
        </p>
      </div>
    </div>
  )
}

export default function MaradminsTab() {
  const [selectedItem, setSelectedItem] = useState<Maradmin | null>(null)

  if (selectedItem) {
    return <MaradminDetail item={selectedItem} onBack={() => setSelectedItem(null)} />
  }

  return (
    <div className="space-y-3">
      {maradmins.map(item => (
        <MaradminCard key={item.id} item={item} onSelect={setSelectedItem} />
      ))}
    </div>
  )
}
