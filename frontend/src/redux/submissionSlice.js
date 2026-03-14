import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

const initialState = {
    submissions: [],
    submission: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new submission
export const createSubmission = createAsyncThunk(
    'submissions/create',
    async (submissionData, thunkAPI) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await axios.post('/submissions', submissionData, config);
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

// Get user submissions
export const getMySubmissions = createAsyncThunk(
    'submissions/getAll',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/submissions/my');
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

// Delete submission
export const deleteSubmission = createAsyncThunk(
    'submissions/delete',
    async (id, thunkAPI) => {
        try {
            const response = await axios.delete(`/submissions/${id}`);
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

export const submissionSlice = createSlice({
    name: 'submission',
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
            .addCase(createSubmission.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSubmission.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.submissions.push(action.payload);
            })
            .addCase(createSubmission.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMySubmissions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMySubmissions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.submissions = action.payload;
            })
            .addCase(getMySubmissions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteSubmission.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSubmission.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.submissions = state.submissions.filter((sub) => sub._id !== action.payload.id);
            })
            .addCase(deleteSubmission.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = submissionSlice.actions;
export default submissionSlice.reducer;
