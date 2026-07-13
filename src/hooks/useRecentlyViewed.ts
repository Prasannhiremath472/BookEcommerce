import { useEffect, useState } from 'react'

const KEY = 'cosmosedge-recently-viewed'
const MAX = 8

export function useRecentlyViewed(bookId?: string) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (!bookId) return
    setIds((prev) => {
      const next = [bookId, ...prev.filter((id) => id !== bookId)].slice(0, MAX)
      sessionStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  return ids
}
