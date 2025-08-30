import React, { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const ServiceRecordForm = ({ handleCancel }) => {

  const [formData, setFormData] = useState({});
    const [storageOption, setStorageOption] = useState('');

  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 bg-white w-full rounded-lg">
      <form className="w-full">
        {/* Header */}
        <div className='flex items-center gap-4 p-9'>
          <button 
           type="submit"  
           className="text-black hover:text-red-600" 
           onClick={(e) => { e.preventDefault();
           handleCancel();
           }}>
          <FaArrowLeft className="cursor-pointer" />
          </button>
          <h2 className='text-[18px] text-[#000] font-bold'>Services Record</h2>
        </div>

        {/* Form Grid: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          {/* Column 1 */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-bold text-black mb-1">Repair/Service Description</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Repair/Service Description'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">P/N</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='P/N'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Part Description</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Part Description'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Qty</label>
           <input type="number" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Qty'/>

          <label className="block text-sm font-bold text-black mt-4 mb-1">Vendor</label>
          <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Vendor'/>

          <label className="block text-sm font-bold text-black mt-4 mb-1">Repair Type</label>
          <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]">
            <option value="repair">Repair</option>
            <option value="maintenance">Maintenance</option>
          </select>
          </div>

          {/* Column 2 */}
          <div className="mb-4 w-full">
           

            <label className="block text-sm font-bold text-black mt-4 mb-1">Part Cost</label>
            <input type="number" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Part Cost'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Mileage</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Mileage'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Estimated Completion</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Estimated Completion'/>

             <label className="block text-sm font-bold text-black mt-4 mb-1">Terminal</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Terminal'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Notes</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Notes'/>
           
        
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-start space-x-4 px-6 pb-6">
         
          <button
            type="submit"
            onClick={handleCancel}
            className="px-8 py-4 bg-[#C01824] w-[30%] text-white rounded hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRecordForm;
