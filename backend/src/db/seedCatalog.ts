import { pool } from './pool.js'
import { importCatalog } from './importCatalog.js'

importCatalog()
  .then((result) => {
    console.log(`Catalog import complete: ${result.categories} categories, ${result.authors} authors, ${result.books} books inserted.`)
  })
  .catch((err) => {
    console.error('Catalog import failed:', err)
    process.exitCode = 1
  })
  .finally(() => pool.end())
