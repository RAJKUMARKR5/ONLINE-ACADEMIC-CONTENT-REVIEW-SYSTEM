import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

const initialState = {
    users: [],
    allSubmissions: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Get all users (optional role filter)
export const getUsers = createAsyncThunk(
    'admin/getUsers',
    async (role, thunkAPI) => {
        try {
            const url = role ? `/auth/users?role=${role}` : '/auth/users';
            const response = await axios.get(url);
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

// Get all submissions
export const getAllSubmissions = createAsyncThunk(
    'admin/getAllSubmissions',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/submissions/all');
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

// Assign Reviewer
export const assignReviewer = createAsyncThunk(
    'admin/assignReviewer',
    async (assignmentData, thunkAPI) => {
        try {
            const response = await axios.post('/assignments', assignmentData);
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

// Update Submission Status (Publish/Reject)
export const updateSubmissionStatus = createAsyncThunk(
    'admin/updateSubmissionStatus',
    async (decisionData, thunkAPI) => {
        try {
            const { submissionId, status } = decisionData;
            const response = await axios.put(`/submissions/${submissionId}/decision`, { status });
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

// Delete a submission
export const deleteAdminSubmission = createAsyncThunk(
    'admin/deleteSubmission',
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

export const adminSlice = createSlice({
    name: 'admin',
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
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllSubmissions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllSubmissions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allSubmissions = action.payload;
            })
            .addCase(getAllSubmissions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(assignReviewer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(assignReviewer.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Reviewer assigned successfully';
            })
            .addCase(assignReviewer.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateSubmissionStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSubmissionStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Submission status updated successfully';
                // Update the array without needing to re-fetch
                const updatedSubmission = action.payload;
                const index = state.allSubmissions.findIndex(sub => sub._id === updatedSubmission._id);
                if (index !== -1) {
                    state.allSubmissions[index] = updatedSubmission;
                }
            })
            .addCase(updateSubmissionStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteAdminSubmission.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAdminSubmission.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.allSubmissions = state.allSubmissions.filter((sub) => sub._id !== action.payload.id);
                state.message = 'Submission deleted successfully';
            })
            .addCase(deleteAdminSubmission.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;
