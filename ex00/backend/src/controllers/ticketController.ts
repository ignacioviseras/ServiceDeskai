import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 
import { TicketModel, ITicket } from '../models/ticketModel'; 
import { CustomRequest } from '../middleware/authMiddleware';

const checkTicketAccess = (ticket: ITicket, userId: string, userRole: string): boolean => {
    if (userRole === 'admin' || userRole === 'service_desk') {//can see all tickets
        return true;
    }
    if (userRole === 'standard' && ticket.reporter.toString() === userId) {//can see only her tickets
        return true;
    }
    return false;
};


/**
 * @route   POST /api/tickets
 */
const createTicket = asyncHandler(async (req: Request, res: Response) => {
    const { title, details, location_office, photo_evidence } = req.body;
    const customReq = req as CustomRequest;

    const userId = customReq.user?._id;

    if (!userId || !title || !location_office || !photo_evidence) {
        res.status(400);
        throw new Error('title, office and photo are required');
    }

    try {
        const ticket = await TicketModel.create({
            title,
            details,
            location_office: new mongoose.Types.ObjectId(location_office),
            reporter: new mongoose.Types.ObjectId(userId),
            photo_evidence,
            state: 'new',
        });

        const populatedTicket = await ticket.populate('location_office', 'number city');
        res.status(201).json(populatedTicket);
    } catch (error) {
        console.error(error);
        res.status(400);
        throw new Error('invalid data / error in creation ticket');
    }
});


/**
 * @route   GET /api/tickets
 */
const getAllTickets = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    const { role, _id: userId } = customReq.user!;
    let filter = {};

    if (role === 'standard') {
        filter = { reporter: userId };//only see her tickets
    } 
	
    // servicedesk adn admin see all -> (filter = {})
    // servicedesk filter her tickets
    if (role === 'service_desk' && req.query.assigned === 'me') {
        filter = { assigned_to: userId };
    }

    const tickets = await TicketModel.find(filter)
        .populate('reporter', 'name email role') 
        .populate('location_office', 'number city country')
        .populate('assigned_to', 'name email')
        .sort({ createdAt: -1 });

    res.status(200).json(tickets);
});


/**
 * @route   GET /api/tickets/:id
 */
const getTicketById = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    const ticket = await TicketModel.findById(req.params.id)
        .populate('reporter', 'name email role') 
        .populate('location_office', 'number city country')
        .populate('assigned_to', 'name email');
    
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    // Chequeo de acceso usando la logica compartida
    if (!checkTicketAccess(ticket, customReq.user!._id, customReq.user!.role)) {
        res.status(403);
        throw new Error('access denied you dont have access to this ticket');
    }

    res.status(200).json(ticket);
});


/**
 * @route   PUT /api/tickets/:id
 */
const updateTicket = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    const { role, _id: userId } = customReq.user!;

    //only service_desk and admin can update
    if (role === 'standard') {
        res.status(403);
        throw new Error('access denied only service_desk/admin can updateTickets');
    }

    const ticket = await TicketModel.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket no encontrado');
    }

    // if a service_desk updates the status to 'assigned' and is not assigned, it is self-assigned - like jira/azure
    if (role === 'service_desk' && req.body.state === 'assigned' && !ticket.assigned_to) {
         req.body.assigned_to = userId;
    }

    const updatedTicket = await TicketModel.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true } 
    ).populate('reporter', 'name email role') 
     .populate('location_office', 'number city country')
     .populate('assigned_to', 'name email');

    res.status(200).json(updatedTicket);
});


/**
 * @route   GET /api/tickets/mine
 */
const getMyTickets = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;
    
    // Busca tickets donde el campo 'user' coincida con el ID del usuario logueado
    const tickets = await TicketModel.find({ user: customReq.user!._id })
        .sort({ createdAt: -1 });

    res.status(200).json(tickets);
});

/**
 * @route   DELETE /api/tickets/:id
 */
const deleteTicket = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;

    if (customReq.user!.role !== 'admin') {
        res.status(403); 
        throw new Error('access denied only admin can delete Tickets');
    }
    
    const ticket = await TicketModel.findById(req.params.id);

    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    await TicketModel.deleteOne({ _id: req.params.id }); 
    
    res.status(200).json({ 
        message: `Ticket ${req.params.id} deleted` 
    });
});


export { 
    createTicket, 
    getAllTickets, 
    getMyTickets,
    getTicketById, 
    updateTicket, 
    deleteTicket 
};