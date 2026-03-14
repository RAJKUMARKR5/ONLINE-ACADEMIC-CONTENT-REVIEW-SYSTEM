import React from 'react';
import { UserPlus, CheckCircle, Trash2, Eye, FileText, Settings, XCircle } from 'lucide-react';

const AdminAssignPapers = ({
    submissions,
    reviewers,
    selectedSubmission,
    selectedReviewer,
    setSelectedSubmission,
    setSelectedReviewer,
    handleAssign,
    handleDecision,
    handleDelete
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-extrabold text-[#1E293B] tracking-tight flex items-center">
                        <Settings className="mr-3 text-[#2563EB]" size={28} />
                        Manage Submissions
                    </h2>
                    <p className="text-gray-500 ml-10">Assign reviewers and make final publication decisions.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Title & Author</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Domain</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Management Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText size={48} className="text-gray-300 mb-4" />
                                            <p className="text-gray-500 font-medium">No submissions available to manage.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((submission) => (
                                    <tr key={submission._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-5 px-6 min-w-[300px]">
                                            <div className="flex flex-col">
                                                <h3 className="text-base font-semibold text-[#1E293B] mb-1 line-clamp-2" title={submission.title}>
                                                    {submission.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    By: <span className="font-medium ml-1 text-gray-700">{submission.author?.name || 'Unknown Author'}</span>
                                                </p>
                                            </div>
                                        </td>
                                        
                                        <td className="py-5 px-6 whitespace-nowrap">
                                            <div className="inline-flex items-center text-xs font-semibold text-gray-600 bg-gray-100 py-1 px-3 rounded-md">
                                                {submission.domain}
                                            </div>
                                        </td>
                                        
                                        <td className="py-5 px-6 whitespace-nowrap">
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                                submission.status === 'Accepted' || submission.status === 'Published' ? 'bg-[#10B981] text-white' :
                                                submission.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                submission.status === 'Reviewed' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                            }`}>
                                                {submission.status === 'Accepted' || submission.status === 'Published' ? 'Published' : submission.status}
                                            </span>
                                        </td>
                                        
                                        <td className="py-5 px-6 min-w-[420px]">
                                            {/* Inline assignment selector (expands when Assign is clicked) */}
                                            {selectedSubmission === submission._id ? (
                                                <div className="flex items-center space-x-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                                                    <select
                                                        className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-gray-700"
                                                        value={selectedReviewer}
                                                        onChange={(e) => setSelectedReviewer(e.target.value)}
                                                    >
                                                        <option value="" disabled>Select Reviewer</option>
                                                        {reviewers.map(r => (
                                                            <option key={r._id} value={r._id}>{r.name}</option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleAssign(submission._id)}
                                                        className="bg-[#2563EB] text-white p-1.5 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm"
                                                        title="Confirm Assignment"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedSubmission(null); setSelectedReviewer(''); }}
                                                        className="text-gray-400 hover:text-red-500 p-1.5 bg-white rounded-lg border border-gray-200 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center flex-wrap gap-2">
                                                    {/* Assign Button */}
                                                    <button
                                                        onClick={() => setSelectedSubmission(submission._id)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#2563EB] hover:border-[#2563EB] transition-all shadow-sm"
                                                    >
                                                        <UserPlus size={16} className="mr-1.5" /> 
                                                        Assign
                                                    </button>
                                                    
                                                    {/* View Document */}
                                                    <a 
                                                        href={`http://localhost:5000/${encodeURI(submission.fileUrl.replace(/\\/g, '/'))}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center justify-center p-1.5 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                        title="View Document"
                                                    >
                                                        <Eye size={18} />
                                                    </a>

                                                    {/* Publish/Reject for Reviewed status */}
                                                    {submission.status === 'Reviewed' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleDecision(submission._id, 'Published')}
                                                                className="inline-flex items-center bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white border border-[#10B981]/20 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                                                            >
                                                                Publish
                                                            </button>
                                                            <button
                                                                onClick={() => handleDecision(submission._id, 'Rejected')}
                                                                className="inline-flex items-center bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Delete button */}
                                                    {handleDelete && (
                                                        <button
                                                            onClick={() => handleDelete(submission._id)}
                                                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-200 hover:border-red-600 bg-red-50"
                                                        >
                                                            <Trash2 size={14} className="mr-1.5" /> Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAssignPapers;
