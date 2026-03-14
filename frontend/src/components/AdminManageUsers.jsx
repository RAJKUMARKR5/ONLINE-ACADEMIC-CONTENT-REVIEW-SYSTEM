import React, { useState } from 'react';
import { Trash2, User, Search, UserCheck, Shield, BookOpen, AlertCircle, Lock, UserX } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AdminManageUsers = ({ users, fetchUsers }) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const isPrimaryAdmin = currentUser?.email === 'kr48392425@gmail.com';
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const handleApprove = async (userId) => {
        try {
            await axios.put(`/auth/${userId}/approve`);
            toast.success('User approved successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to approve user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDecline = async (userId) => {
        try {
            await axios.put(`/auth/${userId}/decline`);
            toast.success('User declined successfully');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to decline user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user permanently? This action cannot be undone.')) {
            try {
                await axios.delete(`/auth/users/${userId}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const numReviewers = users.filter(u => u.role === 'Reviewer' && u.status === 'Approved').length;
    const numAuthors = users.filter(u => u.role === 'Author' && u.status === 'Approved').length;
    const numAdmins = users.filter(u => u.role === 'Admin').length;
    const totalUsers = users.filter(u => u.status === 'Approved').length;

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Admin': return <Shield size={16} className="text-purple-600" />;
            case 'Reviewer': return <UserCheck size={16} className="text-[#10B981]" />;
            case 'Author': return <BookOpen size={16} className="text-blue-600" />;
            default: return <User size={16} className="text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* User Metrics Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
                        <p className="text-3xl font-extrabold text-gray-900">{totalUsers}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-xl">
                        <User size={24} className="text-gray-600" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Reviewers</p>
                        <p className="text-3xl font-extrabold text-gray-900">{numReviewers}</p>
                    </div>
                    <div className="p-3 bg-[#10B981]/10 rounded-xl">
                        <UserCheck size={24} className="text-[#10B981]" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Authors</p>
                        <p className="text-3xl font-extrabold text-gray-900">{numAuthors}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <BookOpen size={24} className="text-blue-600" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Admins</p>
                        <p className="text-3xl font-extrabold text-gray-900">{numAdmins}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-xl">
                        <Shield size={24} className="text-purple-600" />
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#1E293B] flex items-center px-2">
                    <User className="mr-2 text-[#2563EB]" /> Manage Accounts
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] text-gray-700 font-medium transition-shadow appearance-none pr-10 relative cursor-pointer min-w-[140px]"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right .5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                    >
                        <option value="All">All Roles</option>
                        <option value="Reviewer">Reviewers</option>
                        <option value="Author">Authors</option>
                        <option value="Admin">Admins</option>
                    </select>

                    {/* Search Bar */}
                    <div className="relative flex-1 sm:w-72">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] text-gray-700 transition-shadow"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                    </div>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Account Status</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertCircle size={48} className="text-gray-300 mb-4" />
                                            <p className="text-gray-500 font-medium text-lg">No users found</p>
                                            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search term</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                        
                                        {/* User Details */}
                                        <td className="py-4 px-6 min-w-[250px]">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] font-bold text-lg mr-4 flex-shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{user.name}</h3>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="inline-flex items-center text-xs font-semibold text-gray-600 bg-gray-100 py-1.5 px-3 rounded-lg border border-gray-200">
                                                <span className="mr-2">{getRoleIcon(user.role)}</span>
                                                {user.role}
                                            </div>
                                        </td>

                                        {/* Account Status */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                                user.status === 'Approved' 
                                                    ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                                                     : user.status === 'Declined'
                                                     ? 'bg-red-50 text-red-700 border border-red-200'
                                                     : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                    user.status === 'Approved' ? 'bg-[#10B981]' : user.status === 'Declined' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}></span>
                                                {user.status === 'Approved' ? 'Active' : user.status === 'Declined' ? 'Declined' : 'Pending Approval'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            {/* Logic for Primary Admin or Protected Admin status */}
                                            {isPrimaryAdmin ? (
                                                // Primary Admin can manage everyone EXCEPT themselves
                                                user.email !== currentUser.email ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        {user.status === 'Pending' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(user._id)}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] rounded-lg transition-all shadow-sm shadow-[#10B981]/20 border border-[#10B981]"
                                                                    title="Approve Account"
                                                                >
                                                                    <UserCheck size={16} className="mr-1.5" /> Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDecline(user._id)}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200"
                                                                    title="Decline Account"
                                                                >
                                                                    <UserX size={16} className="mr-1.5" /> Decline
                                                                </button>
                                                            </>
                                                        ) : user.status === 'Declined' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(user._id)}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-[#10B981] bg-white hover:bg-[#10B981]/5 rounded-lg transition-all border border-[#10B981]/30"
                                                                    title="Restore and Approve User"
                                                                >
                                                                    <UserCheck size={16} className="mr-1.5" /> Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(user._id)}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-red-600 bg-white hover:bg-red-50 rounded-lg transition-all border border-red-200"
                                                                    title="Delete User Permanently"
                                                                >
                                                                    <Trash2 size={16} className="mr-1.5" /> Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleDecline(user._id)}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-200 hover:border-red-600 bg-red-50/50"
                                                                    title="Decline User"
                                                                >
                                                                    <UserX size={16} className="mr-1.5" /> Decline
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(user._id)}
                                                                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-gray-200 ml-2"
                                                                    title="Delete User Permanently"
                                                                >
                                                                    <Trash2 size={16} className="mr-1.5" /> Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-semibold text-[#2563EB] italic px-2">Me (Primary)</span>
                                                )
                                            ) : (
                                                // Regular Admin View
                                                user.role === 'Admin' ? (
                                                    <span className="text-xs font-semibold text-gray-400 italic px-2">
                                                        {user.email === currentUser.email ? 'Me (Admin)' : 'Protected'}
                                                    </span>
                                                ) : (
                                                    <div className="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                                                        <Lock size={12} className="mr-1.5" /> Read Only
                                                    </div>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminManageUsers;
