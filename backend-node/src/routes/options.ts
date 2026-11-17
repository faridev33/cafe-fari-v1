import { Router } from 'express'
import { getOptions, saveOptions } from '../controllers/optionController'

const router = Router()

router.get('/:productId', getOptions)
router.post('/:productId', saveOptions)

export default router