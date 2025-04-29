import React, { useEffect, useRef, useState } from 'react'
import MainLayout from '@/layouts/SchoolLayout'
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { employees } from '@/data/dummyData';
import { ActiveTick, licencesPic, unactiveCross } from '@/assets';
import { FaEllipsisVertical } from "react-icons/fa6";
import { Button, ButtonGroup, } from '@material-tailwind/react'
import AddDriver from './AddDriver';
import EditDriver from './EditDriver';
import ToggleBar from './ToggleBar';
import SearchInput from '@/components/SearchInput';


const EmployeeManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState('Employee Management');
    const [status, setStatus] = useState(
        employees.map((employee) => employee.appStatus === "Active")
    );
    const [showImage, setShowImage] = useState(false);
    const [showInfraction, setShowInfraction] = useState(false);
    const [showPayroll, setShowPayroll] = useState(false);
    const [addEmployee, setAddEmployee] = useState(false);
    const [editEmployee, setEditEmployee] = useState(false);
    const [modalPosition, setModalPosition] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    const itemsPerPage = 9;
    const totalPages = Math.ceil(itemsPerPage);

    const handleClickLicenses = () => {
        setShowImage(true);
    };

    const handleClickInfraction = () => {
        setShowInfraction(true);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const totalVisiblePages = 5; // Number of page buttons to display

        // Calculate start and end page numbers to display
        let startPage = Math.max(1, currentPage - Math.floor(totalVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + totalVisiblePages - 1);

        // Adjust the start page if there are not enough pages at the end
        if (endPage - startPage + 1 < totalVisiblePages) {
            startPage = Math.max(1, endPage - totalVisiblePages + 1);
        }

        // Always show the first page
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === 1
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black'
                        }`}
                >
                    1
                </button>
            );

            // Add '...' after the first page if necessary
            if (startPage > 2) {
                pages.push(<span key="start-ellipsis" className="px-1">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    // onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === i
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Always show the last page
        if (endPage < totalPages) {
            // Add '...' before the last page if necessary
            if (endPage < totalPages - 1) {
                pages.push(<span key="end-ellipsis" className="px-1">...</span>);
            }
            pages.push(
                <button
                    key={totalPages}
                    // onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === totalPages
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-black'
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };
    const handleEllipsisClick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ top: rect.top + window.scrollY + 30, left: rect.left + window.scrollX - 140 });
        setIsModalOpen(true);
    };
    const handleClose = () => {
        setShowInfraction(false);
    };
    const handletabClick = (tab) => {
        setSelectedTab(tab);
        if (tab === 'Payroll') {
            setShowPayroll(true);
        } else {
            setShowPayroll(false);
        }
    }
    const handleCancel = () => {
        setAddEmployee(false);
    }
    const handleEditCancel = () => {
        setEditEmployee(false);
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isModalOpen && !document.getElementById("custom-modal")?.contains(event.target)) {
                setIsModalOpen(false);
                setShowImage(false);
                setShowInfraction(false);
                setModalPosition(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);


    return (
        <MainLayout>
            <div className="flex flex-row items-center justify-between w-[100%] mt-3 mb-4">
                {!addEmployee && !editEmployee ? (
                    showPayroll ? (
                        <>
                            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='lg'>
                                {['Employee Management', 'Payroll'].map(tab => (
                                    <Button
                                        key={tab}
                                        className={selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                                        onClick={() => handletabClick(tab)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </ButtonGroup>
                            <SearchInput />
                        </>

                    ) : (
                        <>
                            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='lg'>
                                {['Employee Management', 'Payroll'].map(tab => (
                                    <Button
                                        key={tab}
                                        className={selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                                        onClick={() => handletabClick(tab)}
                                    >
                                        {tab}
                                    </Button>
                                ))}
                            </ButtonGroup>
                            <Button onClick={() => setAddEmployee(true)} className="px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]" variant='filled' size='lg' >
                                Add Employee
                            </Button>
                        </>
                    )
                ) :
                    <h3 className="text-[24px] font-bold text-[#2C2F32]">{addEmployee ? 'Add Driver' : 'Edit Driver'}</h3>
                }
            </div>
            {
                showPayroll ?
                    <ToggleBar />
                    :
                    addEmployee ? (
                        <AddDriver handleCancel={handleCancel} />

                    ) : editEmployee ? (
                        <EditDriver handleCancel={handleEditCancel} />
                    ) : (
                        <div className="bg-white w-full rounded-[4px] border shadow-sm p-4 flex flex-wrap justify-center gap-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse border">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 border">Title</th>
                                            <th className="p-3 border">Name</th>
                                            <th className="p-3 border">Address</th>
                                            <th className="p-3 border">City</th>
                                            <th className="p-3 border">Date of Birth</th>
                                            <th className="p-3 border">State</th>
                                            <th className="p-3 border">Zip</th>
                                            <th className="p-3 border">Terminal</th>
                                            <th className="p-3 border">Email</th>
                                            <th className="p-3 border">Emergency Contact Name </th>
                                            <th className="p-3 border">Emergency Contact </th>
                                            <th className="p-3 border">Pay Grade</th>
                                            <th className="p-3 border">Trip Rate</th>
                                            <th className="p-3 border">Route Rate</th>
                                            <th className="p-3 border">Pay Cycle</th>
                                            <th className="p-3 border">Pay Type</th>
                                            <th className="p-3 border">W2</th>
                                            <th className="p-3 border">1099</th>
                                            <th className="p-3 border">YTD</th>
                                            <th className="p-3 border">Pay Stub</th>
                                            <th className="p-3 border">Terminal Assigned To</th>
                                            <th className="p-3 border">Fuel Card Code</th>
                                            <th className="p-3 border">App User Name</th>
                                            <th className="p-3 border">Direct Deposit</th>
                                            <th className="p-3 border">App Password Reset</th>
                                            <th className="p-3 border">App Status</th>
                                            <th className="p-3 border">Availability</th>
                                            <th className="p-3 border">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees?.map((employee, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="p-3 border">
                                                    <div className='w-[140px]'>
                                                        {employee?.title}
                                                    </div>
                                                </td>
                                                <td className="p-3 border">
                                                    <div className="flex flex-row justify-center items-center w-[200px] gap-2">
                                                        <img
                                                            src={employee.avatar}
                                                            alt="avatar"
                                                            className="rounded-full w-10 h-10 object-cover border"
                                                        />{employee.name}
                                                    </div>
                                                </td>
                                                <td className="p-3 border"><div className='w-[140px]'>{employee.address}</div></td>
                                                <td className="p-3 border"><div className='w-[140px]'>{employee.city}</div></td>
                                                <td className="p-3 border"><div className='w-[120px]'>{employee.dob}</div></td>
                                                <td className="p-3 border">{employee.state}</td>
                                                <td className="p-3 border">{employee.zip}</td>
                                                <td className="p-3 border">{employee.terminal}</td>
                                                <td className="p-3 border">{employee.email}</td>
                                                <td className="p-3 border"><div className='w-[200px] text-center'>{employee.emergencyContactName}</div></td>
                                                <td className="p-3 border"><div className='w-[200px] text-center'>{employee.emergencyContact}</div></td>
                                                <td className="p-3 border">{employee.payGrade}</td>
                                                <td className="p-3 border">{employee.tripRate}</td>
                                                <td className="p-3 border">{employee.routeRate}</td>
                                                <td className="p-3 border"><div className='w-[100px] text-center'>{employee.payCycle}</div></td>
                                                <td className="p-3 border">{employee.payType}</td>
                                                <td className="p-3 border">{employee.w2}</td>
                                                <td className="p-3 border">{employee._1099}</td>
                                                <td className="p-3 border">{employee.ytd}</td>
                                                <td className="p-3 border text-[#C01824] font-bold cursor-pointer">View</td>
                                                <td className="p-3 border"><div className='w-[200px] text-center'>{employee.terminalAssigned}</div></td>
                                                <td className="p-3 border"><div className='w-[120px] text-center'>{employee.fuelCardCode}</div></td>
                                                <td className="p-3 border"><div className='w-[120px] text-center'>{employee.appUserName}</div></td>
                                                <td className="p-3 border text-[#C01824] font-bold">{employee.directDeposit}</td>
                                                <td className="p-3 border text-[#C01824] font-bold">{employee.appPasswordReset}</td>
                                                <td className="p-3 border">
                                                    <label className="inline-flex items-center cursor-pointer">
                                                        <div
                                                            className={`flex flex-row w-[98px] h-8 items-center gap-1 transition-all duration-300 ease-in-out ${status[index] ? "bg-green-500" : "bg-[#C01824]"}
                                            } rounded-full`}
                                                        >
                                                            {status[index] ? (
                                                                <img src={ActiveTick} className='ms-2' />
                                                            ) : (
                                                                null
                                                            )
                                                            }
                                                            <span className={`mr-2 ${!status[index] ? 'ms-2' : null}`} style={{ color: 'white' }}>{status[index] ? "Active" : "Inactive"}</span>
                                                            {!status[index] ? (
                                                                <img src={unactiveCross} />
                                                            ) : (
                                                                null
                                                            )
                                                            }
                                                        </div>
                                                    </label>
                                                </td>
                                                <td className={`p-3 border`}>
                                                    <div className={`w-[100px] text-center justify-center items-center flex h-[35px] rounded  ${employee.availability === "Present" ? "bg-[#CCFAEB] text-[#0BA071]" : "bg-[#F6DCDE] text-[#C01824]"}`}>
                                                        {employee.availability}
                                                    </div>
                                                </td>
                                                <td className="relative p-3 border text-center items-center cursor-pointer" onClick={handleEllipsisClick}>
                                                    <FaEllipsisVertical />
                                                </td>
                                            </tr>
                                        ))}
                                        {isModalOpen && (
                                            <div id="custom-modal" className="fixed w-40 bg-white border rounded shadow-lg z-50 text-left" style={{ top: modalPosition.top, left: modalPosition.left }}>
                                                <ul className="py-2">
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleClickLicenses}>Licenses copy</li>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleClickInfraction}>Infraction</li>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setEditEmployee(true)}>Edit</li>
                                                </ul>
                                            </div>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {showImage && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" ref={modalRef}>
                                    <div className="image-container relative">
                                        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                                        <img src={licencesPic} className="relative z-20" />
                                    </div>
                                </div>
                            )}
                            {showInfraction && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-56">
                                        <div className='flex justify-between items-center self-center mb-4'>
                                            <h3 className="text-lg font-semibold mb-2">Infraction</h3>
                                            <button
                                                className="top-2 left-2 text-black-600 hover:text-gray-800"
                                                onClick={handleClose}
                                            >
                                                ×
                                            </button>

                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex">
                                                <span className="w-20 font-medium">Date:</span>
                                                <span className="text-[#67696A]">02-12-2023</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-20 font-medium">Status:</span>
                                                <span className="text-[#67696A]">Pending</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-20 font-medium">Type:</span>
                                                <span className="text-[#67696A]">Signal Break</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* <div className="w-40 bg-white border rounded shadow-lg z-50 text-left">
            <span className="mr-2 text-black-700">Page</span>
            {renderPageNumbers()}
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </div> */}
                        </div>
                    )
            }

        </MainLayout>
    )
}

export default EmployeeManagement