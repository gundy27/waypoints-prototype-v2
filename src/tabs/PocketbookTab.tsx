import { useState } from 'react'
import { Search, ChevronRight, ChevronDown, ArrowLeft, Bookmark, Shirt, Shield, ScrollText, BookOpen, Users, BookMarked, Network, Dumbbell, TrendingUp, type LucideIcon } from 'lucide-react'
import { pocketbookCategories } from '../data/mockData'
import type { PocketbookCategory, PocketbookItem } from '../data/mockData'

const categoryIcons: Record<string, LucideIcon> = {
  'uniform': Shirt,
  'rank': Shield,
  'general-orders': ScrollText,
  'code-of-conduct': BookOpen,
  'leadership': Users,
  'acronyms': BookMarked,
  'chain-of-command': Network,
  'fitness': Dumbbell,
  'promotions': TrendingUp,
}

interface PocketbookTabProps {
  bookmarks: Set<string>
  onToggleBookmark: (id: string) => void
}

function CategoryList({
  categories,
  searchQuery,
  onSelect,
}: {
  categories: PocketbookCategory[]
  searchQuery: string
  onSelect: (cat: PocketbookCategory) => void
}) {
  const filtered = searchQuery
    ? categories.filter(
        c =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.items.some(
            i =>
              i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              i.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : categories

  return (
    <div className="grid grid-cols-2 gap-3">
      {filtered.map(cat => {
        const Icon = categoryIcons[cat.id]
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat)}
            className="flex flex-col items-center justify-center bg-wp-surface rounded-xl border-none cursor-pointer transition-colors duration-150 hover:bg-wp-tan-light/30 text-center"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', padding: '20px 12px 18px' }}
          >
            <div className="flex items-center justify-center rounded-xl mb-3" style={{ width: 48, height: 48, backgroundColor: 'rgba(210,180,140,0.2)' }}>
              {Icon && <Icon size={24} className="text-wp-accent" strokeWidth={1.75} />}
            </div>
            <span className="font-heading font-semibold text-wp-black" style={{ fontSize: 13, lineHeight: 1.35 }}>
              {cat.title}
            </span>
          </button>
        )
      })}
      {filtered.length === 0 && (
        <p className="col-span-2 text-center font-body text-wp-tan-dark py-8" style={{ fontSize: 14 }}>
          No results found
        </p>
      )}
    </div>
  )
}

function CategoryDetail({
  category,
  bookmarks,
  onToggleBookmark,
  onBack,
}: {
  category: PocketbookCategory
  bookmarks: Set<string>
  onToggleBookmark: (id: string) => void
  onBack: () => void
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer mb-5 px-0"
      >
        <ArrowLeft size={18} className="text-wp-accent" />
        <span className="font-body font-medium text-wp-accent" style={{ fontSize: 14 }}>
          Back
        </span>
      </button>

      <h2 className="font-heading font-bold text-wp-black mb-5" style={{ fontSize: 20, lineHeight: 1.2 }}>
        {category.title}
      </h2>

      <div className="space-y-3">
        {category.items.map((item: PocketbookItem) => {
          const isOpen = expanded.has(item.id)
          const isBookmarked = bookmarks.has(item.id)
          return (
            <div
              key={item.id}
              className="bg-wp-surface rounded-xl overflow-hidden"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' }}
            >
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full flex items-center justify-between px-4 py-4 bg-transparent border-none cursor-pointer text-left"
              >
                <span className="font-heading font-semibold text-wp-black pr-3" style={{ fontSize: 15, lineHeight: 1.3 }}>
                  {item.title}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onToggleBookmark(item.id)
                    }}
                    className="p-1 bg-transparent border-none cursor-pointer"
                  >
                    <Bookmark
                      size={18}
                      className={isBookmarked ? 'text-wp-accent fill-wp-accent' : 'text-wp-tan-dark'}
                      strokeWidth={1.75}
                    />
                  </button>
                  {isOpen ? (
                    <ChevronDown size={18} className="text-wp-tan-dark" />
                  ) : (
                    <ChevronRight size={18} className="text-wp-tan-dark" />
                  )}
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-5">
                  <div className="border-t border-wp-tan-light pt-4">
                    <p className="font-body text-wp-black" style={{ fontSize: 14, lineHeight: 1.65 }}>
                      {item.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PocketbookTab({ bookmarks, onToggleBookmark }: PocketbookTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PocketbookCategory | null>(null)

  if (selectedCategory) {
    return (
      <CategoryDetail
        category={selectedCategory}
        bookmarks={bookmarks}
        onToggleBookmark={onToggleBookmark}
        onBack={() => setSelectedCategory(null)}
      />
    )
  }

  return (
    <div>
      <div className="relative mb-5">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-wp-tan-dark" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search references..."
          className="w-full bg-wp-surface border-[1.5px] border-wp-contour rounded-lg pl-10 pr-4 font-body text-wp-black"
          style={{ height: 44, fontSize: 14 }}
        />
      </div>
      <CategoryList
        categories={pocketbookCategories}
        searchQuery={searchQuery}
        onSelect={setSelectedCategory}
      />
    </div>
  )
}
