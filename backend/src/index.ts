import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { authRouter } from './routes/auth.js'
import { paymentsRouter } from './routes/payments.js'
import { addressesRouter } from './routes/addresses.js'
import { catalogRouter } from './routes/catalog.js'
import { adminCatalogRouter } from './routes/adminCatalog.js'
import { ordersRouter } from './routes/orders.js'
import { adminOrdersRouter } from './routes/adminOrders.js'

const app = express()

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRouter)
app.use('/api', paymentsRouter)
app.use('/api/addresses', addressesRouter)
app.use('/api', catalogRouter)
app.use('/api/admin', adminCatalogRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin/orders', adminOrdersRouter)

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error.' })
})

app.listen(config.port, () => {
  console.log(`Cosmos Edge auth server listening on port ${config.port}`)
})
