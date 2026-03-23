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
        role: 'Author',
        email: '', // Obtained from Google
        googleToken: '', // Verified token
    });

    const [isVerified, setIsVerified] = useState(false);
    const { name, role, email, googleToken } = formData;
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error, success } = useSelector((state) => state.auth);

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
        // Decode token basic info just for UI email display (actual verification happens on backend)
        try {
            const base64Url = credentialResponse.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            
            setFormData(prev => ({
                ...prev,
                email: payload.email,
                googleToken: credentialResponse.credential
            }));
            setIsVerified(true);
            toast.success("Identity verified via Google");
        } catch (e) {
            toast.error("Failed to process Google verification");
        }
    };

    const handleGoogleError = () => {
        toast.error("Google Verification Failed");
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!isVerified) {
            return toast.warning("Please verify your identity with Google first");
        }
        dispatch(register({ name, role, googleToken }));
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

                    <form className="space-y-6" onSubmit={onSubmit}>
                        {/* Step 1: Basic Info */}
                        <div className="space-y-4">
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
                                        disabled={isVerified}
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm text-gray-900 bg-gray-50 hover:bg-white transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                                        placeholder="Dr. Jane Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                                    Primary Role
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="role"
                                        name="role"
                                        value={role}
                                        onChange={onChange}
                                        disabled={isVerified}
                                        className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm text-gray-900 bg-gray-50 hover:bg-white transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                                    >
                                        <option value="Author">Author</option>
                                        <option value="Reviewer">Reviewer</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Google Verification */}
                        <div className="pt-4 border-t border-gray-100">
                            {!isVerified ? (
                                <div className="space-y-3">
                                    <p className="text-xs text-gray-500 font-medium">Verify your email with Google:</p>
                                    <div className="flex justify-center border border-gray-100 rounded-xl p-1 bg-gray-50/50">
                                        <ErrorBoundary>
                                            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
                                                <GoogleLogin
                                                    onSuccess={handleGoogleSuccess}
                                                    onError={handleGoogleError}
                                                    theme="outline"
                                                    size="large"
                                                    width="100%"
                                                    text="signup_with"
                                                    shape="rectangular"
                                                />
                                            </GoogleOAuthProvider>
                                        </ErrorBoundary>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-green-50/50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ShieldCheck className="text-[#10B981] mr-3" size={24} />
                                        <div>
                                            <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Verified Identity</p>
                                            <p className="text-sm font-medium text-gray-700">{email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setIsVerified(false)}
                                        className="text-[10px] text-gray-400 hover:text-red-500 underline font-medium"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Registration Submit */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !isVerified}
                                className="btn-premium w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-600/30 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
