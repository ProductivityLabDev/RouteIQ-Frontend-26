import React from 'react';
import {
    IoLocationOutline,
    IoCalendarOutline,
    IoTimeOutline,
    IoPencilOutline,
    IoChevronDownOutline
} from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi';

const EventModal = ({ closeModal }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header with event title */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#202224]">Event Title</h2>
                        <div className="flex items-center shadow-[0_4px_6px_rgba(0,0,0,0.1)] p-2 rounded-full w-[60px]">
                            <div className="w-5 h-5 bg-[#FFCB33] rounded-full mr-2"></div>
                            <IoChevronDownOutline className="text-[#5C5C5C]" />
                        </div>
                    </div>
                </div>

                {/* Form content */}
                <div className="divide-y divide-gray-200">
                    {/* Place */}
                    <div className="flex items-center px-6 py-4">
                        <IoLocationOutline className="text-[#5C5C5C] text-xl mr-4" />
                        <span className="text-[#202224] font-bold">Add Place</span>
                    </div>

                    {/* Date and time in a grid */}
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="flex items-center px-6 py-4">
                            <IoCalendarOutline className="text-gray-500 text-xl mr-4" />
                            <span className="text-[#202224] font-bold">Add Date</span>
                        </div>
                        <div className="flex items-center px-6 py-4">
                            <IoTimeOutline className="text-[#5C5C5C] text-xl mr-4" />
                            <span className="text-[#202224] font-bold">Add Time</span>
                        </div>
                    </div>

                    {/* Members */}
                    <div className="flex items-center px-6 py-4">
                        <HiUserGroup className="text-[#5C5C5C] text-xl mr-4" />
                        <span className="text-[#202224] font-bold">Add Members</span>
                    </div>

                    {/* Notes */}
                    <div className="flex items-center px-6 py-4">
                        <IoPencilOutline className="text-[#5C5C5C] text-xl mr-4" />
                        <span className="text-[#202224] font-bold">Add Notes</span>
                    </div>
                </div>

                {/* Footer with buttons */}
                <div className="flex justify-end space-x-3 p-6">
                    <button onClick={closeModal} className="px-6 py-2 border border-red-500 text-red-500 font-medium rounded-md">
                        Cancel
                    </button>
                    <button onClick={closeModal} className="px-6 py-2 bg-[#C01824] text-white font-medium rounded-md">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;