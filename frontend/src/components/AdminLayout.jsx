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
        { id: 'assign', label: 'Assign Papers', icon: <FileText size={20} /> },
        { id: 'manage', label: 'Manage Users', icon: <Users size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
                <div className="p-4 border-b border-gray-200"></div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                                activeTab === item.id
                                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <span className={`mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100">
                         <a
                            href="/viewer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <span className="mr-3 text-gray-400">
                                <Eye size={20} />
                            </span>
                            Public Viewer
                        </a>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-shadow"
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
                        {menuItems.find(item => item.id === activeTab)?.label || 'Admin Panel'}
                    </h2>

                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-end hidden md:flex">
                           <span className="text-sm font-semibold text-gray-900">{user?.name || 'Administrator'}</span>
                           <span className="text-xs text-gray-500 bg-gray-100 px-2 rounded-full mt-0.5">{user?.role || 'Admin'}</span>
                        </div>
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-blue-200 shadow-sm">
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
