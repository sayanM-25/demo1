require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDatabase } = require('./server/config/database')
const authRoutes = require('./server/routes/authRoutes')
const contactRoutes = require('./server/routes/contactRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
)
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactRoutes)

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error.',
  })
})

async function startServer() {
  await connectDatabase()
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
