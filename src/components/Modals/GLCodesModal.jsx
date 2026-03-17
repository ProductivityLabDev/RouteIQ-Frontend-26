import { Button } from '@material-tailwind/react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaChevronRight, FaPlus } from 'react-icons/fa';
import { addGlCode } from '@/redux/slices/payrollSlice';

export default function GLCodesModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.payroll);

    const [code, setCode] = useState('');
    const [glCodeName, setGlCodeName] = useState('');
    const [category, setCategory] = useState('');
    const [defaultUnitPrice, setDefaultUnitPrice] = useState('');
    const [assignedTo, setAssignedTo] = useState([]);
    const [assignInput, setAssignInput] = useState('');

    const handleAddAssignment = () => {
        const trimmed = assignInput.trim();
        if (trimmed && !assignedTo.includes(trimmed)) {
            setAssignedTo([...assignedTo, trimmed]);
        }
        setAssignInput('');
    };

    const handleSubmit = async () => {
        if (!code || !glCodeName || !category) return;
        const price = defaultUnitPrice !== '' ? parseFloat(defaultUnitPrice) : undefined;
        const result = await dispatch(addGlCode({ glCode: code, glCodeName, category, defaultUnitPrice: price, assignedTo }));
        if (result.meta.requestStatus === 'fulfilled') {
            setCode('');
            setGlCodeName('');
            setCategory('');
            setDefaultUnitPrice('');
            setAssignedTo([]);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white w-[46%] rounded shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-0">
                    <h2 className="text-2xl font-medium text-gray-800">Add GL Codes</h2>
                    <button onClick={onClose} className="text-black-500 hover:text-black-700">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
                        {/* GL Code */}
                        <div className="mb-4 md:mb-0 flex-1">
                            <label className="block text-gray-700 font-medium mb-2">GL Code</label>
                            <input
                                type="text"
                                placeholder="e.g. GL # 225-00"
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>

                        <div className="hidden md:flex items-center justify-center mt-8">
                            <FaChevronRight size={16} className="text-black-400" />
                        </div>

                        {/* GL Code Name */}
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-2">GL Code Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Fuel"
                                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={glCodeName}
                                onChange={(e) => setGlCodeName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Category</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="" disabled>Select category</option>
                            <option value="Asset">Asset</option>
                            <option value="Liability">Liability</option>
                            <option value="Revenue">Revenue</option>
                            <option value="Expense">Expense</option>
                            <option value="BalanceSheet">Balance Sheet</option>
                        </select>
                    </div>

                    {/* Default Unit Price */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Default Unit Price</label>
                        <input
                            type="number"
                            placeholder="e.g. 50.00"
                            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={defaultUnitPrice}
                            onChange={(e) => setDefaultUnitPrice(e.target.value)}
                        />
                    </div>

                    {/* Assign To */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Assign To</label>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Add assignment"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={assignInput}
                                onChange={(e) => setAssignInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddAssignment()}
                            />
                            <button
                                type="button"
                                onClick={handleAddAssignment}
                                className="flex items-center justify-center w-10 bg-white border border-l-0 border-gray-300 rounded-r hover:bg-gray-50"
                            >
                                <FaPlus size={16} className="text-red-600" />
                            </button>
                        </div>
                        {assignedTo.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {assignedTo.map((item, i) => (
                                    <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                        {item}
                                        <button onClick={() => setAssignedTo(assignedTo.filter((_, idx) => idx !== i))}>
                                            <FaTimes size={10} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {error.addGlCode && <p className="text-red-500 text-sm">{error.addGlCode}</p>}
                </div>

                {/* Footer */}
                <div className="p-6 flex justify-end space-x-4">
                    <Button
                        size="lg"
                        variant="outlined"
                        onClick={onClose}
                        className="px-14 rounded-md text-[18px] capitalize border-2 border-[#C01824] py-3 text-[#C01824]"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        size="lg"
                        variant="filled"
                        onClick={handleSubmit}
                        disabled={loading.addGlCode}
                        className="px-14 rounded-md text-[18px] capitalize bg-[#C01824] py-3"
                    >
                        <span>{loading.addGlCode ? 'Saving...' : 'Submit'}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
