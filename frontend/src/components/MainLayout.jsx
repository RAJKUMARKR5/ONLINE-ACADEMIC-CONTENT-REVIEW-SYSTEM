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
        <div className="flex h-screen font-sans text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 flex flex-col transition-all duration-300 shadow-2xl" style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #111b33 50%, #0f172a 100%)' }}>
                <div className="p-5 border-b border-white/10">
                    <h1 className="text-lg font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, #60A5FA, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>OACRS</h1>
                    <p className="text-xs text-blue-400/60 mt-0.5">{user?.role === 'Author' ? 'Author Portal' : 'Reviewer Portal'}</p>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                navigate(item.path);
                            }}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                (activeTab === item.id || window.location.pathname === item.path)
                                    ? 'bg-gradient-to-r from-blue-600/25 to-cyan-600/15 text-white font-semibold shadow-lg shadow-blue-500/10 border border-blue-400/25'
                                    : 'text-gray-400 hover:bg-white/8 hover:text-white'
                            }`}
                        >
                            <span className={`mr-3 ${(activeTab === item.id || window.location.pathname === item.path)? 'text-blue-400' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}                     
                    {user?.role === 'Admin' && (
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-white/10 hover:text-white mt-2"
                         >
                            <span className="mr-3 text-red-400"><ShieldAlert size={20}/></span>
                            Admin Panel
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-white/10">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-red-500/20 rounded-xl text-sm font-medium text-red-300 bg-red-500/5 hover:bg-red-500/15 hover:text-red-200 focus:outline-none transition-all">
                        <LogOut size={16} className="mr-2 text-red-400" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-mesh-gradient" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 50%, #f0f4f8 100%)' }}>
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-8 z-10 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight capitalize">
                         {navItems.find(item => item.id === activeTab)?.label || 'Overview'}
                    </h2>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end hidden md:flex">
                           <span className="text-sm font-semibold text-gray-900">{user?.name}</span>
                           <span className="text-xs text-white bg-blue-600 px-2.5 py-0.5 rounded-full mt-0.5 font-medium">{user?.role}</span>
                        </div>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-400/30" style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4, #10B981)' }}>
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
