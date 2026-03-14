import React from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AdminOverview = ({ stats, submissions = [], users = [] }) => {
    // Expect stats object, or default to 0 if loading/error
    const { totalUsers = 0, totalSubmissions = 0, pendingReviews = 0, activeReviewers = 0 } = stats || {};

    const cards = [
        { title: 'Total Users', value: totalUsers, icon: <Users size={22} />, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
        { title: 'Total Submissions', value: totalSubmissions, icon: <FileText size={22} />, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20' },
        { title: 'Pending Reviews', value: pendingReviews, icon: <Clock size={22} />, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
        { title: 'Active Reviewers', value: activeReviewers, icon: <CheckCircle size={22} />, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
    ];

    // Prepare data for PieChart (Submissions by Status)
    const statusCounts = submissions.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status]
    }));
    const COLORS = ['#eab308', '#3b82f6', '#10B981', '#ef4444']; // Yellow, Blue, Green, Red

    // Prepare data for BarChart (Users by Role)
    const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});
    const barData = Object.keys(roleCounts).map(role => ({
        name: role,
        count: roleCounts[role]
    }));

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#1E293B] tracking-tight mb-6">System Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color} ${card.border} border`}>
                                {card.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{card.value}</h3>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{card.title}</p>
                        </div>
                        
                        {/* Decorative background circle */}
                        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${card.bg} opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Pie Chart: Submission Status */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">Submissions By Status</h3>
                    <div className="h-72">
                        {submissions.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <FileText size={48} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">No submission data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bar Chart: Users by Role */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-100">Users By Role</h3>
                    <div className="h-72">
                        {users.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        allowDecimals={false} 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 13 }}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Users size={48} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">No user data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
