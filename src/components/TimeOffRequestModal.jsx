import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoCalendarOutline, IoChevronDownOutline } from 'react-icons/io5';
import { AiOutlinePaperClip } from 'react-icons/ai';

const TimeOffRequestModal = ({ closeModal }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">New Time-Off Request</h2>
            <button onClick={closeModal} className="text-[#000000] hover:text-[#000]">
              <IoMdClose className="text-xl" />
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-md font-medium text-[#000] mb-1">Request Type</label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 font-light text-[#9E9E9E] appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Choose leave type</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Annual Leave</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <IoChevronDownOutline className="text-[#000000]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-[#000] mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 font-light text-[#9E9E9E] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <IoCalendarOutline className="text-[#000000]" />
                </div>
              </div>
            </div>
          </div>

          {/* Duration & Attachments */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-md font-medium text-[#000] mb-1">Duration</label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md py-2 px-3 font-light text-[#9E9E9E] appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Choose duration</option>
                  <option>Half Day</option>
                  <option>Full Day</option>
                  <option>Multiple Days</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <IoChevronDownOutline className="text-[#000000]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-md font-medium text-[#000] mb-1">Attachments</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 font-light text-[#9E9E9E] cursor-pointer"
                >
                  {attachment ? attachment.name : 'Upload attachment'}
                  <AiOutlinePaperClip className="text-[#000000]" />
                </label>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <textarea
              placeholder="Reason note"
              rows={6}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={closeModal}
              className="bg-[#C01824] text-white px-6 py-2 rounded-md focus:outline-none"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="bg-[#D3D3D9] text-[#000] px-6 py-2 rounded-md focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOffRequestModal;
