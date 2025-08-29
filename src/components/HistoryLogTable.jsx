import React, { useState } from 'react'
import { vendors, vendorsHistoryTable } from '@/data/dummyData'
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import EditDriver from '@/pages/employeeManagement/EditDriver';
import EditScheduledMaintenance from '@/pages/vehicleManagement/EditScheduledMaintenance';
import { EditTrip } from './Modals/EditTrip';
import { Button } from '@mui/material';

const HistoryLogTable = ({ expandedVendor, toggleExpand, setAddExpense, setPayModal }) => {
  const [modalPosition, setModalPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedModal, setEditedModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter vendors based on search input
  const filteredVendors = vendorsHistoryTable.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full overflow-hidden rounded-lg">
      {/* 🔍 Search Bar */}
     <div className="flex items-center mb-4">
  <input
    type="text"
    placeholder="Search by vendor name..."
    className="border border-gray-300 rounded px-4 py-2 w-[300px] focus:outline-none focus:ring-2 focus:ring-[#C01824]"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button
    type="button"
    onClick={() => console.log('Search clicked with:', searchTerm)}
    className="ml-4 bg-[#C01824] text-white px-5 py-2 rounded hover:bg-[#a9141d] transition"
  >
    Search
  </button>
</div>

      {/* 🧾 Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Vendor Name</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Address</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Phone No</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Payment Method</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Payment Terms</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">GL Codes</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Expenses/Bill</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-800">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map((vendor, index) => (
            <React.Fragment key={vendor.name}>
              <tr className={vendor.name === "Ronald Richards" ? "bg-[#fff]" : "border-t border-gray-200"}>
                <td className="py-3 px-4 flex items-center">
                  {vendor.name === "Ronald Richards" && (
                    <button onClick={() => toggleExpand(vendor.name)} className="mr-1"></button>
                  )}
                  <span>{vendor.name}</span>
                </td>
                <td className="py-3 px-4">{vendor.address}</td>
                <td className="py-3 px-4">{vendor.phone}</td>
                <td className="py-3 px-4">{vendor.paymentMethod}</td>
                <td className="py-3 px-4">{vendor.paymentTerms}</td>
                <td className="py-3 px-4">{vendor.glCodes}</td>
                <td className="py-3 px-4">
                 BILL-1023
                </td>
                <td className="py-3 px-4 flex items-center space-x-2">
                  <button className="px-4 py-1 rounded text-black font-medium">
                    {vendor?.amount}
                  </button>
                  <button className='text-[#147D2C] py-1 rounded p-6 font-bold bg-[#C2FACE] cursor-pointer'>
                    Paid
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
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {editedModal && (
        <EditTrip handleOpen={() => setEditedModal(false)} open={editedModal} />
      )}
    </div>
  );
};

export default HistoryLogTable;
