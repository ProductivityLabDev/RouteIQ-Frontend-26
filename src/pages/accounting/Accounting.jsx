import { accountingTab, generateReportEmployeesData, glCodeData, glCodesTab, InvoicesData, payementTablesData, schoolInvoices, terminalTab } from '@/data/dummyData';
import { useState } from 'react';
import { Button, ButtonGroup, Input, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { format, set } from "date-fns";
import { DayPicker } from "react-day-picker";
import { avatar, busIcon, calendar, locationicon, marketIcon, moneyWallet } from '@/assets';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { BiDollar } from 'react-icons/bi';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EditInvoiceForm from '@/components/EditInvoiceForm ';
import GLCodesTable from '@/components/GLCodesTable';
import InvoiceForm from '@/components/InvoiceForm';
import VendorGlobalModal from '@/components/Modals/VendorGlobalModal';
import SchoolInvoiceList from '@/components/SchoolInvoiceList';
import MainLayout from '@/layouts/SchoolLayout';
import BalanceModal from '@/components/Modals/BalanceModal';
import { GLCodeItem } from '@/components/GLCodeItem';
import GLCodesModal from '@/components/Modals/GLCodesModal';
import HistoryLogTable from '@/components/HistoryLogTable';
import FinancialDashboard from '@/components/FinancialDashboard';
import KPIScreen from '@/components/KPIScreen';



const Accounting = () => {
    const [selectedTab, setSelectedTab] = useState('Subscription');
    const [selectedGlCodesTab, setSelectedGlCodesTab] = useState('Accounts Payable');
    const [selectedTerminalTab, setSelectedTerminalTab] = useState('Terminals Details');
    const [invoiceForm, setInvoiceForm] = useState(false);
    const [gLCodeModalOpen, setGLCodeModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState();
    const [isTripInvoice, setIsTripInvoice] = useState(false);
    const [isTerminal, setIsTerminal] = useState(false);
    const [schoolData, setSchoolData] = useState(false)
    const [schoolInvoice, setSchoolInvoice] = useState(false)
    const [editInvoice, setEditInvoice] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportInvoiceModal, setIsImportInvoiceModal] = useState(false);
    const [batchInvoice, setBatchInvoice] = useState(false)
    const [createBatchInvoice, setCreateBatchInvoice] = useState(false)
    const [createInvoice, setCreateInvoice] = useState(false)
    const [addVendor, setAddVendor] = useState(false)
    const [addExpense, setAddExpense] = useState(false)
    const [expandedVendor, setExpandedVendor] = useState("Ronald Richards");
    const [payModal, setPayModal] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openImportInvoiceModal = () => setIsImportInvoiceModal(true);
    const closeImportInvoiceModal = () => setIsImportInvoiceModal(false);
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname;
    const headings = {
        'Subscription': 'Invoices',
        'School Invoices': 'School Invoices',
        'Trip invoices': 'Trip Invoices',
        'Generate Report': 'Generate Report'
    };
    const handleback = () => {
        setInvoiceForm(!invoiceForm)
    }
    const handleExport = () => {
        closeModal();
        setSelectedTab('Trip invoices')
        setSchoolData(false)
    };
    const handleImport = () => {
        closeImportInvoiceModal();
        setSelectedTab('Trip invoices')
        setSchoolData(false)
    };
    const handleSchoolBack = () => {
        setSchoolData(!schoolData)
    }
    const handleInvoiceList = () => {
        setSchoolInvoice(true)
        setInvoiceForm(true)
    }
    const handleBatchInvoice = () => {
        setEditInvoice(true)
        setBatchInvoice(true)
    }
    const handleCreateBatchInvoice = () => {
        setCreateBatchInvoice(true)
        setBatchInvoice(true)
    }
    const backCreateBatchInvoice = () => {
        setCreateBatchInvoice(false)
    }
    const handleCreateInvoice = () => {
        setEditInvoice(true)
        setCreateInvoice(true)
    }
    const handlebackCreateInvoice = () => {
        setCreateInvoice(false)
    }
    const toggleExpand = (name) => {
        if (expandedVendor === name) {
            setExpandedVendor(null);
        } else {
            setExpandedVendor(name);
        }
    };
    return (
        <MainLayout>
            <section className='w-full h-full mt-8'>
                {createBatchInvoice || createInvoice ?
                    <div className='w-full'>
                        <div className="flex justify-between items-center my-3 pb-2">
                            <div className="flex w-full justify-between items-center  mt-3 pb-2">
                                <div className="flex flex-col items-center gap-2">
                                    <h2 className="text-[22px] lg:text-[26px] xl:text-[29px] font-bold text-black">
                                        Create Invoice
                                    </h2>
                                    {batchInvoice &&
                                        <h2 className="text-[22px] ps-5 lg:text-[26px] xl:text-[29px] mx-3 font-bold text-black">
                                            Invoice # 12501
                                        </h2>
                                    }
                                </div>
                                <div className="flex flex-row items-center flex-wrap gap-4 justify-end">
                                    <Button
                                        className="border border-[#C01824] bg-transparent text-[#C01824] px-12 py-2 rounded-[4px]"
                                        variant="outlined"
                                        size="lg"
                                        onClick={createInvoice ? handlebackCreateInvoice : backCreateBatchInvoice}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                                        variant="filled"
                                        size="lg"
                                        onClick={createInvoice ? handlebackCreateInvoice : backCreateBatchInvoice}
                                    >
                                        Save Invoice
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <EditInvoiceForm batchInvoice={batchInvoice} />
                    </div>
                    :
                    invoiceForm ?
                        <InvoiceForm handleback={handleback} schoolInvoice={schoolInvoice} setEditInvoice={setEditInvoice} editInvoice={editInvoice} handleBatchInvoice={handleBatchInvoice} batchInvoice={batchInvoice} />
                        :
                        <>
                            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='md'>
                                {accountingTab.map(tab => (
                                    <Button
                                        key={tab}
                                        className={selectedTab === tab ? 'bg-[#C01824] w-full  hover:bg-[#C01824] text-white px-6 py-3 lg:text-[13px] capitalize font-bold' : 'bg-white hover:bg-white px-6 py-3 lg:text-[13px] w-full border-[#DDDDE1] capitalize font-bold'}
                                        onClick={() => setSelectedTab(tab)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </ButtonGroup>
                            {/* ---------------- Header of Card --------------- */}
                            <div className="flex justify-between items-center my-3 pb-2">
                                {schoolData ?
                                    <div className="flex w-full justify-between items-center  mt-3 pb-2">
                                        <div className="flex items-center gap-2">
                                            <MdOutlineKeyboardArrowLeft color="#C01824" size={40} onClick={() => setSchoolData(false)} />
                                            <h2 className="text-[22px] lg:text-[26px] xl:text-[29px] font-bold text-black">
                                                Lakeview High Sch...
                                            </h2>
                                        </div>

                                        <div className="flex flex-row items-center flex-wrap gap-4 justify-end">
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
                                                onClick={openImportInvoiceModal}
                                            >
                                                Import Invoice
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
                                    :

                                    headings[selectedTab] &&
                                    <h2 className="text-[22px] lg:text-[26px] xl:text-[29px] font-bold text-black">{headings[selectedTab]}</h2>
                                }
                                {selectedTab === 'Subscription' &&
                                    <Button
                                        className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                        variant='filled'
                                        size='lg'
                                        onClick={() => navigate(`/dashboard_subscription?from=${encodeURIComponent(currentPath)}`)}
                                    >
                                        Renew Subscription
                                    </Button>
                                }
                            </div>
                            {selectedTab === 'Subscription' &&
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
                            }
                            {schoolData ?
                                <div className="w-full p-4 bg-white h-[66vh] rounded-xl">
                                    <div className="bg-white shadow-md rounded-xl w-full h-[45vh] overflow-hidden border border-[#D9D9D9]">
                                        <div className="w-full overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="p-3 border-b border-[#D9D9D9]">
                                                            <input type="checkbox" className="w-4 h-4" />
                                                        </th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Date</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Invoice#</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Bill To</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">GL Code#</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Type</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Miles per Rate</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Invoice Total</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Invoice</th>
                                                        <th className="p-3 text-left font-bold text-[#141516] border-b border-[#D9D9D9]">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {schoolInvoices.map((invoice, index) => (
                                                        <tr key={index} className="bg-whit">
                                                            <td className="p-8 border-b flex justify-center items-center border-[#D9D9D9]">
                                                                <input type="checkbox" className="w-4 h-4" />
                                                            </td>
                                                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">{invoice.date}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">{invoice.invoiceNumber}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">{invoice.billTo}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">{invoice.glCode}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">{invoice.type}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">{invoice.milesPerRate}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9] text-[#141516]">{invoice.invoiceTotal}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">
                                                                <a className="text-[#C01824] font-bold cursor-pointer" onClick={handleInvoiceList}>View</a>
                                                            </td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">
                                                                <button className="text-red-500" aria-label="Delete">
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
                                :
                                selectedTab === 'School Invoices' &&
                                <div className="w-full space-y-4">
                                    {[...Array(4)].map((_, index) => (
                                        <div className="w-full bg-white border-b border-[#D9D9D9] shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-4 border rounded-md border-[#D9D9D9]">
                                                <div className="flex items-center space-x-3">
                                                    <button className="text-gray-600 hover:text-gray-800">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                        </svg>
                                                    </button>
                                                    <h2 className="font-medium text-gray-800 text-lg">Terminal {index + 1}</h2>
                                                    <button className="text-gray-600 hover:text-gray-800">
                                                      <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M3.78276 17.6688C3.51278 17.6688 3.28488 17.5774 3.09907 17.3945C2.91339 17.2114 2.82056 16.9869 2.82056 16.7209V14.5905C2.82056 14.3384 2.86877 14.0975 2.9652 13.8678C3.06149 13.6382 3.19902 13.4354 3.37779 13.2595L13.9762 2.83425C14.1521 2.67147 14.3474 2.54674 14.562 2.46008C14.7764 2.37341 15.0015 2.33008 15.2372 2.33008C15.4695 2.33008 15.6965 2.37341 15.9181 2.46008C16.1396 2.54674 16.3347 2.67675 16.5033 2.85008L17.8838 4.21591C18.0597 4.37869 18.189 4.57008 18.2716 4.79008C18.3542 5.00994 18.3956 5.2307 18.3956 5.45237C18.3956 5.68459 18.3542 5.90716 18.2716 6.12008C18.189 6.33313 18.0597 6.52633 17.8838 6.69966L7.30654 17.1199C7.12791 17.296 6.92201 17.4315 6.68882 17.5263C6.45578 17.6213 6.21132 17.6688 5.95543 17.6688H3.78276ZM15.2313 6.61404L16.4155 5.45237L15.2262 4.2757L14.0369 5.44237L15.2313 6.61404Z" fill="#1C1B1F"/>
                                                      </svg>

                                                    </button>

                                                </div>
                                                <div className="flex items-center space-x-4">

                                                    <button
                                                        onClick={() => setIsOpen(index === isOpen ? null : index)}
                                                        className="text-black hover:text-gray-800"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-6 w-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            {isOpen === index && (
                                                <SchoolInvoiceList handleSchoolBack={handleSchoolBack} setSchoolData={setSchoolData} />
                                            )}
                                        </div>
                                    ))

                                    }
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
                            }
                            {selectedTab === 'Trip invoices' &&
                                <div className="w-full space-y-4">
                                    {[...Array(4)].map((_, index) => (
                                        <div className="w-full bg-white border-b  shadow-sm">
                                            <div className="flex items-center justify-between px-4 py-4 border rounded-md border-[#D6D6D6]">
                                                <div className="flex items-center space-x-3">
                                                    <button className="text-[#000]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                                                        </svg>
                                                    </button>
                                                    <h2 className="font-medium text-gray-800 text-lg">Terminal {index + 1}</h2>
                                                    <button className="text-gray-600 hover:text-gray-800">
                                                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3.78276 17.6688C3.51278 17.6688 3.28488 17.5774 3.09907 17.3945C2.91339 17.2114 2.82056 16.9869 2.82056 16.7209V14.5905C2.82056 14.3384 2.86877 14.0975 2.9652 13.8678C3.06149 13.6382 3.19902 13.4354 3.37779 13.2595L13.9762 2.83425C14.1521 2.67147 14.3474 2.54674 14.562 2.46008C14.7764 2.37341 15.0015 2.33008 15.2372 2.33008C15.4695 2.33008 15.6965 2.37341 15.9181 2.46008C16.1396 2.54674 16.3347 2.67675 16.5033 2.85008L17.8838 4.21591C18.0597 4.37869 18.189 4.57008 18.2716 4.79008C18.3542 5.00994 18.3956 5.2307 18.3956 5.45237C18.3956 5.68459 18.3542 5.90716 18.2716 6.12008C18.189 6.33313 18.0597 6.52633 17.8838 6.69966L7.30654 17.1199C7.12791 17.296 6.92201 17.4315 6.68882 17.5263C6.45578 17.6213 6.21132 17.6688 5.95543 17.6688H3.78276ZM15.2313 6.61404L16.4155 5.45237L15.2262 4.2757L14.0369 5.44237L15.2313 6.61404Z" fill="#1C1B1F"/>
                                                        </svg>

                                                    </button>

                                                </div>
                                                <div className="flex items-center space-x-4">

                                                    <button
                                                        onClick={() => setIsTripInvoice(index === isTripInvoice ? null : index)}
                                                        className="text-black"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={`h-6 w-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            {isTripInvoice === index && (
                                                <div className="w-full overflow-x-auto">
                                                    <div className="flex flex-row items-center flex-wrap gap-4 p-3   justify-end">
                                                        <Button
                                                            className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                                                            variant="filled"
                                                            size="sm"
                                                        >
                                                            Send
                                                        </Button>
                                                        <Button
                                                            className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                                                            variant="filled"
                                                            size="sm"
                                                            onClick={openModal}
                                                        >
                                                            Export Invoice
                                                        </Button>
                                                        <Button
                                                            className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                                                            variant="filled"
                                                            size="sm"
                                                            onClick={openImportInvoiceModal}
                                                        >
                                                            Import Invoice
                                                        </Button>
                                                        <Button
                                                            className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                                                            variant="filled"
                                                            size="sm"
                                                            onClick={handleCreateBatchInvoice}
                                                        >
                                                            Create Batch Invoice
                                                        </Button>
                                                        <Button
                                                            className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                                                            variant="filled"
                                                            size="sm"
                                                            onClick={handleCreateInvoice}
                                                        >
                                                            Create Invoice
                                                        </Button>
                                                    </div>
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="p-3 border-b border-[#EEEEEE]">
                                                                    <input type="checkbox" className="w-4 h-4" />
                                                                </th>
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
                                                            {schoolInvoices.map((invoice, index) => (
                                                                <tr key={index} className="bg-white">
                                                                    <td className="p-8   border-b flex justify-center items-center border-[#D9D9D9]">
                                                                        <input type="checkbox" className="w-4 h-4" />
                                                                    </td>
                                                                    <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.date}</td>
                                                                    <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.invoiceNumber}</td>
                                                                    <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.billTo}</td>
                                                                    <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.glCode}</td>
                                                                    <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.type}</td>
                                                                    <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.milesPerRate}</td>
                                                                    <td className="p-3 border-b border-[#D9D9D9] text-[#141516] font-semibold">{invoice.invoiceTotal}</td>
                                                                    <td className="p-3 border-b border-[#D9D9D9]">
                                                                        <a className="text-[#C01824] font-bold cursor-pointer" onClick={handleInvoiceList}>View</a>
                                                                    </td>
                                                                    <td className="p-3 border-b border-[#D9D9D9]">
                                                                        <button className="text-red-500" aria-label="Delete">
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
                                    ))

                                    }
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
                            }
                            {selectedTab === 'GL Codes' &&
                                <div className="w-full space-y-4 bg-[#fff] shadow-md p-5 rounded-md">
                                    {addVendor || addExpense ?
                                        <div className="w-full text-start">
                                            <h1 className="text-[20px] text-black font-bold">{addVendor ? "Add Vendor" : "Add Expense"}</h1>
                                        </div>
                                        :
                                        <div className='w-full flex justify-between items-center mt-6 mb-4 px-7 py-3'>
                                            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='md'>
                                                {glCodesTab?.map(tab => (
                                                    <Button
                                                        key={tab}
                                                        className={selectedGlCodesTab === tab ? 'bg-[#C01824]  hover:bg-[#C01824] text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white hover:bg-white px-6 py-3 lg:text-[13px]  border-[#DDDDE1] capitalize font-bold'}
                                                        onClick={() => setSelectedGlCodesTab(tab)}
                                                    >
                                                        {tab}
                                                    </Button>
                                                ))}
                                            </ButtonGroup>
                                            {selectedGlCodesTab === 'Accounts Payable' &&
                                                <div className='flex items-center space-x-4'>
                                                    <div className="md:w-[250px] bg-white border-0 rounded-md shadow-sm">
                                                        <Popover placement="bottom">
                                                            <PopoverHandler>
                                                                <div className="relative">
                                                                    <Input
                                                                        label="Select a Date"
                                                                        onChange={() => null}
                                                                        value={date ? format(date, "PPP") : ""}
                                                                    />
                                                                    <img src={calendar} alt='' className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
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
                                                                        caption: "flex justify-center py-1 relative items-center",
                                                                        caption_label: "text-sm font-medium text-gray-900",
                                                                        nav: "flex items-center",
                                                                        nav_button: "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                                                                        nav_button_previous: "absolute left-1.5",
                                                                        nav_button_next: "absolute right-1.5",
                                                                        table: "w-full border-collapse",
                                                                        head_row: "flex font-medium text-gray-900",
                                                                        head_cell: "m-0.5 w-9 font-normal text-sm",
                                                                        row: "flex w-full mt-2",
                                                                        cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                                        day: "h-9 w-9 p-0 font-normal",
                                                                        day_range_end: "day-range-end",
                                                                        day_selected: "rounded-md bg-[#C01824] text-white hover:bg-[#C01824]/90 hover:text-white focus:bg-[#C01824] focus:text-white",
                                                                        day_today: "rounded-md bg-gray-200 text-gray-900",
                                                                        day_outside: "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                                                                        day_disabled: "text-gray-500 opacity-50",
                                                                        day_hidden: "invisible",
                                                                    }}
                                                                    components={{
                                                                        IconLeft: ({ ...props }) => (
                                                                            <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                                                                        ),
                                                                        IconRight: ({ ...props }) => (
                                                                            <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                                                                        ),
                                                                    }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>

                                                    </div>
                                                    <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                                        variant='filled' size='lg' onClick={() => setAddVendor(true)}>
                                                        Add Vendor
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    }
                                    {selectedGlCodesTab === 'Accounts Payable' && (
                                        <div className="w-full bg-white border-b border-[#D9D9D9] shadow-sm">
                                            {addVendor ?
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
                                                                    <img src={locationicon} alt="location" className="h-5 w-5" />
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
                                                : addExpense ?
                                                    <div className="max-w-3xl p-6">
                                                        <div className="grid grid-cols-2 gap-6">
                                                            {/* Vendor Name */}
                                                            <div className="col-span-1">
                                                                <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                                                    Date
                                                                </div>
                                                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                                                                    <input
                                                                        type="date"
                                                                        placeholder="Enter Date"
                                                                        className="bg-[#F5F6FA] outline-none w-full"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Address */}
                                                            <div className="col-span-1">
                                                                <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                                                    Type
                                                                </div>
                                                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Select"
                                                                        className="bg-[#F5F6FA] outline-none w-full"
                                                                    />
                                                                    <div className="flex flex-row gap-3 items-center">
                                                                        <ChevronDownIcon className="h-5 w-5 text-black ml-2" />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="col-span-1">
                                                                <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                                                    Amount
                                                                </div>
                                                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter Amount"
                                                                        className="bg-[#F5F6FA] outline-none w-full"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-span-1">
                                                                <div className="mb-2 text-[14px] text-[#2C2F32] font-semibold">
                                                                    Due Date
                                                                </div>
                                                                <div className="flex flex-row bg-[#F5F6FA] border border-[#D5D5D5] rounded-[6px] p-3 w-full justify-between relative">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter due date"
                                                                        className="bg-[#F5F6FA] outline-none w-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Buttons */}
                                                        <div className="flex mt-20 space-x-4">
                                                            <button
                                                                className="border border-[#C01824] bg-white text-[#C01824] px-12 py-2 rounded-[4px]"
                                                                onClick={() => setAddExpense(false)}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="bg-[#C01824] text-white px-12 py-2 rounded-[4px]"
                                                                onClick={() => setAddExpense(false)}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                    :
                                                    <GLCodesTable expandedVendor={expandedVendor} toggleExpand={toggleExpand} setAddExpense={setAddExpense} setPayModal={setPayModal} />
                                            }
                                            {
                                                payModal &&
                                                <BalanceModal setBalanceModal={setPayModal} accountingPay={true} />
                                            }
                                        </div>
                                    )}
                                    {selectedGlCodesTab === 'Accounts Receivable' && (
                                        <div className="w-[100%] h-[75vh] p-4 bg-white border-0 shadow-sm">
                                            <div className="overflow-x-auto w-[100%] bg-white border-1 rounded-[12px] border-[#D9D9D9] shadow-sm">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Date</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Payment Date</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Payment Method</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Trip#</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Trip Status</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Client</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Invoice#</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Bill To</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Trip Status</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Client</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Invoice#</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Bill To</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Type</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Miles per Rate</th>
                                                            <th className="px-4 py-3 text-left text-sm font-bold text-black">Invoice Total</th>
                                                            <th className="px-4 py-3 text-center text-sm font-bold text-black">Invoice</th>
                                                            <th className="px-4 py-3 text-center text-sm font-bold text-black">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {payementTablesData.map((payment, index) => (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.date}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.paymentDate}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.paymentMethod}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.tripId}</td>
                                                                <td className="px-4 py-4">
                                                                    <span className="px-2 py-1 text-xs font-medium text-[#0BA071] bg-[#CCFAEB] rounded-md">
                                                                        {payment.tripStatus}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.client}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.invoiceId}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.billTo}</td>

                                                                <td className="px-4 py-4">
                                                                    <span className="px-2 py-1 text-xs font-medium text-[#0BA071] bg-[#CCFAEB] rounded-md">
                                                                        {payment.tripStatus}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.client}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.invoiceId}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.billTo}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.type}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.milesPerRate}</td>
                                                                <td className="px-4 py-4 text-sm text-gray-800">{payment.invoiceTotal}</td>
                                                                <td className="px-4 py-4 text-center text-[#C01824] font-bold cursor-pointer" onClick={handleCreateInvoice}>
                                                                    View
                                                                </td>
                                                                <td className="px-4 py-4 text-center">
                                                                    <button className="text-red-500 hover:text-red-700">
                                                                        <FaRegTrashAlt className="w-5 h-5 text-[#C01824]" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    {selectedGlCodesTab === 'GL Code List' && (
                                        <section className='w-full h-full p-4 md:p-6 lg:p-8 bg-white rounded-[10px]'>
                                            <div className="w-[100%]">
                                                <div className='flex justify-between mb-6 w-[100%]'>
                                                    <h1 className="text-3xl font-bold">GL Codes</h1>
                                                    <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                                        variant='filled' size='lg' onClick={() => setGLCodeModalOpen(true)}>
                                                        Add GL Code
                                                    </Button>
                                                </div>
                                                <div className='max-w-4xl'>
                                                    <div className="flex justify-between mb-6 w-[63%]">
                                                        <h2 className="text-2xl font-bold">GL Codes</h2>
                                                        <h2 className="text-2xl font-bold">Assign to</h2>
                                                    </div>
                                                    {glCodeData.map((item, index) => (
                                                        <GLCodeItem key={index} glCode={item.glCode} assignTo={item.assignTo} />
                                                    ))}
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                    {selectedGlCodesTab === 'History Log' && (
                                        <section className='w-full h-full p-4 md:p-6 lg:p-8 bg-white rounded-[10px]'>
                                            <HistoryLogTable expandedVendor={expandedVendor} toggleExpand={toggleExpand} setAddExpense={setAddExpense} setPayModal={setPayModal} />
                                        </section>
                                    )}
                                </div>
                            }
                            {selectedTab === 'Income Statement' && (
                                <FinancialDashboard />
                            )}
                            {selectedTab === 'Balance Sheet' && (
                                <FinancialDashboard selectedTab={selectedTab} />
                            )}
                            {selectedTab === 'Generate Report' && (
                                <div>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                className="pl-10 pr-4 py-2 rounded-md border border-[#D9D9D9] w-52 outline-0"
                                            />
                                        </div>

                                        <div className="relative bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52">
                                            <span className="text-gray-500 text-sm mr-1">Data Type : </span>
                                            <span className="font-medium">Table</span>
                                            <FaChevronDown className="ml-auto text-gray-500" />
                                        </div>

                                        <div className="relative bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52">
                                            <span className="text-gray-500 text-sm mr-1">Short by : </span>
                                            <span className="font-medium">Newest</span>
                                            <FaChevronDown className="ml-auto text-gray-500" />
                                        </div>

                                        <div className="relative bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52">
                                            <span className="text-gray-500 text-sm mr-1">Year : </span>
                                            <span className="font-medium">2024</span>
                                            <FaChevronDown className="ml-auto text-gray-500" />
                                        </div>

                                        <div className="relative bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52">
                                            <span className="text-gray-500 text-sm mr-1">Month : </span>
                                            <span className="font-medium">August</span>
                                            <FaChevronDown className="ml-auto text-gray-500" />
                                        </div>

                                        <div className="relative bg-white rounded-md border border-[#D9D9D9] flex items-center px-4 py-2 w-52">
                                            <span className="text-gray-500 text-sm mr-1">Category : </span>
                                            <span className="font-medium">Employees</span>
                                            <FaChevronDown className="ml-auto text-gray-500" />
                                        </div>
                                    </div>

                                    {/* Data Table */}
                                    <div className="bg-white rounded-lg shadow overflow-hidden">
                                        {/* Table Header */}
                                        <div className="grid grid-cols-8 bg-[#EEEEEE] text-gray-800 font-medium text-sm">
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Date</div>
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">GL Code</div>
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Working Days</div>
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Work Hours</div>
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Present Days</div>
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Absent Days</div>
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Leaves</div>
                                            <div className="py-4 px-6 text-[#141516] text-[14px] font-bold">Invoice Total</div>
                                        </div>

                                        {/* Table Body */}
                                        {generateReportEmployeesData.map((employee, index) => (
                                            <div key={index} className="grid grid-cols-8 border-t border-[#D9D9D9]">
                                                <div className="py-4 px-6 flex items-center">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                                        <img src={employee.image} alt={employee.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className='text-[#141516] text-[14px] font-semibold'>{employee.name}</span>
                                                </div>
                                                <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.glCode}</div>
                                                <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.workingDays}</div>
                                                <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.workHours}</div>
                                                <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.presentDays}</div>
                                                <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.absentDays}</div>
                                                <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.leaves}</div>
                                                <div className="py-4 px-6 text-[#141516] text-[14px] font-semibold">{employee.invoiceTotal}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selectedTab === 'Terminal' && (
                                <div className="w-full h-full p-4">
                                    <div className='flex justify-between w-[100%]'>
                                        <ButtonGroup className="border-2 w-[33%] h-[45px] border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='md'>
                                            {terminalTab.map(tab => (
                                                <Button
                                                    key={tab}
                                                    className={selectedTerminalTab === tab ? 'bg-[#C01824] w-full  hover:bg-[#C01824] text-white px-6 py-1 lg:text-[13px] capitalize font-bold' : 'bg-white hover:bg-white px-6 py-2 lg:text-[13px] w-full border-[#DDDDE1] capitalize font-bold'}
                                                    onClick={() => setSelectedTerminalTab(tab)}
                                                >
                                                    {tab}
                                                </Button>
                                            ))}
                                        </ButtonGroup>
                                        {selectedTerminalTab === 'Terminals Details' && (
                                            <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                                variant='filled' size='lg' onClick={() => setCreateInvoice(true)}>
                                                Add Terminal
                                            </Button>
                                        )}
                                    </div>
                                    {selectedTerminalTab === 'Terminals Details' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 mt-5">
                                                {/* Year Selector */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                                                    <div className="bg-[#C01824] text-white p-2 rounded mr-3">
                                                        <img src={busIcon} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Total # of Open Trips</div>
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-black">7852</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Month Selector */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                                                    <div className="bg-[#C01824] text-[#C01824] p-2 rounded mr-3">
                                                        <img src={moneyWallet} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500">Total $ of Open Trips</div>
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-black">$41,210</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Gross Income */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                                                    <div className="bg-[#C01824] text-green-600 p-2 rounded mr-3">
                                                        <img src={busIcon} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center">
                                                            <div className="text-xs text-gray-500">Total # of Completed
                                                                Trips(within current month)</div>
                                                        </div>
                                                        <div className="font-medium">5610</div>
                                                    </div>
                                                </div>

                                                {/* Net Income */}
                                                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                                                    <div className="bg-[#C01824] text-[#C01824] p-2 rounded mr-3">
                                                        <img src={moneyWallet} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center">
                                                            <div className="text-xs text-gray-500">Total $ of Completed
                                                                Trips(within current month)</div>
                                                        </div>
                                                        <div className="font-medium">$41,210</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full space-y-4">
                                                {[...Array(4)].map((_, index) => {
                                                    if (index === 0) {
                                                        return (
                                                            <div key={index} className="w-full bg-white border-b border-[#D9D9D9] shadow-sm">
                                                                <div className="flex items-center justify-between px-4 py-2">
                                                                    <div className="flex items-center space-x-3">
                                                                        <button className="text-black hover:text-gray-800">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                                            </svg>
                                                                        </button>
                                                                        <h2 className="font-medium text-black text-lg">Terminal {index + 1}</h2>

                                                                        <button className="text-black hover:text-gray-800">
                                                                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                          <path d="M3.78252 17.6688C3.51253 17.6688 3.28464 17.5774 3.09882 17.3945C2.91315 17.2114 2.82031 16.9869 2.82031 16.7209V14.5905C2.82031 14.3384 2.86853 14.0975 2.96496 13.8678C3.06125 13.6382 3.19878 13.4354 3.37754 13.2595L13.9759 2.83425C14.1519 2.67147 14.3471 2.54674 14.5617 2.46008C14.7762 2.37341 15.0012 2.33008 15.237 2.33008C15.4693 2.33008 15.6963 2.37341 15.9179 2.46008C16.1394 2.54674 16.3344 2.67675 16.503 2.85008L17.8835 4.21591C18.0595 4.37869 18.1888 4.57008 18.2714 4.79008C18.354 5.00994 18.3953 5.2307 18.3953 5.45237C18.3953 5.68459 18.354 5.90716 18.2714 6.12008C18.1888 6.33313 18.0595 6.52633 17.8835 6.69966L7.30629 17.1199C7.12767 17.296 6.92176 17.4315 6.68858 17.5263C6.45554 17.6213 6.21107 17.6688 5.95519 17.6688H3.78252ZM15.231 6.61404L16.4153 5.45237L15.226 4.2757L14.0366 5.44237L15.231 6.61404Z" fill="#1C1B1F"/>
                                                                          </svg>

                                                                        </button>
                                                                    </div>
                                                                    <div className="flex items-center space-x-4">
                                                                        {index > 0 && (
                                                                            <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                                                                variant='filled' size='lg'>
                                                                                Create Invoice
                                                                            </Button>
                                                                        )}
                                                                        {index === 0 && (
                                                                            <div className='flex items-center justify-center self-center'>
                                                                                <img src={avatar} className='mr-1' />
                                                                                <p className="font-medium text-[#565656] text-sm">Terminal Manager:</p>
                                                                                <p className="font-bold text-black text-md">David John</p>
                                                                            </div>
                                                                        )}
                                                                        {index === 0 && (
                                                                            <button
                                                                                onClick={() => setIsTerminal(index === isTerminal ? null : index)}
                                                                                className="text-gray-600 hover:text-gray-800"
                                                                            >
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className={`h-6 w-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                                </svg>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {isTerminal === index && (
                                                                    <div className="w-full">

                                                                        <div className="p-4 w-full">
                                                                            {/* Top Row Cards */}
                                                                            <div className="flex space-x-2 mb-2">
                                                                                {/* YTD Revenue Card */}
                                                                                <div className="w-[300px] px-2 mb-4">
                                                                                    <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                                                                        <div className="flex items-start">
                                                                                            <div className="bg-[#C01824] p-2 rounded text-white mr-3">
                                                                                                <img src={busIcon} />
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="text-xs text-gray-600">YTD Revenue</div>
                                                                                                <div className="font-medium">$ 240,000</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Total # of Open Trips Card */}
                                                                                <div className="w-[300px] px-2 mb-4">
                                                                                    <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                                                                        <div className="flex items-start">
                                                                                            <div className="bg-[#C01824] p-2 rounded text-white mr-3">
                                                                                                <img src={busIcon} />
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="text-xs text-gray-600">Total # of Open Trips</div>
                                                                                                <div className="font-medium">102</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Total # of Completed Trips Card */}
                                                                                <div className="w-[300px] px-2 mb-4">
                                                                                    <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                                                                        <div className="flex items-start">
                                                                                            <div className="bg-[#C01824] p-2 rounded text-white mr-3">
                                                                                                <img src={busIcon} />
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="text-xs text-gray-600">
                                                                                                    Total # of Completed Trips
                                                                                                    <div className="text-xs text-gray-500">(within current month)</div>
                                                                                                </div>
                                                                                                <div className="font-medium">524</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex flex-col w-[400px] gap-6 items-end justify-end">
                                                                                    <button className="bg-[#C01824] w-[50%] text-white  py-2 rounded mr-0 text-sm" onClick={() => setCreateInvoice(true)}>
                                                                                        Create Invoice
                                                                                    </button>
                                                                                    <button className="bg-[#C01824] w-[50%] text-white  py-2 rounded text-sm">
                                                                                        Terminal Invoice
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            {/* Bottom Row Cards */}
                                                                            <div className="flex flex-wrap mx-1">
                                                                                {/* YTD Trips Card */}
                                                                                <div className="w-[300px] px-2">
                                                                                    <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                                                                        <div className="flex items-start">
                                                                                            <div className="bg-[#C01824] p-2 rounded text-white mr-3">
                                                                                                <img src={busIcon} />
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="text-xs text-gray-600">YTD Trips</div>
                                                                                                <div className="font-medium">450</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Total $ of Open Trips Card */}
                                                                                <div className="w-[300px] px-2">
                                                                                    <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                                                                        <div className="flex items-start">
                                                                                            <div className="bg-[#C01824] p-2 rounded text-white mr-3">
                                                                                                <img src={busIcon} />
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="text-xs text-gray-600">Total $ of Open Trips</div>
                                                                                                <div className="font-medium">$ 5200</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Total $ of Completed Trips Card */}
                                                                                <div className="w-[300px] px-2">
                                                                                    <div className="border border-[#D9D9D9] rounded p-3 bg-white">
                                                                                        <div className="flex items-start">
                                                                                            <div className="bg-[#C01824] p-2 rounded text-white mr-3">
                                                                                                <img src={busIcon} />
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="text-xs text-gray-600">
                                                                                                    Total $ of Completed Trips
                                                                                                    <div className="text-xs text-gray-500">(within current month)</div>
                                                                                                </div>
                                                                                                <div className="font-medium">$ 5200</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

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
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                                {[...Array(3)].map((_, index) => (
                                                    <div className="w-full bg-white border-b border-[#D9D9D9] shadow-sm">
                                                        <div className="flex items-center justify-between px-4 py-2">
                                                            <div className="flex items-center space-x-3">
                                                                <button className="text-black hover:text-gray-800">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                                    </svg>
                                                                </button>
                                                                <h2 className="font-medium text-black text-lg">Terminal {index + 2}</h2>
                                                                <button className="text-black hover:text-gray-800">
                                                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M3.78252 17.6688C3.51253 17.6688 3.28464 17.5774 3.09882 17.3945C2.91315 17.2114 2.82031 16.9869 2.82031 16.7209V14.5905C2.82031 14.3384 2.86853 14.0975 2.96496 13.8678C3.06125 13.6382 3.19878 13.4354 3.37754 13.2595L13.9759 2.83425C14.1519 2.67147 14.3471 2.54674 14.5617 2.46008C14.7762 2.37341 15.0012 2.33008 15.237 2.33008C15.4693 2.33008 15.6963 2.37341 15.9179 2.46008C16.1394 2.54674 16.3344 2.67675 16.503 2.85008L17.8835 4.21591C18.0595 4.37869 18.1888 4.57008 18.2714 4.79008C18.354 5.00994 18.3953 5.2307 18.3953 5.45237C18.3953 5.68459 18.354 5.90716 18.2714 6.12008C18.1888 6.33313 18.0595 6.52633 17.8835 6.69966L7.30629 17.1199C7.12767 17.296 6.92176 17.4315 6.68858 17.5263C6.45554 17.6213 6.21107 17.6688 5.95519 17.6688H3.78252ZM15.231 6.61404L16.4153 5.45237L15.226 4.2757L14.0366 5.44237L15.231 6.61404Z" fill="#1C1B1F"/>
                                                                    </svg>

                                                                </button>

                                                            </div>
                                                            <div className="flex items-center space-x-4">
                                                                <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                                                    variant='filled' size='lg'>
                                                                    Create Invoice
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {selectedTerminalTab === 'Terminal Invoices' && (
                                        <div className="bg-white rounded-lg shadow-md p-4 mt-4 w-[100%] h-[60%]">
                                            <table className="w-[100%] border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="p-3 border-b border-[#D9D9D9]">
                                                            <input type="checkbox" className="w-4 h-4" />
                                                        </th>
                                                        <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Date</th>
                                                        <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">GL Code#</th>
                                                        <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Type</th>
                                                        <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Invoice Total</th>
                                                        <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Invoice</th>
                                                        <th className="p-3 text-left font-medium text-black border-b border-[#D9D9D9]">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {schoolInvoices.map((invoice, index) => (
                                                        <tr key={index} className="bg-whit">
                                                            <td className="p-5 border-b mb-[-1px] flex justify-center items-center border-[#D9D9D9]">
                                                                <input type="checkbox" className="w-4 h-4" />
                                                            </td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">{invoice.date}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">{invoice.glCode}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">{invoice.type}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">{invoice.invoiceTotal}</td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">
                                                                <a className="text-[#C01824] font-bold cursor-pointer" onClick={handleInvoiceList}>View</a>
                                                            </td>
                                                            <td className="p-3 border-b border-[#D9D9D9]">
                                                                <button className="text-red-500" aria-label="Delete">
                                                                    <FaRegTrashAlt className="w-5 h-5 text-[#C01824]" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {selectedTerminalTab === 'Track Terminal' && (
                                        <div className='flex items-center gap-5'>
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
                                                                <span className="font-medium text-[#141516] text-[24px]">Terminal 1</span>
                                                                <FaChevronDown className="ml-1 text-[#141516]" size={12} />
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
                                                                <span className="font-medium text-[#141516] text-[24px]">$41,210</span>
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
                                                                <span className="font-medium text-[#141516] text-[24px]">$41,210</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Savings Card */}
                                                    <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center gap-4">
                                                        <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                                                            <div className="bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                                                                <BiDollar size={18} color='#C01824' />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[#9E9E9E] font-normal">Savings</div>
                                                            <div className="flex items-center">
                                                                <span className="font-medium text-[#141516] text-[24px]">$41,210</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Sales Section */}
                                                <div className="mb-6 border border-gray-100 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h2 className="text-[26px] font-bold text-[#475569]">Sales</h2>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            Current month
                                                            <FaChevronDown className="ml-1" size={10} />
                                                        </div>
                                                    </div>
                                                    <div className="text-[26px] font-bold mb-4 text-[#475569]">$15,940.65</div>

                                                    {/* Sales Chart */}
                                                    <div className="relative h-32">
                                                        {/* Y-axis labels */}
                                                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#475569]">
                                                            <div>$15k</div>
                                                            <div>$10k</div>
                                                            <div>$5k</div>
                                                            <div>$0k</div>
                                                        </div>

                                                        {/* Chart lines */}
                                                        <div className="ml-8 h-full flex flex-col justify-between">
                                                            <div className="border-t border-gray-300"></div>
                                                            <div className="border-t border-gray-300"></div>
                                                            <div className="border-t border-gray-300"></div>
                                                            <div className="border-t border-gray-300"></div>
                                                        </div>

                                                        {/* Chart line */}
                                                        <svg className="absolute top-0 left-10 w-5/6 h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                                            <polyline
                                                                points="0,40 100,60 200,80 300,20"
                                                                fill="none"
                                                                stroke="#C01824"
                                                                strokeWidth="2"
                                                            />
                                                            <circle cx="0" cy="40" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                                                            <circle cx="100" cy="60" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                                                            <circle cx="200" cy="80" r="5" fill="#C01824" />
                                                            <circle cx="300" cy="20" r="5" fill="#C01824" />
                                                        </svg>

                                                        {/* X-axis labels */}
                                                        <div className="absolute bottom-0 left-10 w-5/6 flex justify-between text-xs text-gray-500">
                                                            <div>Q1</div>
                                                            <div>Q2</div>
                                                            <div>Q3</div>
                                                            <div>Q4</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Profit & Loss Section */}
                                                <div className='border border-gray-100 rounded-lg p-4'>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h2 className="text-lg font-semibold text-gray-700 text-[#475569]">Profit & Loss</h2>
                                                        <div className="text-sm text-gray-500 flex items-center text-[#475569]">
                                                            Current month
                                                            <FaChevronDown className="ml-1" size={10} />
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <div className="text-2xl font-bold text-[#475569]">$20,000</div>
                                                        <div className="text-sm text-[#475569]">Net income for March</div>
                                                    </div>

                                                    {/* Income Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="font-semibold text-[#475569]">$100,000</span>
                                                            <span className="text-[#475569]">Income</span>
                                                        </div>
                                                        <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                                                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: '60%' }}></div>
                                                        </div>
                                                    </div>

                                                    {/* Expenses Bar */}
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="font-semibold text-[#475569">$80,000</span>
                                                            <span className="text-[#475569]">Expenses</span>
                                                        </div>
                                                        <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                                                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: '80%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg shadow-md p-6 w-[45%] mt-4">
                                                {/* Top Cards */}
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    {/* Terminal Selection Card */}
                                                    <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center ">
                                                        <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                                                            <img src={busIcon} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[#9E9E9E] font-normal">Select Terminal</div>
                                                            <div className="flex items-center">
                                                                <span className="font-bold text-[#141516] text-[24px]">Terminal 1</span>
                                                                <FaChevronDown className="ml-1 text-[#141516]" size={12} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Income Card */}
                                                    <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center">
                                                        <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                                                            <img src={moneyWallet} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[#9E9E9E] font-normal">Income</div>
                                                            <div className="flex items-center">
                                                                <span className="font-bold text-[#141516] text-[24px]">$41,210</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Expenses Card */}
                                                    <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center">
                                                        <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                                                            <img src={marketIcon} />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[#9E9E9E] font-normal">Expenses</div>
                                                            <div className="flex items-center">
                                                                <span className="font-bold text-[#141516] text-[24px]">$41,210</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Savings Card */}
                                                    <div className="bg-white rounded-lg border border-gray-100 p-3 flex items-center">
                                                        <div className="bg-[#C01824] text-white p-2 rounded mr-3 flex items-center justify-center">
                                                            <div className="bg-white rounded-full p-1 shadow-md flex items-center justify-center">
                                                                <BiDollar size={18} color='#C01824' />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-[#9E9E9E] font-normal">Savings</div>
                                                            <div className="flex items-center">
                                                                <span className="font-bold text-[#141516] text-[24px]">$41,210</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Sales Section */}
                                                <div className="mb-6 border border-gray-100 rounded-lg p-4">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h2 className="text-lg font-semibold text-[#475569]">Sales</h2>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            Current month
                                                            <FaChevronDown className="ml-1" size={10} />
                                                        </div>
                                                    </div>
                                                    <div className="text-2xl font-bold mb-4 text-[#475569]">$15,940.65</div>

                                                    {/* Sales Chart */}
                                                    <div className="relative h-32">
                                                        {/* Y-axis labels */}
                                                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                                                            <div>$15k</div>
                                                            <div>$10k</div>
                                                            <div>$5k</div>
                                                            <div>$0k</div>
                                                        </div>

                                                        {/* Chart lines */}
                                                        <div className="ml-8 h-full flex flex-col justify-between">
                                                            <div className="border-t border-gray-300"></div>
                                                            <div className="border-t border-gray-300"></div>
                                                            <div className="border-t border-gray-300"></div>
                                                            <div className="border-t border-gray-300"></div>
                                                        </div>

                                                        {/* Chart line */}
                                                        <svg className="absolute top-0 left-10 w-5/6 h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                                                            <polyline
                                                                points="0,40 100,60 200,80 300,20"
                                                                fill="none"
                                                                stroke="#C01824"
                                                                strokeWidth="2"
                                                            />
                                                            <circle cx="0" cy="40" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                                                            <circle cx="100" cy="60" r="5" fill="white" stroke="#C01824" strokeWidth="2" />
                                                            <circle cx="200" cy="80" r="5" fill="#C01824" />
                                                            <circle cx="300" cy="20" r="5" fill="#C01824" />
                                                        </svg>

                                                        {/* X-axis labels */}
                                                        <div className="absolute bottom-0 left-10 w-5/6 flex justify-between text-xs text-gray-500">
                                                            <div>Q1</div>
                                                            <div>Q2</div>
                                                            <div>Q3</div>
                                                            <div>Q4</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Profit & Loss Section */}
                                                <div className='border border-gray-100 rounded-lg p-4'>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h2 className="text-lg font-semibold text-gray-700 text-[#475569]">Profit & Loss</h2>
                                                        <div className="text-sm text-gray-500 flex items-center text-[#475569]">
                                                            Current month
                                                            <FaChevronDown className="ml-1" size={10} />
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <div className="text-2xl font-bold text-[#475569]">$20,000</div>
                                                        <div className="text-sm text-[#475569]">Net income for March</div>
                                                    </div>

                                                    {/* Income Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="font-semibold text-[#475569]">$100,000</span>
                                                            <span className="text-[#475569]">Income</span>
                                                        </div>
                                                        <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                                                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: '60%' }}></div>
                                                        </div>
                                                    </div>

                                                    {/* Expenses Bar */}
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span className="font-semibold text-[#475569">$80,000</span>
                                                            <span className="text-[#475569]">Expenses</span>
                                                        </div>
                                                        <div className="h-6 w-full bg-[#F9E8E9] rounded-sm">
                                                            <div className="h-full bg-[#C01824] rounded-sm" style={{ width: '80%' }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            )}
                            {selectedTab === 'KPI' && (
                                <KPIScreen />
                            )}
                        </>

                }
                <GLCodesModal isOpen={gLCodeModalOpen} onClose={() => setGLCodeModalOpen(false)} />

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
                                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#C01824" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 2V8H20" stroke="#C01824" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="text-[#C01824] font-medium mb-1">Drag and Drop Files</div>
                            <div className="text-gray-600 text-sm">CSV, XSL, PDF or DOC</div>
                        </div>
                    </div>
                </VendorGlobalModal>
            </section>
        </MainLayout>
    )
}

export default Accounting