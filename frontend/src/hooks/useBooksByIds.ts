import { useEffect, useState } from 'react'
import { fetchBooks } from '@/lib/api'
import type { Book } from '@/data/types'

export function useBooksByIds(ids: string[]) {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const idsKey = ids.join(',')

  useEffect(() => {
    if (ids.length === 0) {
      setBooks([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    fetchBooks({ ids, pageSize: ids.length })
      .then((res) => setBooks(res.books))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  return { books, isLoading }
}
