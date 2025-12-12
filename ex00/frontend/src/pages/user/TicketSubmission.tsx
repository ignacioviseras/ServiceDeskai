import React from 'react';

const TicketSubmission: React.FC = () => {
    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-green-700">🚨 Reportar Nueva Incidencia</h1>
            <p className="text-gray-600 mb-8">Selecciona la oficina e incluye una foto como evidencia.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-500">
                    Formulario de envío de tickets...
                </p>
            </div>
        </div>
    );
}

export default TicketSubmission;