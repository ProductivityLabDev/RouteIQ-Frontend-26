import { useState } from 'react';
import { IoChevronBack, IoChevronForward, IoEllipsisVertical } from "react-icons/io5";
import { FaRegFile } from "react-icons/fa";
import { calendar, DocumentTag } from '@/assets';

export default function CorporateDocuments({ openModal }) {
    const [currentPage, setCurrentPage] = useState(1);

    const documents = Array(12).fill().map((_, i) => ({
        id: i + 1,
        title: "Corporate Documents 204",
        date: 'May 30,2024',
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard ..."
    }));



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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="bg-[#B6B4B4EE] p-4 rounded shadow-sm relative">
                        <div className="absolute left-0 top-0 h-20 w-10 flex items-center justify-center">
                            <img src={DocumentTag} className='-translate-y-3' />
                        </div>
                        <div className="flex justify-between mb-2 ps-2 ml-6">
                            <div>
                                <p className="text-sm font-medium">{doc.title}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className={`rounded-full h-4 w-4`}>
                                        <img src={calendar} />
                                    </div>
                                    <span className="text-xs text-[#202224]">{doc.date}</span>
                                </div>
                            </div>
                            <button className="text-black">
                                <IoEllipsisVertical />
                            </button>
                        </div>
                        <p className="text-xs text-[#68696A] mt-3">{doc.content}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-6 gap-1">
                <button
                    className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                    <IoChevronBack />
                </button>

                <button
                    className={`flex items-center justify-center bg-white h-8 w-8 rounded ${currentPage === 1 ? 'text-[#C01824] border border-[#C01824]' : 'border border-[#C4C6C9] text-black'}`}
                    onClick={() => setCurrentPage(1)}
                >
                    1
                </button>

                <button
                    className={`flex items-center justify-center bg-white h-8 w-8 rounded ${currentPage === 2 ? 'text-[#C01824] border border-[#C01824]' : 'border border-[#C4C6C9] text-black'}`}
                    onClick={() => setCurrentPage(2)}
                >
                    2
                </button>

                <button
                    className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5] "
                    onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
                >
                    <IoChevronForward />
                </button>
            </div>
        </div>
    );
}