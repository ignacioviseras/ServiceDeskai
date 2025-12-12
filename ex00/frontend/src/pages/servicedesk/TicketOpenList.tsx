import React from 'react';

const TicketOpenList: React.FC = () => {
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">🎫 Tickets Abiertos / Asignados</h1>
            <p className="text-gray-600 mb-8">Revisa y gestiona las incidencias reportadas por los usuarios.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-500">
                    Tabla de listado de tickets...
                </p>
            </div>
        </div>
    );
}

export default TicketOpenList;