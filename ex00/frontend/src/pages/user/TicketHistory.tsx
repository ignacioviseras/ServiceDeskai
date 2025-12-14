// En tu archivo TicketHistory.tsx

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getMyTickets, reset } from '../../features/tickets/ticketSlice';
import { Link } from 'react-router-dom';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

type TicketStatus = 'new' | 'assigned' | 'process' | 'closed';

const TicketHistory: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tickets, isLoading, isError, message } = useAppSelector((state) => state.tickets);
    const [showOpen, setShowOpen] = React.useState(true);
    const [showClosed, setShowClosed] = React.useState(false);

    useEffect(() => {
        dispatch(getMyTickets());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'new': return 'bg-red-100 text-red-800 border-red-500';
            case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
            case 'process': return 'bg-blue-100 text-blue-800 border-blue-500';
            case 'closed': return 'bg-green-100 text-green-800 border-green-500';
            default: return 'bg-gray-100 text-gray-800 border-gray-500';
        }
    };
    const openTickets = (tickets ?? []).filter(t => t.state !== 'closed');
    const closedTickets = (tickets ?? []).filter(t => t.state === 'closed');

    if (isLoading) {
        return <h1 className="text-xl text-center mt-8">Cargando tu historial de reportes...</h1>;
    }
    return (
        <div className="p-4 max-w-xl mx-auto pb-24">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-indigo-700">Reportes</h1>
                <Link
                    to="/reports/new"
                    className="flex items-center bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition"
                    title="Crear Nuevo Reporte"
                >
                    <Plus className="h-5 w-5" />
                </Link>
            </div>

            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
                    Error al cargar reportes: {message}
                </div>
            )}

            <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
                <button
                    onClick={() => setShowOpen(!showOpen)}
                    className="flex justify-between items-center w-full text-xl font-semibold text-gray-800 py-2 focus:outline-none border-b mb-2"
                >
                    Reportes Abiertos ({openTickets.length})
                    {showOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showOpen && (
                    <div className="mt-4 space-y-3">
                        {openTickets.length > 0 ? (
                            openTickets.map((ticket) => (
                                <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="block bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition duration-150 border-l-4 border-yellow-500">
                                    <h3 className="text-lg font-medium truncate">{ticket.title}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm text-gray-500">Oficina ID: {ticket.office?.slice(-4) ?? 'N/A'}</p>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(ticket.state)} capitalize`}>
                                            {ticket.state.replace('_', ' ')}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No tienes reportes activos.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <button
                    onClick={() => setShowClosed(!showClosed)}
                    className="flex justify-between items-center w-full text-xl font-semibold text-gray-800 py-2 focus:outline-none border-b mb-2"
                >
                    Reportes Cerrados ({closedTickets.length})
                    {showClosed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showClosed && (
                    <div className="mt-4 space-y-3">
                        {closedTickets.length > 0 ? (
                            closedTickets.map((ticket) => (
                                <Link to={`/tickets/${ticket._id}`} key={ticket._id} className="block bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition duration-150 opacity-75 border-l-4 border-green-500">
                                    <h3 className="text-lg font-medium truncate">{ticket.title}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm text-gray-500">Oficina ID: {ticket.office?.slice(-4) ?? 'N/A'}</p>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 capitalize`}>
                                            Cerrado
                                        </span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No tienes reportes cerrados.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketHistory;