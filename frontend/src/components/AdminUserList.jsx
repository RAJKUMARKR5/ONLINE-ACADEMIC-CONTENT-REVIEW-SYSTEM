import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/auth/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const approveUser = async (id) => {
        try {
            await axios.put(`/auth/${id}/approve`);
            // Refresh list or update local state
            setUsers(users.map(user =>
                user._id === id ? { ...user, isApproved: true } : user
            ));
        } catch (err) {
            toast.error('Failed to approve user');
        }
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const pendingUsers = users.filter(u => !u.isApproved);
    const approvedUsers = users.filter(u => u.isApproved);

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Pending Approvals ({pendingUsers.length})</h3>

            {pendingUsers.length === 0 ? (
                <p className="text-gray-500 mb-6">No pending users.</p>
            ) : (
                <div className="space-y-4 mb-8">
                    {pendingUsers.map(user => (
                        <div key={user._id} className="flex items-center justify-between border p-4 rounded bg-yellow-50">
                            <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                            </div>
                            <button
                                onClick={() => approveUser(user._id)}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                <CheckCircle size={18} /> Approve
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <h3 className="text-xl font-bold mb-4 mt-8">Active Users</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedUsers.map(user => (
                    <div key={user._id} className="border p-4 rounded flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                        </div>
                        <span className="text-green-600 text-sm font-medium">Active</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUserList;
