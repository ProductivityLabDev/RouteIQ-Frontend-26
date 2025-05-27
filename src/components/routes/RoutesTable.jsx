import { scheduleData } from '@/data/routesTableData';
import React, { useState } from 'react';

const RoutesTable = () => {
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const handleSelectAll = () => {
        if (allChecked) {
            setCheckedItems([]);
        } else {
            setCheckedItems([...Array(scheduleData.length).keys()]);
        }
        setAllChecked(!allChecked);
    };

    const handleSelectItem = (index) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter(item => item !== index));
            setAllChecked(false);
        } else {
            setCheckedItems([...checkedItems, index]);
            if (checkedItems.length + 1 === scheduleData.length) {
                setAllChecked(true);
            }
        }
    };

    return (
        <div className="border border-[#EEEEEE] rounded mt-4">
            <div className="overflow-x-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full">
                    <thead className="bg-[#EEEEEE] sticky top-0 z-10">
                        <tr>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-medium text-gray-500">
                                {/* <input
                                    type="checkbox"
                                    className="form-checkbox custom-checkbox2 w-4 h-4 lg:w-5 lg:h-5"
                                    checked={allChecked}
                                    onChange={handleSelectAll}
                                /> */}
                            </th>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-bold text-black">
                                Time
                            </th>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-bold text-black">
                                Pick-up Address(AM)
                            </th>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-bold text-black">
                                Time
                            </th>
                            <th className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-left text-sm lg:text-md font-bold text-black">
                                Drop-off Address(PM)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b">
                                    {/* <input
                                        type="checkbox"
                                        className="form-checkbox custom-checkbox2 w-4 h-4 lg:w-5 lg:h-5"
                                        checked={checkedItems.includes(index)}
                                        onChange={() => handleSelectItem(index)}
                                    /> */}
                                </td>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-sm lg:text-md font-medium text-black">
                                    {item.time}
                                </td>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-sm lg:text-md font-medium text-black whitespace-pre-line">
                                    {item.address}
                                </td>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-sm lg:text-md font-medium text-black">
                                    {item.dropTime}
                                </td>
                                <td className="px-3 lg:px-4 xl:px-5 py-2 lg:py-3 border-b text-sm lg:text-md font-medium text-black whitespace-pre-line">
                                    {item.dropAddress}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoutesTable;