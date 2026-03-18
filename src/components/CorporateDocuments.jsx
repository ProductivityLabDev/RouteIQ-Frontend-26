import { useEffect, useState } from 'react';
import { IoEllipsisVertical } from "react-icons/io5";
import { calendar, DocumentTag } from '@/assets';
import { toast } from 'react-hot-toast';
import vendorDocumentsService from '@/services/vendorDocumentsService';

export default function CorporateDocuments({ openModal, subcategory, refreshToken = 0 }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadDocuments = async () => {
        try {
            setLoading(true);
            const response = await vendorDocumentsService.getCorporateDocuments({
                category: subcategory,
                limit: 20,
                offset: 0,
            });
            setDocuments(response.data || []);
        } catch (error) {
            toast.error('Failed to load corporate documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, [subcategory, refreshToken]);

    const handleDelete = async (documentId) => {
        try {
            await vendorDocumentsService.deleteCorporateDocument(documentId);
            toast.success('Document deleted');
            loadDocuments();
        } catch (error) {
            toast.error('Failed to delete document');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mt-4 mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Corporate Documents</h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center">
                        <span className="text-sm text-black mr-2">Sort by</span>
                        <div className="relative">
                            <select className="appearance-none bg-[#D9D9D9] text-gray-700 py-2 px-4 pr-8 rounded border border-[#9A9A9A] focus:outline-none">
                                <option>Date</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <button className="bg-[#C01824] text-white py-2 px-4 rounded flex items-center" onClick={openModal}>
                        Upload Document
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-10 text-center text-gray-500">Loading documents...</div>
            ) : documents.length === 0 ? (
                <div className="py-10 text-center text-gray-500">No corporate documents found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {documents.map((doc) => (
                        <div key={doc.DocumentId} className="bg-[#B6B4B4EE] p-4 rounded shadow-sm relative">
                            <div className="absolute left-0 top-0 h-20 w-10 flex items-center justify-center">
                                <img src={DocumentTag} className='-translate-y-3' />
                            </div>
                            <div className="flex justify-between mb-2 ps-2 ml-6">
                                <div>
                                    <p className="text-sm font-medium">{doc.DocumentName}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="rounded-full h-4 w-4">
                                            <img src={calendar} />
                                        </div>
                                        <span className="text-xs text-[#202224]">
                                            {doc.CreatedAt ? new Date(doc.CreatedAt).toLocaleDateString() : '--'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#202224] mt-1">{doc.category || '--'}</p>
                                </div>
                                <button className="text-black" onClick={() => handleDelete(doc.DocumentId)}>
                                    <IoEllipsisVertical />
                                </button>
                            </div>
                            <p className="text-xs text-[#68696A] mt-3 break-all">{doc.MimeType || 'Document'}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs text-[#202224]">
                                    {doc.FileSize ? `${Math.round(doc.FileSize / 1024)} KB` : '--'}
                                </span>
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-bold text-[#C01824]"
                                >
                                    Open
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
