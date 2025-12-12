import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; 
import ticketReducer from '../features/tickets/ticketSlice';
import officeReducer from '../features/offices/officeSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer, 
		tickets: ticketReducer,
        offices: officeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;