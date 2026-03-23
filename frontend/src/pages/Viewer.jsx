import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { User, FileText, Download, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Viewer = () => {
    const [viewerName, setViewerName] = useState(() => sessionStorage.getItem('viewerName') || '');
    const [nameInput, setNameInput] = useState('');
    const [publishedPapers, setPublishedPapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (viewerName) {
            fetchPublishedPapers();
        }
    }, [viewerName]);

    const fetchPublishedPapers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/submissions/published');
            setPublishedPapers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch published content.');
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (nameInput.trim()) {
            sessionStorage.setItem('viewerName', nameInput.trim());
            setViewerName(nameInput.trim());
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('viewerName');
        setViewerName('');
        setPublishedPapers([]);
    };

    if (!viewerName) {
        return (
            <div className="flex items-center justify-center min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 30%, #EC4899 60%, #F97316 100%)' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }}></div>
                <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10 border border-white/20 animate-slide-up" style={{ background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(20px)' }}>
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Eye size={40} className="text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Viewer Access</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                                Enter your name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-premium w-full text-white font-bold py-3 px-4 rounded-xl focus:ring-4 focus:ring-violet-300 transition-all shadow-lg transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)' }}
                        >
                            Enter as Viewer
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center justify-center">
                            <ArrowLeft size={16} className="mr-1" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-10 font-sans" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f7 50%, #f0f4f8 100%)' }}>
            <div className="max-w-7xl mx-auto animate-fade-in">
                <header className="flex justify-between items-center mb-10 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Eye className="text-indigo-600" /> Published Content
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Viewing as: <span className="font-semibold text-indigo-600">{viewerName}</span></p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Exit Viewer
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-indigo-600 text-xl font-semibold animate-pulse">Loading publications...</div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center shadow-sm">
                        {error}
                    </div>
                ) : publishedPapers.length === 0 ? (
                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600">No published content yet</h3>
                        <p className="text-gray-400 mt-2">Check back later for accepted papers.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publishedPapers.map((paper) => (
                            <div key={paper._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-2 group">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                            {paper.domain}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{paper.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {paper.abstract}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {paper.keywords?.map((keyword, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                                #{keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <User size={16} className="mr-1" />
                                        <span className="font-medium truncate max-w-[120px]">{paper.author?.name || 'Unknown Author'}</span>
                                    </div>
                                    <a
                                        href={`${import.meta.env.VITE_FILE_BASE_URL || ''}/${encodeURI(paper.fileUrl.replace(/\\/g, '/'))}`} // Assuming fileUrl is a relative path stored in DB, adjust domain
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                                    >
                                        <Download size={14} /> View
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Viewer;
