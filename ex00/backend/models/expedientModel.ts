import { Schema, model, Document, Types, Model } from 'mongoose';

export interface IExpedient extends Document {
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

const expedientSchema = new Schema<IExpedient>({
    title: {
        type: String,
        required: [true, 'required field'],
        trim: true,
        maxlength: [100, 'max 100 characters']
    },
    details: {
        type: String,
        trim: true,
        maxlength: [500, 'max 500 characters']
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

export const ExpedientModel: Model<IExpedient> = model<IExpedient>('Expedient', expedientSchema);