import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Tag, CheckCircle, Clock } from 'lucide-react';

const AssignmentList = ({ assignments }) => {
    const filteredAssignments = assignments ? assignments.filter(a => a.submission) : [];

    if (filteredAssignments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white text-center">
                <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-4">
                    <Clock size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Assignments Found</h3>
                <p className="text-gray-500 max-w-md">
                    You currently have no assignments in this category. New assignments will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Submission Details</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Domain</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Date</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredAssignments.map((assignment) => (
                        <tr key={assignment._id} className="hover:bg-gray-50/50 transition-colors group">
                            
                            {/* Submission Details */}
                            <td className="py-5 px-6 min-w-[300px]">
                                <div className="flex flex-col">
                                    <h3 className="text-base font-semibold text-[#1E293B] mb-1 line-clamp-2 pr-4">
                                        {assignment.submission?.title || 'Unknown Title'}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1 pr-4">
                                        {assignment.submission?.abstract || 'No abstract'}
                                    </p>
                                </div>
                            </td>

                            {/* Domain */}
                            <td className="py-5 px-6 whitespace-nowrap">
                                <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-100 py-1 px-3 rounded-md w-fit">
                                    <Tag size={14} className="mr-1.5 text-gray-400" />
                                    {assignment.submission?.domain || 'N/A'}
                                </div>
                            </td>

                            {/* Assigned Date */}
                            <td className="py-5 px-6 whitespace-nowrap text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Calendar size={14} className="mr-2 text-gray-400" />
                                    {new Date(assignment.assignedAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </div>
                            </td>

                            {/* Status */}
                            <td className="py-5 px-6 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                    assignment.status === 'Completed'
                                        ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                }`}>
                                    {assignment.status === 'Completed' ? <CheckCircle size={12} className="mr-1.5" /> : <Clock size={12} className="mr-1.5" />}
                                    {assignment.status}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="py-5 px-6 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end space-x-3">
                                    {assignment.submission ? (
                                        <>
                                            <a 
                                                href={assignment.submission.fileUrl.startsWith('http') ? assignment.submission.fileUrl : `${import.meta.env.VITE_FILE_BASE_URL || ''}/${encodeURI(assignment.submission.fileUrl.replace(/\\/g, '/'))}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Document"
                                            >
                                                <FileText size={18} />
                                            </a>
                                            
                                            {assignment.status !== 'Completed' && (
                                                <Link
                                                    to={`/submit-review/${assignment.submission._id}/${assignment._id}`}
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-1 transition-all"
                                                >
                                                    Evaluate
                                                </Link>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                                            Submission Deleted
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentList;
