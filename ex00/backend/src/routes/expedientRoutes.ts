import express from 'express';
import { 
    createExpedient, 
    getAllExpedients, 
    getExpedientById, 
    updateExpedient, 
    deleteExpedient 
} from '../controllers/expedientController'; 
import { protect } from '../middleware/authMiddleware'; 

const router = express.Router();

// /api/expedients
router.route('/')
	.get(protect, getAllExpedients) // GET /api/expedients:
	.post(protect, createExpedient);// POST /api/expedients: Standard/Admin/Service Desk

// /api/expedients/:id
router.route('/:id')
	.get(protect, getExpedientById)// GET /api/expedients/:id 
	.put(protect, updateExpedient)// PUT /api/expedients/:id
	.delete(protect, deleteExpedient);// DELETE /api/expedients/:id

export default router;