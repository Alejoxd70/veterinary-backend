import { Router } from 'express'
import { getAllUsers, registerUser, loginUser, deleteUser, editUser } from '../controllers/usersController.js'

const router = Router()

router.get('/users', getAllUsers)
router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.post('/users/:id', editUser)
router.delete('/users/:id', deleteUser)

// Example of how to use verifyAuth and verifyPermission middleware
// router.get('/admin', verifyAuth, verifyPermission({ permission: PERMISSIONS.ADMIN }), (req, res) => {
//   res.status(200).json({ message: 'Admin access granted' })
// })

export default router
