import { Button } from '@material-tailwind/react';
import { useState } from 'react';
import { FaTimes, FaChevronRight, FaPlus } from 'react-icons/fa';

export default function GLCodesModal({ isOpen, onClose }) {
    const [code, setCode] = useState('');
    const [assignment, setAssignment] = useState('');

    const handleClose = () => {
        onClose()
    };

    const handleAdd = () => {
        // Handle adding GL code
        console.log('Adding GL code:', code, 'with assignment:', assignment);
        // Then close modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white w-[46%] rounded shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-0">
                    <h2 className="text-2xl font-medium text-gray-800">Add GL Codes</h2>
                    <button
                        onClick={handleClose}
                        className="text-black-500 hover:text-black-700"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        {/* Left column */}
                        <div className="mb-4 md:mb-0 flex-1">
                            <label className="block text-gray-700 font-medium mb-2">GL Codes</label>
                            <input
                                type="text"
                                placeholder="Enter code"
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        {/* Arrow */}
                        <div className="hidden md:flex items-center justify-center mt-6">
                            <FaChevronRight size={16} className="text-black-400" />
                        </div>

                        {/* Right column */}
                        <div className="flex-1 flex items-end">
                            <div className="w-full">
                                <label className="block text-gray-700 font-medium mb-2">Assign to</label>
                                <div className="flex">
                                    <div className="relative flex-1">
                                        <select
                                            className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-l bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            value={assignment}
                                            onChange={(e) => setAssignment(e.target.value)}
                                        >
                                            <option value="" disabled>Assign to</option>
                                            <option value="option1">Option 1</option>
                                            <option value="option2">Option 2</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg className="h-4 w-4 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <button className="flex items-center justify-center w-10 bg-white border border-l-0 border-gray-300 rounded-r hover:bg-gray-50">
                                        <FaPlus size={16} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 flex justify-end space-x-4">
                    <Button
                        size="lg"
                        variant="outlined"
                        onClick={handleAdd}
                        className="px-14 rounded-md text-[18px] capitalize border-2 border-[#C01824] py-3 text-[#C01824]"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        size="lg"
                        variant="filled"
                        onClick={handleAdd}
                        className="px-14 rounded-md text-[18px] capitalize bg-[#C01824] py-3"
                    >
                        <span>Submit</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}