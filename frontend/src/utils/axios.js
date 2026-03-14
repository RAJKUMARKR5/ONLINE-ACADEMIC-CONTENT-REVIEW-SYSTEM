import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust if backend runs on a different port
});

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
