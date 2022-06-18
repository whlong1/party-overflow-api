import { Router } from 'express'
import * as postCtrl from '../controllers/posts.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========= Public Routes ========= 
router.get('/', postCtrl.index)


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)


export {
    router
}