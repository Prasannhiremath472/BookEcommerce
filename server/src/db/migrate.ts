import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { pool } from './pool.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function migrate() {
  const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)

  const conn = await pool.getConnection()
  try {
    for (const statement of statements) {
      await conn.query(statement)
    }
    console.log(`Migration complete: ${statements.length} statements executed.`)
  } finally {
    conn.release()
    await pool.end()
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
