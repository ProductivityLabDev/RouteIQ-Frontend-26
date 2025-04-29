import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import TimeOffRequestTable from '@/components/TimeOffRequestTable'
import TimeOffRequestModal from '@/components/TimeOffRequestModal'
import { Button, Typography } from '@material-tailwind/react'

const TimeOffRequest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <DashboardLayout>
            <div className='w-[100%] flex flex-row justify-between items-center mb-5'>
                <Typography className="text-[23px] md:text-[32px] font-[700] text-[#000] mt-5 ps-2" sx={{ fontSize: { xs: '23px', md: '38px' }, fontWeight: 800 }}>Time Off Request</Typography>
                <Button    onClick={openModal} className="mt-8 px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg'>
                    New Request
                </Button>
            </div>
            {isModalOpen && <TimeOffRequestModal closeModal={closeModal} />}
            <TimeOffRequestTable />
        </DashboardLayout>
    )
}

export default TimeOffRequest