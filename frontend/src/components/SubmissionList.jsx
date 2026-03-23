import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Tag, MessageSquare, Trash2, Settings2, CheckCircle } from 'lucide-react';

const SubmissionList = ({ submissions, onDelete }) => {
    if (!submissions || submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
                <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
                     <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">No submissions yet</h3>
                <p className="text-gray-500 text-sm max-w-sm text-center">
                    Get started by submitting your first academic paper or content for review.
                </p>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Accepted':
            case 'Published':
                return 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20';
            case 'Rejected':
                return 'bg-red-50 text-red-700 border border-red-200';
            case 'Reviewed':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'Pending':
            default:
                return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {submissions.map((submission) => (
                <div
                    key={submission._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 overflow-hidden flex flex-col"
                >
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${getStatusStyle(submission.status)}`}
                            >
                                {submission.status}
                            </span>
                            <div className="flex flex-col items-end text-gray-400 text-[10px] font-medium">
                                <div className="flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    <span>Created: {new Date(submission.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                </div>
                                {submission.publishedAt && (
                                    <div className="flex items-center text-[#10B981] mt-0.5 font-bold">
                                        <CheckCircle size={12} className="mr-1" />
                                        <span>Published: {new Date(submission.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-[#1E293B] line-clamp-2 leading-tight mb-3">
                            {submission.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
                            {submission.abstract}
                        </p>

                        <div className="flex items-center text-gray-500 text-sm bg-gray-50 max-w-max px-3 py-1.5 rounded-lg border border-gray-100">
                            <Tag size={14} className="mr-2 text-[#2563EB]" />
                            <span className="truncate font-medium">{submission.domain}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 items-center justify-between">
                        <a 
                            href={submission.fileUrl ? (submission.fileUrl.startsWith('http') ? submission.fileUrl : `${import.meta.env.VITE_FILE_BASE_URL || ''}/${encodeURI(submission.fileUrl.replace(/\\/g, '/'))}`) : '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-[#2563EB] hover:text-[#1D4ED8] text-sm font-semibold transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"
                        >
                            <FileText size={16} className="mr-1.5" /> View Original
                        </a>

                        <div className="flex items-center gap-2">
                             {(submission.status === 'Reviewed' || submission.status === 'Accepted' || submission.status === 'Rejected' || submission.status === 'Published') && (
                                 <Link 
                                    to={`/view-feedback/${submission._id}`}
                                    className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#2563EB] transition-colors shadow-sm"
                                    title="View Feedback"
                                 >
                                     <MessageSquare size={16} />
                                 </Link>
                            )}

                            {onDelete && (
                                 <button
                                    onClick={() => onDelete(submission._id)}
                                    className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                                    title="Delete Submission"
                                 >
                                     <Trash2 size={16} />
                                 </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SubmissionList;
