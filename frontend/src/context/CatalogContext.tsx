import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchCategories, fetchAuthors } from '@/lib/api'
import type { Category, Author } from '@/data/types'

interface CatalogContextValue {
  categories: Category[]
  authors: Author[]
  isLoading: boolean
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchCategories(), fetchAuthors()])
      .then(([categoriesRes, authorsRes]) => {
        setCategories(categoriesRes.categories)
        setAuthors(authorsRes.authors)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return <CatalogContext.Provider value={{ categories, authors, isLoading }}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}
