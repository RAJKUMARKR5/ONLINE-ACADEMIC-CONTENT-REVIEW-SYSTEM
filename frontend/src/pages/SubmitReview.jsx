import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { submitReview } from '../redux/reviewSlice';
import { Star, MessageSquare, ThumbsUp, GitPullRequest, Code, Lightbulb, CheckCircle, XCircle, FileText, User, Tag, Download, BookOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import MainLayout from '../components/MainLayout';
import axios from '../utils/axios';

const SubmitReview = () => {
    const { submissionId, assignmentId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading } = useSelector(
        (state) => state.review
    );

    const [activeTab, setActiveTab] = useState('review');
    const [submission, setSubmission] = useState(null);
    const [loadingSubmission, setLoadingSubmission] = useState(true);

    const [formData, setFormData] = useState({
        technicalQuality: 5,
        clarity: 5,
        novelty: 5,
        comments: '',
        recommendation: 'Accept',
    });

    const { technicalQuality, clarity, novelty, comments, recommendation } = formData;

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const res = await axios.get(`/submissions/${submissionId}`);
                setSubmission(res.data);
            } catch (err) {
                console.error('Failed to fetch submission', err);
                toast.error('Could not load submission details');
            } finally {
                setLoadingSubmission(false);
            }
        };
        fetchSubmission();
    }, [submissionId]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const reviewData = {
            submissionId,
            assignmentId,
            technicalQuality,
            clarity,
            novelty,
            comments,
            recommendation,
        };
        dispatch(submitReview(reviewData))
            .unwrap()
            .then(() => {
                toast.success('Review submitted successfully!');
                navigate('/dashboard');
            })
            .catch((error) => {
                toast.error(error || 'Failed to submit review');
            });
    };

    return (
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight mb-2">Submit Evaluation</h1>
                    <p className="text-gray-500">Review the submission content below, then provide your detailed assessment.</p>
                </div>

                {/* Submission Content Card */}
                {loadingSubmission ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ) : submission ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="bg-indigo-50/50 border-b border-gray-100 px-8 py-5">
                            <div className="flex items-center">
                                <BookOpen size={22} className="mr-3 text-indigo-600" />
                                <h2 className="text-lg font-bold text-gray-800">Submission Content</h2>
                            </div>
                        </div>
                        <div className="p-8 space-y-5">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{submission.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center"><User size={14} className="mr-1" /> {submission.author?.name || 'Unknown Author'}</span>
                                    <span className="flex items-center"><Tag size={14} className="mr-1" /> {submission.domain}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Abstract</h4>
                                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{submission.abstract}</p>
                            </div>

                            {submission.keywords && submission.keywords.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {submission.keywords.map((kw, i) => (
                                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {submission.fileUrl && (
                                <div className="pt-2">
                                    <a
                                        href={`http://localhost:5000/${encodeURI(submission.fileUrl.replace(/\\/g, '/'))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-5 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium shadow-sm"
                                    >
                                        <Download size={16} className="mr-2" /> View / Download File
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl mb-8 text-center">
                        Could not load submission details. You can still submit your review.
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-blue-50/50 border-b border-gray-100 px-8 py-6">
                        <div className="flex items-center text-[#2563EB]">
                            <Star size={24} className="mr-3 text-yellow-500 fill-current" />
                            <h2 className="text-xl font-bold text-gray-800">Evaluation Form</h2>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="p-8">
                        
                        {/* Rating Metrics */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 pb-2 border-b border-gray-100">Quantitative Metrics (1-5)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* Technical Quality */}
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative group hover:border-[#2563EB]/30 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                                            <Code size={16} className="text-[#2563EB] mr-2" />
                                            Technical Quality
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        name="technicalQuality"
                                        value={technicalQuality}
                                        onChange={onChange}
                                        min="1"
                                        max="5"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-lg text-center"
                                        required
                                    />
                                    <p className="text-xs text-center text-gray-400 mt-2">1 = Poor, 5 = Excellent</p>
                                </div>

                                {/* Clarity */}
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative group hover:border-[#2563EB]/30 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                                            <MessageSquare size={16} className="text-[#2563EB] mr-2" />
                                            Clarity & Scope
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        name="clarity"
                                        value={clarity}
                                        onChange={onChange}
                                        min="1"
                                        max="5"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-lg text-center"
                                        required
                                    />
                                    <p className="text-xs text-center text-gray-400 mt-2">1 = Poor, 5 = Excellent</p>
                                </div>

                                {/* Novelty */}
                                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 relative group hover:border-[#2563EB]/30 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                                            <Lightbulb size={16} className="text-[#2563EB] mr-2" />
                                            Novelty / Impact
                                        </label>
                                    </div>
                                    <input
                                        type="number"
                                        name="novelty"
                                        value={novelty}
                                        onChange={onChange}
                                        min="1"
                                        max="5"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-lg text-center"
                                        required
                                    />
                                    <p className="text-xs text-center text-gray-400 mt-2">1 = Poor, 5 = Excellent</p>
                                </div>
                            </div>
                        </div>

                        {/* Qualitative Feedback */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 pb-2 border-b border-gray-100">Qualitative Feedback</h3>
                            <div className="bg-white">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Comments</label>
                                <textarea
                                    name="comments"
                                    value={comments}
                                    onChange={onChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all text-gray-800 min-h-[160px] resize-y"
                                    placeholder="Provide constructive feedback, outlining strengths and areas for improvement..."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="mb-10">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 pb-2 border-b border-gray-100">Final Decision</h3>
                            <div className="bg-white">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="recommendation">
                                    Overall Recommendation
                                </label>
                                <div className="relative max-w-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <GitPullRequest size={18} className="text-gray-400" />
                                    </div>
                                    <select
                                        id="recommendation"
                                        name="recommendation"
                                        value={recommendation}
                                        onChange={onChange}
                                        className="pl-10 w-full px-4 py-3 appearance-none bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all text-gray-900 font-medium"
                                    >
                                        <option value="Accept">Accept Submission</option>
                                        <option value="Reject">Reject Submission</option>
                                    </select>
                                    
                                    {/* Custom Dropdown Arrow */}
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-5 border-t border-gray-100">
                             <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="mr-4 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex items-center min-w-[160px] justify-center px-6 py-2.5 rounded-lg text-white font-medium shadow-sm transition-all focus:ring-4 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    recommendation === 'Accept' 
                                        ? 'bg-[#10B981] hover:bg-[#059669] focus:ring-green-100' 
                                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-100'
                                }`}
                            >
                                {isLoading ? (
                                    'Submitting...'
                                ) : (
                                    <>
                                        {recommendation === 'Accept' ? <CheckCircle size={18} className="mr-2" /> : <XCircle size={18} className="mr-2" />}
                                        Submit {recommendation}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default SubmitReview;
