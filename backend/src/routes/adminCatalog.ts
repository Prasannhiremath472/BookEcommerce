import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { importCatalog } from '../db/importCatalog.js'

export const adminCatalogRouter = Router()
adminCatalogRouter.use(requireAuth, requireAdmin)

// TEMPORARY: one-time production catalog import trigger. Idempotent (uses
// INSERT IGNORE), safe to call more than once. Remove this route once the
// live catalog import has been verified complete (see plan Phase 8).
adminCatalogRouter.post('/import-catalog', asyncHandler(async (_req, res) => {
  const result = await importCatalog()
  res.json({ ok: true, ...result })
}))

const bookSchema = z.object({
  id: z.string().trim().min(1).max(16),
  title: z.string().trim().min(1).max(255),
  author: z.string().trim().min(1).max(255),
  authorId: z.string().trim().min(1).max(128).nullable().optional(),
  categoryId: z.string().trim().min(1).max(64).nullable().optional(),
  cover: z.string().trim().min(1).max(255),
  price: z.number().min(0),
  originalPrice: z.number().min(0).nullable().optional(),
  format: z.enum(['Hardcover', 'Paperback', 'eBook', 'Audiobook']),
  language: z.string().trim().min(1).max(50),
  publisher: z.string().trim().min(1).max(255),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0).nullable().optional(),
  isBestseller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  badge: z.string().trim().max(50).nullable().optional(),
  description: z.string().trim().min(1),
  pages: z.number().int().min(1),
  publishedYear: z.number().int().min(1000),
  isbn: z.string().trim().min(1).max(20),
})

const categorySchema = z.object({
  id: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(255),
  slug: z.string().trim().min(1).max(64),
  image: z.string().trim().max(255).nullable().optional(),
  description: z.string().trim().max(2000).nullable().optional(),
})

const authorSchema = z.object({
  id: z.string().trim().min(1).max(128),
  name: z.string().trim().min(1).max(255),
  photo: z.string().trim().max(255).nullable().optional(),
  bio: z.string().trim().max(2000).nullable().optional(),
})

// --- Books ---

