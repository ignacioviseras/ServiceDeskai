import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from './authService';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'service_desk' | 'standard'; 
    token: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
}

const user = JSON.parse(localStorage.getItem('user') || 'null');

const initialState: AuthState = {
    user: user,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const login = createAsyncThunk(
    'auth/login',
    async (userData: any, thunkAPI) => {
        try {
            return await authService.login(userData);
        } catch (error: any) {
            const message = 
				(error.response && error.response.data && error.response.data.message) || 
				error.message || 
				error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
});

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, thunkAPI) => {
        try {
            return await authService.register(userData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
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
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isError = false; 
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false; 
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload as string;
                state.user = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload as string;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isSuccess = false;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;