import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSubmission, reset } from '../redux/submissionSlice';
import { UploadCloud, FileText, Tag, Hash, FileUp, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import MainLayout from '../components/MainLayout';

const SubmitContent = () => {
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        keywords: '',
        domain: '',
    });
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState('submit');

    const { title, abstract, keywords, domain } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading } = useSelector(
        (state) => state.submission
    );

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please upload a file');
            return;
        }

        const submissionData = new FormData();
        submissionData.append('title', title);
        submissionData.append('abstract', abstract);
        submissionData.append('keywords', keywords);
        submissionData.append('domain', domain);
        submissionData.append('file', file);

        dispatch(createSubmission(submissionData))
            .unwrap()
            .then(() => {
                toast.success('Submission created successfully!');
                navigate('/dashboard');
                dispatch(reset());
            })
            .catch((error) => {
                toast.error(error || 'Failed to create submission');
            });
    };

    return (
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight mb-2">Submit New Content</h1>
                    <p className="text-gray-500">Provide the details of your academic work for review.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-6">
                        <div className="flex items-center text-[#2563EB]">
                            <FileUp size={24} className="mr-3" />
                            <h2 className="text-xl font-bold text-gray-800">Submission Document</h2>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="title">
                                    Paper Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={onChange}
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all text-gray-800"
                                        placeholder="Enter the full title of your paper"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="domain">
                                    Primary Domain <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="domain"
                                        name="domain"
                                        value={domain}
                                        onChange={onChange}
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all text-gray-800"
                                        placeholder="e.g., Computer Science"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="keywords">
                                    Keywords <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="keywords"
                                        name="keywords"
                                        value={keywords}
                                        onChange={onChange}
                                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all text-gray-800"
                                        placeholder="Comma separated (e.g., AI, Machine Learning)"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="abstract">
                                Abstract <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="abstract"
                                name="abstract"
                                value={abstract}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white transition-all text-gray-800 min-h-[160px] resize-y"
                                placeholder="Paste your structured abstract here. A clear summary helps reviewers evaluate your submission efficiently."
                                required
                            ></textarea>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Document Upload <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors relative group">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#2563EB] transition-colors" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#2563EB] hover:text-[#1D4ED8] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#2563EB]"
                                        >
                                            <span>Upload a file</span>
                                            <input 
                                                id="file" 
                                                name="file" 
                                                type="file" 
                                                className="sr-only" 
                                                onChange={onFileChange}
                                                accept=".pdf,.doc,.docx"
                                                required
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF, DOC up to 50MB</p>
                                    {file && (
                                        <div className="mt-3 p-2 bg-blue-50 text-blue-800 rounded-lg text-sm inline-block font-medium">
                                            Selected: {file.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="mr-4 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center min-w-[160px] bg-[#2563EB] text-white font-medium py-2.5 px-6 rounded-lg hover:bg-[#1D4ED8] focus:ring-4 focus:ring-blue-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Content'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default SubmitContent;
