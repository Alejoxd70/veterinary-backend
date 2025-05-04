import { Router } from 'express'
import { deleteProduct, getAllProducts, getProduct, registerProduct, updateProduct } from '../controllers/productsController.js'

const router = Router()

router.get('/products', getAllProducts)
router.get('/product/:id', getProduct)
router.post('/products/register', registerProduct)
router.put('/products/update/:id', updateProduct)
router.delete('/products/delete/:id', deleteProduct)

export default router
