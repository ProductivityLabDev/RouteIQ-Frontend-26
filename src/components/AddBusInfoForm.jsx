import { pickFileIcon } from '@/assets';
import React, { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const AddBusInfoForm = ({ handleCancel }) => {
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
          <h2 className='text-[18px] text-[#000] font-bold'>Bus Information</h2>
        </div>

        {/* Form Grid: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          {/* Column 1 */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-bold text-black mb-1">Vehicle name/number</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Vehicle name/number'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Bus type</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Bus type'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Number Plate</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Number Plate'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Year</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Year'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Service intervals</label>
            <input type="date" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Service intervals'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Fuel tank size</label>
           <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Fuel tank size'/>
          </div>

          {/* Column 2 */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-bold text-black mb-1">Vehicle Make</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Vehicle Make'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">No of passengers</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='No of passengers'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Vin No</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Vin No'/>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Mileage</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Mileage'/>

           <label className="block text-sm font-bold text-black mt-4 mb-1">Drivers</label>
            <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]">
              <option>Select Drivers</option>
              <option>Driver 1</option>
              <option>Driver 2</option>
              <option>Driver 3</option>
            </select>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Fuel type (gas, diesel)</label>
            <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]">
              <option>Select Fuel type (gas, diesel)</option>
              <option>Gas</option>
              <option>Diesel</option>
              
            </select>
          </div>
        </div>

        {/* Additional Fields (Row below 2 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          <div className="mb-4 w-full">
            <label className="block text-sm font-bold text-black mt-4 mb-1">Assigned Terminal</label>
              <select className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]">
              <option>Select Assigned</option>
              <option>Assigne 1</option>
              <option>Assigne 2</option>
              <option>Assigne 3</option>
            </select>

            <label className="block text-sm font-bold text-black mt-4 mb-1">Expiration Date</label>
            <input type="date" className="outline-none border border-[#D5D5D5] w-[70%] rounded-[6px] py-3 px-6 bg-[#F5F6FA]" placeholder='Expiration Date'/>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-sm font-bold text-black mt-4 mb-1">Insurance & Expiration</label>
            <input type="text" className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" placeholder='Insurance & Expiration'/>

          <div className="mt-6">
      <label className="block text-lg font-bold text-gray-800 mb-2">
        Undercarriage Storage
      </label>
      <div className="flex items-center gap-6">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="undercarriage"
            value="yes"
            checked={storageOption === 'yes'}
            onChange={() => setStorageOption('yes')}
            className="form-radio h-4 w-4 text-[#c01824]"
          />
          <span>Yes</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="undercarriage"
            value="no"
            checked={storageOption === 'no'}
            onChange={() => setStorageOption('no')}
            className="form-radio h-4 w-4 text-[#c01824]"
          />
          <span>No</span>
        </label>
      </div>
    </div>
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

export default AddBusInfoForm;
