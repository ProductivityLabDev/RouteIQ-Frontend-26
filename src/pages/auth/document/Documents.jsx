import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/layouts/SchoolLayout';
import {
    Button,
    ButtonGroup,
} from '@material-tailwind/react';
import { documentTab } from '@/data/dummyData';
import CorporateDocuments from '@/components/CorporateDocuments';
import VendorGlobalModal from '@/components/Modals/VendorGlobalModal';
import { AvatarPlus } from '@/assets';
import TrainingDocuments from '@/components/TrainingDocuments';
import vendorDocumentsService from '@/services/vendorDocumentsService';
import { toast } from 'react-hot-toast';

const Documents = () => {
    const [selectedTab, setSelectedTab] = useState('Corporate Documents');
    const [selectedSubcategory, setSelectedSubcategory] = useState('General');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [trainingEmployees, setTrainingEmployees] = useState([]);
    const [refreshToken, setRefreshToken] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        file: null,
        documentName: '',
        category: 'General',
        description: '',
        employeeId: '',
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setUploadForm({
            file: null,
            documentName: '',
            category: selectedSubcategory || 'General',
            description: '',
            employeeId: '',
        });
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await vendorDocumentsService.getCategories();
                const list = response.data || [];
                setCategories(list);
                if (list[0]?.Name && !selectedSubcategory) {
                    setSelectedSubcategory(list[0].Name);
                }
            } catch (error) {
                toast.error('Failed to load document categories');
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        setUploadForm((prev) => ({ ...prev, category: selectedSubcategory || 'General' }));
    }, [selectedSubcategory]);

    useEffect(() => {
        if (selectedTab !== 'Training Documents') return;

        const loadEmployees = async () => {
            try {
                const response = await vendorDocumentsService.getTrainingEmployees();
                setTrainingEmployees(response.data || []);
            } catch (error) {
                toast.error('Failed to load employees');
            }
        };

        loadEmployees();
    }, [selectedTab, refreshToken]);

    const handleSubmit = async () => {
        if (!uploadForm.file || !uploadForm.documentName || !uploadForm.category) {
            toast.error('File, document name, and category are required');
            return;
        }
        if (selectedTab === 'Training Documents' && !uploadForm.employeeId) {
            toast.error('Employee is required for training document');
            return;
        }

        const fd = new FormData();
        fd.append('file', uploadForm.file);
        fd.append('documentName', uploadForm.documentName);
        fd.append('category', uploadForm.category);
        if (uploadForm.description) fd.append('description', uploadForm.description);
        if (selectedTab === 'Training Documents') fd.append('employeeId', String(uploadForm.employeeId));

        try {
            setUploading(true);
            if (selectedTab === 'Corporate Documents') {
                await vendorDocumentsService.uploadCorporateDocument(fd);
            } else {
                await vendorDocumentsService.uploadTrainingDocument(fd);
            }
            toast.success('Document uploaded successfully');
            setRefreshToken((prev) => prev + 1);
            closeModal();
        } catch (error) {
            toast.error('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const subcategories = useMemo(
        () => (categories.length > 0 ? categories.map((item) => item.Name) : ['General', 'HR', 'Safety', 'Fleet', 'History']),
        [categories]
    );

    useEffect(() => {
        if (subcategories.length > 0 && !subcategories.includes(selectedSubcategory)) {
            setSelectedSubcategory(subcategories[0]);
        }
    }, [subcategories, selectedSubcategory]);

    const handleInputChange = (field, value) => {
        setUploadForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (event) => {
        handleInputChange('file', event.target.files?.[0] || null);
    };

    const selectedEmployeeName = trainingEmployees.find((item) => String(item.EmployeeId) === String(uploadForm.employeeId))?.Name;

    const uploadModalTitle = selectedTab === 'Corporate Documents' ? 'Upload Corporate Document' : 'Upload Training Document';

    return (
        <MainLayout>
            <section className='w-full h-full'>
                {/* Main Tabs */}
                <div className='flex w-full mt-4'>
                    <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='md'>
                        {documentTab?.map(tab => (
                            <Button
                                key={tab}
                                className={selectedTab === tab ? 'bg-[#C01824] text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white text-black px-6 py-3 lg:text-[13px] capitalize font-bold'}
                                onClick={() => {
                                    setSelectedTab(tab);
                                    setSelectedSubcategory(subcategories[0] || 'General');
                                }}
                            >
                                {tab}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                {/* Subcategories */}
                <div className='flex w-full mt-6'>
                    <ButtonGroup className="border border-[#DDDDE1]/50 rounded-md" variant="outlined">
                        {subcategories.map(sub => (
                            <Button
                                key={sub}
                                className={selectedSubcategory === sub ? 'bg-[#C01824] text-white capitalize font-semibold text-sm px-4' : 'bg-white text-black capitalize font-semibold text-sm px-4'}
                                onClick={() => setSelectedSubcategory(sub)}
                            >
                                {sub}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                {/* Render Tab Content */}
                <div className="mt-6">
                    {selectedTab === 'Corporate Documents' && (
                        <CorporateDocuments openModal={openModal} subcategory={selectedSubcategory} refreshToken={refreshToken} />
                    )}
                    {selectedTab === 'Training Documents' && (
                        <TrainingDocuments openModal={openModal} subcategory={selectedSubcategory} refreshToken={refreshToken} />
                    )}
                </div>

                {/* Upload Modal */}
                <VendorGlobalModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={uploadModalTitle}
                    primaryButtonText={uploading ? "Uploading..." : "Submit"}
                    secondaryButtonText="Cancel"
                    onPrimaryAction={handleSubmit}
                >
                    <div className="w-full space-y-4">
                        <div className="border border-dashed border-[#C01824] rounded-md p-8 flex flex-col gap-3 items-center justify-center">
                            <div className="text-[#C01824] mb-2">
                                <img src={AvatarPlus} alt="Upload" />
                            </div>
                            <div className="text-[#C01824] font-bold mb-1">Drag and Drop Files</div>
                            <input type="file" onChange={handleFileChange} className="w-full text-sm" accept=".pdf,image/*" />
                            {uploadForm.file && <div className="text-xs text-gray-600">{uploadForm.file.name}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#202224] mb-1">Document Name</label>
                            <input
                                type="text"
                                value={uploadForm.documentName}
                                onChange={(e) => handleInputChange('documentName', e.target.value)}
                                className="w-full border border-[#D5D5D5] rounded-md px-3 py-2 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#202224] mb-1">Category</label>
                            <select
                                value={uploadForm.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                                className="w-full border border-[#D5D5D5] rounded-md px-3 py-2 outline-none"
                            >
                                {subcategories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {selectedTab === 'Training Documents' && (
                            <div>
                                <label className="block text-sm font-semibold text-[#202224] mb-1">Employee</label>
                                <select
                                    value={uploadForm.employeeId}
                                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                    className="w-full border border-[#D5D5D5] rounded-md px-3 py-2 outline-none"
                                >
                                    <option value="">Select employee</option>
                                    {trainingEmployees.map((employee) => (
                                        <option key={employee.EmployeeId} value={employee.EmployeeId}>
                                            {employee.Name} {employee.busNumber ? `(${employee.busNumber})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {selectedEmployeeName && (
                                    <div className="mt-1 text-xs text-gray-500">{selectedEmployeeName}</div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-[#202224] mb-1">Description</label>
                            <textarea
                                value={uploadForm.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full border border-[#D5D5D5] rounded-md px-3 py-2 outline-none min-h-[90px]"
                            />
                        </div>
                    </div>
                </VendorGlobalModal>
            </section>
        </MainLayout>
    );
};

export default Documents;
