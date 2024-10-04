import {
  loginHandler,
  registerHandler
} from '@/controllers/auth.controller'
import { Router } from 'express'

const router = Router()

router.post('/register', registerHandler)
router.post('/login', loginHandler)

export { router as authRouter }