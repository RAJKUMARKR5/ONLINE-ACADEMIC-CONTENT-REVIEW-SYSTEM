import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import { LogOut, LayoutDashboard, FileUp, List, UserCircle, ShieldAlert } from 'lucide-react';

const MainLayout = ({ children, activeTab, setActiveTab }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const getNavItems = () => {
        if (!user) return [];

        if (user.role === 'Author') {
             return [
                 { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
                 { id: 'submit', label: 'Submit Content', icon: <FileUp size={20} />, path: '/submit-content' },
             ];
        } else if (user.role === 'Reviewer') {
             return [
                 { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
             ];
        } else if (user.role === 'Admin') {
            return [
                 { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
            ];
        }
        return [];
    };

    const navItems = getNavItems();

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
                <div className="p-4 border-b border-gray-200"></div>
                
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                navigate(item.path);
                            }}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                                (activeTab === item.id || window.location.pathname === item.path)
                                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <span className={`mr-3 ${(activeTab === item.id || window.location.pathname === item.path)? 'text-blue-600' : 'text-gray-400'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                    
                    {user?.role === 'Admin' && (
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 mt-2"
                         >
                            <span className="mr-3 text-red-400"><ShieldAlert size={20}/></span>
                            Admin Panel
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-200">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-shadow"
                    >
                        <LogOut size={16} className="mr-2 text-gray-500" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight capitalize">
                         {navItems.find(item => item.id === activeTab)?.label || 'Overview'}
                    </h2>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end hidden md:flex">
                           <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                           <span className="text-xs text-gray-500 bg-gray-100 px-2 rounded-full mt-0.5">{user?.role}</span>
                        </div>
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200 shadow-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 fade-in h-full">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
