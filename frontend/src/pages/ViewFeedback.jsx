import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axios';
import { ArrowLeft, Star, FileText, Code, MessageSquare, Lightbulb, UserCheck, X, User, Hash } from 'lucide-react';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import MainLayout from '../components/MainLayout';

const ViewFeedback = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [reviews, setReviews] = useState([]);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [reviewsRes, submissionRes] = await Promise.all([
                    axios.get(`/submissions/${submissionId}/reviews`),
                    axios.get(`/submissions/${submissionId}`)
                ]);
                setReviews(reviewsRes.data);
                setSubmission(submissionRes.data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to load feedback details');
                setLoading(false);
            }
        };

        fetchData();
    }, [submissionId, user, navigate]);

    if (loading) {
        return (
            <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="max-w-4xl mx-auto">
                    <Skeleton height={600} borderRadius={16} />
                </div>
            </MainLayout>
        );
    }

    if (!submission) {
        return (
            <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-700">Submission not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 text-[#2563EB] font-medium hover:underline">Return to Dashboard</button>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 relative">
                    
                    {/* Close Button */}
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                        title="Close"
                    >
                        <X size={20} />
                    </button>

                    {/* Domain Badge */}
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-600">
                            {submission.domain}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight mb-2 uppercase pr-10">
                        {submission.title}
                    </h1>

                    {/* Author */}
                    <div className="flex items-center text-gray-500 mb-8">
                        <User size={16} className="mr-2" />
                        <span className="font-medium text-sm">{submission.author?.name || 'Unknown Author'}</span>
                    </div>

                    <hr className="border-gray-100 border-t-2 mb-6" />

                    {/* Abstract Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#1E293B] flex items-center mb-3 uppercase tracking-wider">
                            <FileText size={16} className="mr-2 text-[#2563EB]" />
                            Abstract
                        </h3>
                        <div className="bg-gray-50 text-gray-600 p-5 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border border-gray-100">
                            {submission.abstract}
                        </div>
                    </div>

                    {/* Keywords Section */}
                    {submission.keywords && submission.keywords.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-[#1E293B] flex items-center mb-3 uppercase tracking-wider">
                                Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {submission.keywords.map((keyword, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                                        <Hash size={12} className="mr-1.5 opacity-70" />
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feedback Section */}
                    <div>
                        <h3 className="text-sm font-bold text-[#1E293B] flex items-center mb-4 uppercase tracking-wider">
                            <MessageSquare size={16} className="mr-2 text-[#2563EB]" />
                            Reviewer Feedback
                        </h3>
                        
                        {reviews.length === 0 ? (
                            <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100 text-gray-500 text-sm">
                                Reviewers are currently evaluating this submission. Feedback will appear here once submitted.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review, index) => (
                                    <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        {/* Header */}
                                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <UserCheck size={16} className="text-gray-400 mr-2" />
                                                <h4 className="text-sm font-bold text-gray-800 uppercase">
                                                    {review.reviewer?.name || `Reviewer ${index + 1}`}
                                                </h4>
                                            </div>
                                            <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider ${
                                                review.recommendation === 'Accept' 
                                                    ? 'bg-green-50 text-green-600' 
                                                    : 'bg-red-50 text-red-600'
                                            }`}>
                                                {review.recommendation}
                                            </span>
                                        </div>

                                        <div className="p-6">
                                            {/* Quantitative Metrics */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-gray-50 border border-gray-100 py-4 px-2 rounded-xl text-center">
                                                    <div className="flex items-center justify-center text-xs font-semibold text-gray-600 mb-2">
                                                        <Code size={14} className="text-[#2563EB] mr-1.5" /> Technical Quality
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{review.technicalQuality}</p>
                                                </div>
                                                
                                                <div className="bg-gray-50 border border-gray-100 py-4 px-2 rounded-xl text-center">
                                                    <div className="flex items-center justify-center text-xs font-semibold text-gray-600 mb-2">
                                                        <MessageSquare size={14} className="text-[#2563EB] mr-1.5" /> Clarity & Scope
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{review.clarity}</p>
                                                </div>

                                                <div className="bg-gray-50 border border-gray-100 py-4 px-2 rounded-xl text-center">
                                                    <div className="flex items-center justify-center text-xs font-semibold text-gray-600 mb-2">
                                                        <Lightbulb size={14} className="text-amber-500 mr-1.5" /> Novelty & Impact
                                                    </div>
                                                    <p className="text-2xl font-bold text-gray-900">{review.novelty}</p>
                                                </div>
                                            </div>

                                            {/* Comments */}
                                            <h5 className="text-xs font-bold text-gray-500 mb-2">Comments:</h5>
                                            <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                                {review.comments || 'No qualitative feedback provided.'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ViewFeedback;
