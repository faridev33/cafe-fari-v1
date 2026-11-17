import { Router } from 'express'
import { getTables, createTable, updateTableStatus, deleteTable } from '../controllers/tableController'

const router = Router()

router.get('/', getTables)
router.post('/', createTable)
router.put('/:id/status', updateTableStatus)
router.delete('/:id', deleteTable)

export default router