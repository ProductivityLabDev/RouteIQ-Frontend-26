import React from 'react'
import { checkMark } from '@/assets'
import VendorDashboardHeader from '@/components/VendorDashboardHeader'
import MainLayout from '@/layouts/SchoolLayout'
import { Typography } from '@mui/material'

const Notification = () => {
    return (
        <MainLayout>
            <section className='w-full h-full'>
                <VendorDashboardHeader title='Notifications' />
                <div className='flex space-x-0 gap-5 md:space-x-5 justify-end flex-col items-center self-center h-[50vh]'>
                    <img src={checkMark} />
                    <div className='flex justify-end flex-col items-center gap-2 self-center'>
                        <Typography fontSize={30} fontWeight={800} className="font-Nunito Sans text-[#1F1F1F]">
                            All Caught Up
                        </Typography>
                        <Typography fontSize={26} fontWeight={400} className="font-Nunito Sans">
                            No new notifications yet for you
                        </Typography>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}

export default Notification
