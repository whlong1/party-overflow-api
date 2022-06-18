import { Router } from 'express'
import * as postCtrl from '../controllers/posts.js'
import { decodeUserFromToken, checkAuth, attributeAuthor } from '../middleware/auth.js'

const router = Router()

// ========= Public Routes ========= 
router.get('/', postCtrl.index)


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.post('/', checkAuth, attributeAuthor, postCtrl.create)


export {
    router
}