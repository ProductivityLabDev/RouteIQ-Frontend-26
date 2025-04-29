import React from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import LeaveWidget from '@/components/LeaveWidget'
import PayRateCard from '@/components/PayRateCard'
import PayrollSummary from '@/components/PayrollSummary'
import PayrollHistory from '@/components/PayrollHistory'

const EmployeePayroll = () => {
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