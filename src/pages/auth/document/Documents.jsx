import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, ButtonGroup, Input, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import { documentTab } from '@/data/dummyData';
import CorporateDocuments from '@/components/CorporateDocuments';
import VendorGlobalModal from '@/components/Modals/VendorGlobalModal';
import { AvatarPlus } from '@/assets';
import TrainingDocuments from '@/components/TrainingDocuments';
import SafetyTerms from '@/components/SafetyTerms';
import TermsAndCondition from '@/components/TermsAndCondition';

const Documents = () => {
    const [selectedTab, setSelectedTab] = useState('Corporate Documents');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleSubmit = () => {
        closeModal();
    };
    return (
        <MainLayout>
            <section className='w-full h-full'>
                <div className='flex w-[45%] mt-4'>
                    <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='md'>
                        {documentTab?.map(tab => (
                            <Button
                                key={tab}
                                className={selectedTab === tab ? 'bg-[#C01824]  hover:bg-[#C01824] text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white hover:bg-white px-6 py-3 lg:text-[13px]  border-[#DDDDE1] capitalize font-bold'}
                                onClick={() => setSelectedTab(tab)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
                {selectedTab === 'Corporate Documents' && (
                    <CorporateDocuments openModal={openModal} />
                )}
                {selectedTab === 'Training Documents' && (
                    <TrainingDocuments />
                )}
                {selectedTab === 'Safety' && (
                    <SafetyTerms />
                )}
                {selectedTab === 'Terms & Conditions' && (
                    <TermsAndCondition />
                )}
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
                                <img src={AvatarPlus} />
                            </div>
                            <div className="text-[#C01824] font-bold mb-1">Drag and Drop Files</div>
                        </div>
                    </div>
                </VendorGlobalModal>
            </section>
        </MainLayout>
    )
}

export default Documents