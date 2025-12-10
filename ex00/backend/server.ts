import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from './src/middleware/errorMiddleware'; 
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes';
import officeRoutes from './src/routes/officeRoutes';
import expedientRoutes from './src/routes/expedientRoutes';
import { initdb } from './src/database/initdb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());// to use frontend
app.use(express.json());// allow serv to use json
app.use(express.urlencoded({ extended: false }));

const connectDB = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- MongoDB connected ---');
    } catch (error: unknown) { 
        // comprobación de tipo para acceder a propiedades de 'unknown'
        if (error instanceof Error) {
            console.error(`Database connection error: ${error.message}`);
        } else {
            console.error(`An unknown error occurred during database connection: ${error}`);
        }
        process.exit(1);
    }
};

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'backend response ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/expedients', expedientRoutes);

app.use(errorHandler);

//firts conect the db and if the connection si okey start the serv
connectDB().then(async () => {
    await initdb();
    app.listen(PORT, () =>
        console.log(`Express server running on port ${PORT}`)
    );
});