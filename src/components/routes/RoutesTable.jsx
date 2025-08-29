import { scheduleData } from '@/data/routesTableData';
import React, { useState } from 'react';

const RoutesTable = () => {
    const [allChecked, setAllChecked] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            const newChecked = [...checkedItems, index];
            setCheckedItems(newChecked);
            if (newChecked.length === scheduleData.length) {
                setAllChecked(true);
            }
        }
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <>
            <div className="border border-[#EEEEEE] rounded mt-4">
                <div className="overflow-x-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="min-w-full">
                        <thead className="bg-[#EEEEEE] sticky top-0 z-10">
                            <tr>
                                <th className="px-3 py-2 border-b">
                                    {/* Select All Checkbox (optional to activate) */}
                                    {/* <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={allChecked}
                                        onChange={handleSelectAll}
                                    /> */}
                                </th>
                                <th className="px-3 py-2 border-b text-left font-bold">Time</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Pick-up Address (AM)</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Time</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Drop-off Address (PM)</th>
                                <th className="px-3 py-2 border-b text-left font-bold">Terminals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-3 py-2 border-b">
                                        {/* Item Checkbox (optional to activate) */}
                                        {/* <input
                                            type="checkbox"
                                            className="form-checkbox"
                                            checked={checkedItems.includes(index)}
                                            onChange={() => handleSelectItem(index)}
                                        /> */}
                                    </td>
                                    <td className="px-3 py-2 border-b">{item.time}</td>
                                    <td className="px-3 py-2 border-b whitespace-pre-line">{item.address}</td>
                                    <td className="px-3 py-2 border-b">{item.dropTime}</td>
                                    <td className="px-3 py-2 border-b whitespace-pre-line">{item.dropAddress}</td>
                                    <td className="px-3 py-2 border-b">
                                        <button
                                            className="text-[#c01824] underline"
                                            onClick={() => openModal(item)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg overflow-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Route Details</h2>
                            <button onClick={closeModal} className="text-gray-600 text-lg">&times;</button>
                        </div>
                        <table className="min-w-full border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border text-left font-bold">Terminals</th>
                                    <th className="px-4 py-2 border text-left font-bold">School</th>
                                    <th className="px-4 py-2 border text-left font-bold">Routes</th> 
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-4 py-2 border">R1 Terminal</td>
                                    <td className="px-4 py-2 border whitespace-pre-line">Taft Public School</td>
                                    <td className="px-4 py-2 border">12</td>
                                    
                                </tr>
                                  <tr>
                                    <td className="px-4 py-2 border">R2 Terminal</td>
                                    <td className="px-4 py-2 border whitespace-pre-line">Taft Public School</td>
                                    <td className="px-4 py-2 border">22</td>
                                    
                                </tr> 
                                  <tr>
                                    <td className="px-4 py-2 border">R3 Terminal</td>
                                    <td className="px-4 py-2 border whitespace-pre-line">Taft Public School</td>
                                    <td className="px-4 py-2 border">21</td>
                                    
                                </tr>
                            </tbody>
                        </table>

                        <div className="mt-4 text-right">
                            <button
                                onClick={closeModal}
                                className="bg-[#c01824] text-white px-4 py-2 rounded hover:bg-[#c01824]"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoutesTable;
