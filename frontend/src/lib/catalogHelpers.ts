import type { Book } from '@/data/types'

const FEATURED_ID = 'bk-156'

// Pins the current most-selling book to the front of a list without
// duplicating it. Operates on whatever array it's given (static or
// API-fetched), so callers just need the featured book present somewhere
// in the source list — if it's not there, the list is returned unchanged.
export function withFeaturedFirst(list: Book[]): Book[] {
  const featured = list.find((b) => b.id === FEATURED_ID)
  if (!featured) return list
  return [featured, ...list.filter((b) => b.id !== FEATURED_ID)]
}
