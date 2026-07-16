import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Book } from '@/data/types'
import { BookCard } from '@/components/book/BookCard'
import { SectionHeading } from './SectionHeading'
import { useLanguage } from '@/context/LanguageContext'

export function BookRail({
  eyebrow,
  title,
  subtitle,
  books,
  ctaTo,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  books: Book[]
  ctaTo?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const scroll = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="container-app py-16 sm:py-20">
      <div className="flex items-end justify-between">
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} cta={ctaTo ? t('viewAll') : undefined} ctaTo={ctaTo} />
        <div className="mb-10 hidden gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-none pb-2">
        {books.map((book) => (
          <div key={book.id} className="w-56 flex-shrink-0 sm:w-64">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  )
}
