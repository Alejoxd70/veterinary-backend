import { Router } from 'express'
import { getAllUsers, registerUser, loginUser } from '../controllers/usersController.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.get('/users', getAllUsers)
router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.get('/admin', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Admin access granted' })
})

export default router
