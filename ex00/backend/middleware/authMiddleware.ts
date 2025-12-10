import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 
import { User } from '../models/userModel'; 

interface IDecodedToken extends JwtPayload {
    id: mongoose.Types.ObjectId; //tokenid in mongo
}

interface IUserPayload {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export interface CustomRequest extends Request {
    user?: IUserPayload; 
}

const protect = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IDecodedToken;//decode passwd
            const userDoc = await User.findById(decoded.id).select('-password');
            if (userDoc) {
                // y mapeamos _id a string ANTES de asignarlo a req.user para que coincida con IUserPayload.
                const userObject = userDoc.toObject();
                req.user = {
                    _id: userObject._id.toString(),
                    name: userObject.name,
                    email: userObject.email,
                    role: userObject.role,
                } as IUserPayload; 
                
            } else {
                res.status(401);
                throw new Error('Usuario no encontrado');
            }

            next();

        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('No autorizado, token fallido');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('No autorizado, no hay token');
    }
});

export { protect };