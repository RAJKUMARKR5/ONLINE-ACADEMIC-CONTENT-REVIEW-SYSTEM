import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsers, getAllSubmissions, assignReviewer, updateSubmissionStatus, deleteAdminSubmission, reset } from '../redux/adminSlice';
import AdminLayout from '../components/AdminLayout';
import AdminOverview from '../components/AdminOverview';
import AdminAssignPapers from '../components/AdminAssignPapers';
import AdminManageUsers from '../components/AdminManageUsers';
import SubmissionModal from '../components/SubmissionModal';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { users: reviewers, allSubmissions, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.admin
    );

    const [activeTab, setActiveTab] = useState('overview');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedReviewer, setSelectedReviewer] = useState('');
    const [allUsers, setAllUsers] = useState([]); // Define this here or use Redux if we expand adminSlice
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingSubmissionId, setViewingSubmissionId] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'Admin') {
            navigate('/login');
        } else {
            // Fetch initial data
            dispatch(getUsers('Reviewer'));
            dispatch(getAllSubmissions());
            fetchAllUsers();
        }

        return () => {
            dispatch(reset());
        };
    }, [user, navigate, dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
    }, [isError, message]);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get('/auth/users'); // We need a route for ALL users or reuse existing
            // The existing get users route filters by role if provided. If not, it returns all?
            // Let's check the backend... yes: if (role) query.role = role. So no role = all.
            setAllUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleAssign = (submissionId) => {
        console.log(`[Admin] Assigning reviewer ${selectedReviewer} to submission ${submissionId}`);
        if (!selectedReviewer) {
            toast.warning('Please select a reviewer');
            return;
        }
        dispatch(assignReviewer({ submissionId, reviewerId: selectedReviewer }))
            .unwrap()
            .then((data) => {
                toast.success('Reviewer assigned successfully');
                dispatch(getAllSubmissions());
                setSelectedSubmission(null);
                setSelectedReviewer('');
            })
            .catch((error) => {
                toast.error(error || 'Failed to assign reviewer');
            });
    };

    const handleDecision = (submissionId, status) => {
        console.log(`[Admin] Decision triggered for ${submissionId}: ${status}`);
        
        if (window.confirm(`Are you sure you want to mark this paper as ${status}?`)) {
            // Use setTimeout to decouple from window.confirm (fixes Chrome event loop issue)
            setTimeout(() => {
                console.log(`[Admin] Dispatching updateSubmissionStatus for ${status}`);
                dispatch(updateSubmissionStatus({ submissionId, status }))
                    .unwrap()
                    .then((data) => {
                        console.log(`[Admin] Status update successful:`, data);
                        toast.success(`Submission ${status} successfully`);
                        dispatch(getAllSubmissions());
                    })
                    .catch((error) => {
                        console.error(`[Admin] Status update failed:`, error);
                        toast.error(error || 'Failed to update submission status');
                    });
            }, 0);
        }
    };

    const handleDelete = (submissionId) => {
        console.log(`[Admin] Delete triggered for submission ${submissionId}`);
        
        if (window.confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
            // Use setTimeout to decouple from window.confirm (fixes Chrome event loop issue)
            setTimeout(() => {
                console.log(`[Admin] Dispatching deleteAdminSubmission for ${submissionId}`);
                dispatch(deleteAdminSubmission(submissionId))
                    .unwrap()
                    .then(() => {
                        console.log(`[Admin] Delete successful for ${submissionId}`);
                        toast.success("Submission deleted successfully");
                    })
                    .catch((error) => {
                        console.error(`[Admin] Delete failed for ${submissionId}:`, error);
                        toast.error(error || "Failed to delete submission");
                    });
            }, 0);
        }
    };

    // Calculate stats
    const stats = {
        totalUsers: allUsers.length,
        totalSubmissions: allSubmissions.length,
        pendingReviews: allSubmissions.filter(s => s.status === 'Pending').length,
        activeReviewers: reviewers.length,
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <AdminOverview stats={stats} submissions={allSubmissions} users={allUsers} />;;
            case 'assign':
                return (
                    <AdminAssignPapers
                        submissions={allSubmissions}
                        reviewers={reviewers}
                        selectedSubmission={selectedSubmission}
                        selectedReviewer={selectedReviewer}
                        setSelectedSubmission={setSelectedSubmission}
                        setSelectedReviewer={setSelectedReviewer}
                        handleAssign={handleAssign}
                        handleDecision={handleDecision}
                        handleDelete={handleDelete}
                        onViewDetails={(id) => {
                            setViewingSubmissionId(id);
                            setIsModalOpen(true);
                        }}
                    />
                );
            case 'manage':
                return <AdminManageUsers users={allUsers} fetchUsers={fetchAllUsers} />;
            default:
                return <AdminOverview stats={stats} submissions={allSubmissions} users={allUsers} />;
        }
    };

    if (isLoading && activeTab === 'assign') {
        return (
            <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="mb-6">
                     <Skeleton width={250} height={36} className="mb-2" />
                     <Skeleton width={180} height={20} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Skeleton height={300} borderRadius={8} />
                    <Skeleton height={300} borderRadius={8} />
                </div>
            </AdminLayout>
        );
    }

    // Wrap everything in AdminLayout
    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}

            {/* Submission Modal for Admin */}
            <SubmissionModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setViewingSubmissionId(null);
                }}
                submissionId={viewingSubmissionId}
            />
        </AdminLayout>
    );
};

export default AdminDashboard;
