import { Router } from 'express'
import * as guildCtrl from '../controllers/guilds.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========= Public Routes ========= 


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

router.get('/', guildCtrl.index)
router.get('/:id', guildCtrl.show)
router.post('/', guildCtrl.create)
router.put('/:', guildCtrl.update)


export {
    router
}