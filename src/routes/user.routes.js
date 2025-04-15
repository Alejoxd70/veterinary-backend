import { Router } from 'express'
import { getAllUsers } from '../controllers/usersController.js'

const router = Router()

router.get('/', getAllUsers)

export default router
