import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { ArrowLeft, Star, FileText, Code, MessageSquare, Lightbulb, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MainLayout from '../components/MainLayout';

const ViewFeedback = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/submissions/${submissionId}/reviews`);
                setReviews(response.data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load reviews');
                setLoading(false);
            }
        };

        fetchReviews();
    }, [submissionId, user, navigate]);

    if (loading) {
        return (
            <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="max-w-4xl mx-auto">
                    <Skeleton width={150} height={24} className="mb-8" />
                    <Skeleton width={300} height={40} className="mb-8" />
                    <Skeleton height={250} count={2} className="mb-6 rounded-2xl" />
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-[#2563EB] mb-6 font-medium transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight mb-2 flex items-center">
                        <FileText className="mr-3 text-[#2563EB]" size={32} /> 
                        Reviewer Feedback
                    </h1>
                    <p className="text-gray-500 ml-11">Detailed evaluations and recommendations from assigned reviewers.</p>
                </div>

                {reviews.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                         <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
                             <MessageSquare size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Evaluations Yet</h3>
                        <p className="text-gray-500 max-w-md">
                            Reviewers are currently evaluating this submission. Feedback will appear here once submitted.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {reviews.map((review, index) => (
                            <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                
                                {/* Header */}
                                <div className="bg-gray-50/80 px-8 py-5 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-4">
                                            R{index + 1}
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                            Reviewer {index + 1}
                                        </h2>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm uppercase tracking-wider ${
                                        review.recommendation === 'Accept' 
                                            ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        {review.recommendation}
                                    </span>
                                </div>

                                <div className="p-8">
                                    {/* Quantitative Scores */}
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Quantitative Metrics</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-start">
                                            <div className="bg-blue-50 p-2.5 rounded-lg mr-4">
                                                <Code size={20} className="text-[#2563EB]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium mb-1">Technical Quality</p>
                                                <p className="text-2xl font-bold text-gray-900">{review.technicalQuality}<span className="text-base text-gray-400 font-medium">/5</span></p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-start">
                                            <div className="bg-blue-50 p-2.5 rounded-lg mr-4">
                                                <MessageSquare size={20} className="text-[#2563EB]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium mb-1">Clarity & Scope</p>
                                                <p className="text-2xl font-bold text-gray-900">{review.clarity}<span className="text-base text-gray-400 font-medium">/5</span></p>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-start">
                                            <div className="bg-blue-50 p-2.5 rounded-lg mr-4">
                                                <Lightbulb size={20} className="text-[#2563EB]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium mb-1">Novelty & Impact</p>
                                                <p className="text-2xl font-bold text-gray-900">{review.novelty}<span className="text-base text-gray-400 font-medium">/5</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Qualitative Comments */}
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-50 pb-2">Qualitative Feedback</h3>
                                    <div className="bg-gray-50 p-6 rounded-xl text-gray-700 whitespace-pre-wrap border border-gray-100 leading-relaxed min-h-[120px]">
                                        {review.comments}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default ViewFeedback;
