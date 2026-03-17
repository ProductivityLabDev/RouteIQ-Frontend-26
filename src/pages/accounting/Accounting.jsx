import React from 'react';
import {
  accountingTab,
  generateReportEmployeesData,
  glCodesTab,
  InvoicesData,
  payementTablesData,
  schoolInvoices,
  terminalTab,
} from "@/data/dummyData";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGlCodes } from "@/redux/slices/payrollSlice";
import { addExpense } from "@/redux/slices/accountsPayableSlice";
import { fetchInvoices, markInvoicePaid } from "@/redux/slices/accountsReceivableSlice";
import { fetchInvoiceTerminals, fetchSchoolsByTerminal, fetchSchoolInvoices, sendSchoolInvoice, deleteSchoolInvoice, exportSchoolInvoice, importSchoolInvoices } from "@/redux/slices/schoolInvoicesSlice";
import { fetchTripInvoiceTerminals, fetchTripInvoices, sendTripInvoice, deleteTripInvoice, exportTripInvoice, importTripInvoices } from "@/redux/slices/tripInvoicesSlice";
import { fetchGenerateReport } from "@/redux/slices/reportsSlice";
import {
  fetchTerminalSummary,
  fetchTerminalList,
  fetchTerminalInvoices,
  createTerminalInvoice,
  deleteTerminalInvoice,
  fetchTerminalTrack,
} from "@/redux/slices/terminalTabSlice";
import {
  Button,
  ButtonGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@material-tailwind/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { format, set } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
  avatar,
  busIcon,
  calendar,
  locationicon,
  marketIcon,
  moneyWallet,
} from "@/assets";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { BiDollar } from "react-icons/bi";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EditInvoiceForm from "@/components/EditInvoiceForm ";
import GLCodesTable from "@/components/GLCodesTable";
import InvoiceForm from "@/components/InvoiceForm";
import VendorGlobalModal from "@/components/Modals/VendorGlobalModal";
import SchoolInvoiceList from "@/components/SchoolInvoiceList";
import MainLayout from "@/layouts/SchoolLayout";
import BalanceModal from "@/components/Modals/BalanceModal";
import { GLCodeItem } from "@/components/GLCodeItem";
import GLCodesModal from "@/components/Modals/GLCodesModal";
import HistoryLogTable from "@/components/HistoryLogTable";
import FinancialDashboard from "@/components/FinancialDashboard";
import KPIScreen from "@/components/KPIScreen";

