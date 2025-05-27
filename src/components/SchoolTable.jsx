import { VerticalDot } from '@/assets';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SchoolTable = () => {
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    const schools = [
        { name: 'Taft Public School', contact: '+42325643232', status: 'Active' },
        { name: 'Gohar High School', contact: '+42325643232', status: 'Active' },
        { name: 'Poppl Public School', contact: '+42325643232', status: 'Active' },
        { name: 'Notrw Grammer School', contact: '+42325643232', status: 'Active' },
        { name: 'Fafi Di School', contact: '+42325643232', status: 'Pending' },
        { name: 'Jodh Wad High School', contact: '+42325643232', status: 'Pending' },
        { name: 'New York School', contact: '+42325643232', status: 'Pending' },
    ];
    const handleSelectAll = () => {
        if (allChecked) {
            setCheckedItems([]);
        } else {
            setCheckedItems(schools.map((_, index) => index));
        }
        setAllChecked(!allChecked);
    };

    const handleSelectItem = (index) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter(item => item !== index));
        } else {
            setCheckedItems([...checkedItems, index]);
        }
    };
    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-full md:w-[50%] lg:w-[50%] xl:w-[50%] h-[100%]">
            {/* ---------------- Header of Card --------------- */}
            <div className="flex justify-between items-center pb-2">
                <h2 className="text-[22px] lg:text-[24px] xl:text-[26px] font-bold text-black font-Nunito Sans">Schools</h2>
                <Link to='/SchoolManagement'><h2 className='text-[#C01824] text-[16px] font-semibold font-[Nunito Sans]'>View All</h2></Link>
                {/* <button className="focus:outline-none border border-[#DADADA] w-[24px] lg:w-[28px] h-[24px] lg:h-[28px] flex items-center justify-center bg-[#F5F5F5]" style={{ borderRadius: "8px" }}>
                    <div className="w-[14px] lg:w-[17px] h-[14px] lg:h-[17px]">
                        <img src={VerticalDot} />
                    </div>
                </button> */}
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto mt-4 border border-[#EEEEEE] rounded">
                <table className="min-w-full">
                    <thead className="bg-[#EEEEEE]">
                        <tr>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-medium text-gray-500">
                                <input type="checkbox" className="form-checkbox custom-checkbox2 w-4 h-4 lg:w-5 lg:h-5" checked={allChecked} onChange={handleSelectAll} />
                            </th>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-bold text-black">
                                School / Company Name
                            </th>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-bold text-black">
                                Contact Info
                            </th>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-bold text-black">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {schools.map((school, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b">
                                    <input type="checkbox" className="form-checkbox custom-checkbox2 w-4 h-4 lg:w-5 lg:h-5"
                                        checked={checkedItems.includes(index)}
                                        onChange={() => handleSelectItem(index)} />
                                </td>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-sm lg:text-md font-bold text-black">
                                    {school.name}
                                </td>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-sm lg:text-md font-bold text-black">
                                    {school.contact}
                                </td>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-sm lg:text-md font-bold">
                                    <span
                                    className={`font-bold ${
                                        school.status === 'Active'
                                        ? 'bg-[#CCFAEB] text-[#28A745] p-2 rounded-md'
                                        : 'bg-[#FDFFA4] text-[#393E08] p-2  rounded-md'
                                    }`}
                                    >
                                    {school.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchoolTable;
