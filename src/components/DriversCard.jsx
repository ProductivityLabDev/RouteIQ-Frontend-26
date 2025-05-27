import React from 'react'
import { VerticalDot } from '@/assets';
import { Link } from 'react-router-dom';

const DriversCard = () => {
    const Drivers = [
        { name: 'Darrell Steward', payrate: '$40/hr', terminalAssignedTo: 'Darrell Steward', availability: 'Present' },
        { name: 'Arlena McCoy', payrate: '$55/hr', terminalAssignedTo: 'Arlena McCoy', availability: 'Absent' },
        { name: 'Jane Cooper', payrate: '$25/hr', terminalAssignedTo: 'Jane Cooper', availability: 'Present' },
        { name: 'Wade Warren', payrate: '$25/hr', terminalAssignedTo: 'Wade Warren', availability: 'Present' },
        { name: 'Robert Fox', payrate: '$25/hr', terminalAssignedTo: 'Robert Fox', availability: 'Present' },
        { name: 'Kristin Watson', payrate: '$50/hr', terminalAssignedTo: 'Kristin Watson', availability: 'Present' },
    ];
    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-[70%] lg:w-[60%] xl:w-[48%] h-[100%]">
            {/* ---------------- Header of Card --------------- */}
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-[22 px] lg:text-[28px] xl:text-[32px] font-bold text-black">Drivers</h2>
                 <Link to='/EmployeeManagement'><h2 className='text-[#C01824] text-[16px] font-semibold font-[Nunito Sans]'>View All</h2></Link>
                {/* <button className="focus:outline-none border border-[#DADADA] w-[28px] lg:w-[32px] h-[28px] lg:h-[32px] flex items-center justify-center bg-[#F5F5F5]" style={{ borderRadius: "8px" }}>
                    <div className="w-[16px] lg:w-[20px] h-[16px] lg:h-[20px]">
                        <img src={VerticalDot} />
                    </div>
                </button> */}
            </div>

            {/* ------------ Content -------------------- */}
            <div className="overflow-x-auto mt-1 border border-gray-200 rounded h-[20vh] lg:h-[45vh]">
                <table className="min-w-full text-[14px] md:text-[16px] lg:text-[18px]">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-4 md:px-4 lg:px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] md:text-[14px] lg:text-[14px] text-black">
                                Name
                            </th>
                            <th className="px-4 md:px-4 lg:px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] md:text-[14px] lg:text-[14px] text-black">
                                Pay Rate
                            </th>
                            <th className="px-4 md:px-4 lg:px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] md:text-[14px] lg:text-[14px] text-black">
                                Terminal Assigned To
                            </th>
                            <th className="px-4 md:px-4 lg:px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] md:text-[14px] lg:text-[14px] text-black">
                                Availability
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Drivers.map((driver, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 md:px-1 lg:px-8 py-1 lg:py-1 border-b text-[14px] md:text-[14px] lg:text-[14px] font-semibold text-[#141516]">
                                    {driver.name}
                                </td>
                                <td className="px-6 md:px-1 lg:px-8 py-1 lg:py-1 border-b text-[14px] md:text-[14px] lg:text-[14px] font-semibold text-[#141516]">
                                    {driver.payrate}
                                </td>
                                <td className="px-6 md:px-1 lg:px-8 py-1 lg:py-1 border-b text-[14px] md:text-[14px] lg:text-[14px] font-semibold text-[#141516]">
                                    {driver.terminalAssignedTo}
                                </td>
                                <td className="px-6 md:px-1 lg:px-8 py-1 lg:py-1 border-b text-[14px] md:text-[14px] lg:text-[14px] font-medium">
                                    <div className={`${driver.availability === 'Present' ? 'bg-[#CCFAEB]' : 'bg-[#F6DCDE]'} w-[75px] md:w-[85px] lg:w-[100px] h-[30px] md:h-[35px] lg:h-[40px] flex items-center justify-center text-center rounded-md`}>
                                        <span className={`${driver.availability === 'Present' ? 'text-[#0BA071]' : 'text-[#C01824]'} text-[12px] md:text-[14px] lg:text-[16px]`}>
                                            {driver.availability}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default DriversCard
