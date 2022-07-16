import { Router } from 'express'
import * as guildCtrl from '../controllers/guilds.js'
import { createAdmin } from '../middleware/middleware.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'


const router = Router()

// ========= Public Routes ========= 


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

router.post('/', checkAuth, createAdmin, guildCtrl.create)

router.get('/', checkAuth, guildCtrl.index)
router.get('/:id', checkAuth, guildCtrl.show)
router.put('/:', checkAuth, guildCtrl.update)


export {
    router
}