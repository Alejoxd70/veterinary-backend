import { Router } from 'express'
import { getAllUsers, registerUser, loginUser, deleteUser, editUser } from '../controllers/usersController.js'
import { verifyAuth } from '../middleware/auth.js'

const router = Router()

router.get('/users', getAllUsers)
router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.put('/users/:id', editUser)
router.delete('/users/:id', deleteUser)

// Example of how to use verifyAuth and verifyPermission middleware
router.get('/access', verifyAuth, (req, res) => {
  res.status(200).json(req.user)
})

export default router
