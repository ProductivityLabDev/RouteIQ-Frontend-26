import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorSchools } from '@/redux/slices/vendorDashboardSlice';

const SchoolTable = () => {
    const dispatch = useDispatch();
    const { schools, loading } = useSelector((s) => s.vendorDashboard);

    const [allChecked, setAllChecked]   = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        dispatch(fetchVendorSchools({ limit: 10, offset: 0 }));
    }, [dispatch]);

    const handleSelectAll = () => {
        if (allChecked) {
            setCheckedItems([]);
        } else {
            setCheckedItems(schools.map((_, i) => i));
        }
        setAllChecked(!allChecked);
    };

    const handleSelectItem = (index) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter(i => i !== index));
        } else {
            setCheckedItems([...checkedItems, index]);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%]">
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-[22px] lg:text-[24px] xl:text-[26px] font-bold text-black">Schools</h2>
                <Link to='/SchoolManagement'>
                    <h2 className='text-[#C01824] text-[16px] font-semibold'>View All</h2>
                </Link>
            </div>

            <div className="overflow-x-auto mt-4 border border-[#EEEEEE] rounded">
                <table className="min-w-full">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 border-b text-left text-sm">
                                <input
                                    type="checkbox"
                                    className="form-checkbox w-4 h-4 lg:w-5 lg:h-5"
                                    checked={allChecked}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 border-b text-left text-sm font-bold text-black">School / Company Name</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 border-b text-left text-sm font-bold text-black">Contact Info</th>
                            <th className="px-3 lg:px-4 py-2 lg:py-3 border-b text-left text-sm font-bold text-black">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading.schools ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">Loading...</td>
                            </tr>
                        ) : schools.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">No schools found</td>
                            </tr>
                        ) : (
                            schools.map((school, index) => (
                                <tr key={school.id ?? index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-3 lg:px-4 py-2 lg:py-3 border-b">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox w-4 h-4 lg:w-5 lg:h-5"
                                            checked={checkedItems.includes(index)}
                                            onChange={() => handleSelectItem(index)}
                                        />
                                    </td>
                                    <td className="px-3 lg:px-4 py-2 lg:py-3 border-b text-sm font-bold text-black">{school.name}</td>
                                    <td className="px-3 lg:px-4 py-2 lg:py-3 border-b text-sm font-bold text-black">{school.contactInfo}</td>
                                    <td className="px-3 lg:px-4 py-2 lg:py-3 border-b text-sm font-bold">
                                        <span className={`font-bold px-2 py-1 rounded-md ${
                                            school.status === 'Active'
                                                ? 'bg-[#CCFAEB] text-[#28A745]'
                                                : 'bg-[#FDFFA4] text-[#393E08]'
                                        }`}>
                                            {school.status}
                                        </span>
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

export default SchoolTable;
