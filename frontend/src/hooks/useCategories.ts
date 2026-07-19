import { useEffect, useState } from 'react'
import { fetchCategories } from '@/lib/api'
import type { Category } from '@/data/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
      .then(({ categories }) => setCategories(categories))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { categories, isLoading, error }
}
