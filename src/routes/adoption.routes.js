import { Router } from 'express'
import { getAllAdoptions, getAdoption, registerAdoption, updateAdoption, deleteAdoption } from '../controllers/adoptionsController.js'

const router = Router()

router.get('/adoptions', getAllAdoptions)
router.get('/adoption/:id', getAdoption)
router.post('/adoptions/register', registerAdoption)
router.put('/adoptions/update/:id', updateAdoption)
router.delete('/adoptions/delete/:id', deleteAdoption)

export default router
