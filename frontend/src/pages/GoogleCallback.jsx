import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { googleLogin, reset } from '../redux/authSlice';
import { Loader2 } from 'lucide-react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const state = params.get('state'); // This contains the role

            if (!code || !state) {
                toast.error("Invalid response from Google");
                navigate('/login');
                return;
            }

            try {
                const response = await axios.post('/auth/google/code', { 
                    code, 
                    role: state 
                });

                if (response.data && response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    // Redirect to dashboard on success
                    window.location.href = '/dashboard';
                }
            } catch (err) {
                // Display the specific backend error (e.g., "Account not found" or "Pending approval")
                toast.error(err.response?.data?.message || "Authentication failed");
                navigate('/login');
            }
        };

        handleCallback();
    }, [location, dispatch, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
            <Loader2 size={48} className="text-[#2563EB] animate-spin mb-4" />
            <h2 className="text-xl font-bold text-[#1E293B]">Authenticating...</h2>
            <p className="text-gray-500">Please wait while we complete your login.</p>
        </div>
    );
};

export default GoogleCallback;
