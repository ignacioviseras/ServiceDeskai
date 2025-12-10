import mongoose, { Schema, Document, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs'; // Asegúrate de instalar bcryptjs

// 1. Interfaz de Usuario (Exportada para uso externo)
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'standard' | 'service desk' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            lowercase: true, 
            required: [true, 'Por favor, introduce un nombre'],
        },
        email: {
            type: String,
            required: [true, 'Por favor, introduce un email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Por favor, introduce una contraseña'],
        },
        role: {
            type: String,
            lowercase: true,
            enum: ['standard', 'service desk', 'admin'],
            default: 'standard',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        
        // hashea la contraseña y pasa el texto plano
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw new Error('Error al hashear la contraseña.');
    }
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export { User };