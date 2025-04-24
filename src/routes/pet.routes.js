import { Router } from 'express'
import { getAllPets } from '../controllers/petsController.js'

const router = Router()

router.get('/pets', getAllPets)

export default router
