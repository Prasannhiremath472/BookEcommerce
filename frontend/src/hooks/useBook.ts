import { useEffect, useState } from 'react'
import { fetchBookById } from '@/lib/api'
import type { Book } from '@/data/types'

export function useBook(id: string | undefined) {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setBook(null)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setBook(null)
    fetchBookById(id)
      .then(({ book }) => setBook(book))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [id])

  return { book, isLoading, error }
}
