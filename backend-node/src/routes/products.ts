import { Router } from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, updateProductStatus } from '../controllers/productController'
import { upload } from '../utils/upload'

const router = Router()

router.get('/', getProducts)
router.get('/:id', getProduct)
router.post('/', upload.single('image'), createProduct)
router.put('/:id', upload.single('image'), updateProduct)
router.delete('/:id', deleteProduct)
router.patch('/:id/status', updateProductStatus)

export default router