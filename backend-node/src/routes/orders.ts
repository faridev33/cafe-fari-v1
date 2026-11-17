import { Router } from 'express'
import { createOrder, getOrders, updateOrderItems, payOrder, getOrderStatus, updateCookingStatus } from '../controllers/orderController'

const router = Router()

router.post('/', createOrder)
router.get('/', getOrders)
router.put('/:id/items', updateOrderItems)
router.put('/:id/pay', payOrder)
router.get('/status/:tableId', getOrderStatus)
router.put('/:id/cooking', updateCookingStatus)

export default router