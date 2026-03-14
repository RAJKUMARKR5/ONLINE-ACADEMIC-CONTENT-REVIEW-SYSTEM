import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    if (location.pathname === '/viewer') return null;

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md p-4">
            <div className={`container mx-auto flex items-center min-h-[40px] ${!user ? 'justify-between' : 'justify-between'}`}>
                {/* Left side spacer to help centering when no user */}
                {!user && <div className="flex-1 hidden md:block"></div>}

                {/* Title */}
                <Link 
                    to="/" 
                    className={`text-sm sm:text-lg md:text-2xl font-bold text-blue-600 whitespace-nowrap z-0 ${!user ? 'flex-1 text-center' : ''}`}
                >
                    Online Academic Content Review System
                </Link>

                {/* Right side Actions */}
                <div className={`flex space-x-4 items-center justify-end relative z-10 bg-white md:bg-transparent px-2 md:px-0 ${!user ? 'flex-1' : ''}`}>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">Dashboard</Link>
                            {user.role === 'Author' && (
                                <Link to="/submit-content" className="text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap">Submit Content</Link>
                            )}
                            <span className="text-gray-700 flex items-center gap-2 whitespace-nowrap hidden sm:flex">
                                <User size={18} />
                                {user.name} ({user.role})
                            </span>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition whitespace-nowrap"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-600 font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
