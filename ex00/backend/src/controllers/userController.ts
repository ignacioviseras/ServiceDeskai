import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'; 
import { User, IUser } from '../models/userModel';
import { CustomRequest } from '../middleware/authMiddleware';

const generateToken = (id: mongoose.Types.ObjectId) => {
    const secret = process.env.JWT_SECRET; 
	const expiresIn = process.env.REFRESH_TOKEN_EXPIRATION;
    if (!secret)
        throw new Error("ERROR: JWT_SECRET not defined");
    if (!expiresIn)
        throw new Error("ERROR: JWT_SECRET not defined");
    // ID de MongoDB para el payload del token.
    return jwt.sign({ id }, secret, {
        expiresIn: expiresIn as SignOptions['expiresIn'],
    });
};

/**
 * @route   POST /api/users
 */
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('fill out all the fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('user already exists');
    }

    // userSchema.pre('save') nos da la passwd en hash
    const user = await User.create({
        name,
        email,
        password,
        role: 'standard',
    });

    if (user) {
        res.status(201).json({ // code201 all okey -> create user
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), // crea el token de acceso
        });
    } else {
        res.status(400);
        throw new Error('invalid data user');
    }
});

/**
 * @route   POST /api/users/login
 */
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // use bcrypt.compare to compare the hash and the normal text
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({ // 200 OK
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id), // crea el token de acceso
        });
    } else {
        res.status(401); // 401 Unauthorized
        throw new Error('invalid passwd');
    }
});


/**
    get data from the user
 * @route   GET /api/users/me
 */
const getMe = asyncHandler(async (req: Request, res: Response) => {
    const customReq = req as CustomRequest;
    if (customReq.user) {
        res.status(200).json(customReq.user);
    } else {
        res.status(401);
        throw new Error('Not authorized');
    }
});

export { 
    registerUser,
    loginUser,
    getMe
};