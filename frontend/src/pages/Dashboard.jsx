import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getMySubmissions, deleteSubmission, reset } from '../redux/submissionSlice';
import SubmissionList from '../components/SubmissionList';
import MainLayout from '../components/MainLayout';
import { PlusCircle, FileText, Clock } from 'lucide-react';
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
        console.log(`[Author] Delete triggered for submission ${id}`);
        
        if (window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
            // Use setTimeout to decouple from window.confirm (fixes Chrome event loop issue)
            setTimeout(() => {
                console.log(`[Author] Dispatching deleteSubmission for ${id}`);
                dispatch(deleteSubmission(id))
                    .unwrap()
                    .then(() => {
                        console.log(`[Author] Delete successful for ${id}`);
                        toast.success("Submission deleted");
                    })
                    .catch((err) => {
                        console.error(`[Author] Delete failed for ${id}:`, err);
                        toast.error(err || "Failed to delete submission");
                    });
            }, 0);
        }
    };

    if (isLoading) {
        return (
            <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="mb-8">
                     <Skeleton width={300} height={40} className="mb-2" />
                     <Skeleton width={200} height={20} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
    const statCards = [
        { title: 'Total Submissions', value: totalSubmissions, icon: <FileText size={24} className="text-white" />, bgIcon: 'linear-gradient(135deg, #3B82F6, #6366F1)', border: 'border-blue-100' },
        { title: 'Pending Reviews', value: pendingReviews, icon: <Clock size={24} className="text-white" />, bgIcon: 'linear-gradient(135deg, #F59E0B, #EF4444)', border: 'border-yellow-100' },
    ];

    return (
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 max-w-2xl">
                {statCards.map((stat, index) => (
                    <div key={index} className={`card-hover flex items-center p-6 rounded-2xl shadow-sm border ${stat.border} bg-white`}>
                        <div className="p-4 rounded-xl mr-4 shadow-md" style={{ background: stat.bgIcon }}>
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
