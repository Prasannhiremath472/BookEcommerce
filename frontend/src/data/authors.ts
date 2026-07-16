import type { Author } from './types'
import generatedAuthors from './generated-authors.json'

const avatarSeeds = [12, 32, 47, 51, 15, 44, 8, 22, 5, 61, 9, 33]

export const authors: Author[] = (generatedAuthors as { id: string; name: string; bookCount: number }[])
  .slice(0, 12)
  .map((a, i) => ({
    id: a.id,
    name: a.name,
    photo: `https://i.pravatar.cc/300?img=${avatarSeeds[i % avatarSeeds.length]}`,
    bio: `${a.name} — New Era Publishing House चे लेखक, ${a.bookCount} पुस्तकांचे लेखन.`,
    bookCount: a.bookCount,
  }))
