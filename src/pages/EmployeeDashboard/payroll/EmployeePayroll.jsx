import React, { useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import LeaveWidget from '@/components/LeaveWidget'
import PayRateCard from '@/components/PayRateCard'
import PayrollSummary from '@/components/PayrollSummary'
import PayrollHistory from '@/components/PayrollHistory'
import { useDispatch } from 'react-redux'
import { fetchInsights, fetchPayroll, fetchPayrollHistory } from '@/redux/slices/employeeDashboardSlice'
import dayjs from 'dayjs'

const EmployeePayroll = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchInsights({ month: dayjs().month() + 1, year: dayjs().year() }))
        dispatch(fetchPayroll())
        dispatch(fetchPayrollHistory())
    }, [dispatch])

    return (
        <DashboardLayout>
            <LeaveWidget />
            <PayRateCard />
            <PayrollSummary />
            <PayrollHistory />
        </DashboardLayout>
    )
}

export default EmployeePayroll