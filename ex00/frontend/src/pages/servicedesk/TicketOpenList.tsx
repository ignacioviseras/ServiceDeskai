import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAllTickets, reset } from '../../features/tickets/ticketSlice'; 
import { Link } from 'react-router-dom';

type TicketStatus = 'new' | 'assigned' | 'process' | 'closed';

const TicketOpenList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tickets, isLoading, isError, message } = useAppSelector((state) => state.tickets);

    useEffect(() => {
        dispatch(getAllTickets());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);
    
    const openTickets = (tickets ?? []).filter(t => t.state !== 'closed');
    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'new': return 'bg-red-100 text-red-800 border-red-500';
            case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
            case 'process': return 'bg-blue-100 text-blue-800 border-blue-500';
            default: return 'bg-gray-100 text-gray-800 border-gray-500';
        }
    };

    if (isLoading) {
        return <h1 className="text-xl text-center mt-8">Cargando la lista de tickets...</h1>;
    }
    
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">🎫 Tickets Abiertos / Asignados</h1>
            <p className="text-gray-600 mb-8">Revisa y gestiona las incidencias reportadas por los usuarios.</p>

            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                    Error al cargar la lista general: {message}
                </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                {openTickets.length > 0 ? (
                    <div className="space-y-3">
                        {openTickets.map((ticket) => (
                            <Link 
                                to={`/tickets/${ticket._id}`}
                                key={ticket._id} 
                                className="block bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition duration-150 border-l-4 border-blue-500"
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium truncate">{ticket.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(ticket.state)} capitalize`}>
                                        {ticket.state.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Oficina ID: {ticket.office?.slice(-4) ?? 'N/A'}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No hay tickets abiertos que mostrar.</p>
                )}
            </div>
        </div>
    );
}

export default TicketOpenList;