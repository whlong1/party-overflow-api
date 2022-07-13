import 'dotenv/config.js'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'

// Import Custom Middleware
import { removeEmptyFields } from './middleware/middleware.js'

// Import Routers
import { router as authRouter } from './routes/auth.js'
import { route as guildsRouter } from './routes/guilds.js'
import { router as postsRouter } from './routes/posts.js'
import { router as profilesRouter } from './routes/profiles.js'

import('./config/database.js')

const app = express()

// Middleware
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(removeEmptyFields)

app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/guilds', guildsRouter)
app.use('/api/profiles', profilesRouter)

app.use(function (req, res, next) {
  res.status(404).json({ err: "Not found" })
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ err: err.message })
})

export {
  app
}
