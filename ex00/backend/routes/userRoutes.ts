// routes/userRoutes.ts
import express from 'express';
// Si usas un controlador, también impórtalo
// import { registerUser, loginUser, getMe } from '../controllers/userController'; 

// 1. Define y crea el Router
const router = express.Router();

// 2. Define las rutas y asocia los controladores
// router.post('/', registerUser);
// router.post('/login', loginUser);
// router.get('/me', protect, getMe); // Asumiendo que usas middleware 'protect'

// 3. EXPORTA el router
export default router; // Usa export default si estás en TypeScript