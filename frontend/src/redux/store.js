import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import submissionReducer from './submissionSlice';
import reviewReducer from './reviewSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        submission: submissionReducer,
        review: reviewReducer,
        admin: adminReducer,
    },
});
