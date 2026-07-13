import type { Book } from './types'
import generated from './generated-books.json'

export const books = generated as Book[]

export const getBookById = (id: string) => books.find((b) => b.id === id)
export const getBooksByCategory = (categoryId: string) => books.filter((b) => b.categoryId === categoryId)
export const getBestsellers = () => books.filter((b) => b.isBestseller)
export const getTrending = () => books.filter((b) => b.isTrending)
export const getNewArrivals = () => books.filter((b) => b.isNew)
export const getDeals = () => books.filter((b) => b.originalPrice && b.originalPrice > b.price)
