import React, { useState } from 'react';
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
import SafetyTerms from '@/components/SafetyTerms';
import TermsAndCondition from '@/components/TermsAndCondition';

const subcategories = ['General', 'HR', 'Safety', 'Fleet', 'History'];

const Documents = () => {
    const [selectedTab, setSelectedTab] = useState('Corporate Documents');
    const [selectedSubcategory, setSelectedSubcategory] = useState('General');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleSubmit = () => {
        closeModal();
    };

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
                                    setSelectedSubcategory('General'); // Reset subcategory
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
                        <CorporateDocuments openModal={openModal} subcategory={selectedSubcategory} />
                    )}
                    {selectedTab === 'Training Documents' && (
                        <TrainingDocuments subcategory={selectedSubcategory} />
                    )}
                    {/* {selectedTab === 'Safety' && (
                        <SafetyTerms subcategory={selectedSubcategory} />
                    )}
                    {selectedTab === 'Terms & Conditions' && (
                        <TermsAndCondition subcategory={selectedSubcategory} />
                    )} */}
                </div>

                {/* Upload Modal */}
                <VendorGlobalModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title="Upload Document"
                    primaryButtonText="Submit"
                    secondaryButtonText="Cancel"
                    onPrimaryAction={handleSubmit}
                >
                    <div className="w-full">
                        <div className="border border-dashed border-[#C01824] rounded-md p-16 flex flex-row gap-3 items-center justify-center">
                            <div className="text-[#C01824] mb-2">
                                <img src={AvatarPlus} alt="Upload" />
                            </div>
                            <div className="text-[#C01824] font-bold mb-1">Drag and Drop Files</div>
                        </div>
                    </div>
                </VendorGlobalModal>
            </section>
        </MainLayout>
    );
};

export default Documents;