const Accounting = () => {
  const [selectedTab, setSelectedTab] = useState("School Invoices");
  const [selectedGlCodesTab, setSelectedGlCodesTab] =
    useState("GL Code List");
  const [glCodeSearch, setGlCodeSearch] = useState("");
  const [selectedTerminalTab, setSelectedTerminalTab] =
    useState("Terminals Details");
  const [invoiceForm, setInvoiceForm] = useState(false);
  const [gLCodeModalOpen, setGLCodeModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState();
  const [isTripInvoice, setIsTripInvoice] = useState(false);
  const [isTerminal, setIsTerminal] = useState(false);
  const [schoolData, setSchoolData] = useState(false);
  const [selectedInstituteId, setSelectedInstituteId] = useState(null);
  const [selectedSchoolName, setSelectedSchoolName] = useState('');
  const [schoolInvoice, setSchoolInvoice] = useState(false);
  const [editInvoice, setEditInvoice] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportInvoiceModal, setIsImportInvoiceModal] = useState(false);
  const [batchInvoice, setBatchInvoice] = useState(false);
  const [createBatchInvoice, setCreateBatchInvoice] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);
  const [addVendor, setAddVendor] = useState(false);
  const [addExpense, setAddExpense] = useState(false);
  const [expandedVendor, setExpandedVendor] = useState("Ronald Richards");
  const [payModal, setPayModal] = useState(false);
  const [accountsPayable, setaccountsPayable] = useState("Accounts Payable");
  const [accountsReceivable, setaccountsReceivable] = useState("accountsReceivable");

  // Generate Report filters
  const [grSearch, setGrSearch] = useState('');
  const [grSortBy, setGrSortBy] = useState('name');
  const [grYear, setGrYear] = useState(new Date().getFullYear());
  const [grMonth, setGrMonth] = useState(new Date().getMonth() + 1);
  const [grSortOpen, setGrSortOpen] = useState(false);
  const [grYearOpen, setGrYearOpen] = useState(false);
  const [grMonthOpen, setGrMonthOpen] = useState(false);

  const grMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const grYearOptions = [2022,2023,2024,2025,2026,2027];
  const grSortOptions = [{ label: 'Name', value: 'name' }, { label: 'Invoice Total', value: 'invoiceTotal' }, { label: 'Work Hours', value: 'workHours' }];

  // Terminal Tab states
  const [trackTerminalId, setTrackTerminalId] = useState(null);
  const [trackYear, setTrackYear] = useState(new Date().getFullYear());
  const [createInvoiceTerminalId, setCreateInvoiceTerminalId] = useState(null);
  const [createInvoiceForm, setCreateInvoiceForm] = useState({
    description: '', glCodeId: '', quantity: 1, unitPrice: '',
  });
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);

  const dispatch = useDispatch();
  const { glCodes, loading, error } = useSelector((state) => state.payroll);
  const { loading: apLoading, error: apError } = useSelector((state) => state.accountsPayable);
  const { invoices, loading: arLoading, error: arError } = useSelector((state) => state.accountsReceivable);
  const { terminals, schools: siSchools, invoices: siInvoices, loading: siLoading } = useSelector((state) => state.schoolInvoices);
  const { terminals: tripTerminals, invoices: tripInvoices, loading: tiLoading } = useSelector((state) => state.tripInvoices);
  const { generateReport, loading: grLoading } = useSelector((state) => state.reports);
  const { summary: termSummary, list: termList, invoices: termInvoices, trackData: termTrackData, loading: termLoading } = useSelector((state) => state.terminalTab);
  const filteredGlCodes = glCodes.filter((item) => {
    const search = glCodeSearch.trim().toLowerCase();
    if (!search) return true;

    return [
      item.glCode,
      item.glCodeName,
      item.category,
      ...(item.items || []).map((assignment) => assignment.assignment),
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(search));
  });

  useEffect(() => {
    dispatch(fetchGlCodes());
  }, [dispatch]);

  useEffect(() => {
    if (selectedTab === "Accounts Receivable") {
      dispatch(fetchInvoices({ source: "All", limit: 20, offset: 0 }));
    }
    if (selectedTab === "School Invoices") {
      dispatch(fetchInvoiceTerminals());
    }
    if (selectedTab === "Trip invoices") {
      dispatch(fetchTripInvoiceTerminals());
    }
  }, [dispatch, selectedTab]);

  useEffect(() => {
    if (selectedInstituteId) {
      dispatch(fetchSchoolInvoices({ instituteId: selectedInstituteId, limit: 20, offset: 0 }));
    }
  }, [dispatch, selectedInstituteId]);

  useEffect(() => {
    if (selectedTab === 'Generate Report') {
      dispatch(fetchGenerateReport({ year: grYear, month: grMonth, search: grSearch || undefined, sortBy: grSortBy, limit: 20, offset: 0 }));
    }
  }, [dispatch, selectedTab, grYear, grMonth, grSearch, grSortBy]);

  useEffect(() => {
    if (selectedTab === 'Terminal') {
      dispatch(fetchTerminalSummary());
      dispatch(fetchTerminalList());
    }
  }, [dispatch, selectedTab]);

  useEffect(() => {
    if (selectedTab === 'Terminal' && selectedTerminalTab === 'Terminal Invoices') {
      dispatch(fetchTerminalInvoices({ limit: 20, offset: 0 }));
    }
  }, [dispatch, selectedTab, selectedTerminalTab]);

  useEffect(() => {
    if (isTerminal !== null && isTerminal !== false) {
      const terminal = termList[isTerminal];
      if (terminal) {
        const tId = terminal.id || terminal.terminalId;
        dispatch(fetchTerminalInvoices({ terminalId: tId, limit: 20, offset: 0 }));
        dispatch(fetchTerminalTrack({ terminalId: tId, year: trackYear }));
        setTrackTerminalId(tId);
      }
    }
  }, [dispatch, isTerminal, trackYear, termList]);

  const handleCreateTerminalInvoice = async (terminalId) => {
    if (!createInvoiceForm.description || !createInvoiceForm.unitPrice) return;
    const result = await dispatch(createTerminalInvoice({
      terminalId,
      lineItems: [{
        glCodeId: parseInt(createInvoiceForm.glCodeId) || 0,
        description: createInvoiceForm.description,
        quantity: parseInt(createInvoiceForm.quantity) || 1,
        unitPrice: parseFloat(createInvoiceForm.unitPrice),
      }],
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      setCreateInvoiceOpen(false);
      setCreateInvoiceForm({ description: '', glCodeId: '', quantity: 1, unitPrice: '' });
    }
  };

  const importInputRef = React.useRef(null);
  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(importSchoolInvoices(file));
  };

  const tripImportInputRef = React.useRef(null);
  const handleTripImportFile = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(importTripInvoices(file));
  };

  const [expenseForm, setExpenseForm] = useState({
    expenseDate: '', expenseType: '', amount: '', dueDate: '',
    vendorName: '', glCodeId: '', paymentTerm: '', paymentMethod: '', terminalId: '',
  });

  const handleExpenseSubmit = async () => {
    const result = await dispatch(addExpense({
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
      glCodeId: parseInt(expenseForm.glCodeId),
      terminalId: parseInt(expenseForm.terminalId),
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      setAddExpense(false);
      setExpenseForm({ expenseDate: '', expenseType: '', amount: '', dueDate: '', vendorName: '', glCodeId: '', paymentTerm: '', paymentMethod: '', terminalId: '' });
    }
  };



  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openImportInvoiceModal = () => setIsImportInvoiceModal(true);
  const closeImportInvoiceModal = () => setIsImportInvoiceModal(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const headings = {
    // 'Subscription': 'Invoices',
    "School Invoices": "School Invoices",
    "Trip invoices": "Trip Invoices",
    "Generate Report": "Generate Report",
  };
  const handleback = () => {
    setInvoiceForm(!invoiceForm);
  };
  const handleExport = () => {
    closeModal();
    setSelectedTab("Trip invoices");
    setSchoolData(false);
  };
  const handleImport = () => {
    closeImportInvoiceModal();
    setSelectedTab("Trip invoices");
    setSchoolData(false);
  };
  const handleSchoolBack = () => {
    setSchoolData(!schoolData);
  };
  const handleInvoiceList = () => {
    setSchoolInvoice(true);
    setInvoiceForm(true);
  };
  const handleBatchInvoice = () => {
    setEditInvoice(true);
    setBatchInvoice(true);
  };
  const handleCreateBatchInvoice = () => {
    setCreateBatchInvoice(true);
    setBatchInvoice(true);
  };
  const backCreateBatchInvoice = () => {
    setCreateBatchInvoice(false);
  };
  const handleCreateInvoice = () => {
    setEditInvoice(true);
    setCreateInvoice(true);
  };
  const handlebackCreateInvoice = () => {
    setCreateInvoice(false);
  };
  const toggleExpand = (name) => {
    if (expandedVendor === name) {
      setExpandedVendor(null);
    } else {
      setExpandedVendor(name);
    }
  };
  return (
    <MainLayout>
      <section className="w-full h-full mt-8">
        {createBatchInvoice || createInvoice ? (
          <div className="w-full">
            <div className="flex justify-between items-center my-3 pb-2">
              <div className="flex w-full justify-between items-center  mt-3 pb-2">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-[22px] lg:text-[26px] xl:text-[29px] font-bold text-black">
                    Create Invoice
                  </h2>
                  {batchInvoice && (
                    <h2 className="text-[22px] ps-5 lg:text-[26px] xl:text-[29px] mx-3 font-bold text-black">
                      Invoice # 12501
                    </h2>
                  )}
                </div>
                <div className="flex flex-row items-center flex-wrap gap-4 justify-end">
                  <Button
                    className="border border-[#C01824] bg-transparent text-[#C01824] px-12 py-2 rounded-[4px]"
                    variant="outlined"
                    size="lg"
                    onClick={
                      createInvoice
                        ? handlebackCreateInvoice
                        : backCreateBatchInvoice
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                    variant="filled"
                    size="lg"
                    onClick={
                      createInvoice
                        ? handlebackCreateInvoice
                        : backCreateBatchInvoice
                    }
                  >
                    Save Invoice
                  </Button>
                </div>
              </div>
            </div>
            <EditInvoiceForm batchInvoice={batchInvoice} />
          </div>
        ) : invoiceForm ? (
          <InvoiceForm
            handleback={handleback}
            schoolInvoice={schoolInvoice}
            setEditInvoice={setEditInvoice}
            editInvoice={editInvoice}
            handleBatchInvoice={handleBatchInvoice}
            batchInvoice={batchInvoice}
          />
        ) : (
          <>
            <ButtonGroup
              className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0"
              variant="text"
              size="md"
            >
              {accountingTab.map((tab) => (
                <Button
                  key={tab}
                  className={
                    selectedTab === tab
                      ? "bg-[#C01824] w-full  hover:bg-[#C01824] text-white px-6 py-3 lg:text-[13px] capitalize font-bold"
                      : "bg-white hover:bg-white px-6 py-3 lg:text-[13px] w-full border-[#DDDDE1] capitalize font-bold"
                  }
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </ButtonGroup>
            {/* ---------------- Header of Card --------------- */}
            <div className="flex justify-between items-center my-3 pb-2">
              {schoolData ? (
                <div className="flex w-full justify-between items-center  mt-3 pb-2">
                  <div className="flex items-center gap-2">
                    <MdOutlineKeyboardArrowLeft
                      color="#C01824"
                      size={40}
                      onClick={() => setSchoolData(false)}
                    />
                    <h2 className="text-[22px] lg:text-[26px] xl:text-[29px] font-bold text-black">
                      {selectedSchoolName || 'School Invoices'}
                    </h2>
                  </div>

                  <div className="flex flex-row items-center flex-wrap gap-4 justify-end">
                    <input ref={importInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImportFile} />
                    <Button
                      className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                      variant="filled"
                      size="lg"
                    >
                      Send
                    </Button>
                    <Button
                      className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                      variant="filled"
                      size="lg"
                      onClick={openModal}
                    >
                      Export Invoice
                    </Button>
                    <Button
                      className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                      variant="filled"
                      size="lg"
                      onClick={() => importInputRef.current?.click()}
                      disabled={siLoading.import}
                    >
                      {siLoading.import ? 'Importing...' : 'Import Invoice'}
                    </Button>
                    <Button
                      className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                      variant="filled"
                      size="lg"
                      onClick={handleCreateBatchInvoice}
                    >
                      Create Batch Invoice
                    </Button>
                    <Button
                      className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                      variant="filled"
                      size="lg"
                      onClick={handleCreateInvoice}
                    >
                      Create Invoice
                    </Button>
                  </div>
                </div>
              ) : (
                headings[selectedTab] && (
                  <h2 className="text-[22px] lg:text-[26px] xl:text-[29px] font-bold text-black">
                    {headings[selectedTab]}
                  </h2>
                )
              )}
              {/* {selectedTab === 'Subscription' &&
                                    <Button
                                        className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                        variant='filled'
                                        size='lg'
                                        onClick={() => navigate(`/dashboard_subscription?from=${encodeURIComponent(currentPath)}`)}
                                    >
                                        Renew Subscription
                                    </Button>
                                } */}
            </div>
            {/* {selectedTab === 'Subscription' &&
                                <div className="bg-white rounded-lg shadow-md p-4 w-full">
                                    <div className="overflow-x-auto mt-4 border border-[#DDDDE1] rounded h-[40vh] lg:h-[38vh]">
                                        <table className="min-w-full text-[10px] md:text-[12px]">
                                            <thead className="bg-[#EEEEEE]">
                                                <tr>
                                                    <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[10px] md:text-[14px] lg:text-[14px] font-bold text-[#141516]">
                                                        Date
                                                    </th>
                                                    <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[10px] md:text-[14px] lg:text-[14px] font-bold text-[#141516]">
                                                        Description
                                                    </th>
                                                    <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[10px] md:text-[14px] lg:text-[14px] font-bold text-[#141516]">
                                                        Invoice Total
                                                    </th>
                                                    <th className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b text-left text-[10px] md:text-[14px] lg:text-[14px] font-bold text-[#141516]">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {InvoicesData.map((invoice, index) => (
                                                    <tr key={index} className='bg-white'>
                                                        <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b border-[#D9D9D9] text-[14px] md:text-[14px] font-semibold text-[#141516]">
                                                            {invoice.date}
                                                        </td>
                                                        <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b border-[#D9D9D9] text-[14px] md:text-[14px] font-semibold text-[#141516]">
                                                            {invoice.desc}
                                                        </td>
                                                        <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b border-[#D9D9D9] text-[14px] md:text-[14px] font-semibold text-[#141516]">
                                                            {invoice.invoiceTotal}
                                                        </td>
                                                        <td className="px-3 md:px-4 lg:px-5 py-1 lg:py-2 border-b border-[#D9D9D9] text-[14px] md:text-[14px] font-semibold">
                                                            <div className="flex flex-col items-center w-[35]">
                                                                <span className="text-black font-bold self-start">Paid</span>
                                                                <button className="text-[#C01824] text-[10px] md:text-[12px] mt-1 hover:text-red-800 focus:outline-none self-start" onClick={() => setInvoiceForm(!invoiceForm)}>
                                                                    View invoice
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            } */}
            {schoolData ? (
              <div className="w-full p-4 bg-white h-[66vh] rounded-xl">
                <div className="bg-white shadow-md rounded-xl w-full h-[45vh] overflow-hidden border border-[#D9D9D9]">
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 border-b border-[#D9D9D9]">
                            <input type="checkbox" className="w-4 h-4" />
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Date
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Invoice#
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Bill To
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            GL Code#
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Type
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Miles per Rate
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Invoice Total
                          </th>
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Invoice
                          </th>          
                          <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {siLoading.invoices && (
                          <tr><td colSpan={10} className="py-6 text-center text-gray-400">Loading...</td></tr>
                        )}
                        {!siLoading.invoices && !Array.isArray(siInvoices?.data) || (Array.isArray(siInvoices?.data) && siInvoices.data.length === 0) ? (
                          <tr><td colSpan={10} className="py-6 text-center text-gray-400">No invoices found</td></tr>
                        ) : null}
                        {(Array.isArray(siInvoices?.data) ? siInvoices.data : []).map((invoice, index) => (
                          <tr key={invoice.invoiceId ?? index} className="bg-white">
                            <td className="p-8 border-b flex justify-center items-center border-[#D9D9D9]">
                              <input type="checkbox" className="w-4 h-4" />
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">
                              {invoice.date ? new Date(invoice.date).toLocaleDateString() : '-'}
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">
                              {invoice.invoiceNumber ?? '-'}
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">
                              {invoice.billTo ?? '-'}
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">
                              {invoice.glCode ?? '-'}
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">
                              {invoice.type ?? '-'}
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">
                              {invoice.milesPerRate ?? '-'}
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">
                              {invoice.invoiceTotal != null ? `$${invoice.invoiceTotal}` : '-'}
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9]">
                              <a className="text-[#C01824] font-bold cursor-pointer" onClick={handleInvoiceList}>View</a>
                            </td>
                            <td className="p-3 border-b border-[#D9D9D9]">
                              <button
                                aria-label="Delete"
                                onClick={() => dispatch(deleteSchoolInvoice(invoice.invoiceId))}
                                disabled={siLoading.delete}
                              >
                                <FaRegTrashAlt className="w-5 h-5 text-[#C01824]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              selectedTab === "School Invoices" && (
                <div className="w-full space-y-4">
                  {siLoading && terminals.length === 0 && (
                    <p className="text-center text-gray-400 py-6">Loading terminals...</p>
                  )}
                  {terminals.map((terminal, index) => (
                    <div key={terminal.TerminalId} className="w-full bg-white border-b border-[#D9D9D9] shadow-sm">
                      <div className="flex items-center justify-between px-4 py-4 border rounded-md border-[#D9D9D9]">
                        <div className="flex items-center space-x-3">
                          <button className="text-gray-600 hover:text-gray-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                          </button>
                          <h2 className="font-medium text-gray-800 text-lg">
                            {terminal.TerminalName}
                          </h2>
                          <button className="text-gray-600 hover:text-gray-800">
                            <svg
                              width="21"
                              height="20"
                              viewBox="0 0 21 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.78276 17.6688C3.51278 17.6688 3.28488 17.5774 3.09907 17.3945C2.91339 17.2114 2.82056 16.9869 2.82056 16.7209V14.5905C2.82056 14.3384 2.86877 14.0975 2.9652 13.8678C3.06149 13.6382 3.19902 13.4354 3.37779 13.2595L13.9762 2.83425C14.1521 2.67147 14.3474 2.54674 14.562 2.46008C14.7764 2.37341 15.0015 2.33008 15.2372 2.33008C15.4695 2.33008 15.6965 2.37341 15.9181 2.46008C16.1396 2.54674 16.3347 2.67675 16.5033 2.85008L17.8838 4.21591C18.0597 4.37869 18.189 4.57008 18.2716 4.79008C18.3542 5.00994 18.3956 5.2307 18.3956 5.45237C18.3956 5.68459 18.3542 5.90716 18.2716 6.12008C18.189 6.33313 18.0597 6.52633 17.8838 6.69966L7.30654 17.1199C7.12791 17.296 6.92201 17.4315 6.68882 17.5263C6.45578 17.6213 6.21132 17.6688 5.95543 17.6688H3.78276ZM15.2313 6.61404L16.4155 5.45237L15.2262 4.2757L14.0369 5.44237L15.2313 6.61404Z"
                                fill="#1C1B1F"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => {
                              const next = index === isOpen ? null : index;
                              setIsOpen(next);
                              if (next !== null) dispatch(fetchSchoolsByTerminal({ terminalId: terminal.TerminalId, limit: 20, offset: 0 }));
                            }}
                            className="text-black hover:text-gray-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-6 w-6 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {isOpen === index && (
                        <SchoolInvoiceList
                          handleSchoolBack={handleSchoolBack}
                          setSchoolData={setSchoolData}
                          setSelectedInstituteId={setSelectedInstituteId}
                          setSelectedSchoolName={setSelectedSchoolName}
                          schools={siSchools?.data || []}
                          loadingSchools={siLoading.schools}
                        />
                      )}
                    </div>
                  ))}
                  {/* <div className='flex justify-between items-center mt-6 mb-4 px-7 py-3'>
                                        <Typography color="gray" className='text-[#202224]/60 font-semibold text-[14px]'>
                                            Page {active} - 06 of 20
                                        </Typography>
                                        <div className='!p-0 bg-[#FAFBFD] flex justify-around items-center w-[86px] h-[33px] border border-[#D5D5D5] rounded-[12px] space-x-3'>
                                            <img onClick={prev}
                                                disabled={active === 1} src={previcon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                                            <img onClick={next}
                                                disabled={active === 10} src={nexticon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                                        </div>
                                    </div> */}
                </div>
              )
            )}
            {selectedTab === "Trip invoices" && (
              <div className="w-full space-y-4">
                {tiLoading.terminals && tripTerminals.length === 0 && (
                  <p className="text-center text-gray-400 py-6">Loading terminals...</p>
                )}
                {tripTerminals.map((terminal, index) => (
                  <div key={terminal.TerminalId} className="w-full bg-white border-b  shadow-sm">
                    <div className="flex items-center justify-between px-4 py-4 border rounded-md border-[#D6D6D6]">
                      <div className="flex items-center space-x-3">
                        <button className="text-[#000]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                        </button>
                        <h2 className="font-medium text-gray-800 text-lg">
                          {terminal.TerminalName}
                        </h2>
                        <button className="text-gray-600 hover:text-gray-800">
                          <svg
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.78276 17.6688C3.51278 17.6688 3.28488 17.5774 3.09907 17.3945C2.91339 17.2114 2.82056 16.9869 2.82056 16.7209V14.5905C2.82056 14.3384 2.86877 14.0975 2.9652 13.8678C3.06149 13.6382 3.19902 13.4354 3.37779 13.2595L13.9762 2.83425C14.1521 2.67147 14.3474 2.54674 14.562 2.46008C14.7764 2.37341 15.0015 2.33008 15.2372 2.33008C15.4695 2.33008 15.6965 2.37341 15.9181 2.46008C16.1396 2.54674 16.3347 2.67675 16.5033 2.85008L17.8838 4.21591C18.0597 4.37869 18.189 4.57008 18.2716 4.79008C18.3542 5.00994 18.3956 5.2307 18.3956 5.45237C18.3956 5.68459 18.3542 5.90716 18.2716 6.12008C18.189 6.33313 18.0597 6.52633 17.8838 6.69966L7.30654 17.1199C7.12791 17.296 6.92201 17.4315 6.68882 17.5263C6.45578 17.6213 6.21132 17.6688 5.95543 17.6688H3.78276ZM15.2313 6.61404L16.4155 5.45237L15.2262 4.2757L14.0369 5.44237L15.2313 6.61404Z"
                              fill="#1C1B1F"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() =>
                          {
                            const next = index === isTripInvoice ? null : index;
                            setIsTripInvoice(next);
                            if (next !== null) dispatch(fetchTripInvoices({ terminalId: terminal.TerminalId, limit: 20, offset: 0 }));
                          }}
                          className="text-black"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {isTripInvoice === index && (
                      <div className="w-full overflow-x-auto">
                        <input ref={tripImportInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleTripImportFile} />
                        <div className="flex flex-row items-center flex-wrap gap-4 p-3 justify-end">
                          <Button className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center" variant="filled" size="sm">
                            Send
                          </Button>
                          <Button className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center" variant="filled" size="sm" onClick={openModal}>
                            Export Invoice
                          </Button>
                          <Button
                            className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                            variant="filled" size="sm"
                            onClick={() => tripImportInputRef.current?.click()}
                            disabled={tiLoading.import}
                          >
                            {tiLoading.import ? 'Importing...' : 'Import Invoice'}
                          </Button>
                          <Button className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center" variant="filled" size="sm" onClick={handleCreateBatchInvoice}>
                            Create Batch Invoice
                          </Button>
                          <Button className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center" variant="filled" size="sm" onClick={handleCreateInvoice}>
                            Create Invoice
                          </Button>
                        </div>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="p-3 border-b border-[#EEEEEE]"><input type="checkbox" className="w-4 h-4" /></th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Date</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Invoice#</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Bill To</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">GL Code#</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Type</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Miles per Rate</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Invoice Total</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Invoice</th>
                              <th className="p-3 text-left font-bold text-black border-b border-[#D9D9D9]">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tiLoading.invoices && (
                              <tr><td colSpan={10} className="py-6 text-center text-gray-400">Loading...</td></tr>
                            )}
                            {!tiLoading.invoices && (tripInvoices?.data?.length ?? 0) === 0 && (
                              <tr><td colSpan={10} className="py-6 text-center text-gray-400">No invoices found</td></tr>
                            )}
                            {(Array.isArray(tripInvoices?.data) ? tripInvoices.data : []).map((invoice, idx) => (
                              <tr key={invoice.invoiceId ?? idx} className="bg-white">
                                <td className="p-8 border-b flex justify-center items-center border-[#D9D9D9]"><input type="checkbox" className="w-4 h-4" /></td>
                                <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.date ? new Date(invoice.date).toLocaleDateString() : '-'}</td>
                                <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.invoiceNumber ?? '-'}</td>
                                <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.billTo ?? '-'}</td>
                                <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.glCode ?? '-'}</td>
                                <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.type ?? '-'}</td>
                                <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.milesPerRate ?? '-'}</td>
                                <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.invoiceTotal != null ? `$${invoice.invoiceTotal}` : '-'}</td>
                                <td className="p-3 border-b border-[#D9D9D9]">
                                  <a className="text-[#C01824] font-bold cursor-pointer" onClick={handleInvoiceList}>View</a>
                                </td>
                                <td className="p-3 border-b border-[#D9D9D9]">
                                  <button aria-label="Delete" onClick={() => dispatch(deleteTripInvoice(invoice.invoiceId))} disabled={tiLoading.delete}>
                                    <FaRegTrashAlt className="w-5 h-5 text-[#C01824]" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
                {/* <div className='flex justify-between items-center mt-6 mb-4 px-7 py-3'>
                                    <Typography color="gray" className='text-[#202224]/60 font-semibold text-[14px]'>
                                        Page {active} - 06 of 20
                                    </Typography>
                                    <div className='!p-0 bg-[#FAFBFD] flex justify-around items-center w-[86px] h-[33px] border border-[#D5D5D5] rounded-[12px] space-x-3'>
                                        <img onClick={prev}
                                            disabled={active === 1} src={previcon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                                        <img onClick={next}
                                            disabled={active === 10} src={nexticon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                                    </div>
                                </div> */}
              </div>
            )}
            {selectedTab === "GL Codes" && (
              <div className="w-full space-y-4 bg-[#fff] shadow-md p-5 rounded-md">
                {addVendor || addExpense ? (
                  <div className="w-full text-start">
                    <h1 className="text-[20px] text-black font-bold">
                      {addVendor ? "Add Vendor" : "Add Expense"}
                    </h1>
                  </div>
                ) : (
                  <div className="w-full flex justify-between items-center mt-6 mb-4 px-7 py-3">
                    <ButtonGroup
                      className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0"
                      variant="text"
                      size="md"
                    >
                      {glCodesTab?.map((tab) => (
                        <Button
                          key={tab}
                          className={
                            selectedGlCodesTab === tab
                              ? "bg-[#C01824]  hover:bg-[#C01824] text-white px-6 py-3 lg:text-[14px] capitalize font-bold"
                              : "bg-white hover:bg-white px-6 py-3 lg:text-[13px]  border-[#DDDDE1] capitalize font-bold"
                          }
                          onClick={() => setSelectedGlCodesTab(tab)}
                        >
                          {tab}
                        </Button>
                      ))}
                    </ButtonGroup>
                    {/* {selectedGlCodesTab === "Accounts Payable" && (
                      <div className="flex items-center space-x-4">
                        <div className="md:w-[250px] bg-white border-0 rounded-md shadow-sm">
                          <Popover placement="bottom">
                            <PopoverHandler>
                              <div className="relative">
                                <Input
                                  label="Select a Date"
                                  onChange={() => null}
                                  value={date ? format(date, "PPP") : ""}
                                />
                                <img
                                  src={calendar}
                                  alt=""
                                  className="absolute right-3 top-3 h-5 w-5 text-gray-400"
                                />
                              </div>
                            </PopoverHandler>
                            <PopoverContent>
                              <DayPicker
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                showOutsideDays
                                className="border-0"
                                classNames={{
                                  caption:
                                    "flex justify-center py-1 relative items-center",
                                  caption_label:
                                    "text-sm font-medium text-gray-900",
                                  nav: "flex items-center",
                                  nav_button:
                                    "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                                  nav_button_previous: "absolute left-1.5",
                                  nav_button_next: "absolute right-1.5",
                                  table: "w-full border-collapse",
                                  head_row: "flex font-medium text-gray-900",
                                  head_cell: "m-0.5 w-9 font-normal text-sm",
                                  row: "flex w-full mt-2",
                                  cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                  day: "h-9 w-9 p-0 font-normal",
                                  day_range_end: "day-range-end",
                                  day_selected:
                                    "rounded-md bg-[#C01824] text-white hover:bg-[#C01824]/90 hover:text-white focus:bg-[#C01824] focus:text-white",
                                  day_today:
                                    "rounded-md bg-gray-200 text-gray-900",
                                  day_outside:
                                    "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                                  day_disabled: "text-gray-500 opacity-50",
                                  day_hidden: "invisible",
                                }}
                                components={{
                                  IconLeft: ({ ...props }) => (
                                    <ChevronLeftIcon
                                      {...props}
                                      className="h-4 w-4 stroke-2"
                                    />
                                  ),
                                  IconRight: ({ ...props }) => (
                                    <ChevronRightIcon
                                      {...props}
                                      className="h-4 w-4 stroke-2"
                                    />
                                  ),
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button
                          className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                          variant="filled"
                          size="lg"
                          onClick={() => setAddVendor(true)}
                        >
                          Add Vendor
                        </Button>
                      </div>
                    )} */}
                  </div>
                )}


               
                {selectedGlCodesTab === "GL Code List" && (
                  <section className="w-full h-full p-4 md:p-6 lg:p-8 bg-white rounded-[10px]">
                    <div className="w-[100%]">
                      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <h1 className="text-3xl font-bold">GL Codes</h1>
                          <p className="mt-2 text-sm text-[#667085]">
                            Review code, category, default pricing, and linked assignments in one place.
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Button
                            className="w-[160px] bg-[#C01824] !px-6 !py-2 capitalize text-sm font-normal flex items-center justify-center"
                            variant="filled"
                            size="lg"
                            onClick={() => setGLCodeModalOpen(true)}
                          >
                            Add GL Code
                          </Button>

                          <Button
                            className="w-[160px] bg-[#C01824] !px-6 !py-2 capitalize text-sm font-normal flex items-center justify-center"
                            variant="filled"
                            size="lg"
                          >
                            Import GL Code
                          </Button>
                        </div>
                      </div>

                      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E7EAF3] bg-[#F8FAFC] p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#141516] shadow-sm">
                            Total Codes: {glCodes.length}
                          </div>
                          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#141516] shadow-sm">
                            Showing: {filteredGlCodes.length}
                          </div>
                        </div>

                        <div className="w-full lg:max-w-md">
                          <input
                            type="text"
                            value={glCodeSearch}
                            onChange={(e) => setGlCodeSearch(e.target.value)}
                            placeholder="Search by code, name, category, or assignment"
                            className="w-full rounded-xl border border-[#D8DEE8] bg-white px-4 py-3 text-sm text-[#141516] outline-none transition focus:border-[#C01824]"
                          />
                        </div>
                      </div>

                      <div className="max-w-6xl">
                        {loading.glCodes && <p className="text-gray-500">Loading...</p>}
                        {error.glCodes && <p className="text-red-500">{error.glCodes}</p>}

                        {!loading.glCodes && !error.glCodes && filteredGlCodes.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-[#D8DEE8] bg-[#FBFCFE] px-6 py-12 text-center">
                            <h2 className="text-lg font-semibold text-[#141516]">No GL codes matched your search</h2>
                            <p className="mt-2 text-sm text-[#667085]">
                              Try a GL code number, code name, category, or assignment keyword.
                            </p>
                          </div>
                        )}

                        {filteredGlCodes.map((item) => (
                          <GLCodeItem
                            key={item.glCodeId}
                            glCodeId={item.glCodeId}
                            glCode={item.glCode}
                            glCodeName={item.glCodeName}
                            category={item.category}
                            defaultUnitPrice={item.defaultUnitPrice}
                            items={item.items || []}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                )}
                {selectedGlCodesTab === "History Log" && (
                  <section className="w-full h-full p-4 md:p-6 lg:p-8 bg-white rounded-[10px]">
                    <HistoryLogTable
                      expandedVendor={expandedVendor}
                      toggleExpand={toggleExpand}
                      setAddExpense={setAddExpense}
                      setPayModal={setPayModal}
                    />
                  </section>
                )}
              </div>
            )}

            {selectedTab === "Accounts Payable" && (
                  <div className="w-full bg-white border-b border-[#D9D9D9] shadow-sm">
                    {addVendor ? (
                      <div className="max-w-3xl p-6">
                        <div className="grid grid-cols-2 gap-6">
                          {/* Vendor Name */}
                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                              Vendor Name
                            </div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                              <input
                                type="text"
                                placeholder="Enter name"
                                className="bg-[#F5F6FA] outline-none w-full"
                              />
                            </div>
                          </div>

                          {/* Address */}
                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                              Address
                            </div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                              <input
                                type="text"
                                placeholder="Enter address"
                                className="bg-[#F5F6FA] outline-none w-full"
                              />
                              <div className="flex flex-row gap-3 items-center">
                                <img
                                  src={locationicon}
                                  alt="location"
                                  className="h-5 w-5"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Phone No */}
                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                              Phone No
                            </div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                              <input
                                type="text"
                                placeholder="Enter number"
                                className="bg-[#F5F6FA] outline-none w-full"
                              />
                            </div>
                          </div>

                          {/* Assign GL code */}
                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                              Assign GL code
                            </div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                              <input
                                type="text"
                                placeholder="Enter code"
                                className="bg-[#F5F6FA] outline-none w-full"
                              />
                            </div>
                          </div>

                          {/* Payment Term */}
                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                              Payment Term
                            </div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                              <input
                                type="text"
                                placeholder="Select"
                                className="bg-[#F5F6FA] outline-none w-full"
                                readOnly
                              />
                              <div className="flex flex-row gap-3 items-center">
                                <ChevronDownIcon className="h-5 w-5 text-black ml-2" />
                              </div>
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                              Payment Method
                            </div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                              <input
                                type="text"
                                placeholder="Select"
                                className="bg-[#F5F6FA] outline-none w-full"
                                readOnly
                              />
                              <div className="flex flex-row gap-3 items-center">
                                <ChevronDownIcon className="h-5 w-5 text-black ml-2" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex mt-20 space-x-4">
                          <button
                            className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                            onClick={() => setAddVendor(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-[#C01824] text-white px-12 py-2 rounded-[4px]"
                            onClick={() => setAddVendor(false)}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    ) : addExpense ? (
                      <div className="max-w-3xl p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">Expense Date</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full">
                              <input type="date" className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.expenseDate}
                                onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })} />
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">Expense Type</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full">
                              <input type="text" placeholder="e.g. Fuel" className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.expenseType}
                                onChange={(e) => setExpenseForm({ ...expenseForm, expenseType: e.target.value })} />
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">Vendor Name</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full">
                              <input type="text" placeholder="Enter vendor name" className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.vendorName}
                                onChange={(e) => setExpenseForm({ ...expenseForm, vendorName: e.target.value })} />
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">Amount</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full">
                              <input type="number" placeholder="Enter Amount" className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.amount}
                                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">Due Date</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full">
                              <input type="date" className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.dueDate}
                                onChange={(e) => setExpenseForm({ ...expenseForm, dueDate: e.target.value })} />
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">Payment Method</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                              <select className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.paymentMethod}
                                onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}>
                                <option value="">Select</option>
                                <option value="BankTransfer">Bank Transfer</option>
                                <option value="Card">Card</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">Payment Term</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                              <select className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.paymentTerm}
                                onChange={(e) => setExpenseForm({ ...expenseForm, paymentTerm: e.target.value })}>
                                <option value="">Select</option>
                                <option value="Net30">Net30</option>
                                <option value="Net60">Net60</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-span-1">
                            <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">GL Code</div>
                            <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between">
                              <select className="bg-[#F5F6FA] outline-none w-full"
                                value={expenseForm.glCodeId}
                                onChange={(e) => setExpenseForm({ ...expenseForm, glCodeId: e.target.value })}>
                                <option value="">Select GL Code</option>
                                {glCodes.map((g) => (
                                  <option key={g.glCodeId} value={g.glCodeId}>{g.glCode} — {g.glCodeName}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {apError.addExpense && <p className="text-red-500 text-sm mt-4">{apError.addExpense}</p>}

                        {/* Buttons */}
                        <div className="flex mt-10 space-x-4">
                          <button
                            className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                            onClick={() => setAddExpense(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="bg-[#C01824] text-white px-12 py-2 rounded-[4px] disabled:opacity-60"
                            onClick={handleExpenseSubmit}
                            disabled={apLoading.addExpense}
                          >
                            {apLoading.addExpense ? 'Saving...' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <GLCodesTable
                        expandedVendor={expandedVendor}
                        toggleExpand={toggleExpand}
                        setAddExpense={setAddExpense}
                        setPayModal={setPayModal}
                      />
                    )}
                    {payModal && (
                      <BalanceModal
                        setBalanceModal={setPayModal}
                        accountingPay={true}
                      />
                    )}
                  </div>
            )}

                {selectedTab === "Accounts Receivable" && (
                  <div className="w-[100%] h-[75vh] p-4 bg-white border-0 shadow-sm">
                    <div className="overflow-x-auto w-[100%] bg-white border-1 rounded-[12px] border-[#D9D9D9] shadow-sm">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Invoice#</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Invoice Date</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Due Date</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Client</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Bill To</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Payment Terms</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Sub Total</th>
                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Invoice Total</th>
                            <th className="px-4 py-3 text-center text-sm font-bold text-black">Status</th>
                            <th className="px-4 py-3 text-center text-sm font-bold text-black">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {arLoading.invoices && (
                            <tr><td colSpan={13} className="py-6 text-center text-gray-400">Loading...</td></tr>
                          )}
                          {arError.invoices && (
                            <tr><td colSpan={13} className="py-6 text-center text-red-500">{arError.invoices}</td></tr>
                          )}
                          {!arLoading.invoices && invoices.data.length === 0 && (
                            <tr><td colSpan={13} className="py-6 text-center text-gray-400">No invoices found</td></tr>
                          )}
                          {arLoading.invoices && (
                            <tr><td colSpan={11} className="py-6 text-center text-gray-400">Loading...</td></tr>
                          )}
                          {arError.invoices && (
                            <tr><td colSpan={11} className="py-6 text-center text-red-500">{arError.invoices}</td></tr>
                          )}
                          {!arLoading.invoices && invoices.data.length === 0 && (
                            <tr><td colSpan={11} className="py-6 text-center text-gray-400">No invoices found</td></tr>
                          )}
                          {invoices.data.map((invoice) => (
                            <tr key={invoice.invoiceId} className="hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                {invoice.invoiceNumber ?? '-'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-800">
                                {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-800">
                                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-800">
                                {invoice.instituteName ?? '-'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-800">
                                {invoice.billTo ?? '-'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-800">
                                {invoice.invoiceType ?? '-'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-800">
                                {invoice.paymentTerms ?? '-'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-800">
                                {invoice.subTotal != null ? `$${invoice.subTotal}` : '-'}
                              </td>
                              <td className="px-4 py-4 text-sm font-semibold text-gray-800">
                                {invoice.totalAmount != null ? `$${invoice.totalAmount}` : '-'}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                  invoice.status === 'Paid'
                                    ? 'text-[#0BA071] bg-[#CCFAEB]'
                                    : invoice.status === 'Invoice Sent'
                                    ? 'text-blue-600 bg-blue-100'
                                    : 'text-yellow-700 bg-yellow-100'
                                }`}>
                                  {invoice.status ?? '-'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    className="bg-[#C01824] text-white px-3 py-1 rounded text-xs font-medium"
                                    onClick={handleCreateInvoice}
                                  >
                                    Create Invoice
                                  </button>
                                  {invoice.status !== 'Paid' ? (
                                    <button
                                      className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium disabled:opacity-60"
                                      onClick={() => dispatch(markInvoicePaid(invoice.invoiceId))}
                                      disabled={arLoading.markPaid}
                                    >
                                      Mark Paid
                                    </button>
                                  ) : (
                                    <span className="text-[#0BA071] font-medium text-xs">✓ Paid</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}



            {selectedTab === "Income Statement" && <FinancialDashboard />}
            {selectedTab === "Balance Sheet" && (
              <FinancialDashboard selectedTab={selectedTab} />
            )}
            {selectedTab === "Generate Report" && (
              <div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {/* Search */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={grSearch}
                      onChange={(e) => setGrSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-md border border-[#D9D9D9] w-52 outline-0"
                    />
                  </div>

                  {/* Data Type (static) */}
                  <div className="relative bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52">
                    <span className="text-gray-500 text-sm mr-1">Data Type : </span>
                    <span className="font-medium">Table</span>
                    <FaChevronDown className="ml-auto text-gray-500" />
                  </div>

                  {/* Sort By */}
                  <div className="relative">
                    <button
                      onClick={() => { setGrSortOpen((p) => !p); setGrYearOpen(false); setGrMonthOpen(false); }}
                      className="bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52"
                    >
                      <span className="text-gray-500 text-sm mr-1">Sort by : </span>
                      <span className="font-medium">{grSortOptions.find(o => o.value === grSortBy)?.label}</span>
                      <FaChevronDown className="ml-auto text-gray-500" />
                    </button>
                    {grSortOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                        {grSortOptions.map((opt) => (
                          <button key={opt.value} onClick={() => { setGrSortBy(opt.value); setGrSortOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${grSortBy === opt.value ? 'font-bold text-[#C01824]' : ''}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Year */}
                  <div className="relative">
                    <button
                      onClick={() => { setGrYearOpen((p) => !p); setGrSortOpen(false); setGrMonthOpen(false); }}
                      className="bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52"
                    >
                      <span className="text-gray-500 text-sm mr-1">Year : </span>
                      <span className="font-medium">{grYear}</span>
                      <FaChevronDown className="ml-auto text-gray-500" />
                    </button>
                    {grYearOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                        {grYearOptions.map((y) => (
                          <button key={y} onClick={() => { setGrYear(y); setGrYearOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${grYear === y ? 'font-bold text-[#C01824]' : ''}`}>
                            {y}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Month */}
                  <div className="relative">
                    <button
                      onClick={() => { setGrMonthOpen((p) => !p); setGrSortOpen(false); setGrYearOpen(false); }}
                      className="bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52"
                    >
                      <span className="text-gray-500 text-sm mr-1">Month : </span>
                      <span className="font-medium">{grMonthNames[grMonth - 1]}</span>
                      <FaChevronDown className="ml-auto text-gray-500" />
                    </button>
                    {grMonthOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-56 overflow-y-auto">
                        {grMonthNames.map((m, i) => (
                          <button key={m} onClick={() => { setGrMonth(i + 1); setGrMonthOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${grMonth === i + 1 ? 'font-bold text-[#C01824]' : ''}`}>
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category (static) */}
                  <div className="relative bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52">
                    <span className="text-gray-500 text-sm mr-1">Category : </span>
                    <span className="font-medium">Employees</span>
                    <FaChevronDown className="ml-auto text-gray-500" />
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="grid grid-cols-8 bg-[#EEEEEE] text-gray-800 font-medium text-sm">
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Name</div>
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">GL Code</div>
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Working Days</div>
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Work Hours</div>
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Present Days</div>
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Absent Days</div>
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Leaves</div>
                    <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Invoice Total</div>
                  </div>

                  {grLoading.generateReport && (
                    <div className="py-8 text-center text-gray-400">Loading...</div>
                  )}
                  {!grLoading.generateReport && (generateReport.items || []).length === 0 && (
                    <div className="py-8 text-center text-gray-400">No records found</div>
                  )}

                  {(generateReport.items || []).map((employee) => (
                    <div key={employee.employeeId} className="grid grid-cols-8 border-t border-[#D9D9D9]">
                      <div className="py-4 px-6 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                          {employee.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-[#141516] text-[14px] font-semibold">{employee.name}</span>
                      </div>
                      <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">
                        {employee.glCode}
                        <div className="text-xs text-gray-400">{employee.glCodeName}</div>
                      </div>
                      <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.workingDays}</div>
                      <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.workHours}</div>
                      <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.presentDays}</div>
                      <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.absentDays}</div>
                      <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.leaves}</div>
                      <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">
                        ${Number(employee.invoiceTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                {generateReport.total > 0 && (
                  <div className="mt-3 text-sm text-gray-500 text-right">
                    Total: {generateReport.total} record{generateReport.total !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}
            {selectedTab === "Terminal" && (
              <div className="w-full h-full p-4">
                <div className="flex justify-between w-[100%]">
                  <ButtonGroup
                    className="border-2 w-[33%] h-[45px] border-[#DDDDE1]/50 rounded-[10px] outline-none p-0"
                    variant="text"
                    size="md"
                  >
                    {terminalTab.map((tab) => (
                      <Button
                        key={tab}
                        className={
                          selectedTerminalTab === tab
                            ? "bg-[#C01824] w-full  hover:bg-[#C01824] text-white px-6 py-1 lg:text-[13px] capitalize font-bold"
                            : "bg-white hover:bg-white px-6 py-2 lg:text-[13px] w-full border-[#DDDDE1] capitalize font-bold"
                        }
                        onClick={() => setSelectedTerminalTab(tab)}
                      >
                        {tab}
                      </Button>
                    ))}
                  </ButtonGroup>
                  {selectedTerminalTab === "Terminals Details" && (
                    <div className="h-[45px]"></div>
                  )}
                </div>
                {selectedTerminalTab === "Terminals Details" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 mt-5">
                      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="bg-[#C01824] text-white p-2 rounded mr-3">
                          <img src={busIcon} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Total # of Open Trips</div>
                          <div className="flex items-center">
                            <span className="font-medium text-black">
                              {termLoading.summary ? '...' : (termSummary?.openTripsCount ?? 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="bg-[#C01824] text-[#C01824] p-2 rounded mr-3">
                          <img src={moneyWallet} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Total $ of Open Trips</div>
                          <div className="flex items-center">
                            <span className="font-medium text-black">
                              {termLoading.summary ? '...' : `$${Number(termSummary?.openTripsAmount ?? 0).toLocaleString()}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="bg-[#C01824] text-green-600 p-2 rounded mr-3">
                          <img src={busIcon} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Total # of Completed Trips(within current month)</div>
                          <div className="font-medium">
                            {termLoading.summary ? '...' : (termSummary?.completedTripsCount ?? 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                        <div className="bg-[#C01824] text-[#C01824] p-2 rounded mr-3">
                          <img src={moneyWallet} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Total $ of Completed Trips(within current month)</div>
                          <div className="font-medium">
                            {termLoading.summary ? '...' : `$${Number(termSummary?.completedTripsAmount ?? 0).toLocaleString()}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full space-y-4">
                      {termLoading.list ? (
                        <div className="py-6 text-center text-gray-500 text-sm">Loading terminals...</div>
                      ) : termList.length === 0 ? (
                        <div className="py-6 text-center text-gray-400 text-sm">No terminals found.</div>
                      ) : termList.map((terminal, index) => {
                        const tId = terminal.id || terminal.terminalId;
                        const tTrack = termTrackData[tId] || {};
                        const tInvoices = termInvoices[tId] || { total: 0, items: [] };
                        const isExpanded = isTerminal === index;
                        return (
                          <div key={tId || index} className="w-full bg-white border-b border-[#D9D9D9] shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2">
                              <div className="flex items-center space-x-3">
                                <button className="text-black hover:text-gray-800">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                  </svg>
                                </button>
                                <h2 className="font-medium text-black text-lg">
                                  {terminal.name || terminal.terminalName || `Terminal ${index + 1}`}
                                </h2>
                                <button className="text-black hover:text-gray-800">
                                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.78252 17.6688C3.51253 17.6688 3.28464 17.5774 3.09882 17.3945C2.91315 17.2114 2.82031 16.9869 2.82031 16.7209V14.5905C2.82031 14.3384 2.86853 14.0975 2.96496 13.8678C3.06125 13.6382 3.19878 13.4354 3.37754 13.2595L13.9759 2.83425C14.1519 2.67147 14.3471 2.54674 14.5617 2.46008C14.7762 2.37341 15.0012 2.33008 15.237 2.33008C15.4693 2.33008 15.6963 2.37341 15.9179 2.46008C16.1394 2.54674 16.3344 2.67675 16.503 2.85008L17.8835 4.21591C18.0595 4.37869 18.1888 4.57008 18.2714 4.79008C18.354 5.00994 18.3953 5.2307 18.3953 5.45237C18.3953 5.68459 18.354 5.90716 18.2714 6.12008C18.1888 6.33313 18.0595 6.52633 17.8835 6.69966L7.30629 17.1199C7.12767 17.296 6.92176 17.4315 6.68858 17.5263C6.45554 17.6213 6.21107 17.6688 5.95519 17.6688H3.78252ZM15.231 6.61404L16.4153 5.45237L15.226 4.2757L14.0366 5.44237L15.231 6.61404Z" fill="#1C1B1F" />
                                  </svg>
                                </button>
                              </div>
                              <div className="flex items-center space-x-4">
                                {terminal.managerName && (
                                  <div className="flex items-center justify-center self-center">
                                    <img src={avatar} className="mr-1" />
                                    <p className="font-medium text-[#565656] text-sm">Terminal Manager:</p>
                                    <p className="font-bold text-black text-md ml-1">{terminal.managerName}</p>
                                  </div>
                                )}
                                <button
                                  onClick={() => setIsTerminal(isExpanded ? null : index)}
                                  className="text-gray-600 hover:text-gray-800"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="w-full">
                                <div className="p-4 w-full">
                                  <div className="flex space-x-2 mb-2">
                                    <div className="w-[300px] px-2 mb-4">
                                      <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                        <div className="flex items-start">
                                          <div className="bg-[#C01824] p-2 rounded text-white mr-3"><img src={busIcon} /></div>
                                          <div>
                                            <div className="text-xs text-gray-600">YTD Revenue</div>
                                            <div className="font-medium">${Number(tTrack.ytdRevenue ?? 0).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-[300px] px-2 mb-4">
                                      <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                        <div className="flex items-start">
                                          <div className="bg-[#C01824] p-2 rounded text-white mr-3"><img src={busIcon} /></div>
                                          <div>
                                            <div className="text-xs text-gray-600">Total # of Open Trips</div>
                                            <div className="font-medium">{tTrack.openTripsCount ?? 0}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-[300px] px-2 mb-4">
                                      <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                        <div className="flex items-start">
                                          <div className="bg-[#C01824] p-2 rounded text-white mr-3"><img src={busIcon} /></div>
                                          <div>
                                            <div className="text-xs text-gray-600">Total # of Completed Trips<div className="text-xs text-gray-500">(within current month)</div></div>
                                            <div className="font-medium">{tTrack.completedTripsCount ?? 0}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex flex-col w-[400px] gap-6 items-end justify-end">
                                      <button
                                        className="bg-[#C01824] w-[50%] text-white py-2 rounded mr-0 text-sm"
                                        onClick={() => { setCreateInvoiceTerminalId(tId); setCreateInvoiceOpen(true); }}
                                      >
                                        Create Invoice
                                      </button>
                                      <button className="bg-[#C01824] w-[50%] text-white py-2 rounded text-sm">
                                        Terminal Invoice
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap mx-1">
                                    <div className="w-[300px] px-2">
                                      <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                        <div className="flex items-start">
                                          <div className="bg-[#C01824] p-2 rounded text-white mr-3"><img src={busIcon} /></div>
                                          <div>
                                            <div className="text-xs text-gray-600">YTD Trips</div>
                                            <div className="font-medium">{tTrack.ytdTrips ?? 0}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-[300px] px-2">
                                      <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                        <div className="flex items-start">
                                          <div className="bg-[#C01824] p-2 rounded text-white mr-3"><img src={busIcon} /></div>
                                          <div>
                                            <div className="text-xs text-gray-600">Total $ of Open Trips</div>
                                            <div className="font-medium">${Number(tTrack.openTripsAmount ?? 0).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-[300px] px-2">
                                      <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                        <div className="flex items-start">
                                          <div className="bg-[#C01824] p-2 rounded text-white mr-3"><img src={busIcon} /></div>
                                          <div>
                                            <div className="text-xs text-gray-600">Total $ of Completed Trips<div className="text-xs text-gray-500">(within current month)</div></div>
                                            <div className="font-medium">${Number(tTrack.completedTripsAmount ?? 0).toLocaleString()}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Invoices for this terminal */}
                                  {tInvoices.items.length > 0 && (
                                    <div className="mt-4">
                                      <div className="text-sm font-semibold text-gray-700 mb-2">Invoices</div>
                                      <table className="w-full border-collapse text-sm">
                                        <thead>
                                          <tr className="bg-gray-100">
                                            <th className="p-2 text-left border-b border-[#D9D9D9]">Date</th>
                                            <th className="p-2 text-left border-b border-[#D9D9D9]">GL Code</th>
                                            <th className="p-2 text-left border-b border-[#D9D9D9]">Type</th>
                                            <th className="p-2 text-left border-b border-[#D9D9D9]">Invoice Total</th>
                                            <th className="p-2 text-left border-b border-[#D9D9D9]">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {tInvoices.items.map((inv) => (
                                            <tr key={inv.id}>
                                              <td className="p-2 border-b border-[#D9D9D9]">{inv.date || inv.createdAt || '—'}</td>
                                              <td className="p-2 border-b border-[#D9D9D9]">{inv.glCode || '—'}</td>
                                              <td className="p-2 border-b border-[#D9D9D9]">{inv.type || inv.status || '—'}</td>
                                              <td className="p-2 border-b border-[#D9D9D9]">${Number(inv.invoiceTotal || inv.total || 0).toLocaleString()}</td>
                                              <td className="p-2 border-b border-[#D9D9D9]">
                                                <button
                                                  onClick={() => dispatch(deleteTerminalInvoice({ id: inv.id, terminalId: tId }))}
                                                  className="text-red-500"
                                                >
                                                  <FaRegTrashAlt className="w-4 h-4 text-[#C01824]" />
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>

                                <div className="px-4 pb-3">
                                  <div className="flex items-center text-[#C01824] font-medium">
                                    <span>Overview</span>
                                    <FaChevronDown className="ml-1" />
                                    <div className="border-t border-gray-300 flex-grow ml-2" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                {selectedTerminalTab === "Terminal Invoices" && (
                  <div className="bg-white rounded-lg shadow-md p-4 mt-4 w-[100%]">
                    {termLoading.invoices ? (
                      <div className="py-6 text-center text-gray-500 text-sm">Loading invoices...</div>
                    ) : (
                      <table className="w-[100%] border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-3 border-b border-[#D9D9D9]"><input type="checkbox" className="w-4 h-4" /></th>
                            <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Date</th>
                            <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">GL Code#</th>
                            <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Type</th>
                            <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Invoice Total</th>
                            <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(termInvoices['all']?.items || []).length === 0 ? (
                            <tr><td colSpan={6} className="p-4 text-center text-gray-400 text-sm">No invoices found.</td></tr>
                          ) : (termInvoices['all']?.items || []).map((invoice) => (
                            <tr key={invoice.id}>
                              <td className="p-3 border-b border-[#D9D9D9] text-center"><input type="checkbox" className="w-4 h-4" /></td>
                              <td className="p-3 border-b border-[#D9D9D9]">{invoice.date || invoice.createdAt || '—'}</td>
                              <td className="p-3 border-b border-[#D9D9D9]">{invoice.glCode || '—'}</td>
                              <td className="p-3 border-b border-[#D9D9D9]">{invoice.type || invoice.status || '—'}</td>
                              <td className="p-3 border-b border-[#D9D9D9]">${Number(invoice.invoiceTotal || invoice.total || 0).toLocaleString()}</td>
                              <td className="p-3 border-b border-[#D9D9D9]">
                                <button
                                  onClick={() => dispatch(deleteTerminalInvoice({ id: invoice.id, terminalId: undefined }))}
                                  className="text-red-500"
                                  aria-label="Delete"
                                >
                                  <FaRegTrashAlt className="w-5 h-5 text-[#C01824]" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
                {selectedTerminalTab === "Track Terminal" && (() => {
                  const activeTrackId = trackTerminalId || (termList[0]?.id || termList[0]?.terminalId);
                  const activeTrack = termTrackData[activeTrackId] || {};
                  const quarterlyData = activeTrack.quarterly || [];
                  const activeTerminalName = activeTrackId
                    ? (termList.find(t => (t.id || t.terminalId) === activeTrackId)?.name || `Terminal`)
                    : 'Terminal';
                  return (
                  <div className="flex items-center gap-5">
                    <div className="bg-white rounded-lg shadow-md p-6 w-[45%] mt-4">
                      {/* Top Cards */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Terminal Selection Card */}
                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-4">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <img src={busIcon} />
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Select Terminal</div>
                            <div className="flex items-center">
                              <select
                                className="font-medium text-[#141516] text-base bg-transparent border-none outline-none cursor-pointer"
                                value={activeTrackId || ''}
                                onChange={(e) => {
                                  const newId = parseInt(e.target.value);
                                  setTrackTerminalId(newId);
                                  dispatch(fetchTerminalTrack({ terminalId: newId, year: trackYear }));
                                }}
                              >
                                {termList.map(t => {
                                  const tid = t.id || t.terminalId;
                                  return <option key={tid} value={tid}>{t.name || t.terminalName || `Terminal ${tid}`}</option>;
                                })}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Income Card */}
                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-4">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <img src={moneyWallet} />
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Income</div>
                            <div className="flex items-center">
                              <span className="font-medium text-[#141516] text-[24px]">
                                ${Number(activeTrack.income ?? 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expenses Card */}
                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-4">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <img src={marketIcon} />
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Expenses</div>
                            <div className="flex items-center">
                              <span className="font-medium text-[#141516] text-[24px]">
                                ${Number(activeTrack.expenses ?? 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Savings Card */}
                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-4">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                              <BiDollar size={18} color="#C01824" />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Savings</div>
                            <div className="flex items-center">
                              <span className="font-medium text-[#141516] text-[24px]">
                                ${Number(activeTrack.savings ?? 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sales Section */}
                      <div className="mb-6 border border-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-[26px] font-bold text-[#475569]">Sales</h2>
                          <div className="text-sm text-gray-500 flex items-center">
                            {trackYear}
                          </div>
                        </div>
                        <div className="text-[26px] font-bold mb-4 text-[#475569]">
                          ${Number(activeTrack.income ?? 0).toLocaleString()}
                        </div>
                        <div className="relative h-32">
                          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#475569]">
                            <div>$15k</div><div>$10k</div><div>$5k</div><div>$0k</div>
                          </div>
                          <div className="ml-8 h-full flex flex-col justify-between">
                            <div className="border-t border-gray-300"></div>
                            <div className="border-t border-gray-300"></div>
                            <div className="border-t border-gray-300"></div>
                            <div className="border-t border-gray-300"></div>
                          </div>
                          {quarterlyData.length > 0 ? (
                            <svg className="absolute top-0 left-10 w-5/6 h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                              <polyline
                                points={quarterlyData.map((q, i) => {
                                  const max = Math.max(...quarterlyData.map(d => d.amount || 0), 1);
                                  const x = (i / (quarterlyData.length - 1)) * 300;
                                  const y = 100 - ((q.amount || 0) / max) * 90;
                                  return `${x},${y}`;
                                }).join(' ')}
                                fill="none" stroke="#C01824" strokeWidth="2"
                              />
                              {quarterlyData.map((q, i) => {
                                const max = Math.max(...quarterlyData.map(d => d.amount || 0), 1);
                                const x = (i / (quarterlyData.length - 1)) * 300;
                                const y = 100 - ((q.amount || 0) / max) * 90;
                                return <circle key={i} cx={x} cy={y} r="5" fill="#C01824" />;
                              })}
                            </svg>
                          ) : (
                            <svg className="absolute top-0 left-10 w-5/6 h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                              <polyline points="0,40 100,60 200,80 300,20" fill="none" stroke="#C01824" strokeWidth="2" />
                              <circle cx="0" cy="40" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                              <circle cx="100" cy="60" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                              <circle cx="200" cy="80" r="5" fill="#C01824" />
                              <circle cx="300" cy="20" r="5" fill="#C01824" />
                            </svg>
                          )}
                          <div className="absolute bottom-0 left-10 w-5/6 flex justify-between text-xs text-gray-500">
                            {quarterlyData.length > 0
                              ? quarterlyData.map((q, i) => <div key={i}>{q.quarter || `Q${i+1}`}</div>)
                              : ['Q1','Q2','Q3','Q4'].map(q => <div key={q}>{q}</div>)
                            }
                          </div>
                        </div>
                      </div>

                      {/* Profit & Loss Section */}
                      <div className="border border-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-semibold text-gray-700 text-[#475569]">Profit & Loss</h2>
                          <div className="text-sm text-gray-500 flex items-center text-[#475569]">{trackYear}</div>
                        </div>
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-[#475569]">
                            ${Number((activeTrack.income ?? 0) - (activeTrack.expenses ?? 0)).toLocaleString()}
                          </div>
                          <div className="text-sm text-[#475569]">Net income</div>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-[#475569]">${Number(activeTrack.income ?? 0).toLocaleString()}</span>
                            <span className="text-[#475569]">Income</span>
                          </div>
                          <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: `${activeTrack.income && activeTrack.expenses ? Math.min(100, (activeTrack.income / (activeTrack.income + activeTrack.expenses)) * 100) : 60}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-[#475569]">${Number(activeTrack.expenses ?? 0).toLocaleString()}</span>
                            <span className="text-[#475569]">Expenses</span>
                          </div>
                          <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: `${activeTrack.income && activeTrack.expenses ? Math.min(100, (activeTrack.expenses / (activeTrack.income + activeTrack.expenses)) * 100) : 80}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 w-[45%] mt-4">
                      {/* Top Cards */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <img src={busIcon} />
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Terminal</div>
                            <div className="flex items-center">
                              <span className="font-bold text-[#141516] text-[24px]">{activeTerminalName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <img src={moneyWallet} />
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Income</div>
                            <div className="flex items-center">
                              <span className="font-bold text-[#141516] text-[24px]">${Number(activeTrack.income ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <img src={marketIcon} />
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Expenses</div>
                            <div className="flex items-center">
                              <span className="font-bold text-[#141516] text-[24px]">${Number(activeTrack.expenses ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center">
                          <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                              <BiDollar size={18} color="#C01824" />
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-[#9E9E9E] font-normal">Savings</div>
                            <div className="flex items-center">
                              <span className="font-bold text-[#141516] text-[24px]">${Number(activeTrack.savings ?? 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sales Section */}
                      <div className="mb-6 border border-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-semibold text-[#475569]">Sales</h2>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <select
                              className="text-sm text-gray-500 bg-transparent border-none outline-none cursor-pointer"
                              value={trackYear}
                              onChange={(e) => {
                                const yr = parseInt(e.target.value);
                                setTrackYear(yr);
                                if (activeTrackId) dispatch(fetchTerminalTrack({ terminalId: activeTrackId, year: yr }));
                              }}
                            >
                              {[2022,2023,2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="text-2xl font-bold mb-4 text-[#475569]">
                          ${Number(activeTrack.income ?? 0).toLocaleString()}
                        </div>

                        {/* Sales Chart */}
                        <div className="relative h-32">
                          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                            <div>$15k</div>
                            <div>$10k</div>
                            <div>$5k</div>
                            <div>$0k</div>
                          </div>
                          <div className="ml-8 h-full flex flex-col justify-between">
                            <div className="border-t border-gray-300"></div>
                            <div className="border-t border-gray-300"></div>
                            <div className="border-t border-gray-300"></div>
                            <div className="border-t border-gray-300"></div>
                          </div>
                          {quarterlyData.length > 0 ? (
                            <svg className="absolute top-0 left-10 w-5/6 h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                              <polyline
                                points={quarterlyData.map((q, i) => {
                                  const max = Math.max(...quarterlyData.map(d => d.amount || 0), 1);
                                  const x = (i / (quarterlyData.length - 1)) * 300;
                                  const y = 100 - ((q.amount || 0) / max) * 90;
                                  return `${x},${y}`;
                                }).join(' ')}
                                fill="none" stroke="#C01824" strokeWidth="2"
                              />
                              {quarterlyData.map((q, i) => {
                                const max = Math.max(...quarterlyData.map(d => d.amount || 0), 1);
                                const x = (i / (quarterlyData.length - 1)) * 300;
                                const y = 100 - ((q.amount || 0) / max) * 90;
                                return <circle key={i} cx={x} cy={y} r="5" fill="#C01824" />;
                              })}
                            </svg>
                          ) : (
                            <svg className="absolute top-0 left-10 w-5/6 h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                              <polyline points="0,40 100,60 200,80 300,20" fill="none" stroke="#C01824" strokeWidth="2" />
                              <circle cx="0" cy="40" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                              <circle cx="100" cy="60" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                              <circle cx="200" cy="80" r="5" fill="#C01824" />
                              <circle cx="300" cy="20" r="5" fill="#C01824" />
                            </svg>
                          )}
                          <div className="absolute bottom-0 left-10 w-5/6 flex justify-between text-xs text-gray-500">
                            {quarterlyData.length > 0
                              ? quarterlyData.map((q, i) => <div key={i}>{q.quarter || `Q${i+1}`}</div>)
                              : ['Q1','Q2','Q3','Q4'].map(q => <div key={q}>{q}</div>)
                            }
                          </div>
                        </div>
                      </div>

                      {/* Profit & Loss Section */}
                      <div className="border border-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-semibold text-gray-700 text-[#475569]">Profit & Loss</h2>
                          <div className="text-sm text-gray-500 flex items-center text-[#475569]">
                            {trackYear}
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-[#475569]">
                            ${Number((activeTrack.income ?? 0) - (activeTrack.expenses ?? 0)).toLocaleString()}
                          </div>
                          <div className="text-sm text-[#475569]">Net income</div>
                        </div>
                        {/* Income Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-[#475569]">${Number(activeTrack.income ?? 0).toLocaleString()}</span>
                            <span className="text-[#475569]">Income</span>
                          </div>
                          <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: `${activeTrack.income && activeTrack.expenses ? Math.min(100, (activeTrack.income / (activeTrack.income + activeTrack.expenses)) * 100) : 60}%` }}></div>
                          </div>
                        </div>
                        {/* Expenses Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-[#475569]">${Number(activeTrack.expenses ?? 0).toLocaleString()}</span>
                            <span className="text-[#475569]">Expenses</span>
                          </div>
                          <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: `${activeTrack.income && activeTrack.expenses ? Math.min(100, (activeTrack.expenses / (activeTrack.income + activeTrack.expenses)) * 100) : 80}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })()}
              </div>
            )}
            {selectedTab === "KPI" && <KPIScreen />}
          </>
        )}
        {/* Create Terminal Invoice Modal */}
        {createInvoiceOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl p-6 w-[420px]">
              <h3 className="text-lg font-semibold mb-4">Create Invoice</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Description</label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                    value={createInvoiceForm.description}
                    onChange={e => setCreateInvoiceForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Invoice description"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                    <input
                      type="number" min="1"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                      value={createInvoiceForm.quantity}
                      onChange={e => setCreateInvoiceForm(f => ({ ...f, quantity: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Unit Price ($)</label>
                    <input
                      type="number" min="0" step="0.01"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                      value={createInvoiceForm.unitPrice}
                      onChange={e => setCreateInvoiceForm(f => ({ ...f, unitPrice: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">GL Code ID (optional)</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                    value={createInvoiceForm.glCodeId}
                    onChange={e => setCreateInvoiceForm(f => ({ ...f, glCodeId: e.target.value }))}
                    placeholder="GL Code ID"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700"
                  onClick={() => { setCreateInvoiceOpen(false); setCreateInvoiceForm({ description: '', glCodeId: '', quantity: 1, unitPrice: '' }); }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm rounded bg-[#C01824] text-white disabled:opacity-60"
                  disabled={termLoading.createInvoice}
                  onClick={() => handleCreateTerminalInvoice(createInvoiceTerminalId)}
                >
                  {termLoading.createInvoice ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        <GLCodesModal
          isOpen={gLCodeModalOpen}
          onClose={() => setGLCodeModalOpen(false)}
        />

        <VendorGlobalModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Export Invoice"
          primaryButtonText="Export"
          secondaryButtonText="Cancel"
          onPrimaryAction={handleExport}
        >
          {/* Custom content specific to Export Invoice */}
          <div className="w-full">
            <label className="block mb-2 font-medium">Select Format</label>
            <div className="relative">
              <select className="w-full p-2 outline-none border border-gray-300 rounded appearance-none bg-white text-gray-700 pr-8">
                <option value="">Select</option>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </VendorGlobalModal>
        <VendorGlobalModal
          isOpen={isImportInvoiceModal}
          onClose={closeImportInvoiceModal}
          title="Import Invoice"
          primaryButtonText="Import"
          secondaryButtonText="Cancel"
          onPrimaryAction={handleImport}
        >
          <div className="w-full">
            <div className="border border-dashed border-red-300 rounded-md p-16 flex flex-col items-center justify-center">
              <div className="text-[#C01824] mb-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="#C01824"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="#C01824"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-[#C01824] font-medium mb-1">
                Drag and Drop Files
              </div>
              <div className="text-gray-600 text-sm">CSV, XSL, PDF or DOC</div>
            </div>
          </div>
        </VendorGlobalModal>
      </section>
    </MainLayout>
  );
};

export default Accounting;
