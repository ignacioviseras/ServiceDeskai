const mongoose = require('mongoose');

// Definición del esquema (Schema) para el Ticket
const ticketSchema = mongoose.Schema(
    {
        // El usuario que crea el ticket (será una referencia al modelo de Usuario más adelante)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Asumimos que tendrás un modelo de 'User'
        },
        // El tipo de producto o servicio al que se refiere el ticket
        product: {
            type: String,
            required: [true, 'Por favor, selecciona un producto'],
            enum: ['iPhone', 'Macbook Pro', 'iPad', 'Servicio Externo'], // Opciones predefinidas
        },
        // La descripción del problema
        description: {
            type: String,
            required: [true, 'Por favor, añade una descripción del problema'],
        },
        // El estado actual del ticket
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

module.exports = mongoose.model('Ticket', ticketSchema);