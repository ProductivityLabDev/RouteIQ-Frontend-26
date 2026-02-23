import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDrivers } from '@/redux/slices/vendorDashboardSlice';

const DriversCard = () => {
    const dispatch = useDispatch();
    const { drivers, loading } = useSelector((s) => s.vendorDashboard);

    useEffect(() => {
        dispatch(fetchVendorDrivers({ limit: 10, offset: 0 }));
    }, [dispatch]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-[70%] lg:w-[60%] xl:w-[48%] h-[100%]">
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-[22px] lg:text-[28px] xl:text-[32px] font-bold text-black">Drivers</h2>
                <Link to='/EmployeeManagement'>
                    <h2 className='text-[#C01824] text-[16px] font-semibold'>View All</h2>
                </Link>
            </div>

            <div className="overflow-x-auto mt-1 border border-gray-200 rounded h-[20vh] lg:h-[45vh]">
                <table className="min-w-full text-[14px]">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] text-black">Name</th>
                            <th className="px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] text-black">Pay Rate</th>
                            <th className="px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] text-black">Terminal</th>
                            <th className="px-4 py-1 lg:py-3 border-b text-left font-bold text-[14px] text-black">Availability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading.drivers ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">Loading...</td>
                            </tr>
                        ) : drivers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">No drivers found</td>
                            </tr>
                        ) : (
                            drivers.map((driver, index) => (
                                <tr key={driver.id ?? index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-1 lg:py-2 border-b text-[14px] font-semibold text-[#141516]">
                                        {driver.name}
                                    </td>
                                    <td className="px-4 py-1 lg:py-2 border-b text-[14px] font-semibold text-[#141516]">
                                        {driver.payRate}
                                    </td>
                                    <td className="px-4 py-1 lg:py-2 border-b text-[14px] font-semibold text-[#141516]">
                                        {driver.terminalAssignedTo || '--'}
                                    </td>
                                    <td className="px-4 py-1 lg:py-2 border-b text-[14px] font-medium">
                                        <div className={`${driver.availability === 'Present' ? 'bg-[#CCFAEB]' : 'bg-[#F6DCDE]'} w-[85px] lg:w-[100px] h-[32px] lg:h-[38px] flex items-center justify-center rounded-md`}>
                                            <span className={`${driver.availability === 'Present' ? 'text-[#0BA071]' : 'text-[#C01824]'} text-[12px] lg:text-[14px]`}>
                                                {driver.availability}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DriversCard;
