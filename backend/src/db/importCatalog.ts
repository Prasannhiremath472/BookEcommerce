import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { pool } from './pool.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SEED_DIR = join(__dirname, 'seed-data')

interface SeedCategory {
  id: string
  name: string
  slug: string
  description?: string
}

interface SeedAuthor {
  id: string
  name: string
}

interface SeedBook {
  id: string
  title: string
  author: string
  authorId: string
  cover: string
  price: number
  originalPrice?: number
  categoryId: string
  format: string
  language: string
  publisher: string
  inStock: boolean
  stockCount?: number
  isBestseller?: boolean
  isNew?: boolean
  isTrending?: boolean
  badge?: string
  description: string
  pages: number
  publishedYear: number
  isbn: string
}

function stripCatPrefix(categoryId: string) {
  return categoryId.replace(/^cat-/, '')
}

// Matches the categoryImages lookup table from the old frontend/src/data/categories.ts
// wrapper, preserved here so the import doesn't lose this curation.
const CATEGORY_IMAGES: Record<string, string> = {
  novels: '/covers/cover005.png',
  business: '/covers/cover009.png',
  biography: '/covers/cover012.png',
  general: '/covers/cover014.png',
  history: '/covers/cover015.png',
  poetry: '/covers/cover019.png',
  'self-help': '/covers/cover026.png',
  spiritual: '/covers/cover072.png',
  'short-stories': '/covers/cover077.png',
}

export async function importCatalog(): Promise<{ categories: number; authors: number; books: number }> {
  const categories: SeedCategory[] = JSON.parse(readFileSync(join(SEED_DIR, 'categories.json'), 'utf-8'))
  const authors: SeedAuthor[] = JSON.parse(readFileSync(join(SEED_DIR, 'authors.json'), 'utf-8'))
  const books: SeedBook[] = JSON.parse(readFileSync(join(SEED_DIR, 'books.json'), 'utf-8'))

  let categoryCount = 0
  for (const c of categories) {
    const id = stripCatPrefix(c.id)
    const [result] = await pool.query(
      'INSERT IGNORE INTO categories (id, name, slug, image_path, description) VALUES (?, ?, ?, ?, ?)',
      [id, c.name, c.slug, CATEGORY_IMAGES[c.slug] ?? '/covers/cover005.png', c.description ?? null],
    )
    categoryCount += (result as any).affectedRows
  }

  let authorCount = 0
  for (const a of authors) {
    const [result] = await pool.query(
      'INSERT IGNORE INTO authors (id, name) VALUES (?, ?)',
      [a.id, a.name],
    )
    authorCount += (result as any).affectedRows
  }

  let bookCount = 0
  for (const b of books) {
    const [result] = await pool.query(
      `INSERT IGNORE INTO books (id, title, author_name, author_id, category_id, cover_path, price, original_price, format, language, publisher, in_stock, stock_count, is_bestseller, is_new, is_trending, badge, description, pages, published_year, isbn)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.id,
        b.title,
        b.author,
        b.authorId,
        stripCatPrefix(b.categoryId),
        b.cover,
        b.price,
        b.originalPrice ?? null,
        b.format,
        b.language,
        b.publisher,
        b.inStock,
        b.stockCount ?? null,
        !!b.isBestseller,
        !!b.isNew,
        !!b.isTrending,
        b.badge ?? null,
        b.description,
        b.pages,
        b.publishedYear,
        b.isbn,
      ],
    )
    bookCount += (result as any).affectedRows
  }

  return { categories: categoryCount, authors: authorCount, books: bookCount }
}
