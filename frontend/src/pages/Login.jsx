import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, googleLogin, reset } from '../redux/authSlice';
import { LogIn, BookOpen, Loader2, CheckCircle } from 'lucide-react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from '../components/ErrorBoundary';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: '',
    });

    const { email, password, role } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, loading, error, success } = useSelector((state) => state.auth);
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
    const [googleScriptError, setGoogleScriptError] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            if (window.google?.accounts?.id || window._gsiLoaded) {
                setGoogleScriptLoaded(true);
                setGoogleScriptError(false); // Reset error if loaded
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
    useEffect(() => {
        // Only auto-redirect to dashboard if this was a SUCCESSFUL login attempt
        // OR if the user is already logged in but NOT on the login page (handled by ProtectedRoute)
        if (user && success) {
            navigate('/dashboard');
        }
    }, [user, success, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        if (error) {
            dispatch(reset());
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!role) {
            return alert("Please select your role");
        }
        dispatch(login({ email, password, role }));
    };

    const handleGoogleSuccess = (credentialResponse) => {
        if (!role) {
            return alert("Please select a role before signing in with Google (Author or Reviewer)");
        }
        dispatch(googleLogin({ token: credentialResponse.credential, role }));
    };

    const handleGoogleError = () => {
         alert('Google Login Failed');
    };


    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
            {/* Animated decorative blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" aria-hidden="true"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" aria-hidden="true"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-4000" aria-hidden="true"></div>

            <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}>
                        <BookOpen size={40} className="text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    Academic Content Review System
                </h1>
                <h2 className="mt-2 text-center text-sm text-blue-200">
                    Sign in to your account
                </h2>
            </div>

            <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-2xl shadow-black/20 sm:rounded-2xl sm:px-10 border border-white/20">
                    
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700 font-medium">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={onSubmit} autoComplete="off">
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="role">
                                I am logging in as
                            </label>
                            <div className="mt-1">
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={role}
                                    onChange={onChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] sm:text-sm transition-colors text-gray-900 bg-gray-50 hover:bg-white"
                                >
                                    <option value="" disabled>-- Select Your Role --</option>
                                    <option value="Author">Author</option>
                                    <option value="Reviewer">Reviewer</option>
                                    <option value="Admin">Admin</option>
                                </select>
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
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                ) : (
                                    <LogIn className="-ml-1 mr-2 h-5 w-5" />
                                )}
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <div className="w-full flex justify-center mt-2 border border-gray-100 rounded-lg p-1 min-h-[50px] items-center">
                                 {role ? (
                                    <ErrorBoundary>
                                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'}>
                                                {!googleScriptLoaded && !googleScriptError && (
                                                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100 mb-2 text-center flex items-center justify-center">
                                                        <Loader2 className="animate-spin h-3 w-3 mr-2" />
                                                        Connecting to Google services...
                                                    </div>
                                                )}
                                                {googleScriptError && (
                                                    <div className="text-xs text-red-600 bg-red-50 p-4 rounded border border-red-100 mb-2 text-center w-full">
                                                        <p className="font-bold text-red-700 mb-2 underline">Google Sign-In is blocked in Chrome.</p>
                                                        <p className="mb-4 text-gray-700 leading-relaxed">This is caused by your browser's ad-blocker or security settings. Please use the button below instead:</p>
                                                        <div className="flex flex-col gap-3">
                                                            <button 
                                                                type="button"
                                                                onClick={() => {
                                                                    if (!role) return alert("Please select a role first");
                                                                    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                                                                    const redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
                                                                    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email&state=${role}&prompt=select_account`;
                                                                    window.location.href = googleAuthUrl;
                                                                }}
                                                                className="w-full bg-[#4285F4] text-white py-3 rounded-lg font-extrabold hover:bg-[#357ae8] transition-all shadow-md active:scale-[0.98]"
                                                            >
                                                                Sign in with Google (Fallback)
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={retryGoogleScript}
                                                                className="text-gray-500 hover:text-gray-800 text-[11px] underline font-medium"
                                                            >
                                                                Try Standard Method Again
                                                            </button>
                                                        </div>
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
                                                        text="continue_with"
                                                        shape="rectangular"
                                                    />
                                                </div>
                                        </GoogleOAuthProvider>
                                    </ErrorBoundary>
                                 ) : (
                                     <div 
                                        className="w-full text-center p-3 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded cursor-not-allowed"
                                        onClick={() => alert("Please select a role from the dropdown above first.")}
                                     >
                                         Select a role above to enable Google Sign In
                                     </div>
                                 )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between text-sm">
                        <Link to="/register" className="font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                            Create a new account
                        </Link>
                        <Link to="/viewer" className="font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center">
                            Enter as Public Viewer <span aria-hidden="true" className="ml-1">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
