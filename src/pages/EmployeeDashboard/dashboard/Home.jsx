import AttendanceReport from '@/components/AttendenceReport'
import DashboardLayout from '@/components/DashboardLayout'
import EmployeeInsights from '@/components/EmployeeInsightsDashboards'
import TimeTrackingCard from '@/components/TimeTrackingCard'
import React from 'react'

const Home = () => {
    return (
        <DashboardLayout>
            <div className='w-100 flex flex-col gap-4'>
                <EmployeeInsights />
                <TimeTrackingCard />
                <AttendanceReport />
            </div>
        </DashboardLayout>
    )
}

export default Home