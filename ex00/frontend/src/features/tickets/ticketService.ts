import axiosInstance from '../../config/axiosInstance'; 

const API_URL = 'tickets/';

export interface Ticket {
    _id: string;
    user: string;
    title: string;
    description: string;
    state: 'new' | 'assigned' | 'process' | 'closed'; 
    office: string;
    photo?: File;
    createdAt: string;
    updatedAt: string;
}

export interface TicketData {
    title: string;
    description: string;
    office: string;
    photo?: string | null;
}

const createTicket = async (ticketData: TicketData): Promise<Ticket> => {
    const response = await axiosInstance.post(API_URL, ticketData);
    return response.data;
};

const getMyTickets = async (): Promise<Ticket[]> => {
    const response = await axiosInstance.get(API_URL + 'mine'); 
    return response.data;
};

const getOpenTickets = async (): Promise<Ticket[]> => {
    const response = await axiosInstance.get(API_URL + '?status=open');
    return response.data;
};

const getTicketDetails = async (ticketId: string): Promise<Ticket> => {
    const response = await axiosInstance.get(API_URL + ticketId);
    return response.data;
};

const updateTicket = async (ticketId: string, updateData: Partial<TicketData>): Promise<Ticket> => {
    const response = await axiosInstance.put(API_URL + ticketId, updateData);
    return response.data;
};

const getAllTickets = async (): Promise<Ticket[]> => {
    const response = await axiosInstance.get(API_URL); 
    return response.data;
};

const ticketService = {
    createTicket,
    getMyTickets,
    getOpenTickets,
    getTicketDetails,
    updateTicket,
    getAllTickets,
};

export default ticketService;