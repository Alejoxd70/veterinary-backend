import { Router } from 'express'
import { getAllUsers, registerUser, loginUser } from '../controllers/usersController.js'

const router = Router()

router.get('/users', getAllUsers)
router.post('/users/register', registerUser)
router.post('/users/login', loginUser)

export default router
