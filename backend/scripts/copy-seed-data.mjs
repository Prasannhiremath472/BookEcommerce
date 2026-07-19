import { cpSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = join(__dirname, '..', 'src', 'db', 'seed-data')
const dest = join(__dirname, '..', 'dist', 'db', 'seed-data')

cpSync(src, dest, { recursive: true })
console.log('Copied seed-data into dist/db/seed-data')
