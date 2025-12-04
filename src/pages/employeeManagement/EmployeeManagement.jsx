import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '@/layouts/SchoolLayout';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { employees } from '@/data/dummyData';
import { ActiveTick, licencesPic, unactiveCross } from '@/assets';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { Button, ButtonGroup, Spinner } from '@material-tailwind/react';
import { Toaster } from 'react-hot-toast';
import AddDriver from './AddDriver';
import EditDriver from './EditDriver';
import ToggleBar from './ToggleBar';
import SearchInput from '@/components/SearchInput';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import axios from 'axios';



const EmployeeManagement = () => {

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");

  // Helper function to get image URL
  const getImageUrl = (filePath) => {
    if (!filePath) return null;
    // If it's already a full URL, return as is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }
    // If it starts with /, it's a relative path from root
    if (filePath.startsWith('/')) {
      return `${BASE_URL}${filePath}`;
    }
    // Otherwise, assume it's a relative path and prepend BASE_URL
    return `${BASE_URL}/${filePath}`;
  };

  // Default placeholder avatar (data URI or use a default image)
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Cpath d='M20 10c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 16c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z' fill='%239CA3AF'/%3E%3C/svg%3E";

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState('Employee Management');
  const [status, setStatus] = useState(
    employees.map((employee) => employee.appStatus === 'Active')
  );
  const [showImage, setShowImage] = useState(false);
  const [showInfraction, setShowInfraction] = useState(false);
  const [showPayroll, setShowPayroll] = useState(false);
  const [addEmployee, setAddEmployee] = useState(false);
  const [editEmployee, setEditEmployee] = useState(false);
  const [modalPosition, setModalPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAvatarImage, setSelectedAvatarImage] = useState(null);
  const modalRef = useRef(null);

  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleClickLicenses = () => setShowImage(true);
  const handleClickInfraction = () => setShowInfraction(true);
  const handleClose = () => setShowInfraction(false);
  const handletabClick = (tab) => {
    setSelectedTab(tab);
    setShowPayroll(tab === 'Payroll');
  };
  const handleCancel = () => {
    setAddEmployee(false);
    getEmployee(); // Refresh employee list when canceling
  };
  const handleEditCancel = () => setEditEmployee(false);

  const handleEllipsisClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.top + window.scrollY + 30, left: rect.left + window.scrollX - 140 });
    setIsModalOpen(true);
  };

  const getEmployee = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/institute/GetEmployeeInfo`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Employees fetched:", res.data);

      const employeesArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
          ? res.data.data
          : [];

      setEmployee(employeesArray);
      // Update total pages based on fetched employees
      setTotalPages(Math.ceil(employeesArray.length / itemsPerPage));
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      setEmployee([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && !document.getElementById("custom-modal")?.contains(event.target)) {
        setIsModalOpen(false);
        setShowImage(false);
        setShowInfraction(false);
        setModalPosition(null);
      }
    };
    if (token)
      getEmployee()
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, token]);

  const renderPageNumbers = () => {
    const pages = [];
    pages.push(
      <button
        key="prev"
        className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <FaAngleLeft />
      </button>
    );

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`flex items-center justify-center bg-white h-8 w-8 rounded mx-1 ${currentPage === i
            ? 'text-[#C01824] border border-[#C01824]'
            : 'border border-[#C4C6C9] text-black'
            }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <FaAngleRight />
      </button>
    );

    return pages;
  };


  return (
    <MainLayout>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{
        style: {
          fontSize: "18px",
          padding: "16px 22px",
          minHeight: "60px",
          borderRadius: "40px",
        },
      }} />
      <div className="flex flex-row items-center justify-between w-full mt-3 mb-4">
        {!addEmployee && !editEmployee ? (
          <>
            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px]" variant="text" size="lg">
              {['Employee Management', 'Payroll'].map(tab => (
                <Button
                  key={tab}
                  className={selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                  onClick={() => handletabClick(tab)}
                >
                  {tab}
                </Button>
              ))}
            </ButtonGroup>
            {showPayroll ? <SearchInput /> : (
              <Button
                onClick={() => setAddEmployee(true)}
                className="px-8 py-2.5 bg-[#C01824] text-[14px] capitalize rounded-[6px]"
              >
                Add Employee
              </Button>
            )}
          </>
        ) : (
          <>
            <h3 className="text-[24px] font-bold text-[#2C2F32]">{addEmployee ? 'Add Employee' : 'Edit Employee'}</h3>

          </>
        )}
      </div>

      {showPayroll ? (
        <ToggleBar />
      ) : addEmployee ? (
        <AddDriver handleCancel={handleCancel} />
      ) : editEmployee ? (
        <EditDriver handleCancel={handleEditCancel} />
      ) : (
        <div className="bg-white w-full rounded-[4px] border shadow-sm p-4 flex flex-col items-center gap-6 min-h-[60vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Spinner className="h-8 w-8 text-[#C01824]" />
              <p className="mt-3 text-sm text-gray-500">Loading employees...</p>
            </div>
          ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Title", "Name", "Address", "City", "Phone", "Date of Birth", "State", "Zip", "Terminal", "Email",
                    "Emergency Contact Name", "Emergency Contact", "Pay Grade", "Trip Rate", "Route Rate", "Pay Cycle", "Pay Type",
                    "W2", "1099", "YTD", "Pay Stub", "Terminal Assigned To", "Fuel Card Code", "User Name", "Direct Deposit", "Account Number", "Routing No", "Social Security No",
                    "Password Reset", "Status", "Availability", "Action"
                  ].map((head) => (
                    <th key={head} className="px-10 py-1 border whitespace-nowrap">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employee.length > 0 ? (
                  employee.slice(startIndex, startIndex + itemsPerPage).map((emp, index) => {
                    const employeeIndex = startIndex + index;
                    return (
                      <tr key={emp.EmpId || index} className={employeeIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-10 py-1 border text-center">
                          <h2 className="w-40">{emp.Title || "Driver"}</h2>
                        </td>

                        <td className="px-10 py-1 border text-center">
                          <div className="flex items-center gap-1">
                            <img
                              src={getImageUrl(emp.FilePath) || defaultAvatar}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                const imageUrl = getImageUrl(emp.FilePath);
                                if (imageUrl) {
                                  setSelectedAvatarImage(imageUrl);
                                }
                              }}
                              onError={(e) => {
                                // Fallback to default avatar if image fails to load
                                e.target.src = defaultAvatar;
                              }}
                            />
                            <h2 className="w-40">{emp.Name || "N/A"}</h2>
                          </div>
                        </td>

                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.Address || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.City || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.Phone || "11111111"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.DateOfBirth
                          ? new Date(emp.DateOfBirth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })
                          : "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.StateName || "Kabul"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.ZipCode || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.TerminalName || "T1"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.Email || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.EmergencyContactName || "10"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.EmergencyContactPhone || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.PayGrade || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.TripRate || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.RouteRate || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.PayCycleName || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.PayTypeName || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.W2 || "—"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp._1099 || "—"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.YTD || "—"}</h2></td>
                        <td className="px-10 py-1 border text-[#C01824] font-bold cursor-pointer">View</td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.TerminalName || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.FuelCardCode || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.AppUserName || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-[#C01824] font-bold text-center"><h2 className="w-40">{emp.DirectDeposit || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-[#C01824] font-bold text-center"><h2 className="w-40">{emp.AccountNumber || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.RoutingNo || "N/A"}</h2></td>
                        <td className="px-10 py-1 border text-center"><h2 className="w-40">{emp.SocialSecurityNo || "N/A"}</h2></td>

                        <td className="px-10 py-1 border text-[#C01824] font-bold text-center">
                          <h2 className="w-40">{emp.AppPasswordReset || "—"}</h2>
                        </td>

                        <td className="px-10 py-1 border text-center">
                          <div
                            className={`flex w-[98px] h-8 items-center gap-1 justify-center rounded-full ${emp.Status === "Active" ? "bg-green-500" : "bg-[#C01824]"
                              }`}
                          >
                            {emp.Status === "Active" && <img src={ActiveTick} className="ms-2" />}
                            <span className="text-white">{emp.Status || "Inactive"}</span>
                            {emp.Status !== "Active" && <img src={unactiveCross} />}
                          </div>
                        </td>

                        <td className="px-10 py-1 border ">
                          <div
                            className={`w-[100px] h-[35px] flex items-center justify-center rounded ${emp.Availability === "Present"
                              ? "bg-[#CCFAEB] text-[#0BA071]"
                              : "bg-[#F6DCDE] text-[#C01824]"
                              }`}
                          >
                            {emp.Availability || "N/A"}
                          </div>
                        </td>

                        <td
                          className="px-10 py-1 border cursor-pointer"
                          onClick={handleEllipsisClick}
                        >
                          <FaEllipsisVertical />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="30" className="text-center p-4 text-gray-500">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
          )}

          {/* Pagination controls */}
          {!loading && (
            <div className="mt-4 flex justify-center">
              {renderPageNumbers()}
            </div>
          )}

          {/* Modal Menus */}
          {isModalOpen && (
            <div id="custom-modal" className="fixed w-40 bg-white border rounded shadow-lg z-50 text-left" style={{ top: modalPosition.top, left: modalPosition.left }}>
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleClickLicenses}>Licenses copy</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleClickInfraction}>Infraction</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setEditEmployee(true)}>Edit</li>
              </ul>
            </div>
          )}

          {/* License View */}
          {showImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" ref={modalRef}>
              <div className="image-container relative">
                <img src={licencesPic} className="relative z-20" />
              </div>
            </div>
          )}

          {/* Infraction Modal */}
          {showInfraction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-56">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Infraction</h3>
                  <button className="text-black hover:text-gray-800" onClick={handleClose}>×</button>
                </div>
                <div className="space-y-2">
                  <div className="flex"><span className="w-20 font-medium">Date:</span><span className="text-[#67696A]">02-12-2023</span></div>
                  <div className="flex"><span className="w-20 font-medium">Status:</span><span className="text-[#67696A]">Pending</span></div>
                  <div className="flex"><span className="w-20 font-medium">Type:</span><span className="text-[#67696A]">Signal Break</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Full Size Avatar Modal */}
          {selectedAvatarImage && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setSelectedAvatarImage(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh] p-4">
                <button
                  onClick={() => setSelectedAvatarImage(null)}
                  className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={selectedAvatarImage}
                  alt="Employee Avatar"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default EmployeeManagement;
