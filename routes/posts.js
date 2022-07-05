import { Router } from 'express'
import * as postCtrl from '../controllers/posts.js'
import { attributeAuthor } from '../middleware/middleware.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========= Public Routes ========= 
router.get('/', postCtrl.index)
router.get('/:id', postCtrl.show)

// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

router.post('/', checkAuth, attributeAuthor, postCtrl.create)
router.put('/:id', checkAuth, postCtrl.update)
router.delete('/:id', checkAuth, postCtrl.delete)

router.post('/:id/comments', checkAuth, attributeAuthor, postCtrl.createComment)
router.put('/:postId/comments/:commentId', checkAuth, postCtrl.updateComment)
router.delete('/:postId/comments/:commentId', checkAuth, postCtrl.deleteComment)
router.post('/:postId/comments/:commentId', checkAuth, postCtrl.castVote)

router.patch('/:id/views', checkAuth, postCtrl.incrementViews)
router.post('/:id/bookmarks', checkAuth, postCtrl.bookmarkPost)
router.delete('/:id/bookmarks/:postId', checkAuth, postCtrl.removeBookmark)


export {
    router
}