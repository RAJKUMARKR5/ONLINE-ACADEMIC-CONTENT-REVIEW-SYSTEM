import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import {
    LayoutDashboard,
    FileText,
    Users,
    LogOut,
    Eye
} from 'lucide-react';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'assign', label: 'Assign/Publish Content', icon: <FileText size={20} /> },
        { id: 'manage', label: 'Manage Users', icon: <Users size={20} /> },
    ];

    return (
        <div className="flex h-screen font-sans text-gray-800" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)' }}>
            {/* Sidebar */}
            <aside className="w-64 flex flex-col transition-all duration-300 shadow-xl" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="p-5 border-b border-white/10">
                    <h1 className="text-lg font-bold text-white tracking-tight">Admin Panel</h1>
                    <p className="text-xs text-blue-300/70 mt-0.5">OACRS Management</p>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                                activeTab === item.id
                                    ? 'bg-blue-600/20 text-white font-semibold shadow-lg shadow-blue-500/10 border border-blue-400/20'
                                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <span className={`mr-3 ${activeTab === item.id ? 'text-blue-400' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-white/10">
                         <a
                            href="/viewer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                            <span className="mr-3 text-gray-500">
                                <Eye size={20} />
                            </span>
                            Public Viewer
                        </a>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-white/15 rounded-xl text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white focus:outline-none transition-all"
                    >
                        <LogOut size={16} className="mr-2 text-gray-400" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 50%, #f0f4f8 100%)' }}>
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-8 z-10 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight capitalize">
                        {menuItems.find(item => item.id === activeTab)?.label || 'Admin Panel'}
                    </h2>

                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end hidden md:flex">
                           <span className="text-sm font-semibold text-gray-900">{user?.name || 'Administrator'}</span>
                           <span className="text-xs text-white bg-blue-600 px-2.5 py-0.5 rounded-full mt-0.5 font-medium">{user?.role || 'Admin'}</span>
                        </div>
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}>
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 fade-in h-full">
                    <div className="max-w-7xl mx-auto h-full">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-full">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
