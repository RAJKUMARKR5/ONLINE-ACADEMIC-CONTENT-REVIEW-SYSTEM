import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { User, FileText, Download, X, MessageSquare, Code, Lightbulb, CheckCircle } from 'lucide-react';

const SubmissionModal = ({ isOpen, onClose, submissionId }) => {
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && submissionId) {
            fetchSubmissionDetails();
        } else {
            setSubmission(null);
            setError('');
        }
    }, [isOpen, submissionId]);

    const fetchSubmissionDetails = async () => {
        try {
            setLoading(true);
            setError('');
            
            // First fetch submission
            const subRes = await axios.get(`/submissions/${submissionId}`);
            
            // Then fetch reviews
            let reviewsData = [];
            try {
                const revRes = await axios.get(`/submissions/${submissionId}/reviews`);
                reviewsData = revRes.data;
            } catch(revErr) {
                console.warn('Could not fetch reviews:', revErr);
            }

            setSubmission({ ...subRes.data, reviews: reviewsData });
        } catch (err) {
            console.error(err);
            setError('Failed to load submission details');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10 shadow-sm">
                    {loading ? (
                        <div className="animate-pulse w-full">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ) : submission ? (
                        <div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
                                {submission.domain}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{submission.title}</h2>
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <User size={16} className="mr-1.5 text-gray-400" />
                                <span className="font-medium">{submission.author?.name || 'Unknown Author'}</span>
                            </div>
                        </div>
                    ) : (
                        <h2 className="text-xl font-bold text-gray-800">Loading Content...</h2>
                    )}
                    
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 rounded-full transition-colors ml-4 shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 space-y-6 flex-grow relative">
                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="h-32 bg-gray-100 rounded-xl w-full"></div>
                            <div className="h-10 bg-gray-100 rounded-xl w-1/3"></div>
                            <div className="h-48 bg-gray-100 rounded-xl w-full"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
                            {error}
                        </div>
                    ) : submission && (
                        <>
                            {/* Abstract Section */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FileText size={16} className="text-indigo-500" /> Abstract
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {submission.abstract}
                                </p>
                            </div>
                            
                            {/* Keywords Section */}
                            {submission.keywords && submission.keywords.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {submission.keywords.map((keyword, idx) => (
                                            <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-lg font-medium">
                                                #{keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews Section */}
                            <div className="pt-2">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MessageSquare size={16} className="text-indigo-500" /> Reviewer Feedback
                                </h3>
                                {submission.reviews && submission.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {submission.reviews.map((review, idx) => (
                                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center text-sm font-semibold text-gray-800">
                                                        <User size={14} className="mr-1.5 text-gray-400" />
                                                        {review.reviewer?.name || 'Assigned Reviewer'}
                                                    </div>
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                                                        review.recommendation === 'Accept' ? 'bg-green-100 text-green-700' :
                                                        review.recommendation === 'Reject' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {review.recommendation}
                                                    </span>
                                                </div>

                                                {/* Ratings Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                                                        <div className="flex items-center justify-center text-indigo-600 mb-1">
                                                            <Code size={16} className="mr-1.5" />
                                                            <span className="text-xs font-semibold text-gray-700 truncate">Technical Quality</span>
                                                        </div>
                                                        <span className="text-2xl font-bold text-gray-900">{review.technicalQuality || 0}</span>
                                                    </div>
                                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                                                        <div className="flex items-center justify-center text-blue-600 mb-1">
                                                            <MessageSquare size={16} className="mr-1.5" />
                                                            <span className="text-xs font-semibold text-gray-700 truncate">Clarity & Scope</span>
                                                        </div>
                                                        <span className="text-2xl font-bold text-gray-900">{review.clarity || 0}</span>
                                                    </div>
                                                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-center">
                                                        <div className="flex items-center justify-center text-amber-500 mb-1">
                                                            <Lightbulb size={16} className="mr-1.5" />
                                                            <span className="text-xs font-semibold text-gray-700 truncate">Novelty / Impact</span>
                                                        </div>
                                                        <span className="text-2xl font-bold text-gray-900">{review.novelty || 0}</span>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl block w-full border border-gray-100">
                                                    <span className="font-bold block mb-1.5 text-gray-800 uppercase text-xs tracking-wider">Comments</span>
                                                    <p className="whitespace-pre-wrap leading-relaxed">
                                                        {review.comments || 'No specific comments provided.'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                        <CheckCircle size={32} className="text-gray-300 mb-3" />
                                        <p className="text-sm font-medium text-gray-500">No reviewer feedback available yet.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Modal Footer */}
                {submission && submission.fileUrl && !loading && !error && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end">
                        <a
                            href={submission.fileUrl.startsWith('http') ? submission.fileUrl : `${import.meta.env.VITE_FILE_BASE_URL || ''}/${encodeURI(submission.fileUrl.replace(/\\/g, '/'))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-premium inline-flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all transform hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                        >
                            <Download size={18} /> View Full Document
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionModal;
