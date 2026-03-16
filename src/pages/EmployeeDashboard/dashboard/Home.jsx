import AttendanceReport from '@/components/AttendenceReport'
import DashboardLayout from '@/components/DashboardLayout'
import EmployeeInsights from '@/components/EmployeeInsightsDashboards'
import TimeTrackingCard from '@/components/TimeTrackingCard'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchInsights } from '@/redux/slices/employeeDashboardSlice'
import dayjs from 'dayjs'

const Home = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchInsights({ month: dayjs().month() + 1, year: dayjs().year() }))
    }, [dispatch])

    return (
        <DashboardLayout>
            <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col gap-4">
                <EmployeeInsights />
                <TimeTrackingCard />
                <AttendanceReport />
            </div>
        </DashboardLayout>
    )
}

export default Home
