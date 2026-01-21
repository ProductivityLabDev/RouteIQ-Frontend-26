import React, { useState } from 'react';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createRepairSchedule } from '@/redux/slices/repairScheduleSlice';
import { toast } from 'react-hot-toast';

const ServiceRecordForm = ({ handleCancel, vehicle, busId, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.repairSchedule);

  const [formData, setFormData] = useState({
    serviceDesc: '',
    passNum: '',
    partDesc: '',
    quantity: '',
    vendor: '',
    repairType: 'repair',
    partCost: '',
    mileage: '',
    estimatedCompletionTime: '',
    terminal: '',
    notes: '',
    repairDate: new Date().toISOString().split('T')[0],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!busId) {
      toast.error("Bus ID is required");
      return;
    }

    try {
      const payload = {
        busId: Number(busId),
        serviceDesc: formData.serviceDesc || undefined,
        partDesc: formData.partDesc || undefined,
        passNum: formData.passNum ? Number(formData.passNum) : undefined,
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
        partCost: formData.partCost ? Number(formData.partCost) : undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        estimatedCompletionTime: formData.estimatedCompletionTime || undefined,
        vendor: formData.vendor || undefined,
        terminal: formData.terminal || undefined,
        repairType: formData.repairType === 'repair' ? 1 : 2,
        notes: formData.notes || undefined,
        repairDate: formData.repairDate || new Date().toISOString(),
      };

      const result = await dispatch(createRepairSchedule(payload));
      
      if (createRepairSchedule.fulfilled.match(result)) {
        if (onSuccess) {
          onSuccess();
        } else {
          handleCancel();
        }
      }
    } catch (error) {
      console.error("Error creating repair schedule:", error);
    }
  };

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
            <input 
              type="text" 
              name="serviceDesc"
              value={formData.serviceDesc}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Repair/Service Description'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">P/N</label>
            <input 
              type="text" 
              name="passNum"
              value={formData.passNum}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='P/N'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Part Description</label>
            <input 
              type="text" 
              name="partDesc"
              value={formData.partDesc}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Part Description'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Qty</label>
            <input 
              type="number" 
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Qty'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Vendor</label>
            <input 
              type="text" 
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Vendor'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Repair Type</label>
            <select 
              name="repairType"
              value={formData.repairType}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]"
            >
              <option value="repair">Repair</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Column 2 */}
          <div className="mb-4 w-full">
            <label className="block text-sm font-bold text-black mb-1">Part Cost</label>
            <input 
              type="number" 
              name="partCost"
              value={formData.partCost}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Part Cost'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Mileage</label>
            <input 
              type="number" 
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Mileage'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Estimated Completion</label>
            <input 
              type="text" 
              name="estimatedCompletionTime"
              value={formData.estimatedCompletionTime}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Estimated Completion (e.g., 3 Hours)'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Terminal</label>
            <input 
              type="text" 
              name="terminal"
              value={formData.terminal}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Terminal'
            />

            <label className="block text-sm font-bold text-black mt-4 mb-1">Notes</label>
            <input 
              type="text" 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 bg-[#F5F6FA] w-[70%]" 
              placeholder='Notes'
            />
           
        
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-start space-x-4 px-6 pb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-4 bg-gray-500 w-[30%] text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading.creating}
            className="px-8 py-4 bg-[#C01824] w-[30%] text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.creating ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRecordForm;
