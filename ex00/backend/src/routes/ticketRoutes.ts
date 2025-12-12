import express from 'express';
import { 
    createTicket, 
    getAllTickets, 
	getMyTickets,
    getTicketById, 
    updateTicket, 
    deleteTicket 
} from '../controllers/ticketController'; 
import { protect } from '../middleware/authMiddleware'; 

const router = express.Router();

// /api/tickets
router.route('/')
	.get(protect, getAllTickets) // GET /api/tickets:
	.post(protect, createTicket);// POST /api/tickets: Standard/Admin/Service Desk

router.get('/mine', protect, getMyTickets);

// /api/tickets/:id
router.route('/:id')
	.get(protect, getTicketById)// GET /api/tickets/:id 
	.put(protect, updateTicket)// PUT /api/tickets/:id
	.delete(protect, deleteTicket);// DELETE /api/tickets/:id

export default router;