import express from 'express';
// Importa las funciones controladoras de tickets (debes crearlas)
// import { 
//     getTickets, 
//     getTicket, 
//     createTicket, 
//     updateTicket, 
//     deleteTicket 
// } from '../controllers/ticketController'; 

// Importa el middleware de protección si lo tienes (es necesario para rutas privadas)
// import { protect } from '../middleware/authMiddleware'; 

const router = express.Router();

// Define las rutas para los tickets. 
// Asumimos que quieres proteger todas las rutas CRUD para que solo usuarios logueados puedan usarlas.

// 1. Obtener todos los tickets (R) y Crear un nuevo ticket (C)
// Si necesitas rutas anidadas (e.g., /api/tickets/:ticketId/notes), puedes importarlas aquí.
router.route('/')
    //.get(protect, getTickets)       // Requiere autenticación
    //.post(protect, createTicket);    // Requiere autenticación

// 2. Obtener un ticket específico (R), Actualizar (U) y Borrar (D)
router.route('/:id')
    //.get(protect, getTicket)        // Requiere autenticación
    //.put(protect, updateTicket)     // Requiere autenticación
    //.delete(protect, deleteTicket);  // Requiere autenticación

// 3. Exporta el router para que `server.ts` pueda usarlo
export default router;