import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAssignments, reset } from '../redux/reviewSlice';
import AssignmentList from '../components/AssignmentList';
import { ListChecks, Clock, CheckCircle } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MainLayout from '../components/MainLayout';

const ReviewDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { assignments, isLoading, isError, message } = useSelector(
        (state) => state.review
    );

    const [activeTab, setActiveTab] = useState('Pending');
    const [sidebarTab, setSidebarTab] = useState('dashboard');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(getAssignments());
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

    const pendingAssignments = assignments ? assignments.filter((a) => a.status === 'Pending' && a.submission) : [];
    const completedAssignments = assignments ? assignments.filter((a) => a.status === 'Completed' && a.submission) : [];

    if (isLoading) {
        return (
            <MainLayout activeTab={sidebarTab} setActiveTab={setSidebarTab}>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <Skeleton width={300} height={40} className="mb-2" />
                        <Skeleton width={200} height={24} />
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <Skeleton height={60} className="mb-6 rounded-xl" />
                        <Skeleton height={80} count={5} className="mb-2 rounded-lg" />
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout activeTab={sidebarTab} setActiveTab={setSidebarTab}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight mb-2 flex items-center">
                            <ListChecks className="mr-3 text-[#2563EB]" size={32} /> 
                            Reviewer Dashboard
                        </h1>
                        <p className="text-gray-500 ml-11">Manage and evaluate your assigned academic submissions.</p>
                    </div>
                    
                    {/* Modern Tabs */}
                    <div className="flex bg-gray-100/80 p-1.5 rounded-xl border border-gray-200">
                        <button
                            onClick={() => setActiveTab('Pending')}
                            className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'Pending' 
                                    ? 'bg-white text-[#2563EB] shadow-sm ring-1 ring-gray-200/50' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                            }`}
                        >
                            <Clock size={16} className={`mr-2 ${activeTab === 'Pending' ? 'text-[#2563EB]' : 'text-gray-400'}`} />
                            Pending
                            {pendingAssignments.length > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                                    activeTab === 'Pending' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {pendingAssignments.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('History')}
                            className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                activeTab === 'History' 
                                    ? 'bg-white text-[#10B981] shadow-sm ring-1 ring-gray-200/50' 
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                            }`}
                        >
                            <CheckCircle size={16} className={`mr-2 ${activeTab === 'History' ? 'text-[#10B981]' : 'text-gray-400'}`} />
                            History
                            {completedAssignments.length > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                                    activeTab === 'History' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {completedAssignments.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <AssignmentList assignments={activeTab === 'Pending' ? pendingAssignments : completedAssignments} />
                </div>
            </div>
        </MainLayout>
    );
};

export default ReviewDashboard;
