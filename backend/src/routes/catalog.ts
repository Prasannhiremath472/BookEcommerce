import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { asyncHandler } from '../lib/asyncHandler.js'

export const catalogRouter = Router()

const DEFAULT_PAGE_SIZE = 24
const MAX_PAGE_SIZE = 60

const listBooksSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  category: z.string().trim().optional(),
  author: z.string().trim().optional(),
  language: z.string().trim().optional(),
  publisher: z.string().trim().optional(),
  format: z.enum(['Hardcover', 'Paperback', 'eBook', 'Audiobook']).optional(),
  inStock: z.coerce.boolean().optional(),
  maxPrice: z.coerce.number().optional(),
  filter: z.enum(['bestsellers', 'new', 'trending', 'deals']).optional(),
  sort: z.enum(['featured', 'price-asc', 'price-desc', 'newest']).optional(),
  search: z.string().trim().optional(),
  ids: z.string().trim().optional(),
})

function mapBookRow(row: any) {
  return {
    id: row.id,
    title: row.title,
    author: row.author_name,
    authorId: row.author_id,
    cover: row.cover_path,
    price: Number(row.price),
    originalPrice: row.original_price !== null ? Number(row.original_price) : undefined,
    category: row.category_name ?? null,
    categoryId: row.category_id,
    format: row.format,
    language: row.language,
    publisher: row.publisher,
    inStock: !!row.in_stock,
    stockCount: row.stock_count ?? undefined,
    isBestseller: !!row.is_bestseller,
    isNew: !!row.is_new,
    isTrending: !!row.is_trending,
    badge: row.badge ?? undefined,
    description: row.description,
    pages: row.pages,
    publishedYear: row.published_year,
    isbn: row.isbn,
  }
}

function mapCategoryRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.image_path ?? '',
    description: row.description ?? '',
  }
}

function mapAuthorRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    photo: row.photo_url ?? '',
    bio: row.bio ?? '',
  }
}

catalogRouter.get('/books', asyncHandler(async (req, res) => {
  const parsed = listBooksSchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query parameters.' })
  }
  const { page, pageSize, category, author, language, publisher, format, inStock, maxPrice, filter, sort, search, ids } = parsed.data

  const where: string[] = []
  const params: any[] = []

  if (ids) {
    const idList = ids.split(',').map((s) => s.trim()).filter(Boolean)
    if (idList.length === 0) {
      return res.json({ books: [], total: 0, page: 1, pageSize })
    }
    where.push(`b.id IN (${idList.map(() => '?').join(',')})`)
    params.push(...idList)
  }
  if (category) { where.push('b.category_id = ?'); params.push(category) }
  if (author) { where.push('b.author_id = ?'); params.push(author) }
  if (language) { where.push('b.language = ?'); params.push(language) }
  if (publisher) { where.push('b.publisher = ?'); params.push(publisher) }
  if (format) { where.push('b.format = ?'); params.push(format) }
  if (inStock) { where.push('b.in_stock = TRUE') }
  if (maxPrice !== undefined) { where.push('b.price <= ?'); params.push(maxPrice) }
  if (search) { where.push('(b.title LIKE ? OR b.author_name LIKE ?)'); params.push(`%${search}%`, `%${search}%`) }
  if (filter === 'bestsellers') where.push('b.is_bestseller = TRUE')
  if (filter === 'new') where.push('b.is_new = TRUE')
  if (filter === 'trending') where.push('b.is_trending = TRUE')
  if (filter === 'deals') where.push('b.original_price IS NOT NULL AND b.original_price > b.price')

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const orderBy =
    sort === 'price-asc' ? 'b.price ASC' :
    sort === 'price-desc' ? 'b.price DESC' :
    sort === 'newest' ? 'b.published_year DESC, b.created_at DESC' :
    'b.is_bestseller DESC, b.created_at DESC'

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM books b ${whereClause}`, params)
  const total = (countRows as any[])[0].total as number

  const offset = (page - 1) * pageSize
  const [rows] = await pool.query(
    `SELECT b.*, c.name AS category_name FROM books b LEFT JOIN categories c ON c.id = b.category_id ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, pageSize, offset],
  )

  res.json({ books: (rows as any[]).map(mapBookRow), total, page, pageSize })
}))

catalogRouter.get('/books/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT b.*, c.name AS category_name FROM books b LEFT JOIN categories c ON c.id = b.category_id WHERE b.id = ? LIMIT 1',
    [req.params.id],
  )
  const book = (rows as any[])[0]
  if (!book) return res.status(404).json({ error: 'Book not found.' })
  res.json({ book: mapBookRow(book) })
}))

catalogRouter.get('/categories', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, (SELECT COUNT(*) FROM books b WHERE b.category_id = c.id) AS book_count FROM categories c ORDER BY c.name ASC`,
  )
  res.json({ categories: (rows as any[]).map((r) => ({ ...mapCategoryRow(r), bookCount: r.book_count })) })
}))

catalogRouter.get('/authors', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*, (SELECT COUNT(*) FROM books b WHERE b.author_id = a.id) AS book_count FROM authors a ORDER BY a.name ASC`,
  )
  res.json({ authors: (rows as any[]).map((r) => ({ ...mapAuthorRow(r), bookCount: r.book_count })) })
}))

catalogRouter.get('/catalog/stats', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS totalBooks, COUNT(DISTINCT author_id) AS totalAuthors, COUNT(DISTINCT language) AS totalLanguages FROM books`,
  )
  const stats = (rows as any[])[0]
  res.json({ totalBooks: stats.totalBooks, totalAuthors: stats.totalAuthors, totalLanguages: stats.totalLanguages })
}))
