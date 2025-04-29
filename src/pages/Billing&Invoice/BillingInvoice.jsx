import React, { useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { Button, ButtonGroup, Card, CardBody, Typography } from '@material-tailwind/react'
import { useLocation, useNavigate } from 'react-router-dom';
import { schoolData } from '@/data/school-data';
import SchoolInvoiceTable from './SchoolInvoiceTable';
import InvoiceTransport from './InvoiceTranportPage';
import { DriverInvoice } from '@/components/DriversInvoice';
import { Driver1, Driver2, Driver3, Driver4, Driver5, Driver6, Driver6SizeBg, nexticon, previcon } from '@/assets';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CiSearch } from 'react-icons/ci';
import GenerateInvoice from './GenerateInvoice';
import TripInvoiceTable from './TripInvoiceTable';
import CreateInvoiceModal from '@/components/CreateInvoiceModal';

const BillingInvoice = () => {
    const [selectedTab, setSelectedTab] = useState('Subscription');
    const [invoiceNavigate, setInvoiceNavigate] = useState(false);
    const [createTripModal, setCreateTripModal] = useState(false);
    const [invoiceTripNavigate, setInvoiceTripNavigate] = useState(false);
    const [generateInoviceNavigate, setGenerateInoviceNavigate] = useState(false);
    const [schoolNameState, setSchoolNameState] = useState('')
    const [active, setActive] = useState(1);
    const [schoolInvoiceTransportPge, setSchoolInvoiceTransportPge] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname;
    const Invoices = [
        { date: 'May 28, 2024', desc: 'Business Subscription', invoiceTotal: '$30.00', status: 'Paid' },
        { date: 'Apr 28, 2024', desc: 'Business Subscription', invoiceTotal: '$30.00', status: 'Paid' },
        { date: 'Mar 28, 2024', desc: 'Business Subscription', invoiceTotal: '$30.00', status: 'Paid' },
    ];
    const drivers = [
        { name: "Arlene McCoy", id: "GL# 202-05", hours: 222, payroll: "1,546.12", date: "1 Jun 2022", avatarSrc: Driver1 },
        { name: "Savannah Nguyen", id: "GL# 202-05", hours: 256, payroll: "1,546.12", date: "1 May 2022", avatarSrc: Driver2 },
        { name: "Kristin Watson", id: "GL# 202-05", hours: 308, payroll: "1,546.12", date: "1 Apr 2022", avatarSrc: Driver3 },
        { name: "Cameron Williamson", id: "GL# 202-05", hours: 209, payroll: "1,546.12", date: "1 Mar 2022", avatarSrc: Driver4 },
        { name: "Jane Cooper", id: "GL# 202-05", hours: 308, payroll: "1,546.12", date: "1 Jan 2022", avatarSrc: Driver5 },
        { name: "Arlene McCoy", id: "GL# 202-05", hours: 222, payroll: "1,546.12", date: "1 Jn 2022", avatarSrc: Driver6 },
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const redDays = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 23, 24];
    const grayDays = [1, 21, 22];
    const handleSchoolInvoice = () => {
        setInvoiceNavigate(true)
    }
    const handleInvoiceTransport = () => {
        setSchoolInvoiceTransportPge(true)
    }
    const next = () => {
        if (active === 10) return;
        setActive(active + 1);
    };

    const prev = () => {
        if (active === 1) return;
        setActive(active - 1);
    };
    const handleGenerateInvoice = () => {
        setGenerateInoviceNavigate(true)
    }
    const handleTrip = ({ schoolName }) => {
        setInvoiceTripNavigate(true)
        setSchoolNameState(schoolName)
    }
    const handleTabClose = (tab) => {
        setSelectedTab(tab)
        setGenerateInoviceNavigate(false)
        setInvoiceTripNavigate(false)
        setInvoiceNavigate(false)
    }
    const handleOpenTripModal = () => setCreateTripModal(!createTripModal);

    return (
        <MainLayout>
            {schoolInvoiceTransportPge ?
                <InvoiceTransport />
                : generateInoviceNavigate ?
                    <GenerateInvoice />
                    :
                    <section className='w-full h-full'>
                        {selectedTab === "Driver invoices" ?
                            <div className='flex flex-row justify-between w-[100%]'>
                                <ButtonGroup className="rounded-[10px] outline-none p-0 h-[5vh]" variant="text" size='lg'>
                                    {['Subscription', 'School Invoices', 'Driver invoices', 'Trip invoices'].map(tab => (
                                        <Button
                                            key={tab}
                                            className={selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                                            onClick={() => handleTabClose(tab)}
                                        >
                                            {tab}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                                <div className='w-[33%] justify-end content-end items-end'>
                                    <div className="mr-auto w-72 flex flex-row md:max-w-screen-3xl md:w-[75%] bg-white border ps-4 border-[#DCDCDC] rounded-[6px] items-center">
                                        <CiSearch size={25} color='#787878' />
                                        <input
                                            type='search'
                                            placeholder="Search"
                                            className='p-3 w-[98%] text-[#090909] font-light outline-none rounded-[6px]'
                                        />
                                    </div>
                                </div>
                            </div>
                            :
                            <ButtonGroup className="rounded-[10px] outline-none w-[600px] p-0 h-[5vh]" variant="text" size='lg'>
                                {['Subscription', 'School Invoices', 'Driver invoices', 'Trip invoices'].map(tab => (
                                    <Button
                                        key={tab}
                                        className={selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                                        onClick={() => handleTabClose(tab)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </ButtonGroup>

                        }
                        {(selectedTab === "Subscription" || selectedTab === "School Invoices" || selectedTab === "Trip invoices") &&
                            <div className='md:my-7 mt-4 flex justify-between flex-row items-start md:space-y-0 space-y-4'>
                                {
                                    invoiceTripNavigate ? null :
                                        <h1 className='font-bold text-[24px] md:text-[32px] text-[#202224]'>Invoices</h1>
                                }
                                {selectedTab === "Trip invoices" ? (
                                    null
                                ) : selectedTab === "School Invoices" ? (
                                    <Button
                                        className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                        variant='filled'
                                        size='lg'
                                        onClick={handleOpenTripModal}
                                    >
                                        Create Invoice
                                    </Button>
                                ) : (
                                    <Button
                                        className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                        variant='filled'
                                        size='lg'
                                        onClick={() => navigate(`/dashboard_subscription?from=${encodeURIComponent(currentPath)}`)}
                                    >
                                        Renew Subscription
                                    </Button>
                                )}

                            </div>
                        }
                        {invoiceTripNavigate === true &&
                            <div className='md:my-7 mt-4 flex justify-between flex-row items-start md:space-y-0 space-y-4'>
                                <h1 className='font-bold text-[24px] md:text-[32px] text-[#202224]'>{schoolNameState}</h1>
                                <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                    variant='filled' size='lg' onClick={handleOpenTripModal}>
                                    Create Invoice
                                </Button>
                            </div>
                        }
                        {/* ------------ Table-Content -------------------- */}
                        {selectedTab === "Subscription" &&
                            <div className='bg-white rounded-lg shadow-md p-4 w-[99%] h-[40vh]'>
                                <div className="overflow-x-auto mt-4 border border-gray-200 rounded">
                                    <table className="min-w-full">
                                        <thead className="bg-[#EEEEEE]">
                                            <tr>
                                                <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                                    Decription
                                                </th>
                                                <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                                    Invoice Total
                                                </th>
                                                <th className="px-6 py-3 border-b text-left text-sm font-bold text-black">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Invoices.map((Invoices, index) => (
                                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                                        {Invoices.date}
                                                    </td>
                                                    <td className="px-6 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                                        {Invoices.desc}
                                                    </td>
                                                    <td className="px-12 py-4 border-b text-[14px] font-[600] text-[#141516]">
                                                        {Invoices.invoiceTotal}
                                                    </td>
                                                    <td className="px-6 py-4 border-b text-[14px] font-[600]">
                                                        <div className="flex flex-col items-center self-center w-[35]">
                                                            <span className="text-black font-bold self-start">Paid</span>
                                                            <button className="text-[#C01824] text-sm mt-1 hover:text-red-800 focus:outline-none self-start">
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
                        {selectedTab === "School Invoices" &&
                            <>
                                {invoiceNavigate ?
                                    <SchoolInvoiceTable handleInvoiceTransport={handleInvoiceTransport} /> :
                                    <div className='w-full shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
                                        {schoolData?.map((item) => {
                                            return (
                                                <Card className="w-full h-[210px] max-w-[380px] shadow-2xl rounded-[16px] overflow-hidden p-3 md:p-3 bg-[#F9E8E9]" onClick={handleSchoolInvoice}>
                                                    <img
                                                        src={item?.imgSrc}
                                                        alt="card-image"
                                                        className="rounded-[8px] w-fit bg-cover h-[120px] mx-auto"
                                                    />
                                                    <CardBody className='md:py-6 md:px-6 p-2.5'>
                                                        <Typography className="mb-2 text-center font-extrabold text-[24px] text-black">
                                                            {item?.schoolName}
                                                        </Typography>
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                }

                            </>
                        }
                        {selectedTab === "Driver invoices" &&
                            <div className='flex flex-row justify-between w-[100%] mt-5 '>
                                <Card className="w-full max-w-4xl border border-gray-200">
                                    <CardBody>
                                        <div className="flex font-bold mb-4">
                                            <div className="w-1/3">Drivers</div>
                                            <div className="w-1/3 text-center">Work Hours</div>
                                            <div className="w-1/3 text-right">Payroll</div>
                                        </div>
                                        {drivers.map((driver, index) => (
                                            <DriverInvoice key={index} {...driver} />
                                        ))}
                                    </CardBody>
                                    <div className='flex justify-between items-center mt-6 mb-4 px-7 py-3'>
                                        <Typography color="gray" className='text-[#202224]/60 font-semibold text-[14px]'>
                                            Page {active} - 06 of 20
                                        </Typography>
                                        <div className='!p-0 bg-[#FAFBFD] flex justify-around items-center w-[86px] h-[33px] border border-[#D5D5D5] rounded-[12px] space-x-3'>
                                            <img onClick={prev}
                                                disabled={active === 1} src={previcon} strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                                            <img onClick={next}
                                                disabled={active === 10} src={nexticon} strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                                        </div>
                                    </div>
                                </Card>
                                <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                                    <div className="text-center py-4">
                                        <img src={Driver6SizeBg} className="w-24 h-24 rounded-full mx-auto" />
                                        <h2 className="mt-2 text-xl font-semibold">Arlene McCoy</h2>
                                        <p className="text-gray-600">Driver</p>
                                    </div>

                                    <div className="px-4 py-2 bg-gray-100">
                                        <div className="flex justify-center items-center mb-2 gap-4">
                                            <FaChevronLeft size={18} color='text-gray-600' style={{ cursor: 'pointer' }} />
                                            <span className="font-medium">August</span>
                                            <FaChevronRight size={18} color='text-gray-600' style={{ cursor: 'pointer' }} />

                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                                                <div key={day} className="text-xs font-medium">{day}</div>
                                            ))}
                                            {days.map(day => (
                                                <div
                                                    key={day}
                                                    className={`text-xs p-1 ${redDays.includes(day) ? 'bg-[#C01824] text-white' :
                                                        grayDays.includes(day) ? 'bg-gray-300' : ''
                                                        }`}
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 p-4">
                                        {[
                                            { label: 'Present', value: '15 Days' },
                                            { label: 'Absent', value: '01 Days' },
                                            { label: 'Holiday', value: '03 Days' },
                                            { label: 'Total Hours', value: '209' },
                                            { label: 'Leaves', value: '03 Days' },
                                            { label: 'Working Days', value: '22 Days' },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="bg-[#FDE6E6] rounded-lg overflow-hidden flex">
                                                <div className="w-2 bg-[#C01824]"></div>
                                                <div className="flex-1 p-2 text-left">
                                                    <div className="text-lg font-bold text-gray-800">{value}</div>
                                                    <div className="text-xs text-gray-600">{label}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="px-4 pb-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gray-600">Net Salary</span>
                                            <span className="font-semibold">$1546</span>
                                        </div>
                                        <Button
                                            className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center w-full justify-center'
                                            variant='filled'
                                            size='lg'
                                            onClick={handleGenerateInvoice}
                                        >
                                            Generate Invoice
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        }
                        {selectedTab === "Trip invoices" &&
                            <>
                                {invoiceTripNavigate ?
                                    <TripInvoiceTable handleInvoiceTransport={handleInvoiceTransport} /> :
                                    <div className='w-full shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
                                        {schoolData?.map((item) => {
                                            return (
                                                <Card className="w-full h-[210px] max-w-[380px] shadow-2xl rounded-[16px] overflow-hidden p-3 md:p-3 bg-[#F9E8E9]" onClick={() => handleTrip(item)}>
                                                    <img
                                                        src={item?.imgSrc}
                                                        alt="card-image"
                                                        className="rounded-[8px] w-fit bg-cover h-[120px] mx-auto"
                                                    />
                                                    <CardBody className='md:py-6 md:px-6 p-2.5'>
                                                        <Typography className="mb-2 text-center font-extrabold text-[24px] text-black">
                                                            {item?.schoolName}
                                                        </Typography>
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                }

                            </>
                        }
                    </section>
            }
            <CreateInvoiceModal open={createTripModal} handleOpen={handleOpenTripModal} />
        </MainLayout >
    )
}

export default BillingInvoice
