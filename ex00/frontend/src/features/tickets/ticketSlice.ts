import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ticketService, { Ticket, TicketData } from './ticketService';

interface TicketState {
    tickets: Ticket[];
    currentTicket: Ticket | null;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    message: string;
}

const initialState: TicketState = {
    tickets: [],
    currentTicket: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

export const getMyTickets = createAsyncThunk(
    'tickets/getMy',
    async (_, thunkAPI) => {
        try {
            return await ticketService.getMyTickets();
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createTicket = createAsyncThunk(
    'tickets/create',
    async (ticketData: TicketData, thunkAPI) => {
        try {
            return await ticketService.createTicket(ticketData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyTickets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyTickets.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
                state.isLoading = false;
                state.tickets = action.payload;
            })
            .addCase(getMyTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })

            .addCase(createTicket.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tickets.unshift(action.payload); 
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            });
    },
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;