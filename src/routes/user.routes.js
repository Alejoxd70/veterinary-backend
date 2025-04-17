import { Router } from 'express'
import { getAllUsers, registerUser, loginUser } from '../controllers/usersController.js'
import { verifyAuth } from '../middleware/auth.js'
import { verifyPermission } from '../middleware/verifyPermission.js'
import { PERMISSIONS } from '../config/constants.js'

const router = Router()

router.get('/users', getAllUsers)
router.post('/users/register', registerUser)
router.post('/users/login', loginUser)

router.get('/admin', verifyAuth, verifyPermission({ permission: PERMISSIONS.ADMIN }), (req, res) => {
  res.status(200).json({ message: 'Admin access granted' })
})

export default router
