import { Router } from 'express'
import * as guildCtrl from '../controllers/guilds.js'
import { createAdmin } from '../middleware/middleware.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'


const router = Router()

// ========= Public Routes ========= 
router.get('/', guildCtrl.index)

// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

router.get('/:id', checkAuth, guildCtrl.show)
router.put('/:id', checkAuth, guildCtrl.update)
router.post('/', checkAuth, createAdmin, guildCtrl.create)



export {
    router
}
