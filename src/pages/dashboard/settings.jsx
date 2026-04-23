import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function Settings() {
    const loggedInUser = useSelector((state) => state.user?.user)
    const normalizedRole = String(loggedInUser?.role || '').trim().toUpperCase()
    const profileLabel = normalizedRole === 'INSTITUTE' || normalizedRole === 'SCHOOL'
        ? 'School Profile'
        : 'Vendor Profile'

    return (
        <section>
            <h1 className="block antialiased tracking-normal mt-4 text-[24px] md:text-[32px] text-[#202224] font-bold leading-[1.3] mb-5">
                Settings
            </h1>
            <div className='flex flex-col text-[#2E2E2E] font-semibold text-[16px] md:text-[18px]'>
                <Link to={`/profile`} className='bg-[#FBFCFF] hover:bg-gray-200 transition-all w-full rounded-[12px] text-start p-5 mb-4 border shadow-sm'>{profileLabel}</Link>
                <Link to={`/dashboard/feedback-and-support`} className='bg-[#FBFCFF] hover:bg-gray-200 transition-all w-full rounded-[12px] text-start p-5 border shadow-sm'>Feedback & Support</Link>
            </div>
        </section>
    )
}

export default Settings
