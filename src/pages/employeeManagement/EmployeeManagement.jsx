import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '@/layouts/SchoolLayout';
import { ActiveTick, unactiveCross } from '@/assets';
import { DrivingLicense } from '@/components/Modals/DrivingLicense';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { Button, ButtonGroup, Spinner } from '@material-tailwind/react';
import { Toaster } from 'react-hot-toast';
import AddDriver from './AddDriver';
import EditDriver from './EditDriver';
import ToggleBar from './ToggleBar';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSearchParams } from 'react-router-dom';
import { readFocusParams } from '@/utils/globalSearch';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Cpath d='M20 10c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 16c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z' fill='%239CA3AF'/%3E%3C/svg%3E";

const getImageUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  return `${BASE_URL}/${filePath.startsWith('/') ? filePath.slice(1) : filePath}`;
};

// ── Small reusable badge ────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const active = status === 'Active';
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white ${active ? 'bg-green-500' : 'bg-[#C01824]'}`}>
      {active ? <img src={ActiveTick} className="w-3 h-3" /> : <img src={unactiveCross} className="w-3 h-3" />}
      {status || 'Inactive'}
    </span>
  );
};

const AvailabilityBadge = ({ availability }) => {
  const present = availability === 'Present';
  return (
    <span className={`inline-flex items-center justify-center px-3 py-1 rounded text-xs font-semibold ${present ? 'bg-[#CCFAEB] text-[#0BA071]' : 'bg-[#F6DCDE] text-[#C01824]'}`}>
      {availability || 'N/A'}
    </span>
  );
};

// ── Detail row in the "View Details" modal ──────────────────────────────────
const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 rounded-xl border border-[#f0ede6] bg-[#fcfbf8] px-3 py-2.5">
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a9488]">{label}</span>
    <span className="text-sm font-medium text-[#2c2f32] break-words">{value || 'N/A'}</span>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────
const EmployeeManagement = () => {
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('token');

  const [selectedTab, setSelectedTab]   = useState('Employee Management');
  const [showPayroll, setShowPayroll]   = useState(false);
  const [addEmployee, setAddEmployee]   = useState(false);
  const [editEmployee, setEditEmployee] = useState(false);

  const [employees, setEmployees]     = useState([]);
  const [loading, setLoading]         = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Context menu
  const [menuAnchor, setMenuAnchor]     = useState(null); // { top, left }
  const [menuEmployee, setMenuEmployee] = useState(null);
  const menuRef = useRef(null);

  // Modals
  const [viewEmployee, setViewEmployee]   = useState(null); // "View Details" modal
  const [showLicense, setShowLicense]     = useState(false);
  const [showInfraction, setShowInfraction] = useState(false);
  const [avatarZoom, setAvatarZoom]       = useState(null);
  const [highlightedEmployeeId, setHighlightedEmployeeId] = useState(null);

  // ── Fetch ───────────────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const decoded = jwtDecode(token);
      const userId  = decoded.userId || decoded.UserId || decoded.user_id || decoded.id || decoded.sub;
      const numericId = Number(userId);
      if (!numericId || isNaN(numericId)) return;

      const res = await axios.get(`${BASE_URL}/institute/GetEmployeeInfo/${numericId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data
        : Array.isArray(res.data?.data) ? res.data.data : [];
      setEmployees(data);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, [token]);

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAnchor(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Pagination ──────────────────────────────────────────────────────────
  const totalPages   = Math.max(1, Math.ceil(employees.length / itemsPerPage));
  const startIndex   = (currentPage - 1) * itemsPerPage;
  const pageEmployees = employees.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (!employees.length || addEmployee || editEmployee || showPayroll) return;

    const focus = readFocusParams(searchParams, 'employee');
    if (!focus) return;

    const matchedEmployee = employees.find((emp) => {
      const employeeId = String(emp.EmpId ?? emp.EmployeeId ?? emp.employeeId ?? emp.id ?? '');
      const employeeName = String(emp.Name ?? emp.name ?? '').trim().toLowerCase();
      return (
        (focus.focusId && employeeId === String(focus.focusId)) ||
        (focus.focusLabel && employeeName === focus.focusLabel)
      );
    });

    if (!matchedEmployee) return;

    const matchedEmployeeId = String(
      matchedEmployee.EmpId ??
      matchedEmployee.EmployeeId ??
      matchedEmployee.employeeId ??
      matchedEmployee.id ??
      ''
    );
    const matchedIndex = employees.findIndex((emp) => String(
      emp.EmpId ??
      emp.EmployeeId ??
      emp.employeeId ??
      emp.id ??
      ''
    ) === matchedEmployeeId);

    if (matchedIndex === -1) return;

    const targetPage = Math.floor(matchedIndex / itemsPerPage) + 1;
    if (currentPage !== targetPage) {
      setCurrentPage(targetPage);
    }

    setHighlightedEmployeeId(matchedEmployeeId);

    const timer = setTimeout(() => setHighlightedEmployeeId(null), 2500);
    return () => clearTimeout(timer);
  }, [addEmployee, currentPage, editEmployee, employees, itemsPerPage, searchParams, showPayroll]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setShowPayroll(tab === 'Payroll');
  };

  const openMenu = (e, emp) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuAnchor({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX - 120 });
    setMenuEmployee(emp);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{
        style: { fontSize: '14px', padding: '12px 18px', borderRadius: '8px' },
      }} />

      {/* Top bar */}
      <div className="flex items-center justify-between w-full mt-3 mb-4">
        {!addEmployee && !editEmployee ? (
          <>
            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px]" variant="text" size="lg">
              {['Employee Management', 'Payroll'].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-6 py-3 capitalize font-bold ${selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white' : 'bg-white'}`}
                >
                  {tab}
                </Button>
              ))}
            </ButtonGroup>

            {!showPayroll && (
              <Button onClick={() => setAddEmployee(true)} className="px-8 py-2.5 bg-[#C01824] text-sm capitalize rounded-md">
                Add Employee
              </Button>
            )}
          </>
        ) : (
          <h3 className="text-2xl font-bold text-[#2C2F32]">
            {addEmployee ? 'Add Employee' : 'Edit Employee'}
          </h3>
        )}
      </div>

      {/* Content */}
      {showPayroll ? (
        <ToggleBar />
      ) : addEmployee ? (
        <AddDriver handleCancel={() => { setAddEmployee(false); fetchEmployees(); }} />
      ) : editEmployee ? (
        <EditDriver employee={menuEmployee} handleCancel={() => setEditEmployee(false)} onSaved={fetchEmployees} />
      ) : (
        <div className="bg-white w-full rounded border shadow-sm min-h-[60vh] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Spinner className="h-8 w-8 text-[#C01824]" />
              <p className="text-sm text-gray-500">Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-12">
              <p className="text-base font-semibold">No employees found.</p>
              <p className="text-sm mt-1">Use "Add Employee" to create the first record.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      <th className="px-4 py-3 whitespace-nowrap">Name</th>
                      <th className="px-4 py-3 whitespace-nowrap">Title</th>
                      <th className="px-4 py-3 whitespace-nowrap">Phone</th>
                      <th className="px-4 py-3 whitespace-nowrap">Email</th>
                      <th className="px-4 py-3 whitespace-nowrap">Terminal</th>
                      <th className="px-4 py-3 whitespace-nowrap">Pay Grade</th>
                      <th className="px-4 py-3 whitespace-nowrap">Pay Type</th>
                      <th className="px-4 py-3 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 whitespace-nowrap">Availability</th>
                      <th className="px-4 py-3 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pageEmployees.map((emp, i) => {
                      const rowEmployeeId = String(emp.EmpId ?? emp.EmployeeId ?? emp.employeeId ?? emp.id ?? i);
                      const isHighlighted = highlightedEmployeeId === rowEmployeeId;
                      return (
                      <tr key={emp.EmpId || i} className={`${isHighlighted ? 'bg-[#fff3f4]' : 'hover:bg-gray-50'} transition-colors`}>
                        {/* Avatar + Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={getImageUrl(emp.FilePath) || defaultAvatar}
                              alt="avatar"
                              className="w-9 h-9 rounded-full object-cover border cursor-pointer hover:opacity-80"
                              onClick={() => { const u = getImageUrl(emp.FilePath); if (u) setAvatarZoom(u); }}
                              onError={(e) => { e.target.src = defaultAvatar; }}
                            />
                            <span className="font-medium text-gray-800 whitespace-nowrap">{emp.Name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{emp.DesignationName || emp.Title || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{emp.Phone || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap max-w-[180px] truncate" title={emp.Email}>{emp.Email || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{emp.TerminalName || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{emp.PayGrade || '—'}</td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{emp.PayTypeName || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={emp.Status} /></td>
                        <td className="px-4 py-3"><AvailabilityBadge availability={emp.Availability} /></td>
                        <td className="px-4 py-3">
                          <button onClick={(e) => openMenu(e, emp)} className="p-1 hover:bg-gray-100 rounded">
                            <FaEllipsisVertical className="text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t mt-auto">
                <p className="text-xs text-gray-500">
                  Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, employees.length)} of {employees.length} employees
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 flex items-center justify-center rounded bg-gray-200 disabled:opacity-40"
                  >
                    <FaAngleLeft />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`h-8 w-8 flex items-center justify-center rounded text-sm ${currentPage === pg ? 'bg-[#C01824] text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 flex items-center justify-center rounded bg-gray-200 disabled:opacity-40"
                  >
                    <FaAngleRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Context menu ──────────────────────────────────────────────── */}
      {menuAnchor && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-40 py-1"
          style={{ top: menuAnchor.top, left: menuAnchor.left }}
        >
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setViewEmployee(menuEmployee); setMenuAnchor(null); }}>View Details</button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setEditEmployee(true); setMenuEmployee(menuEmployee); setMenuAnchor(null); }}>Edit</button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setShowLicense(true); setMenuAnchor(null); }}>License Copy</button>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => { setShowInfraction(true); setMenuAnchor(null); }}>Infraction</button>
        </div>
      )}

      {/* ── View Details modal ─────────────────────────────────────────── */}
      {viewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]" onClick={() => setViewEmployee(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-[#efe8dd] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start gap-4 border-b border-[#eee7dc] bg-gradient-to-r from-[#fff8f8] to-white p-6 sm:p-7">
              <img
                src={getImageUrl(viewEmployee.FilePath) || defaultAvatar}
                alt="avatar"
                className="h-16 w-16 rounded-full border border-[#eadfd2] object-cover shadow-sm"
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-[#2c2f32]">{viewEmployee.Name || 'N/A'}</h2>
                  <span className="rounded-full bg-[#fff1f2] px-3 py-1 text-xs font-semibold text-[#c01824]">
                    {viewEmployee.DesignationName || viewEmployee.Title || 'N/A'}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    viewEmployee.Status === 'Active'
                      ? 'bg-[#e7f8ef] text-[#1b8f50]'
                      : 'bg-[#fce8ea] text-[#c01824]'
                  }`}>
                    {viewEmployee.Status || 'Inactive'}
                  </span>
                </div>
                <p className="mt-2 break-all text-sm text-[#6d6f73]">{viewEmployee.Email || 'No email available'}</p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#efe8dd] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a9488]">Terminal</p>
                    <p className="mt-1 text-sm font-semibold text-[#2c2f32]">{viewEmployee.TerminalName || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl border border-[#efe8dd] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a9488]">Pay Type</p>
                    <p className="mt-1 text-sm font-semibold text-[#2c2f32]">{viewEmployee.PayTypeName || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl border border-[#efe8dd] bg-white px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a9488]">Pay Cycle</p>
                    <p className="mt-1 text-sm font-semibold text-[#2c2f32]">{viewEmployee.PayCycleName || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setViewEmployee(null)} className="ml-auto rounded-full border border-[#eadfd2] px-3 py-1 text-sm font-bold text-[#8f8a81] transition hover:bg-[#f8f5ef] hover:text-[#2c2f32]">X</button>
            </div>

            {/* Details */}
            {/* Details */}
            <div className="grid grid-cols-1 gap-5 px-6 py-6 sm:px-7 lg:grid-cols-2">
              <div className="rounded-[20px] border border-[#efe8dd] bg-white p-5">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#9a9488]">Personal</p>
                <div className="space-y-3">
                  <DetailRow label="Date of Birth" value={viewEmployee.DateOfBirth ? new Date(viewEmployee.DateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) : null} />
                  <DetailRow label="Phone" value={viewEmployee.Phone} />
                  <DetailRow label="Email" value={viewEmployee.Email} />
                  <DetailRow label="Address" value={viewEmployee.Address} />
                  <DetailRow label="City" value={viewEmployee.CityName} />
                  <DetailRow label="State" value={viewEmployee.StateName} />
                  <DetailRow label="Zip Code" value={viewEmployee.ZipCode} />
                  <DetailRow label="Emergency Contact" value={viewEmployee.EmergencyContactName} />
                  <DetailRow label="Emergency Phone" value={viewEmployee.EmergencyContactPhone} />
                </div>
              </div>
              <div className="rounded-[20px] border border-[#efe8dd] bg-white p-5">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#9a9488]">Employment</p>
                <div className="space-y-3">
                  <DetailRow label="Terminal" value={viewEmployee.TerminalName} />
                  <DetailRow label="Pay Grade" value={viewEmployee.PayGrade} />
                  <DetailRow label="Pay Type" value={viewEmployee.PayTypeName} />
                  <DetailRow label="Pay Cycle" value={viewEmployee.PayCycleName} />
                  <DetailRow label="Trip Rate" value={viewEmployee.TripRate} />
                  <DetailRow label="Route Rate" value={viewEmployee.RouteRate} />
                  <DetailRow label="Fuel Card Code" value={viewEmployee.FuelCardCode} />
                  <DetailRow label="Username" value={viewEmployee.AppUserName} />
                  <DetailRow label="Status" value={viewEmployee.Status} />
                  <DetailRow label="Availability" value={viewEmployee.Availability} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── License modal ───────────────────────────────────────────────── */}
      <DrivingLicense
        open={showLicense}
        handleOpen={() => setShowLicense(false)}
        driver={{
          name:           menuEmployee?.Name         || '',
          phone:          menuEmployee?.Phone        || '',
          profilePhoto:   getImageUrl(menuEmployee?.FilePath),
          drivingLicense: getImageUrl(
            menuEmployee?.DrivingLicensePath ||
            menuEmployee?.drivingLicensePath ||
            menuEmployee?.LicensePath        ||
            menuEmployee?.drivingLicense     ||
            menuEmployee?.LicenseFile        || ''
          ),
        }}
      />

      {/* ── Infraction modal ────────────────────────────────────────────── */}
      {showInfraction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInfraction(false)}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-64" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Infraction</h3>
              <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowInfraction(false)}>×</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex"><span className="w-16 font-medium text-gray-500">Date</span><span className="text-gray-700">02-12-2023</span></div>
              <div className="flex"><span className="w-16 font-medium text-gray-500">Status</span><span className="text-gray-700">Pending</span></div>
              <div className="flex"><span className="w-16 font-medium text-gray-500">Type</span><span className="text-gray-700">Signal Break</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ── Avatar zoom ─────────────────────────────────────────────────── */}
      {avatarZoom && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50" onClick={() => setAvatarZoom(null)}>
          <img src={avatarZoom} alt="Employee" className="max-w-full max-h-[90vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} onError={(e) => { e.target.src = defaultAvatar; }} />
        </div>
      )}
    </MainLayout>
  );
};

export default EmployeeManagement;


