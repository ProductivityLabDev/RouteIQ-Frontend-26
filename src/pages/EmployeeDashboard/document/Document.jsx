import React, { useState } from 'react'
import { Button, Typography } from '@material-tailwind/react';
import DashboardLayout from '@/components/DashboardLayout'
import PDFIcons from '@/components/PDFIcons';
import VendorGlobalModal from '@/components/Modals/VendorGlobalModal';
import { uploadDocumentIcon } from '@/assets';

const Document = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <DashboardLayout>
      <div className='w-[100%] flex flex-row justify-between items-center mb-5'>
        <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 800 }}>Document</Typography>
        <Button onClick={openModal} className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg'>
          Upload Document
        </Button>
      </div>
      <PDFIcons />
      <VendorGlobalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Upload Files"
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        onPrimaryAction={closeModal}
      >
        <div className="w-full">
          <div className="border-4 border-dashed border-[#C01824] rounded-md p-16 flex flex-row gap-3 items-center justify-center">
            <div className="text-[#C01824] mb-2">
              <img src={uploadDocumentIcon} />
            </div>
            <div className="text-[#C01824] font-bold mb-1">Drag and Drop Files</div>
          </div>
        </div>
      </VendorGlobalModal>
    </DashboardLayout>
  )
}

export default Document