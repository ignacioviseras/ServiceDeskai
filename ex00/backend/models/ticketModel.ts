import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITicket extends Document {
    user: mongoose.Schema.Types.ObjectId;
    product: 'iPhone' | 'Macbook Pro' | 'iPad' | 'Servicio Externo';
    description: string;
    status: 'nuevo' | 'abierto' | 'cerrado';
    createdAt: Date;
    updatedAt: Date;
}

const ticketSchema: Schema<ITicket> = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Asumimos que tendrás un modelo de 'User'
        },
        product: {
            type: String,
            required: [true, 'Por favor, selecciona un producto'],
            enum: ['iPhone', 'Macbook Pro', 'iPad', 'Servicio Externo'], // Opciones predefinidas
        },
        description: {
            type: String,
            required: [true, 'Por favor, añade una descripción del problema'],
        },
        status: {
            type: String,
            required: true,
            enum: ['nuevo', 'abierto', 'cerrado'],
            default: 'nuevo',
        },
    },
    {
        // Mongoose añade automáticamente campos 'createdAt' y 'updatedAt'
        timestamps: true,
    }
);

// Usamos Model<ITicket> para tipar el objeto que interactúa con la base de datos
const TicketModel: Model<ITicket> = mongoose.model<ITicket>('Ticket', ticketSchema);

export default TicketModel;
