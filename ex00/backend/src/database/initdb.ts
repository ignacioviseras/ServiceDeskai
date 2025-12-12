
import mongoose from 'mongoose';
import { User } from '../models/userModel'; 
import { Office } from '../models/officeModel'; 
import { TicketModel } from '../models/ticketModel'; 

const OficeData = [
    { number: 1, city: 'Madrid', country: 'España', direction: 'Paseo de la Castellana 77' },
    { number: 2, city: 'Barcelona', country: 'España', direction: 'Carrer de Tuset 8' },
    { number: 3, city: 'Buenos Aires', country: 'Argentina', direction: 'Avenida del Libertador 1000' },
    { number: 4, city: 'Bogota', country: 'Colombia', direction: 'Carrera 7 # 120-20' },
    { number: 5, city: 'Nueva York', country: 'Estados Unidos', direction: '1500 Broadway' },
    { number: 6, city: 'Londres', country: 'Reino Unido', direction: '10 Greycoat Place' },
    { number: 7, city: 'Ciudad de Mexico', country: 'Mexico', direction: 'Paseo de la Reforma 250' },
];

//create the admin user if not exist
async function createAdminUser(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    if (!adminEmail || !adminPassword || !adminName) {
        console.error('ERROR: ADMIN_EMAIL ADMIN_PASSWORD ADMIN_NAME not defined in .env');
        process.exit(1);
    }

    try {
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Status creation: OK');
        } else
            console.log('Admin already exist');
    } catch (error) {
        console.error('Status creation AdminUser: KO\n', error);
    }
}

async function addOficeData(): Promise<void> {
    try {
        for (const office of OficeData) {
            const existingOffice = await Office.findOne({ number: office.number });
            if (!existingOffice)
                await Office.create(office);
        }
		console.log('addOficeData: OK');
    } catch (error) {
        console.error('addOficeData: KO\n', error);
    }
}

export async function initdb(): Promise<void> {
    console.log('--- Init db ---');
    await createAdminUser();
    await addOficeData();
    console.log('--- db finish ---');
}