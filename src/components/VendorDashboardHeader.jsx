import React from 'react'
import { backArrow } from '@/assets'
import { useNavigate } from 'react-router-dom'

const VendorDashboardHeader = ({ title, icon = false, className = '', TextClassName = '', handleNavigate }) => {
    return (
        <section>
            <div className={`md:my-7 mt-4 flex flex-row flex-wrap items-center md:space-y-0 space-y-4 gap-10 self-center ${className}`}>
                {icon &&
                    <img src={backArrow} onClick={handleNavigate} />
                }
                <h1 className={`font-bold text-[24px] md:text-[32px] text-[#202224] ${TextClassName}`}>{title}</h1>
            </div>
        </section>
    )
}

export default VendorDashboardHeader
