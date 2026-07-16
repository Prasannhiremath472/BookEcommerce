import type { Category } from './types'
import generatedCategories from './generated-categories.json'

const categoryImages: Record<string, string> = {
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

export const categories: Category[] = (generatedCategories as Omit<Category, 'image'>[]).map((c) => ({
  ...c,
  id: c.id.replace(/^cat-/, ''),
  image: categoryImages[c.slug] ?? '/covers/cover005.png',
}))
