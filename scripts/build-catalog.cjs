// One-off transform: catalog.json (raw PDF extraction) -> books.ts + categories.ts + authors.ts
const fs = require('fs')
const path = require('path')

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/catalog.json'), 'utf-8'))

const CATEGORY_RULES = [
  { id: 'history', name: 'इतिहास', nameEn: 'History', slug: 'history', kw: ['शिवाजी', 'शिवरायांच', 'मराठ्यांच', 'औरंगजेब', 'ऐतिहासिक', 'रायगड', 'संताजी', 'होळकर', 'जिंजी', 'शहाजी', 'चंगेजखान', 'गौतम बुद्ध', 'आंबेडकर', 'गांधी', 'नेहरू', 'भगत सिंह', 'phule', 'फुले', 'इस्रो', 'क्रांती', 'चे ग्वेरा', 'फिडेल', 'castro', 'guevara', 'shivaji'] },
  { id: 'biography', name: 'चरित्र', nameEn: 'Biography', slug: 'biography', kw: ['चरित्र', 'आत्मकथा', 'आत्मकथन', 'बायोग्राफी', 'autobiography', 'ठाणेदार', 'रजनीकांत', 'शाहरुख', 'टाटा', 'made it happen'] },
  { id: 'poetry', name: 'कविता', nameEn: 'Poetry', slug: 'poetry', kw: ['कवितासंग्रह', 'काव्यसंग्रह', 'गझलसंग्रह', 'कविता'] },
  { id: 'selfhelp', name: 'स्वयं-विकास', nameEn: 'Self-Help', slug: 'self-help', kw: ['कार्नेगी', 'हिल', 'यशस्वी', 'सवयी', 'हॅबिट', 'लीडर', 'नेतृत्व', 'माणसे कशी जोडावी', 'सबकॉन्शस', 'ग्रो रिच', 'लॉ ऑफ अॅट्रॅक्शन', 'यू कॅन', 'स्पीकिंग', 'सुखाच्या शोधात', 'समृद्धी', 'पॉवर ऑफ'] },
  { id: 'business', name: 'व्यवसाय', nameEn: 'Business', slug: 'business', kw: ['उद्योजक', 'आंत्रप्रेन्युअर', 'बिझनेस', 'पॅसिव्ह इन्कम', 'शेअर बाजार', 'डिजिटल मार्केटिंग', 'entrepreneur'] },
  { id: 'novel', name: 'कादंबरी', nameEn: 'Novels', slug: 'novels', kw: ['कादंबरी', 'novel', 'उपन्यास'] },
  { id: 'spiritual', name: 'अध्यात्म', nameEn: 'Spiritual', slug: 'spiritual', kw: ['ओशो', 'osho', 'मी कोण आहे', 'झेन', 'जीएम', 'समृद्धि'] },
  { id: 'shortstories', name: 'कथासंग्रह', nameEn: 'Short Stories', slug: 'short-stories', kw: ['कथासंग्रह', 'कथांचा संग्रह', 'गोष्टींचा संग्रह'] },
]

function pickCategory(book) {
  const hay = (book.title + ' ' + book.desc + ' ' + book.category + ' ' + book.author).toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.kw.some((k) => hay.includes(k.toLowerCase()))) return rule
  }
  return { id: 'general', name: 'सामान्य पुस्तके', nameEn: 'General', slug: 'general' }
}

const categoriesMap = new Map()
const authorsMap = new Map()

function slugifyAuthor(name) {
  return 'auth-' + name.split(',')[0].trim().replace(/\s+/g, '-').replace(/[^\w\-ऀ-ॿ]/g, '').toLowerCase()
}

const books = raw.map((b, idx) => {
  const cat = pickCategory(b)
  if (!categoriesMap.has(cat.id)) categoriesMap.set(cat.id, { ...cat, count: 0 })
  categoriesMap.get(cat.id).count++

  const authorName = b.author.split(',')[0].split('।')[0].trim()
  const authorId = slugifyAuthor(authorName)
  if (!authorsMap.has(authorId)) authorsMap.set(authorId, { id: authorId, name: authorName, count: 0 })
  authorsMap.get(authorId).count++

  const seed = b.page
  const isBestseller = !!b.bestseller || seed % 11 === 0
  const isNew = !!b.isNew || seed % 13 === 0
  const isTrending = !!b.isTrending || seed % 7 === 0
  const hasDiscount = b.originalPrice !== undefined || seed % 4 === 0
  const discountPct = b.originalPrice !== undefined
    ? Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100)
    : 10 + (seed % 20)
  const originalPrice = b.originalPrice !== undefined
    ? b.originalPrice
    : hasDiscount
      ? Math.round((b.price / (1 - discountPct / 100)) / 5) * 5
      : undefined

  const coverExt = fs.existsSync(path.join(__dirname, `../public/covers/cover${String(b.page).padStart(3, '0')}.jpeg`))
    ? 'jpeg'
    : 'png'

  return {
    id: `bk-${idx + 1}`,
    title: b.title,
    author: authorName,
    authorId,
    cover: `/covers/cover${String(b.page).padStart(3, '0')}.${coverExt}`,
    price: b.price,
    originalPrice,
    category: cat.name,
    categoryId: cat.id,
    format: 'Paperback',
    language: b.language,
    publisher: 'New Era Publishing House',
    inStock: seed % 29 !== 0,
    stockCount: 5 + (seed % 60),
    isBestseller,
    isNew,
    isTrending,
    badge: hasDiscount ? `${discountPct}% OFF` : isBestseller ? 'BESTSELLER' : undefined,
    description: b.desc,
    pages: b.pages,
    publishedYear: 2024 + (seed % 3),
    isbn: `978${String(1000000000 + seed).slice(0, 10)}`,
  }
})

const categories = Array.from(categoriesMap.values()).map((c) => ({
  id: `cat-${c.id}`,
  name: c.nameEn,
  slug: c.slug,
  bookCount: c.count,
  description: `${c.name} — ${c.count} पुस्तके`,
}))

const authors = Array.from(authorsMap.values())
  .sort((a, b) => b.count - a.count)
  .map((a) => ({ id: a.id, name: a.name, bookCount: a.count }))

fs.writeFileSync(path.join(__dirname, '../src/data/generated-books.json'), JSON.stringify(books, null, 2))
fs.writeFileSync(path.join(__dirname, '../src/data/generated-categories.json'), JSON.stringify(categories, null, 2))
fs.writeFileSync(path.join(__dirname, '../src/data/generated-authors.json'), JSON.stringify(authors, null, 2))

console.log('books:', books.length)
console.log('categories:', categories.map((c) => `${c.name}(${c.bookCount})`).join(', '))
console.log('authors:', authors.length)
