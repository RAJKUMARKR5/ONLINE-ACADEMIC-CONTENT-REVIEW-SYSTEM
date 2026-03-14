import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getMySubmissions, deleteSubmission, reset } from '../redux/submissionSlice';
import SubmissionList from '../components/SubmissionList';
import MainLayout from '../components/MainLayout';
import { PlusCircle, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { submissions, isLoading, isError, message } = useSelector(
        (state) => state.submission
    );
    
    // Default to 'dashboard' Tab for MainLayout
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(getMySubmissions());
        }

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, dispatch]);

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
    }, [isError, message]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
            dispatch(deleteSubmission(id))
                .unwrap()
                .then(() => toast.success("Submission deleted"))
                .catch((err) => toast.error(err || "Failed to delete submission"));
        }
    };

    if (isLoading) {
        return (
            <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="mb-8">
                     <Skeleton width={300} height={40} className="mb-2" />
                     <Skeleton width={200} height={20} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                     <Skeleton height={120} borderRadius={12} />
                     <Skeleton height={120} borderRadius={12} />
                     <Skeleton height={120} borderRadius={12} />
                     <Skeleton height={120} borderRadius={12} />
                </div>
                <div>
                     <Skeleton height={200} count={2} className="mb-4" borderRadius={12} />
                </div>
            </MainLayout>
        );
    }

    // Calculate Stats
    const totalSubmissions = submissions.length;
    const pendingReviews = submissions.filter(s => s.status === 'Pending').length;
    const approvedContent = submissions.filter(s => s.status === 'Accepted').length;
    const rejectedContent = submissions.filter(s => s.status === 'Rejected').length;

    const statCards = [
        { title: 'Total Submissions', value: totalSubmissions, icon: <FileText size={24} className="text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-100' },
        { title: 'Pending Reviews', value: pendingReviews, icon: <Clock size={24} className="text-yellow-600" />, bg: 'bg-yellow-50', border: 'border-yellow-100' },
        { title: 'Approved', value: approvedContent, icon: <CheckCircle size={24} className="text-green-600" />, bg: 'bg-green-50', border: 'border-green-100' },
        { title: 'Rejected', value: rejectedContent, icon: <XCircle size={24} className="text-red-600" />, bg: 'bg-red-50', border: 'border-red-100' },
    ];

    return (
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat, index) => (
                    <div key={index} className={`flex items-center p-6 rounded-2xl shadow-sm border ${stat.border}`}>
                        <div className={`p-4 rounded-xl ${stat.bg} mr-4`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submissions Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Recent Submissions</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and track your published content</p>
                    </div>
                </div>
                
                <SubmissionList submissions={submissions} onDelete={handleDelete} />
            </div>
            
        </MainLayout>
    );
};

export default Dashboard;
