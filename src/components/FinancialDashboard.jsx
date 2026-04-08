import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FaCaretDown,
    FaChevronDown,
    FaEdit,
    FaSave,
    FaTimes,
    FaPlus,
    FaTrash,
    FaCheck
} from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {
    fetchBalanceSheet,
    fetchBalanceSheetSummary,
    fetchBalanceSheetChart,
    addBalanceSheetEntry,
    updateBalanceSheetEntry,
    deleteBalanceSheetEntry,
} from '@/redux/slices/balanceSheetSlice';
import {
    fetchIncomeStatement,
    fetchIncomeStatementChart,
} from '@/redux/slices/incomeStatementSlice';

export default function FinancialDashboard({ selectedTab = 'Balance Sheet' }) {
    const dispatch = useDispatch();
    const balanceSheetState = useSelector((state) => state.balanceSheet);
    const incomeStatementState = useSelector((state) => state.incomeStatement);
    const isIncomeStatement = selectedTab === 'Income Statement';
    const { sections, summary, chartData, loading } = balanceSheetState;
    const incomeStatement = incomeStatementState?.statement;
    const incomeChartData = incomeStatementState?.chartData || [];
    const incomeLoading = incomeStatementState?.loading || {};

    const [year, setYear] = useState('2026');
    const [month, setMonth] = useState('August');
    const [isEditMode, setIsEditMode] = useState(false);

    const [yearOpen, setYearOpen] = useState(false);
    const [monthOpen, setMonthOpen] = useState(false);

    const yearOptions = ['2022', '2023', '2024', '2025', '2026', '2027'];
    const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthMap = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };

    // Dropdown states
    const [dateOverviewOpen1, setDateOverviewOpen1] = useState(false);
    const [dateOverviewOpen2, setDateOverviewOpen2] = useState(false);
    const [reportTypeLineOpen, setReportTypeLineOpen] = useState(false);
    const [reportTypeBarOpen, setReportTypeBarOpen] = useState(false);
    const [selectedDateOverview1, setSelectedDateOverview1] = useState('Overview');
    const [selectedDateOverview2, setSelectedDateOverview2] = useState('Overview');
    const [selectedReportTypeLine, setSelectedReportTypeLine] = useState('Lines');
    const [selectedReportTypeBar, setSelectedReportTypeBar] = useState('Bars');

    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editLabel, setEditLabel] = useState('');
    const [editAmount, setEditAmount] = useState('');

    // Add entry state
    const [addingSection, setAddingSection] = useState(null);
    const [newLabel, setNewLabel] = useState('');
    const [newAmount, setNewAmount] = useState('');

    useEffect(() => {
        const m = monthMap[month];
        const startDate = `${year}-${String(m).padStart(2, '0')}-01`;
        const lastDay = new Date(parseInt(year), m, 0).getDate();
        const endDate = `${year}-${String(m).padStart(2, '0')}-${lastDay}`;
        if (isIncomeStatement) {
            dispatch(fetchIncomeStatement({ startDate, endDate }));
        } else {
            dispatch(fetchBalanceSheet({ startDate, endDate }));
            dispatch(fetchBalanceSheetSummary({ startDate, endDate }));
        }
    }, [dispatch, year, month, isIncomeStatement]);

    useEffect(() => {
        if (isIncomeStatement) {
            dispatch(fetchIncomeStatementChart({ year: parseInt(year) }));
        } else {
            dispatch(fetchBalanceSheetChart({ year: parseInt(year) }));
        }
    }, [dispatch, year, isIncomeStatement]);

    const dateOptions = ['Overview', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
    const reportTypeOptions = ['Lines', 'Bars', 'Area', 'Pie', 'Scatter'];

    // Map API chart data → recharts format
    const rawChartData = isIncomeStatement ? incomeChartData : chartData;
    const mappedChartData = Array.isArray(rawChartData)
        ? rawChartData.map((item, index) => ({
              month: item.month || item.name || item.label || `M${index + 1}`,
              revenue: Number(item.income || item.revenue || item.amount || 0),
              expenses: Number(item.expenses || item.expense || item.cost || 0),
          }))
        : [];

    const lineChartData = mappedChartData.map((item) => ({
        name: item.month,
        value: item.revenue,
    }));

    const activeLoadingSections = isIncomeStatement ? incomeLoading.statement : loading.sections;
    const activeLoadingSummary = isIncomeStatement ? incomeLoading.statement : loading.summary;
    const activeLoadingChart = isIncomeStatement ? incomeLoading.chartData : loading.chartData;

    // Summary values
    const grossIncome = isIncomeStatement
        ? (
            incomeStatement?.grossProfit ??
            incomeStatement?.gross_profit ??
            incomeStatement?.totalRevenue ??
            incomeStatement?.total_revenue ??
            0
        )
        : (summary?.grossIncome ?? summary?.gross_income ?? 0);
    const netIncome = isIncomeStatement
        ? (
            incomeStatement?.netProfit ??
            incomeStatement?.net_profit ??
            incomeStatement?.netIncome ??
            incomeStatement?.net_income ??
            0
        )
        : (summary?.netIncome ?? summary?.net_income ?? 0);
    const changePercent = isIncomeStatement
        ? (
            incomeStatement?.marginPercent ??
            incomeStatement?.margin_percentage ??
            incomeStatement?.profitMargin ??
            0
        )
        : (summary?.change ?? summary?.percentChange ?? 0);

    // Totals
    const revenueItemsRaw =
        incomeStatement?.revenue?.items ||
        incomeStatement?.revenues?.items ||
        incomeStatement?.revenueBreakdown ||
        incomeStatement?.revenue?.breakdown ||
        incomeStatement?.revenue ||
        [];
    const expenseItemsRaw =
        incomeStatement?.expenses?.items ||
        incomeStatement?.expenseBreakdown ||
        incomeStatement?.expenses?.breakdown ||
        incomeStatement?.expenses ||
        [];
    const revenueItems = Array.isArray(revenueItemsRaw)
        ? revenueItemsRaw.map((item, index) => ({
            id: item.id ?? item.entryId ?? index,
            label: item.label ?? item.name ?? item.glCodeName ?? item.glCode ?? `Revenue ${index + 1}`,
            amount: Number(item.amount ?? item.total ?? item.value ?? 0),
        }))
        : [];
    const expenseItems = Array.isArray(expenseItemsRaw)
        ? expenseItemsRaw.map((item, index) => ({
            id: item.id ?? item.entryId ?? index,
            label: item.label ?? item.name ?? item.glCodeName ?? item.glCode ?? `Expense ${index + 1}`,
            amount: Number(item.amount ?? item.total ?? item.value ?? 0),
        }))
        : [];

    const totalCurrentAssets = isIncomeStatement
        ? (incomeStatement?.totalRevenue ?? incomeStatement?.total_revenue ?? revenueItems.reduce((s, i) => s + (i.amount || 0), 0))
        : ((sections.CurrentAssets || []).reduce((s, i) => s + (i.amount || 0), 0));
    const totalNonCurrentAssets = isIncomeStatement
        ? (incomeStatement?.grossProfit ?? incomeStatement?.gross_profit ?? 0)
        : ((sections.NonCurrentAssets || []).reduce((s, i) => s + (i.amount || 0), 0));
    const totalCurrentLiabilities = isIncomeStatement
        ? (incomeStatement?.totalExpenses ?? incomeStatement?.total_expenses ?? expenseItems.reduce((s, i) => s + (i.amount || 0), 0))
        : ((sections.CurrentLiabilities || []).reduce((s, i) => s + (i.amount || 0), 0));
    const totalNonCurrentLiabilities = isIncomeStatement
        ? (incomeStatement?.netProfit ?? incomeStatement?.net_profit ?? 0)
        : ((sections.NonCurrentLiabilities || []).reduce((s, i) => s + (i.amount || 0), 0));
    const totalEquity = isIncomeStatement
        ? 0
        : (summary?.totalEquity ?? (sections.Equity || []).reduce((s, i) => s + (i.amount || 0), 0));
    const totalAssetsDisplay = isIncomeStatement
        ? totalCurrentAssets + totalNonCurrentAssets
        : (summary?.totalAssets ?? (totalCurrentAssets + totalNonCurrentAssets));
    const totalLiabilitiesAndEquityDisplay = isIncomeStatement
        ? totalCurrentLiabilities + totalNonCurrentLiabilities
        : (summary?.liabilitiesPlusEquity ?? (totalCurrentLiabilities + totalNonCurrentLiabilities + totalEquity));

    const formatCurrency = (value) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    const TrendChartTooltip = ({ active, payload, label }) => {
        if (!active || !payload || payload.length === 0) return null;

        const incomeValue = payload.find((entry) => entry.dataKey === 'value')?.value ?? 0;

        return (
            <div className="min-w-[180px] rounded-xl border border-[#E7EAF3] bg-white p-3 shadow-lg">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8A94A6]">
                    {label || 'Period'}
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[#475569]">Income Trend</span>
                        <span className="font-semibold text-[#141516]">{formatCurrency(incomeValue)}</span>
                    </div>
                    <div className="border-t border-[#EEF2F7] pt-2 flex items-center justify-between gap-4">
                        <span className="text-[#475569]">View</span>
                        <span className="font-semibold text-[#2563EB]">Monthly trend</span>
                    </div>
                </div>
            </div>
        );
    };

    const ComparisonChartTooltip = ({ active, payload, label }) => {
        if (!active || !payload || payload.length === 0) return null;

        const revenueValue = payload.find((entry) => entry.dataKey === 'revenue')?.value ?? 0;
        const expensesValue = payload.find((entry) => entry.dataKey === 'expenses')?.value ?? 0;
        const netValue = Number(revenueValue || 0) - Number(expensesValue || 0);

        return (
            <div className="min-w-[200px] rounded-xl border border-[#E7EAF3] bg-white p-3 shadow-lg">
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#8A94A6]">
                    {label || 'Period'}
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[#475569]">Revenue</span>
                        <span className="font-semibold text-[#141516]">{formatCurrency(revenueValue)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[#475569]">Expenses</span>
                        <span className="font-semibold text-[#141516]">{formatCurrency(expensesValue)}</span>
                    </div>
                    <div className="border-t border-[#EEF2F7] pt-2 flex items-center justify-between gap-4">
                        <span className="text-[#475569]">Net</span>
                        <span className={`font-semibold ${netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(netValue)}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Handlers
    const startEdit = (item) => {
        setEditingId(item.id ?? item.entryId);
        setEditLabel(item.label);
        setEditAmount(item.amount);
    };

    const handleSaveEntry = (item, section) => {
        dispatch(updateBalanceSheetEntry({
            id: item.id ?? item.entryId,
            section,
            label: editLabel,
            amount: parseFloat(editAmount) || 0,
        }));
        setEditingId(null);
    };

    const handleDeleteEntry = (item, section) => {
        dispatch(deleteBalanceSheetEntry({ id: item.id ?? item.entryId, section }));
    };

    const handleAddEntry = (section) => {
        if (!newLabel.trim()) return;
        dispatch(addBalanceSheetEntry({
            section,
            label: newLabel.trim(),
            amount: parseFloat(newAmount) || 0,
            sortOrder: (sections[section] || []).length,
        }));
        setNewLabel('');
        setNewAmount('');
        setAddingSection(null);
    };

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);
        setEditingId(null);
        setAddingSection(null);
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
                                onClick={() => { setSelected(option); setIsOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${selected === option ? 'bg-gray-100 font-medium' : ''}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderEditableItem = (item, section, index = 0) => {
        const itemId = item.id ?? item.entryId;
        const isEditing = editingId === itemId;
        const rowKey = `${section}-${String(itemId ?? "row")}-${index}`;
        return (
            <div key={rowKey} className="flex justify-between items-center py-1 px-2 bg-gray-100 group">
                <div className="flex-1 mr-2">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full text-sm text-[#141516] font-semibold border border-gray-300 rounded px-2 py-1"
                            autoFocus
                        />
                    ) : (
                        <div className="text-sm text-[#141516] font-semibold">{item.label}</div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    {isEditing ? (
                        <input
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-24 text-right border border-gray-300 rounded px-1 py-0.5 text-xs"
                        />
                    ) : (
                        <div className="text-sm text-[#141516] font-semibold">{formatCurrency(item.amount || 0)}</div>
                    )}
                    {isEditMode && (
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => isEditing ? handleSaveEntry(item, section) : startEdit(item)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                            >
                                {isEditing ? <FaSave size={12} /> : <FaEdit size={12} />}
                            </button>
                            <button
                                onClick={() => handleDeleteEntry(item, section)}
                                disabled={loading.deleteEntry}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <FaTrash size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderSection = (title, sectionKey) => {
        const items = isIncomeStatement
            ? (sectionKey === 'Revenue' ? revenueItems : sectionKey === 'Expenses' ? expenseItems : [])
            : (sections[sectionKey] || []);
        return (
            <div>
                <div className="bg-gray-200 p-2 mb-1 flex justify-between items-center">
                    <div className="font-bold text-[#141516]">{title}</div>
                    {!isIncomeStatement && isEditMode && (
                        <button
                            onClick={() => setAddingSection(sectionKey)}
                            className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                        >
                            <FaPlus size={12} />
                            <span className="text-xs">Add</span>
                        </button>
                    )}
                </div>
                {items.map((item, index) => renderEditableItem(item, sectionKey, index))}
                {!isIncomeStatement && addingSection === sectionKey && (
                    <div className="flex gap-2 p-2 bg-gray-50 border border-dashed border-gray-300">
                        <input
                            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none"
                            placeholder="Label"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            autoFocus
                        />
                        <input
                            type="number"
                            className="w-24 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none"
                            placeholder="Amount"
                            value={newAmount}
                            onChange={(e) => setNewAmount(e.target.value)}
                        />
                        <button
                            onClick={() => handleAddEntry(sectionKey)}
                            disabled={loading.addEntry}
                            className="text-green-600 hover:text-green-800"
                        >
                            <FaCheck size={12} />
                        </button>
                        <button
                            onClick={() => { setAddingSection(null); setNewLabel(''); setNewAmount(''); }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 min-h-screen bg-gray-50">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Year */}
                <div className="relative bg-white p-4 rounded-lg shadow-sm flex items-center gap-8 cursor-pointer" onClick={() => { setYearOpen((p) => !p); setMonthOpen(false); }}>
                    <div className="bg-[#C01824] text-white p-2 rounded mr-3">
                        <div className="w-[30px] h-[30px] bg-white rounded flex items-center justify-center">
                            <span className="text-[#C01824] font-bold text-sm">📅</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-[#565656] text-[14px] font-bold">Year</div>
                        <div className="flex items-center">
                            <span className="font-medium text-[#141516] text-[33px]">{year}</span>
                            <FaCaretDown className="ml-1 text-gray-600" />
                        </div>
                    </div>
                    {yearOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            {yearOptions.map((y) => (
                                <button
                                    key={y}
                                    onClick={(e) => { e.stopPropagation(); setYear(y); setYearOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${year === y ? 'font-bold text-[#C01824]' : ''}`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Month */}
                <div className="relative bg-white p-4 rounded-lg shadow-sm flex items-center gap-8 cursor-pointer" onClick={() => { setMonthOpen((p) => !p); setYearOpen(false); }}>
                    <div className="bg-[#C01824] text-red-600 p-2 rounded mr-3">
                        <div className="w-[30px] h-[30px] bg-white rounded flex items-center justify-center">
                            <span className="text-[#C01824] font-bold text-xs">{month.slice(0, 3).toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <div className="text-[#565656] text-[14px] font-bold">Month</div>
                        <div className="flex items-center">
                            <span className="font-medium text-[#141516] text-[28px] truncate">{month}</span>
                            <FaCaretDown className="ml-1 text-gray-600 flex-shrink-0" />
                        </div>
                    </div>
                    {monthOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-56 overflow-y-auto">
                            {monthOptions.map((m) => (
                                <button
                                    key={m}
                                    onClick={(e) => { e.stopPropagation(); setMonth(m); setMonthOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${month === m ? 'font-bold text-[#C01824]' : ''}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}
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
                            <div className="text-[#565656] text-[14px] font-bold">{isIncomeStatement ? 'Gross Profit' : 'Gross Income'}</div>
                            {changePercent !== 0 && (
                                <span className={`text-xs ml-2 px-1 rounded ${changePercent >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {changePercent >= 0 ? '+' : ''}{changePercent}%
                                </span>
                            )}
                        </div>
                        <div className="font-medium text-[#141516] text-[33px]">
                            {activeLoadingSummary ? '...' : formatCurrency(grossIncome)}
                        </div>
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
                            <div className="text-[14px] text-[#565656] font-bold">{isIncomeStatement ? 'Net Profit' : 'Net Income'}</div>
                        </div>
                        <div className="font-medium text-[#141516] text-[33px]">
                            {activeLoadingSummary ? '...' : formatCurrency(netIncome)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Balance Sheet */}
                <div className="bg-white p-4 rounded-lg shadow-sm w-full mt-6 mx-auto max-h-[665px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-lg font-bold text-center flex-grow">
                            {isIncomeStatement ? 'INCOME STATEMENT' : 'CONSOLIDATED BALANCE SHEET'}
                        </h1>
                        {!isIncomeStatement && (
                            <button
                                onClick={toggleEditMode}
                                className={`text-sm flex items-center transition-colors px-3 py-1 rounded ${isEditMode ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-500 hover:bg-red-200'}`}
                            >
                                {isEditMode ? <FaSave className="mr-1" /> : <FaEdit className="mr-1" />}
                                {isEditMode ? 'Done' : 'Edit Mode'}
                            </button>
                        )}
                    </div>

                    {activeLoadingSections && <p className="text-center text-gray-400 py-4">Loading...</p>}

                    <div className="text-center font-bold bg-white py-2 mb-2 text-[#141516] text-[18px]">
                        {isIncomeStatement ? 'REVENUE' : 'ASSETS'}
                    </div>
                    {renderSection(isIncomeStatement ? 'Revenue' : 'Current assets', isIncomeStatement ? 'Revenue' : 'CurrentAssets')}
                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>{isIncomeStatement ? 'Total revenue' : 'Total current assets'}</div>
                        <div>{formatCurrency(totalCurrentAssets)}</div>
                    </div>

                    {renderSection(isIncomeStatement ? 'Gross profit' : 'Non-Current assets', isIncomeStatement ? 'GrossProfit' : 'NonCurrentAssets')}
                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>{isIncomeStatement ? 'Gross profit' : 'Total Non-Current assets'}</div>
                        <div>{formatCurrency(totalNonCurrentAssets)}</div>
                    </div>

                    <div className="text-center font-bold bg-white py-2 mb-2 mt-4">
                        {isIncomeStatement ? 'EXPENSES & PROFITABILITY' : 'LIABILITIES AND SHAREHOLDERS EQUITY'}
                    </div>
                    {renderSection(isIncomeStatement ? 'Expenses' : 'Current Liabilities', isIncomeStatement ? 'Expenses' : 'CurrentLiabilities')}
                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>{isIncomeStatement ? 'Total expenses' : 'Total Current Liabilities'}</div>
                        <div>{formatCurrency(totalCurrentLiabilities)}</div>
                    </div>

                    {renderSection(isIncomeStatement ? 'Net profit' : 'Non-Current Liabilities', isIncomeStatement ? 'NetProfit' : 'NonCurrentLiabilities')}
                    <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                        <div>{isIncomeStatement ? 'Net profit' : 'Total Non-Current Liabilities'}</div>
                        <div>{formatCurrency(totalNonCurrentLiabilities)}</div>
                    </div>

                    {!isIncomeStatement && (
                        <>
                            {renderSection('Equity', 'Equity')}
                            <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                                <div>Total Equity</div>
                                <div>{formatCurrency(totalEquity)}</div>
                            </div>
                        </>
                    )}

                    <div className="mt-4 pt-2 border-t-2 border-gray-300">
                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824] text-lg">
                            <div>{isIncomeStatement ? 'TOTAL REVENUE + GROSS PROFIT' : 'TOTAL ASSETS'}</div>
                            <div>{formatCurrency(totalAssetsDisplay)}</div>
                        </div>
                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824] text-lg">
                            <div>{isIncomeStatement ? 'TOTAL EXPENSES + NET PROFIT' : 'TOTAL LIABILITIES & EQUITY'}</div>
                            <div>{formatCurrency(totalLiabilitiesAndEquityDisplay)}</div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="flex flex-col gap-4">
                    {/* Line Chart */}
                    <div className="flex items-end justify-end space-x-2">
                        <Dropdown isOpen={dateOverviewOpen1} setIsOpen={setDateOverviewOpen1} selected={selectedDateOverview1} setSelected={setSelectedDateOverview1} options={dateOptions} label="Select Date" width="w-40" />
                        <Dropdown isOpen={reportTypeLineOpen} setIsOpen={setReportTypeLineOpen} selected={selectedReportTypeLine} setSelected={setSelectedReportTypeLine} options={reportTypeOptions} label="Report Type" width="w-40" />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-medium text-gray-700">{isIncomeStatement ? 'Monthly Income Trend' : 'Overview'}</div>
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
                            {activeLoadingChart ? (
                                <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineChartData.length > 0 ? lineChartData : []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip content={<TrendChartTooltip />} />
                                        <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: '#EF4444' }} activeDot={{ r: 6, fill: '#EF4444' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end justify-end space-x-2">
                        <Dropdown isOpen={dateOverviewOpen2} setIsOpen={setDateOverviewOpen2} selected={selectedDateOverview2} setSelected={setSelectedDateOverview2} options={dateOptions} label="Select Date" width="w-40" />
                        <Dropdown isOpen={reportTypeBarOpen} setIsOpen={setReportTypeBarOpen} selected={selectedReportTypeBar} setSelected={setSelectedReportTypeBar} options={reportTypeOptions} label="Report Type" width="w-40" />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-medium text-gray-700">{isIncomeStatement ? 'Income vs Expenses' : 'Total Revenue'}</div>
                        </div>
                        <div className="h-48">
                            {activeLoadingChart ? (
                                <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mappedChartData.length > 0 ? mappedChartData : []} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Tooltip content={<ComparisonChartTooltip />} />
                                        <Bar dataKey="revenue" fill="#EF4444" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="expenses" fill="#6B7280" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
