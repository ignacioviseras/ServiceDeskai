import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Office } from '../models/officeModel';
import { CustomRequest } from '../middleware/authMiddleware';


/**
 * @route GET /api/offices
 */
const getAllOffices = asyncHandler(async (req: Request, res: Response) => {
    const offices = await Office.find();
    res.status(200).json(offices);
});

/**
 * @route GET /api/offices/:id
 */
const getByIdOffice = asyncHandler(async (req: Request, res: Response) => {
    const office = await Office.findById(req.params.id);
    if (!office) {
        res.status(404);
        throw new Error('office id not exist');
    }
    res.status(200).json(office);
});

/**
 * @route POST /api/offices
 */
const createOffice = asyncHandler(async (req: Request, res: Response) => {
    const { number, city, country, direction } = req.body;
    const customReq = req as CustomRequest;

    // La comprobacion de rol de Admin se hace en la ruta, pero la validacion de datos es clave aqui
    if (!number || !city || !country || !direction) {
        res.status(400);
        throw new Error('empty fields');
    }
    
    try {
        const office = await Office.create({
            number,
            city,
            country,
            direction,
        });
        res.status(201).json(office);//create

    } catch (error: unknown) {
        if (error instanceof Error && (error as any).code === 11000) {
            res.status(400);
            throw new Error('the numb office allrady exists');
        }
        throw error;
    }
});


/**
 * @route   PUT /api/offices/:id
 */
const updateOffice = asyncHandler(async (req: Request, res: Response) => {
    const office = await Office.findById(req.params.id);

    if (!office) {
        res.status(404);
        throw new Error('office id not exist');
    }
	//update params
    const updatedOffice = await Office.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }//the new data is validate
    );

    res.status(200).json(updatedOffice);
});


/**
 * @route   DELETE /api/offices/:id
 */
const deleteOffice = asyncHandler(async (req: Request, res: Response) => {
    
    const office = await Office.findById(req.params.id);

    if (!office) {
        res.status(404);
        throw new Error('office id not exist');
    }

    await Office.deleteOne({ _id: req.params.id }); 
    res.status(200).json({ 
        message: `office id "${req.params.id}" deleted` 
    });
});


export { 
    getAllOffices, 
    getByIdOffice,
    createOffice, 
    updateOffice, 
    deleteOffice 
};