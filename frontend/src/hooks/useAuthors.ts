import { useEffect, useState } from 'react'
import { fetchAuthors } from '@/lib/api'
import type { Author } from '@/data/types'

export function useAuthors() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAuthors()
      .then(({ authors }) => setAuthors(authors))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { authors, isLoading, error }
}
