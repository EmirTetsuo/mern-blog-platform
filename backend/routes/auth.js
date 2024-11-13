import { Router } from 'express'
import { register, login, getMe, getAllUsers, removeUser } from '../controllers/auth.js'
import { checkAuth } from '../utils/checkAuth.js'
const router = new Router()

// Register
// http://localhost:3002/api/auth/register
router.post('/register', register)

// Login
// http://localhost:3002/api/auth/login
router.post('/login', login)

// Get Me
// http://localhost:3002/api/auth/me
router.get('/me', checkAuth, getMe)

// Get All users
// http://localhost:3002/api/users
router.get('/', getAllUsers)

// Remove User
// http://localhost:3002/api/auth/users/:id
router.delete('/users/:id', removeUser);

export default router
