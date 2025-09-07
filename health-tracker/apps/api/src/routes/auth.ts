import { Router } from 'express'
import { validateBody } from '../middleware/validation'
import { authenticateToken } from '../middleware/auth'
import { RegisterSchema, LoginSchema } from '@health-tracker/types'
import {
  register,
  login,
  refresh,
  logout,
  me
} from '../controllers/authController'

const router = Router()

// Public routes
router.post('/register', validateBody(RegisterSchema), register)
router.post('/login', validateBody(LoginSchema), login)
router.post('/refresh', refresh)

// Protected routes
router.post('/logout', authenticateToken, logout)
router.get('/me', authenticateToken, me)

export default router