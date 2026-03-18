import { useEffect, useState } from 'react';
import { calendar, DocumentTag } from '@/assets';
import { Button } from '@material-tailwind/react';
import { IoEllipsisVertical } from "react-icons/io5";
import { toast } from 'react-hot-toast';
import vendorDocumentsService from '@/services/vendorDocumentsService';

const initials = (name) => (name || '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

const TrainingDocuments = ({ subcategory, refreshToken = 0, openModal }) => {
    const [employees, setEmployees] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [activeEmployee, setActiveEmployee] = useState(null);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingDocuments, setLoadingDocuments] = useState(false);

    const loadEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const response = await vendorDocumentsService.getTrainingEmployees();
            const list = response.data || [];
            setEmployees(list);
            setActiveEmployee((prev) => prev ?? list[0]?.EmployeeId ?? null);
        } catch (error) {
            toast.error('Failed to load employees');
        } finally {
            setLoadingEmployees(false);
        }
    };

    const loadDocuments = async (employeeId) => {
        try {
            setLoadingDocuments(true);
            const response = await vendorDocumentsService.getTrainingDocuments({
                employeeId,
                category: subcategory,
                limit: 20,
                offset: 0,
            });
            setDocuments(response.data || []);
        } catch (error) {
            toast.error('Failed to load training documents');
        } finally {
            setLoadingDocuments(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    useEffect(() => {
        if (activeEmployee) {
            loadDocuments(activeEmployee);
        }
    }, [activeEmployee, subcategory, refreshToken]);

    const handleDelete = async (documentId) => {
        try {
            await vendorDocumentsService.deleteTrainingDocument(documentId);
            toast.success('Training document deleted');
            loadDocuments(activeEmployee);
        } catch (error) {
            toast.error('Failed to delete training document');
        }
    };

    return (
        <div className='w-full h-full flex flex-row gap-4 mt-4'>
            <div className='bg-white w-full md:max-w-[280px] pt-2 overflow-y-auto rounded-lg shadow-md'>
                {loadingEmployees ? (
                    <div className="p-4 text-sm text-gray-500">Loading employees...</div>
                ) : employees.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No employees found.</div>
                ) : (
                    employees.map((employee) => (
                        <div key={employee.EmployeeId}>
                            <Button
                                onClick={() => setActiveEmployee(employee.EmployeeId)}
                                className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none transition-all ${
                                    activeEmployee === employee.EmployeeId ? 'bg-[#C01824] text-white' : 'bg-white'
                                }`}
                            >
                                <div className="rounded-full w-[43px] h-[43px] bg-[#E5E7EB] flex items-center justify-center text-[#6B7280] font-bold">
                                    {initials(employee.Name)}
                                </div>
                                <div className='text-start text-base'>
                                    <h6 className={`font-bold text-[16px] capitalize ${activeEmployee === employee.EmployeeId ? 'text-white' : 'text-black'}`}>
                                        {employee.Name}
                                    </h6>
                                    <p className={`font-light text-[14px] ${activeEmployee === employee.EmployeeId ? 'text-white' : 'text-black'}`}>
                                        BUS NO. <span className='font-bold'>{employee.busNumber || '--'}</span>
                                    </p>
                                </div>
                            </Button>
                            <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 w-full">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Training Documents</h1>
                    <button className="bg-[#C01824] text-white py-2 px-4 rounded flex items-center" onClick={openModal}>
                        Upload Document
                    </button>
                </div>

                <div className="flex flex-col h-full gap-4">
                    {loadingDocuments ? (
                        <div className="py-10 text-center text-gray-500">Loading documents...</div>
                    ) : documents.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">No training documents found.</div>
                    ) : (
                        documents.map((doc) => (
                            <div key={doc.DocumentId} className="bg-[#F5F5F5] p-4 rounded shadow-sm relative">
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
                                        <p className="text-xs text-[#202224] mt-1">
                                            {doc.employeeName || employees.find((emp) => emp.EmployeeId === activeEmployee)?.Name || '--'}
                                        </p>
                                    </div>
                                    <button className="text-black" onClick={() => handleDelete(doc.DocumentId)}>
                                        <IoEllipsisVertical />
                                    </button>
                                </div>
                                <p className="text-xs text-[#68696A] mt-3 break-all">{doc.MimeType || 'Document'}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-xs text-[#202224]">{doc.category || '--'}</span>
                                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#C01824]">
                                        Open
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default TrainingDocuments
