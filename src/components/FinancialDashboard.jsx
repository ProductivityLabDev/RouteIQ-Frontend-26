import React, { useState } from 'react';
import {
    FaCaretDown,
    FaChevronDown,
    FaEdit,
    FaSave,
    FaTimes,
    FaPlus,
    FaTrash
} from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';

export default function FinancialDashboard({ selectedTab = 'Balance Sheet' }) {
    const [year, setYear] = useState('2024');
    const [month, setMonth] = useState('August');
    
    // Edit mode state
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Dropdown states
    const [dateOverviewOpen1, setDateOverviewOpen1] = useState(false);
    const [dateOverviewOpen2, setDateOverviewOpen2] = useState(false);
    const [reportTypeLineOpen, setReportTypeLineOpen] = useState(false);
    const [reportTypeBarOpen, setReportTypeBarOpen] = useState(false);
    
    // Selected values
    const [selectedDateOverview1, setSelectedDateOverview1] = useState('Overview');
    const [selectedDateOverview2, setSelectedDateOverview2] = useState('Overview');
    const [selectedReportTypeLine, setSelectedReportTypeLine] = useState('Lines');
    const [selectedReportTypeBar, setSelectedReportTypeBar] = useState('Bars');

    // Balance Sheet Data State
    const [balanceSheetData, setBalanceSheetData] = useState({
        currentAssets: [
            { name: 'GLR-101-01. Marketable securities', value: 30816, isEditing: false },
            { name: 'GLR-101-02. Cash and cash equivalents', value: 25000, isEditing: false },
            { name: 'GLR-101-03. Accounts receivable', value: 18500, isEditing: false },
            { name: 'GLR-101-04. Inventory', value: 22000, isEditing: false },
            { name: 'GLR-101-05. Prepaid expenses', value: 15000, isEditing: false },
            { name: 'GLR-101-06. Short-term investments', value: 32397, isEditing: false }
        ],
        nonCurrentAssets: [
            { name: 'GLR-201-01. Property, plant & equipment', value: 85000, isEditing: false },
            { name: 'GLR-201-02. Intangible assets', value: 45000, isEditing: false },
            { name: 'GLR-201-03. Long-term investments', value: 35000, isEditing: false },
            { name: 'GLR-201-04. Goodwill', value: 25000, isEditing: false },
            { name: 'GLR-201-05. Deferred tax assets', value: 12000, isEditing: false }
        ],
        currentLiabilities: [
            { name: 'GLR-301-01. Accounts payable', value: 18000, isEditing: false },
            { name: 'GLR-301-02. Short-term debt', value: 25000, isEditing: false },
            { name: 'GLR-301-03. Accrued liabilities', value: 12000, isEditing: false },
            { name: 'GLR-301-04. Current portion of long-term debt', value: 15000, isEditing: false },
            { name: 'GLR-301-05. Taxes payable', value: 8000, isEditing: false }
        ],
        nonCurrentLiabilities: [
            { name: 'GLR-401-01. Long-term debt', value: 95000, isEditing: false },
            { name: 'GLR-401-02. Deferred tax liabilities', value: 18000, isEditing: false },
            { name: 'GLR-401-03. Pension obligations', value: 22000, isEditing: false }
        ]
    });

    // Options for dropdowns
    const dateOptions = ['Overview', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
    const reportTypeOptions = ['Lines', 'Bars', 'Area', 'Pie', 'Scatter'];

    // Sample data for charts
    const lineChartData = [
        { name: 'Jan', value: 20000 },
        { name: 'Feb', value: 15000 },
        { name: 'Mar', value: 30000 },
        { name: 'Apr', value: 27000 },
        { name: 'May', value: 18000 },
        { name: 'Jun', value: 23000 },
        { name: 'Jul', value: 34000 },
        { name: 'Aug', value: 41210 },
        { name: 'Sep', value: 30000 },
        { name: 'Oct', value: 25000 },
        { name: 'Nov', value: 39000 },
        { name: 'Dec', value: 24000 },
    ];

    const barChartData = [
        { month: 'JAN', revenue: 20000, expenses: 15000 },
        { month: 'FEB', revenue: 38000, expenses: 25000 },
        { month: 'MAR', revenue: 45000, expenses: 38000 },
        { month: 'APR', revenue: 40000, expenses: 30000 },
        { month: 'MAY', revenue: 18000, expenses: 12000 },
        { month: 'JUN', revenue: 42000, expenses: 30000 },
    ];

    // Calculate totals
    const totalCurrentAssets = balanceSheetData.currentAssets.reduce((sum, item) => sum + item.value, 0);
    const totalNonCurrentAssets = balanceSheetData.nonCurrentAssets.reduce((sum, item) => sum + item.value, 0);
    const totalCurrentLiabilities = balanceSheetData.currentLiabilities.reduce((sum, item) => sum + item.value, 0);
    const totalNonCurrentLiabilities = balanceSheetData.nonCurrentLiabilities.reduce((sum, item) => sum + item.value, 0);

    // Handle individual item edit
    const handleItemEdit = (section, index, field, value) => {
        setBalanceSheetData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    // Handle input changes
    const handleInputChange = (section, index, newValue) => {
        const value = parseFloat(newValue.replace(/[^0-9.-]+/g, '')) || 0;
        handleItemEdit(section, index, 'value', value);
    };

    // Handle name changes
    const handleNameChange = (section, index, newName) => {
        handleItemEdit(section, index, 'name', newName);
    };

    // Toggle individual item edit mode
    const toggleItemEdit = (section, index) => {
        setBalanceSheetData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => 
                i === index ? { ...item, isEditing: !item.isEditing } : item
            )
        }));
    };

    // Add new item
    const addNewItem = (section) => {
        const newItem = {
            name: 'New Item',
            value: 0,
            isEditing: true
        };
        setBalanceSheetData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    // Delete item
    const deleteItem = (section, index) => {
        setBalanceSheetData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        // Reset all individual edit states when toggling main edit mode
        if (isEditMode) {
            setBalanceSheetData(prev => ({
                currentAssets: prev.currentAssets.map(item => ({ ...item, isEditing: false })),
                nonCurrentAssets: prev.nonCurrentAssets.map(item => ({ ...item, isEditing: false })),
                currentLiabilities: prev.currentLiabilities.map(item => ({ ...item, isEditing: false })),
                nonCurrentLiabilities: prev.nonCurrentLiabilities.map(item => ({ ...item, isEditing: false }))
            }));
        }
    };

    // Dropdown component
    const Dropdown = ({ isOpen, setIsOpen, selected, setSelected, options, label, width = "w-48" }) => (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center ${width} justify-between`}
            >
                <span className="truncate">{label}: {selected}</span>
                <FaChevronDown className={`ml-1 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} size={10} />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    setSelected(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                                    selected === option ? 'bg-gray-100 font-medium' : ''
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // Render editable item
    const renderEditableItem = (item, index, section) => (
        <div key={`${section}-${index}`} className="flex justify-between items-center py-1 px-2 bg-gray-100 group">
            <div className="flex-1 mr-2">
                {item.isEditing ? (
                    <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleNameChange(section, index, e.target.value)}
                        className="w-full text-sm text-[#141516] font-semibold border border-gray-300 rounded px-2 py-1"
                        autoFocus
                    />
                ) : (
                    <div className="text-sm text-[#141516] font-semibold">{item.name}</div>
                )}
            </div>
            <div className="flex items-center space-x-2">
                <div className="text-sm text-[#141516] font-semibold">
                    {item.isEditing ? (
                        <input
                            type="text"
                            value={formatCurrency(item.value)}
                            onChange={(e) => handleInputChange(section, index, e.target.value)}
                            className="w-24 text-right border border-gray-300 rounded px-1 py-0.5 text-xs"
                        />
                    ) : (
                        formatCurrency(item.value)
                    )}
                </div>
                {isEditMode && (
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => toggleItemEdit(section, index)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                        >
                            {item.isEditing ? <FaSave size={12} /> : <FaEdit size={12} />}
                        </button>
                        <button
                            onClick={() => deleteItem(section, index)}
                            className="p-1 text-red-600 hover:text-red-800"
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Render section with add button
    const renderSection = (title, items, section) => (
        <div>
            <div className="bg-gray-200 p-2 mb-1 flex justify-between items-center">
                <div className="font-bold text-[#141516]">{title}</div>
                {isEditMode && (
                    <button
                        onClick={() => addNewItem(section)}
                        className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                    >
                        <FaPlus size={12} />
                        <span className="text-xs">Add</span>
                    </button>
                )}
            </div>
            {items.map((item, index) => renderEditableItem(item, index, section))}
        </div>
    );

    return (
        <div className="p-4 min-h-screen bg-gray-50">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Year Selector */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-white p-2 rounded mr-3">
                        <div className="w-[30px] h-[30px] bg-white rounded flex items-center justify-center">
                            <span className="text-[#C01824] font-bold text-sm">📅</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-[#565656] text-[14px] font-bold">Year</div>
                        <div className="flex items-center">
                            <span className="font-medium text-[#141516] text-[33px]">2024</span>
                            <FaCaretDown className="ml-1 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Month Selector */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-red-600 p-2 rounded mr-3">
                        <div className="w-[30px] h-[30px] bg-white rounded flex items-center justify-center">
                            <span className="text-[#C01824] font-bold text-xs">JAN</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[#565656] text-[14px] font-bold">Month</div>
                        <div className="flex items-center">
                            <span className="font-medium text-[#141516] text-[33px]">August</span>
                            <FaCaretDown className="ml-1 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Gross Income */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-green-600 p-2 rounded mr-3">
                        <div className="w-[30px] h-[30px] bg-white rounded flex items-center justify-center">
                            <span className="text-green-600 font-bold text-lg">↓</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <div className="text-[#565656] text-[14px] font-bold">Gross Income</div>
                            <span className="text-xs ml-2 px-1 bg-green-100 text-green-600 rounded">+10%</span>
                        </div>
                        <div className="font-medium text-[#141516] text-[33px]">$41,210</div>
                    </div>
                </div>

                {/* Net Income */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-red-600 p-2 rounded mr-3">
                        <div className="w-[30px] h-[30px] bg-white rounded flex items-center justify-center">
                            <span className="text-red-600 font-bold text-lg">↗</span>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <div className="text-[14px] text-[#565656] font-bold">Net Income</div>
                            <span className="text-xs ml-2 px-1 bg-red-100 text-red-600 rounded">-2%</span>
                        </div>
                        <div className="font-medium text-[#141516] text-[33px]">$41,210</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm w-full mt-6 mx-auto max-h-[665px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-lg font-bold text-center flex-grow">CONSOLIDATED BALANCE SHEET</h1>
                        <button 
                            onClick={toggleEditMode}
                            className={`text-sm flex items-center transition-colors px-3 py-1 rounded ${
                                isEditMode 
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                    : 'bg-red-100 text-red-500 hover:bg-red-200'
                            }`}
                        >
                            {isEditMode ? <FaSave className="mr-1" /> : <FaEdit className="mr-1" />}
                            {isEditMode ? 'Save Changes' : 'Edit Mode'}
                        </button>
                    </div>

                    {/* ASSETS Section */}
                    <div className="text-center font-bold bg-white py-2 mb-2 text-[#141516] text-[18px]">ASSETS</div>

                    {/* Current Assets */}
                    {renderSection('Current assets', balanceSheetData.currentAssets, 'currentAssets')}

                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>Total current assets</div>
                        <div>{formatCurrency(totalCurrentAssets)}</div>
                    </div>

                    {/* Non-Current Assets */}
                    {renderSection('Non-Current assets', balanceSheetData.nonCurrentAssets, 'nonCurrentAssets')}

                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>Total Non-Current assets</div>
                        <div>{formatCurrency(totalNonCurrentAssets)}</div>
                    </div>

                    {/* LIABILITIES AND SHAREHOLDERS EQUITY Section */}
                    <div className="text-center font-bold bg-white py-2 mb-2 mt-4">LIABILITIES AND SHAREHOLDERS EQUITY</div>

                    {/* Current Liabilities */}
                    {renderSection('Current Liabilities', balanceSheetData.currentLiabilities, 'currentLiabilities')}

                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>Total Current Liabilities</div>
                        <div>{formatCurrency(totalCurrentLiabilities)}</div>
                    </div>

                    {/* Non-Current Liabilities */}
                    {renderSection('Non-Current Liabilities', balanceSheetData.nonCurrentLiabilities, 'nonCurrentLiabilities')}

                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>Total Non-Current Liabilities</div>
                        <div>{formatCurrency(totalNonCurrentLiabilities)}</div>
                    </div>

                    {/* Total Assets and Equity */}
                    <div className="mt-4 pt-2 border-t-2 border-gray-300">
                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824] text-lg">
                            <div>TOTAL ASSETS</div>
                            <div>{formatCurrency(totalCurrentAssets + totalNonCurrentAssets)}</div>
                        </div>
                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824] text-lg">
                            <div>TOTAL LIABILITIES & EQUITY</div>
                            <div>{formatCurrency(totalCurrentLiabilities + totalNonCurrentLiabilities)}</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="flex flex-col gap-4">
                    {/* Overview Line Chart */}
                    <div className="flex items-end justify-end space-x-2">
                        <Dropdown
                            isOpen={dateOverviewOpen1}
                            setIsOpen={setDateOverviewOpen1}
                            selected={selectedDateOverview1}
                            setSelected={setSelectedDateOverview1}
                            options={dateOptions}
                            label="Select Date"
                            width="w-40"
                        />
                        <Dropdown
                            isOpen={reportTypeLineOpen}
                            setIsOpen={setReportTypeLineOpen}
                            selected={selectedReportTypeLine}
                            setSelected={setSelectedReportTypeLine}
                            options={reportTypeOptions}
                            label="Report Type"
                            width="w-40"
                        />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-medium text-gray-700">Overview</div>
                            <div className="flex mb-2 text-xs">
                                <div className="flex items-center mr-4">
                                    <div className="w-2 h-2 rounded-full bg-[#C01824] mr-1"></div>
                                    <span>Income</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-[#EBB7BB] mr-1"></div>
                                    <span>Expenses</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                    <ReferenceLine
                                        x="Aug"
                                        stroke="#EF4444"
                                        label={{
                                            value: "$41,210",
                                            position: "top",
                                            fill: "#EF4444",
                                            fontSize: 12,
                                            fontWeight: "bold",
                                            dy: -8
                                        }}
                                        strokeDasharray="3 3"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue Bar Chart */}
                    <div className="flex items-end justify-end space-x-2">
                        <Dropdown
                            isOpen={dateOverviewOpen2}
                            setIsOpen={setDateOverviewOpen2}
                            selected={selectedDateOverview2}
                            setSelected={setSelectedDateOverview2}
                            options={dateOptions}
                            label="Select Date"
                            width="w-40"
                        />
                        <Dropdown
                            isOpen={reportTypeBarOpen}
                            setIsOpen={setReportTypeBarOpen}
                            selected={selectedReportTypeBar}
                            setSelected={setSelectedReportTypeBar}
                            options={reportTypeOptions}
                            label="Report Type"
                            width="w-40"
                        />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-medium text-gray-700">Total Revenue</div>
                        </div>

                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Bar dataKey="revenue" fill="#EF4444" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="expenses" fill="#6B7280" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}