import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import officeService, { Office, OfficeData, UpdateOfficeData } from './officeService';

interface OfficeState {
    offices: Office[];
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
}

const initialState: OfficeState = {
    offices: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};



export const getOffices = createAsyncThunk(
    'offices/getAll',
    async (_, thunkAPI) => {
        try {
            return await officeService.getOffices();
        } catch (error: any) {
            const message = (
                error.response &&
                error.response.data &&
                error.response.data.message) ||
                error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createOffice = createAsyncThunk<Office, OfficeData>( 
    'offices/create',
    async (officeData: OfficeData, thunkAPI) => {
        try {
            return await officeService.createOffice(officeData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updateOffice = createAsyncThunk<Office, UpdateOfficeData>( 
    'offices/update',
    async (officeData: UpdateOfficeData, thunkAPI) => {
        try {
            return await officeService.updateOffice(officeData);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteOffice = createAsyncThunk<string, string>(
    'offices/delete',
    async (id: string, thunkAPI) => {
        try {
            return await officeService.deleteOffice(id);
        } catch (error: any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const officeSlice = createSlice({
    name: 'offices',
    initialState,
    reducers: {
        reset: (state) => {
            Object.assign(state, initialState); 
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOffices.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false; 
            })
            .addCase(getOffices.fulfilled, (state, action: PayloadAction<Office[]>) => {
                state.isLoading = false;
                state.offices = action.payload;
            })
            .addCase(getOffices.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
                state.offices = [];
            })

            .addCase(createOffice.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(createOffice.fulfilled, (state, action: PayloadAction<Office>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.offices.unshift(action.payload);
            })
            .addCase(createOffice.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            
            .addCase(updateOffice.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(updateOffice.fulfilled, (state, action: PayloadAction<Office>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.offices = state.offices.map((office) => 
                    office._id === action.payload._id ? action.payload : office
                );
            })
            .addCase(updateOffice.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(deleteOffice.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
            })
            .addCase(deleteOffice.fulfilled, (state, action: PayloadAction<string>) => { // action.payload es el ID
                state.isLoading = false;
                state.isSuccess = true;
                state.offices = state.offices.filter((office) => office._id !== action.payload);
            })
            .addCase(deleteOffice.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            });
    },
});

export const { reset } = officeSlice.actions;
export default officeSlice.reducer;