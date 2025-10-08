// server/server.js
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'

// Routers (you'll create these files if you haven't yet)
import eventsRouter from './routes/events.js'
import locationsRouter from './routes/locations.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3001
const app = express()

// Middleware
app.use(cors())            // allow client (Vite) -> server requests
app.use(express.json())    // parse JSON bodies

// Health check
app.get('/', (_req, res) => res.send('Virtual Community API'))

// API routes
app.use('/api/events', eventsRouter)
app.use('/api/locations', locationsRouter)

// Production static serving (after you build the client into server/public)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
  app.get('/*', (_req, res) =>
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  )
}

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`)
})
