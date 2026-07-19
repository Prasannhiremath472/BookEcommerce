import { useEffect, useState } from 'react'
import { fetchBooks, type BooksQuery } from '@/lib/api'
import type { Book } from '@/data/types'

export function useBooks(query: BooksQuery) {
  const [books, setBooks] = useState<Book[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const queryKey = JSON.stringify(query)

  useEffect(() => {
    setIsLoading(true)
    fetchBooks(query)
      .then((res) => {
        setBooks(res.books)
        setTotal(res.total)
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  return { books, total, isLoading, error }
}
