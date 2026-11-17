import { Router } from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser, login } from '../controllers/userController'
import { upload } from '../utils/upload'

const router = Router()

router.post('/login', login)
router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', upload.single('image'), createUser)
router.put('/:id', upload.single('image'), updateUser)
router.delete('/:id', deleteUser)

export default router