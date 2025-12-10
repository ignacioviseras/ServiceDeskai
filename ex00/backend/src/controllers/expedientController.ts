import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 
import { ExpedientModel, IExpedient } from '../models/expedientModel'; 
import { CustomRequest } from '../middleware/authMiddleware';

const checkExpedientAccess = (expedient: IExpedient, userId: string, userRole: string): boolean => {
    if (userRole === 'admin' || userRole === 'service desk') {//can see all expedients
        return true;
    }
    if (userRole === 'standard' && expedient.reporter.toString() === userId) {//can see only her expedients
        return true;
    }
    return false;
};


/**
 * @route   POST /api/expedients
 */
const createExpedient = asyncHandler(async (req: Request, res: Response) => {
    const { title, details, location_office, photo_evidence } = req.body;
    const customReq = req as CustomRequest;

    const userId = customReq.user?._id;

    if (!userId || !title || !location_office || !photo_evidence) {
        res.status(400);
        throw new Error('title, office and photo are required');
    }

    try {
        const expedient = await ExpedientModel.create({
            title,
            details,
            location_office: new mongoose.Types.ObjectId(location_office),
            reporter: new mongoose.Types.ObjectId(userId),
            photo_evidence,
            state: 'new',
        });

        const populatedExpedient = await expedient.populate('location_office', 'number city');
        res.status(201).json(populatedExpedient);
    } catch (error) {
        console.error(error);
        res.status(400);
        throw new Error('invalid data / error in creation expedient');
    }
});


/**
 * @route   GET /api/expedients
 */
const getAllExpedients = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    const { role, _id: userId } = customReq.user!;
    let filter = {};

    if (role === 'standard') {
        filter = { reporter: userId };//only see her expedients
    } 
	
    // servicedesk adn admin see all -> (filter = {})
    // servicedesk filter her expedients
    if (role === 'service desk' && req.query.assigned === 'me') {
        filter = { assigned_to: userId };
    }

    const expedients = await ExpedientModel.find(filter)
        .populate('reporter', 'name email role') 
        .populate('location_office', 'number city country')
        .populate('assigned_to', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(expedients);
});


/**
 * @route   GET /api/expedients/:id
 */
const getExpedientById = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    const expedient = await ExpedientModel.findById(req.params.id)
        .populate('reporter', 'name email role') 
        .populate('location_office', 'number city country')
        .populate('assigned_to', 'name email');
    
    if (!expedient) {
        res.status(404);
        throw new Error('Expedient not found');
    }

    // Chequeo de acceso usando la lógica compartida
    if (!checkExpedientAccess(expedient, customReq.user!._id, customReq.user!.role)) {
        res.status(403);
        throw new Error('access denied you dont have access to this expedient');
    }

    res.status(200).json(expedient);
});


/**
 * @route   PUT /api/expedients/:id
 */
const updateExpedient = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    const { role, _id: userId } = customReq.user!;

    //only service desk and admin can update
    if (role === 'standard') {
        res.status(403);
        throw new Error('access denied only service_desk/admin can updateExpedients');
    }

    const expedient = await ExpedientModel.findById(req.params.id);

    if (!expedient) {
        res.status(404);
        throw new Error('Expedient no encontrado');
    }

    // if a service desk updates the status to 'assigned' and is not assigned, it is self-assigned - like jira/azure
    if (role === 'service desk' && req.body.state === 'assigned' && !expedient.assigned_to) {
         req.body.assigned_to = userId;
    }

    const updatedExpedient = await ExpedientModel.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true } 
    ).populate('reporter', 'name email role') 
     .populate('location_office', 'number city country')
     .populate('assigned_to', 'name email');

    res.status(200).json(updatedExpedient);
});


/**
 * @route   DELETE /api/expedients/:id
 */
const deleteExpedient = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    if (customReq.user!.role !== 'admin') {
        res.status(403); 
        throw new Error('access denied only admin can delete Expedients');
    }
    
    const expedient = await ExpedientModel.findById(req.params.id);

    if (!expedient) {
        res.status(404);
        throw new Error('Expedient not found');
    }

    await ExpedientModel.deleteOne({ _id: req.params.id }); 
    
    res.status(200).json({ 
        message: `Expedient ${req.params.id} deleted` 
    });
});


export { 
    createExpedient, 
    getAllExpedients, 
    getExpedientById, 
    updateExpedient, 
    deleteExpedient 
};