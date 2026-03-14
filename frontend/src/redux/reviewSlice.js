import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

const initialState = {
    assignments: [],
    reviews: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Get assignments
export const getAssignments = createAsyncThunk(
    'reviews/getAssignments',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/reviews/assignments');
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Submit review
export const submitReview = createAsyncThunk(
    'reviews/submit',
    async (reviewData, thunkAPI) => {
        try {
            const response = await axios.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const reviewSlice = createSlice({
    name: 'review',
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
            .addCase(getAssignments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAssignments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.assignments = action.payload;
            })
            .addCase(getAssignments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(submitReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Optionally update the specific assignment status in state
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = reviewSlice.actions;
export default reviewSlice.reducer;
