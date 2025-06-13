import { SchoolManagementModal } from '@/pages/schoolManagement/SchoolManagementModal';
import React, { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";


const SchoolTable = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
 const [openSchoolManagementModal, setOpenSchoolManagementModal] = useState(false)
const [editInstitute, setEditInstitute] = useState(false)

  const handleMenuToggle = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleOpenPopUp = (isEdit = false) => {
  setEditInstitute(isEdit); 
  setOpenSchoolManagementModal(true);
  setOpenMenuIndex(null);
};

const handleClosePopUp = () => {
  setOpenSchoolManagementModal(false);
  setOpenMenuIndex(null);
};


  return (
    <>
      <div className="mt-3 mb-3 w-[95%] mx-auto border border-gray-200 rounded-md shadow">
        <table className="w-full text-center relative">
          <thead className="bg-[#EEEEEE]">
            <tr>
              {["Name", "Title", "Phone#1", "Phone#2", "Email", "Supervisor", "Username", "Grade", "Terminal to", "Action"].map((header) => (
                <th key={header} className="px-3 py-3 text-[14px] font-bold text-[#141516] border-b border-[#D9D9D9]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="border-b hover:bg-gray-50 relative">
                {Array(9).fill("Lorem").map((cell, idx) => (
                  <td key={idx} className="px-4 py-2 text-[14px] text-[#141516]">{cell}</td>
                ))}
                <td className="px-4 py-2 text-center relative">
                  <button
                    onClick={() => handleMenuToggle(i)}
                    className="p-1 rounded relative z-10"
                  >
                    <svg className="w-6 h-6 text-[#1F1F1F]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {openMenuIndex === i && (
                    <div className="absolute top-10 right-2 w-28 bg-white border rounded shadow z-20">
                     <button
                      onClick={() => handleOpenPopUp(true)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                    Edit
                    </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav className="flex gap-1">
          <button className="px-3 py-2 border rounded bg-[#919EAB]"><FaAngleLeft color="#fff" /></button>
          {[1, 2, 3].map((page) => (
            <button key={page} className={`px-3 py-1 border rounded ${page === 1 ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`}>{page}</button>
          ))}
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 border rounded hover:bg-gray-200">12</button>
          <button className="px-3 py-1 border rounded bg-[#919EAB]"><FaAngleRight color="#fff" /></button>
        </nav>
      </div>

     <SchoolManagementModal
  open={openSchoolManagementModal}
  handleOpen={handleClosePopUp}
  editInstitute={editInstitute}
/>
    </>
  );
};

export default SchoolTable;
