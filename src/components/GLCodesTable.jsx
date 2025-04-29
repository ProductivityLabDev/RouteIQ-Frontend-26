import React, { useState } from 'react'
import { vendors } from '@/data/dummyData'
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import EditDriver from '@/pages/employeeManagement/EditDriver';
import EditScheduledMaintenance from '@/pages/vehicleManagement/EditScheduledMaintenance';
import { EditTrip } from './Modals/EditTrip';



const GLCodesTable = ({ expandedVendor, toggleExpand, setAddExpense, setPayModal }) => {
    const [modalPosition, setModalPosition] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedModal, setEditedModal] = useState(false)
    const handleEllipsisClick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ top: rect.top + window.scrollY + 30, left: rect.left + window.scrollX - 140 });
        setIsModalOpen(true);
    };
    const hanldeEditModal = () => {
        setAddExpense(true)
        setIsModalOpen(false)
    }
    const hanldeTripEditModal = () => {
        setEditedModal(true)
        setIsModalOpen(false)
    }
    return (
        <div className="w-full overflow-hidden rounded-lg">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Vendor Name</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Address</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Phone No</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Payment Method</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Payment Terms</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">GL Codes</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Expenses</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {vendors.map((vendor, index) => (
                        <React.Fragment key={vendor.name}>
                            <tr className={vendor.name === "Ronald Richards" ? "bg-[#F9E8E9]" : "border-t border-gray-200"}>
                                <td className="py-3 px-4 flex items-center">
                                    {vendor.name === "Ronald Richards" && (
                                        <button onClick={() => toggleExpand(vendor.name)} className="mr-1">
                                            {expandedVendor === vendor.name ? <FaCaretDown size={18} /> : <FaCaretUp size={18} />}
                                        </button>
                                    )}
                                    <span>{vendor.name}</span>
                                </td>
                                <td className="py-3 px-4">{vendor.address}</td>
                                <td className="py-3 px-4">{vendor.phone}</td>
                                <td className="py-3 px-4">{vendor.paymentMethod}</td>
                                <td className="py-3 px-4">{vendor.paymentTerms}</td>
                                <td className="py-3 px-4">{vendor.glCodes}</td>
                                <td className="py-3 px-4">
                                    <span className="text-[#C01824] font-bold cursor-pointer" onClick={hanldeEditModal}>{vendor.expenses}</span>
                                </td>
                                <td className="py-3 px-4 flex items-center space-x-2">
                                    <button className={`px-4 py-1 rounded text-white font-medium ${vendor.name === "Annette Black" ? "bg-[#C01824]" : "bg-[#A3A2A2]"}`} onClick={() => setPayModal(true)}>
                                        PAY
                                    </button>
                                    <button onClick={handleEllipsisClick}>
                                        <FaEllipsisVertical size={18} />
                                    </button>
                                </td>
                                {isModalOpen && (
                                    <div id="custom-modal" className="fixed w-40 bg-white border rounded shadow-lg z-50 text-left" style={{ top: modalPosition.top, left: modalPosition.left }}>
                                        <ul className="py-2">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={hanldeTripEditModal}>Edit</li>
                                        </ul>
                                    </div>
                                )}
                            </tr>
                            {expandedVendor === vendor.name && (
                                <tr className="bg-[#F9E8E9]">
                                    <td colSpan={8} className="p-0">
                                        <div className="px-4 py-2">
                                            <table className="w-full bg-[#F9E8E9] rounded-lg">
                                                <thead className='bg-[#A5A3A3]'>
                                                    <tr>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">Vendor Name</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">Address</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">Phone No</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">Payment Method</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">Payment Terms</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">GL Codes</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">Expenses</th>
                                                        <th className="py-3 px-4 text-left font-semibold text-black">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vendors.slice(0, 3).map((nestedVendor, i) => (
                                                        <tr key={i} className="border-t border-[#A5A3A3]">
                                                            <td className="py-3 px-4">{nestedVendor.name}</td>
                                                            <td className="py-3 px-4">{nestedVendor.address}</td>
                                                            <td className="py-3 px-4">{nestedVendor.phone}</td>
                                                            <td className="py-3 px-4">{nestedVendor.paymentMethod}</td>
                                                            <td className="py-3 px-4">{nestedVendor.paymentTerms}</td>
                                                            <td className="py-3 px-4">{nestedVendor.glCodes}</td>
                                                            <td className="py-3 px-4">
                                                                <span className="text-[#C01824] font-bold cursor-pointer" onClick={hanldeEditModal}>{nestedVendor.expenses}</span>
                                                            </td>
                                                            <td className="py-3 px-4 flex items-center space-x-2">
                                                                <button className="px-4 py-1 rounded text-white font-medium bg-[#A3A2A2]" onClick={() => setPayModal(true)}>
                                                                    PAY
                                                                </button>
                                                                <button onClick={handleEllipsisClick}>
                                                                    <FaEllipsisVertical size={18} />
                                                                </button>
                                                            </td>
                                                            {isModalOpen && (
                                                                <div id="custom-modal" className="fixed w-40 bg-white border rounded shadow-lg z-50 text-left" style={{ top: modalPosition.top, left: modalPosition.left }}>
                                                                    <ul className="py-2">
                                                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {editedModal && (
                <EditTrip handleOpen={() => setEditedModal(false)} open={editedModal} />
            )}
        </div>
    )
}

export default GLCodesTable