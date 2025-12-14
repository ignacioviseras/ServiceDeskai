import { Schema, model, Document, Types, Model } from 'mongoose';

export interface ITicket extends Document {
    title: string;
    details: string; 
    reporter: Types.ObjectId; 
    location_office: Types.ObjectId; 
    assigned_to?: Types.ObjectId; 
    state: 'new' | 'assigned' | 'process' | 'closed'; 
    photo_evidence: string; 
    shared_with?: string; 
    createdAt: Date;
    updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>({
    title: {
        type: String,
        required: [true, 'required field'],
        trim: true,
        maxlength: [100, 'max 100 characters']
    },
    details: {
        type: String,
        trim: true,
        maxlength: [5000, 'max 5000 characters']
    },
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User', //userModel
        required: true,
    },
    location_office: {
        type: Schema.Types.ObjectId,
        ref: 'Office', //officeModel
        required: true,
    },
    assigned_to: {
        type: Schema.Types.ObjectId,
        ref: 'User', //userModel
        default: null,
    },
    state: {
        type: String,
        enum: ['new', 'assigned', 'investigating', 'resolved', 'closed'],
        default: 'new',
    },
    photo_evidence: {
        type: String,
        required: [true, 'required photo'],
    },
    shared_with: {
        type: String,
        trim: true,
        default: null,
    }
}, {
    timestamps: true
});

export const TicketModel: Model<ITicket> = model<ITicket>('Ticket', ticketSchema);