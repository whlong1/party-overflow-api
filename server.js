import 'dotenv/config.js'
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from 'morgan'
import cors from 'cors'

// import routers
import { router as profilesRouter } from './routes/profiles.js'
import { router as authRouter } from './routes/auth.js'
import {router as postsRouter} from './routes/posts.js'

import('./config/database.js')

// set up app
const app = express()

// middleware
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
  )
)

// mounted routers
app.use('/api/profiles', profilesRouter)
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
})

export {
  app
}
