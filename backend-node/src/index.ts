import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { errorHandler } from './middleware/errorHandler'
import productRoutes from './routes/products'
import userRoutes from './routes/users'
import tableRoutes from './routes/tables'
import orderRoutes from './routes/orders'
import optionRoutes from './routes/options'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/static', express.static(path.join(__dirname, '../static')))

// Routes
app.use('/products', productRoutes)
app.use('/users', userRoutes)
app.use('/tables', tableRoutes)
app.use('/orders', orderRoutes)
app.use('/options', optionRoutes)

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'Server Cafe Berjalan!' })
})

// Error handler
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})