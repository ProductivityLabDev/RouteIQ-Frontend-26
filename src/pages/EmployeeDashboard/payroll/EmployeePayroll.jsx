import React, { useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import LeaveWidget from '@/components/LeaveWidget'
import PayRateCard from '@/components/PayRateCard'
import PayrollSummary from '@/components/PayrollSummary'
import PayrollHistory from '@/components/PayrollHistory'
import SharedPayStubModal from '@/components/SharedPayStubModal'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInsights, fetchPayroll, fetchPayrollHistory } from '@/redux/slices/employeeDashboardSlice'
import dayjs from 'dayjs'

const EmployeePayroll = () => {
    const dispatch = useDispatch()
    const payroll = useSelector((state) => state.employeeDashboard.payroll)
    const payrollHistory = useSelector((state) => state.employeeDashboard.payrollHistory)
    const [payStubData, setPayStubData] = React.useState(null)
    const [payStubLoading, setPayStubLoading] = React.useState(false)

    useEffect(() => {
        dispatch(fetchInsights({ month: dayjs().month() + 1, year: dayjs().year() }))
        dispatch(fetchPayroll())
        dispatch(fetchPayrollHistory())
    }, [dispatch])

    useEffect(() => {
        if (!payroll?.period?.start || !Array.isArray(payrollHistory) || payrollHistory.length === 0) return

        const payrollStart = dayjs(payroll.period.start)
        const today = dayjs()
        const latestHistory = payrollHistory[0]

        if (payrollStart.isAfter(today, 'month') && latestHistory?.payrollId && latestHistory.payrollId !== payroll.payrollId) {
            dispatch(fetchPayroll(latestHistory.payrollId))
        }
    }, [dispatch, payroll, payrollHistory])

    const handleOpenCurrentPayStub = () => {
        if (payroll) setPayStubData(payroll)
    }

    const handleOpenHistoryPayStub = async (payrollId) => {
        if (!payrollId) return
        setPayStubLoading(true)
        try {
            const payload = await dispatch(fetchPayroll(payrollId)).unwrap()
            setPayStubData(payload)
        } finally {
            setPayStubLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <LeaveWidget />
            <PayRateCard />
            <PayrollSummary onViewPayStub={handleOpenCurrentPayStub} />
            <PayrollHistory onViewPayStub={handleOpenHistoryPayStub} />
            <SharedPayStubModal
                paystub={payStubData}
                loading={payStubLoading}
                onClose={() => {
                    setPayStubData(null)
                    setPayStubLoading(false)
                }}
            />
        </DashboardLayout>
    )
}

export default EmployeePayroll
