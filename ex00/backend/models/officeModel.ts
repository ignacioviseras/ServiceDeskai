import { Schema, model, Model, Document } from 'mongoose';

export interface IOffice extends Document {
    number: number;
    city: string;
    country: string;
    direction: string;
    createdAt: Date;
    updatedAt: Date;
}

const officeSchema = new Schema<IOffice>({
    number: {
        type: Number,
        required: true,
        unique: true,
        min: [1, 'you need at least 1'],
        validate: {
            validator: Number.isInteger,
            message: 'the num of office must be an int'
        }
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    direction: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
}, {
    timestamps: true
});

const Office: Model<IOffice> = model<IOffice>('Office', officeSchema);

export { Office };