import express, { Response, NextFunction } from 'express';
import { protect, CustomRequest } from '../middleware/authMiddleware';
import { 
    getAllOffices, 
    getByIdOffice,
    createOffice, 
    updateOffice, 
    deleteOffice  
} from '../controllers/officeControler'; 

const router = express.Router();

const adminOnly = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403); // 403 Forbidden
        throw new Error('access denied. required role admin');
    }
};

// /api/offices
router.route('/')
    .get(getAllOffices)// GET /api/offices:
    .post(protect, adminOnly, createOffice);// POST /api/offices:

// /api/offices/:id 
router.route('/:id')
    .get(getByIdOffice)// GET /api/offices/:id:
    .put(protect, adminOnly, updateOffice)// PUT /api/offices/:id:
    .delete(protect, adminOnly, deleteOffice);// DELETE /api/offices/:id

export default router;