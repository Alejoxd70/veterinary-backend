import { Router } from 'express'
import { getAllPets, registerPet, getPet, updatePet, deletePet } from '../controllers/petsController.js'

const router = Router()

router.get('/pets', getAllPets)
router.post('/pets/register', registerPet)
router.get('/pet/:id', getPet)
router.put('/pets/update/:id', updatePet)
router.delete('/pets/delete/:id', deletePet)

export default router
