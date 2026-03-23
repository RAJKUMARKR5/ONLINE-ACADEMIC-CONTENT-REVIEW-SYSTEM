import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/authSlice';
import { BookOpen, Loader2, UserPlus, CheckCircle, ShieldCheck } from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { toast } from 'react-toastify';
import ErrorBoundary from '../components/ErrorBoundary';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        email: '',
        password: '',
    });

    const { name, role, email, password } = formData;
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error, success } = useSelector((state) => state.auth);

    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    const [googleScriptError, setGoogleScriptError] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            if (window.google?.accounts?.id || window._gsiLoaded) {
                setGoogleScriptLoaded(true);
                setGoogleScriptError(false);
                return true;
            }
            if (window._gsiError) {
                setGoogleScriptError(true);
                setGoogleScriptLoaded(false);
                return true;
            }
            return false;
        };

        if (!checkStatus()) {
            const interval = setInterval(() => {
                if (checkStatus()) clearInterval(interval);
            }, 1000);

            const timeout = setTimeout(() => {
                if (!window.google?.accounts?.id && !window._gsiLoaded) {
                    setGoogleScriptError(true);
                }
                clearInterval(interval);
            }, 10000);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, []);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
            dispatch(reset());
        }
    }, [user, success, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        if (error) {
            dispatch(reset());
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        if (!role || !name) {
            return toast.warning("Please enter your name and select a role before signing up with Google");
        }
        dispatch(register({ name, role, googleToken: credentialResponse.credential }));
    };

    const handleGoogleError = () => {
        toast.error("Google Registration Failed");
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!name || !role || !email || !password) {
            return toast.warning("Please fill in all fields to manually register");
        }
        dispatch(register({ name, role, email, password }));
    };

    const retryGoogleScript = () => {
        setGoogleScriptError(false);
        setGoogleScriptLoaded(false);
        const existingScript = document.querySelector('script[src*="gsi/client"]');
        if (existingScript) existingScript.remove();
        
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleScriptLoaded(true);
        script.onerror = () => setGoogleScriptError(true);
        document.head.appendChild(script);
    };

    if (success && !user) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
                <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                    <div className="bg-white py-12 px-4 shadow-xl shadow-green-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">
                        <CheckCircle size={56} className="text-[#10B981] mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-[#1E293B] mb-4">Registration Successful!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Your account has been created and is currently pending administrator approval.
                            You will receive an email once your account is activated.
                        </p>
                        <Link 
                            to="/login" 
                            onClick={() => dispatch(reset())}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none transition-colors"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #111b33 30%, #0d1a2d 60%, #0a0f1e 100%)' }}>
            {/* Animated decorative blobs */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" aria-hidden="true"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-violet-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" aria-hidden="true"></div>
            <div className="absolute -bottom-8 left-20 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000" aria-hidden="true"></div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center animate-slide-up">
                <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl shadow-xl animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6, #6366F1)' }}>
                        <BookOpen size={40} className="text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    Academic Content Review System
                </h1>
                <h2 className="mt-2 text-center text-sm text-emerald-300/80">
                    Create your researcher profile
                </h2>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
                <div className="py-8 px-4 shadow-2xl shadow-black/30 sm:rounded-2xl sm:px-10 border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                    
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <p className="text-sm text-red-700 font-medium">
                                {error}
                            </p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={onSubmit} autoComplete="off">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                                I am registering as
                            </label>
                            <div className="mt-1">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={role}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm text-gray-900 bg-gray-50 hover:bg-white transition-colors"
                                >
                                    <option value="" disabled>-- Select Your Role --</option>
                                    <option value="Author">Author</option>
                                    <option value="Reviewer">Reviewer</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm text-gray-900 bg-gray-50 hover:bg-white transition-colors"
                                    placeholder="Dr. Jane Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    required
                                    value={email}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm transition-colors text-gray-900 bg-gray-50 hover:bg-white"
                                    placeholder="scholar@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm transition-colors text-gray-900 bg-gray-50 hover:bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-premium w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-600/30 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6, #6366F1)' }}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                ) : (
                                    <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                                )}
                                {loading ? 'Processing...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <div className="w-full flex justify-center mt-2 border border-gray-100 rounded-lg p-1 min-h-[50px] items-center">
                                 {(role && name) ? (
                                    <ErrorBoundary>
                                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
                                                {!googleScriptLoaded && !googleScriptError && (
                                                    <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-100 mb-2 text-center flex items-center justify-center">
                                                        <Loader2 className="animate-spin h-3 w-3 mr-2" />
                                                        Connecting to Google services...
                                                    </div>
                                                )}
                                                {googleScriptError && (
                                                    <div className="text-xs text-red-600 bg-red-50 p-4 rounded border border-red-100 mb-2 text-center w-full">
                                                        <p className="font-bold text-red-700 mb-2 underline">Google Sign-Up is blocked.</p>
                                                        <p className="mb-4 text-gray-700 leading-relaxed">Please use the manual registration form above.</p>
                                                        <button 
                                                            type="button"
                                                            onClick={retryGoogleScript}
                                                            className="text-gray-500 hover:text-gray-800 text-[11px] underline font-medium"
                                                        >
                                                            Try Connecting Again
                                                        </button>
                                                    </div>
                                                )}
                                                <div className={!googleScriptLoaded ? 'hidden' : 'block'}>
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleSuccess}
                                                        onError={handleGoogleError}
                                                        useOneTap
                                                        theme="outline"
                                                        size="large"
                                                        width="100%"
                                                        text="signup_with"
                                                        shape="rectangular"
                                                    />
                                                </div>
                                        </GoogleOAuthProvider>
                                    </ErrorBoundary>
                                 ) : (
                                     <div 
                                        className="w-full text-center p-3 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded cursor-not-allowed"
                                        onClick={() => toast.warning("Please enter your name and select a role above first.")}
                                     >
                                         Enter Name & Role to enable Google Sign Up
                                     </div>
                                 )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center text-sm">
                        <span className="text-gray-500 mr-1">Already have an account?</span>
                        <Link to="/login" className="font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