adminCatalogRouter.post('/books', asyncHandler(async (req, res) => {
  const parsed = bookSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid book data.' })
  }
  const b = parsed.data

  const [existing] = await pool.query('SELECT id FROM books WHERE id = ? LIMIT 1', [b.id])
  if ((existing as any[]).length > 0) {
    return res.status(409).json({ error: 'A book with this id already exists.' })
  }

  await pool.query(
    `INSERT INTO books (id, title, author_name, author_id, category_id, cover_path, price, original_price, format, language, publisher, in_stock, stock_count, is_bestseller, is_new, is_trending, badge, description, pages, published_year, isbn)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [b.id, b.title, b.author, b.authorId ?? null, b.categoryId ?? null, b.cover, b.price, b.originalPrice ?? null, b.format, b.language, b.publisher, b.inStock, b.stockCount ?? null, !!b.isBestseller, !!b.isNew, !!b.isTrending, b.badge ?? null, b.description, b.pages, b.publishedYear, b.isbn],
  )
  res.status(201).json({ ok: true, id: b.id })
}))

adminCatalogRouter.put('/books/:id', asyncHandler(async (req, res) => {
  const parsed = bookSchema.omit({ id: true }).safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid book data.' })
  }
  const b = parsed.data

  const [existing] = await pool.query('SELECT id FROM books WHERE id = ? LIMIT 1', [req.params.id])
  if ((existing as any[]).length === 0) {
    return res.status(404).json({ error: 'Book not found.' })
  }

  await pool.query(
    `UPDATE books SET title=?, author_name=?, author_id=?, category_id=?, cover_path=?, price=?, original_price=?, format=?, language=?, publisher=?, in_stock=?, stock_count=?, is_bestseller=?, is_new=?, is_trending=?, badge=?, description=?, pages=?, published_year=?, isbn=? WHERE id=?`,
    [b.title, b.author, b.authorId ?? null, b.categoryId ?? null, b.cover, b.price, b.originalPrice ?? null, b.format, b.language, b.publisher, b.inStock, b.stockCount ?? null, !!b.isBestseller, !!b.isNew, !!b.isTrending, b.badge ?? null, b.description, b.pages, b.publishedYear, b.isbn, req.params.id],
  )
  res.json({ ok: true })
}))

adminCatalogRouter.delete('/books/:id', asyncHandler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM books WHERE id = ?', [req.params.id])
  if ((result as any).affectedRows === 0) {
    return res.status(404).json({ error: 'Book not found.' })
  }
  res.json({ ok: true })
}))

// --- Categories ---

adminCatalogRouter.post('/categories', asyncHandler(async (req, res) => {
  const parsed = categorySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid category data.' })
  }
  const c = parsed.data

  const [existing] = await pool.query('SELECT id FROM categories WHERE id = ? OR slug = ? LIMIT 1', [c.id, c.slug])
  if ((existing as any[]).length > 0) {
    return res.status(409).json({ error: 'A category with this id or slug already exists.' })
  }

  await pool.query(
    'INSERT INTO categories (id, name, slug, image_path, description) VALUES (?, ?, ?, ?, ?)',
    [c.id, c.name, c.slug, c.image ?? null, c.description ?? null],
  )
  res.status(201).json({ ok: true, id: c.id })
}))

adminCatalogRouter.put('/categories/:id', asyncHandler(async (req, res) => {
  const parsed = categorySchema.omit({ id: true }).safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid category data.' })
  }
  const c = parsed.data

  const [existing] = await pool.query('SELECT id FROM categories WHERE id = ? LIMIT 1', [req.params.id])
  if ((existing as any[]).length === 0) {
    return res.status(404).json({ error: 'Category not found.' })
  }

  await pool.query(
    'UPDATE categories SET name=?, slug=?, image_path=?, description=? WHERE id=?',
    [c.name, c.slug, c.image ?? null, c.description ?? null, req.params.id],
  )
  res.json({ ok: true })
}))

adminCatalogRouter.delete('/categories/:id', asyncHandler(async (req, res) => {
  const [referencing] = await pool.query('SELECT id FROM books WHERE category_id = ? LIMIT 1', [req.params.id])
  if ((referencing as any[]).length > 0) {
    return res.status(409).json({ error: 'Cannot delete a category that still has books assigned to it.' })
  }
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id])
  if ((result as any).affectedRows === 0) {
    return res.status(404).json({ error: 'Category not found.' })
  }
  res.json({ ok: true })
}))

// --- Authors ---

adminCatalogRouter.post('/authors', asyncHandler(async (req, res) => {
  const parsed = authorSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid author data.' })
  }
  const a = parsed.data

  const [existing] = await pool.query('SELECT id FROM authors WHERE id = ? LIMIT 1', [a.id])
  if ((existing as any[]).length > 0) {
    return res.status(409).json({ error: 'An author with this id already exists.' })
  }

  await pool.query(
    'INSERT INTO authors (id, name, photo_url, bio) VALUES (?, ?, ?, ?)',
    [a.id, a.name, a.photo ?? null, a.bio ?? null],
  )
  res.status(201).json({ ok: true, id: a.id })
}))

adminCatalogRouter.put('/authors/:id', asyncHandler(async (req, res) => {
  const parsed = authorSchema.omit({ id: true }).safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid author data.' })
  }
  const a = parsed.data

  const [existing] = await pool.query('SELECT id FROM authors WHERE id = ? LIMIT 1', [req.params.id])
  if ((existing as any[]).length === 0) {
    return res.status(404).json({ error: 'Author not found.' })
  }

  await pool.query('UPDATE authors SET name=?, photo_url=?, bio=? WHERE id=?', [a.name, a.photo ?? null, a.bio ?? null, req.params.id])
  res.json({ ok: true })
}))

adminCatalogRouter.delete('/authors/:id', asyncHandler(async (req, res) => {
  const [referencing] = await pool.query('SELECT id FROM books WHERE author_id = ? LIMIT 1', [req.params.id])
  if ((referencing as any[]).length > 0) {
    return res.status(409).json({ error: 'Cannot delete an author who still has books assigned to them.' })
  }
  const [result] = await pool.query('DELETE FROM authors WHERE id = ?', [req.params.id])
  if ((result as any).affectedRows === 0) {
    return res.status(404).json({ error: 'Author not found.' })
  }
  res.json({ ok: true })
}))
