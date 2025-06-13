import React from "react";
import { LuMapPin } from "react-icons/lu";
import { FaCalendarDays } from "react-icons/fa6";



export default function EditModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black text-xl">&times;</button>
        <h2 className="text-[32px] font-bold mb-6 text-[#202224]">Edit</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1 */}
          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Pickup</label>
            <div className="relative">
              <input type="text" placeholder="Enter pickup location" className="w-full p-3 border rounded-md border-[#D5D5D5] bg-[#F5F6FA]" />
              <span className="absolute right-3 top-3.5 text-red-600"><LuMapPin /></span>
            </div>
          </div>

          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Drop</label>
            <div className="relative">
              <input type="text" placeholder="Enter drop location" className="w-full p-3 border rounded-md border-[#D5D5D5] bg-[#F5F6FA]" />
              <span className="absolute right-3 top-3.5 text-red-600"><LuMapPin /></span>
            </div>
          </div>

          {/* Row 2 */}
          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Date</label>
            <div className="relative">
              <input type="date" className="w-full p-3 border rounded-md border-[#D5D5D5] bg-[#F5F6FA]" />
              <span className="absolute right-3 top-3.5 text-red-600"><FaCalendarDays /></span>
            </div>
          </div>

          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Pickup Time</label>
            <div className="relative">
              <input type="time" className="w-full p-3 border rounded-md border-[#D5D5D5] bg-[#F5F6FA]" />
              <span className="absolute right-3 top-3.5"></span>
            </div>
          </div>

          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Student Name</label>
            <input type="text" placeholder="Select name" className="w-full p-3 border rounded-md border-[#D5D5D5] bg-[#F5F6FA]" />
          </div>

          {/* Row 3 */}
          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Driver Name</label>
            <select className="w-full p-3 border rounded-md">
              <option>Select driver</option>
            </select>
          </div>

          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Bus 1 Number</label>
            <input type="text" placeholder="Enter bus no" className="w-full p-3 border rounded-md" />
          </div>

          {/* Row 4 */}
          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Driver Name</label>
            <select className="w-full p-3 border rounded-md">
              <option>Select driver</option>
            </select>
          </div>

          <div>
            <label className="text-[#202224] text-[14px] font-semibold mb-1">Bus 2 Number</label>
            <input type="text" placeholder="Enter bus no" className="w-full p-3 border rounded-md" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={onClose} className="px-6 py-2 border border-[#C01824] text-[#C01824] rounded-md hover:bg-red-50">Cancel</button>
          <button className="px-6 py-2 bg-[#C01824] text-white rounded-md hover:bg-red-700">Update</button>
        </div>
      </div>
    </div>
  );
}
