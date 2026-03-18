import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTerminalDetail,
  fetchTerminalRates,
  fetchDriverPaystub,
  updateTerminalRates,
  generateDriverPayroll,
  updatePayrollStatus,
  bulkGenerateTerminalPayroll,
} from '@/redux/slices/payrollSlice';
import RequestModal from './RequestModal';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import toast from 'react-hot-toast';
import routeiqFav from '@/assets/routeiq-fav.png';

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3Cpath d='M20 10c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 16c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z' fill='%239CA3AF'/%3E%3C/svg%3E";

const pick = (...values) => values.find((v) => v !== undefined && v !== null);

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function DriverTable({ terminalId, handleEdit }) {
  const dispatch = useDispatch();
  const { terminalDetail, terminalRates, loading } = useSelector((s) => s.payroll);

  const d = new Date();
  const [month, setMonth] = useState(d.getMonth() + 1);
  const [year, setYear] = useState(d.getFullYear());
  const [paySlip, setPaySlip] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [requestModalEmployeeId, setRequestModalEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Generate payroll modal (single driver)
  const [generateModal, setGenerateModal] = useState(null); // driver object
  const [genForm, setGenForm] = useState({ periodStart: '', periodEnd: '', federalTaxRate: 22, stateTaxRate: 5, localTaxRate: 0 });
  const [genLoading, setGenLoading] = useState(false);

  // Bulk generate modal
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkForm, setBulkForm] = useState({ periodStart: '', periodEnd: '', federalTaxRate: 22, stateTaxRate: 5, localTaxRate: 0, notes: '' });
  const [bulkLoading, setBulkLoading] = useState(false);

  // Inline rate editing
  const [editingField, setEditingField] = useState(null); // 'routeRate' | 'tripRate' | 'month' | 'year'
  const [tempValue, setTempValue] = useState('');
  const [tripRateValue, setTripRateValue] = useState('');
  const editRef = useRef(null);

  const itemsPerPage = 5;

  useEffect(() => {
    if (!terminalId) return;
    dispatch(fetchTerminalDetail({ terminalId, month, year }));
    dispatch(fetchTerminalRates(terminalId));
  }, [dispatch, terminalId, month, year]);

  const normalizedDetail = terminalDetail
    ? {
        ...terminalDetail,
        terminalId: pick(terminalDetail.terminalId, terminalDetail.TerminalId),
        terminalName: pick(terminalDetail.terminalName, terminalDetail.TerminalName),
        terminalCode: pick(terminalDetail.terminalCode, terminalDetail.TerminalCode),
        month: pick(terminalDetail.month, terminalDetail.Month),
        year: pick(terminalDetail.year, terminalDetail.Year),
        routeRate: pick(terminalDetail.routeRate, terminalDetail.RouteRate),
        tripRate: pick(terminalDetail.tripRate, terminalDetail.TripRate),
        periodStart: pick(terminalDetail.periodStart, terminalDetail.PeriodStart),
        periodEnd: pick(terminalDetail.periodEnd, terminalDetail.PeriodEnd),
        settings: pick(terminalDetail.settings, terminalDetail.Settings) || {},
        drivers: pick(terminalDetail.drivers, terminalDetail.Drivers) || [],
      }
    : null;
  const detail =
    normalizedDetail && Number(normalizedDetail.terminalId) === Number(terminalId)
      ? normalizedDetail
      : null;
  const normalizedRates =
    terminalRates && Number(pick(terminalRates.terminalId, terminalRates.TerminalId)) === Number(terminalId)
      ? {
          ...terminalRates,
          terminalId: pick(terminalRates.terminalId, terminalRates.TerminalId),
          terminalName: pick(terminalRates.terminalName, terminalRates.TerminalName),
          routeRate: pick(terminalRates.routeRate, terminalRates.RouteRate),
          tripRate: pick(terminalRates.tripRate, terminalRates.TripRate),
        }
      : null;
  // API returns flat structure — all payroll fields are directly on driver object
  const drivers = (detail?.drivers || []).map((driver) => {
    const benefits = pick(driver.benefits, driver.Benefits) || {};
    return {
      ...driver,
      employeeId:           pick(driver.employeeId,    driver.EmployeeId),
      name:                 pick(driver.name,          driver.Name),
      payCycle:             pick(driver.payCycle,      driver.PayCycle),
      payType:              pick(driver.payType,       driver.PayType),
      job:                  pick(driver.job,           driver.Job),
      routeRate:            pick(driver.routeRate,     driver.RouteRate),
      tripRate:             pick(driver.tripRate,      driver.TripRate),
      ssn:                  pick(driver.ssn,           driver.SSN),
      ytd:                  pick(driver.ytd,           driver.YTD),
      currentPayPeriod:     pick(driver.currentPayPeriod,     driver.CurrentPayPeriod),
      currentPayPeriodTime: pick(driver.currentPayPeriodTime, driver.CurrentPayPeriodTime),
      periodStart:          pick(driver.periodStart,   driver.PeriodStart),
      periodEnd:            pick(driver.periodEnd,     driver.PeriodEnd),
      // Build payroll object from flat fields
      payroll: {
        payrollId:      pick(driver.payrollId,       driver.PayrollId),
        status:         pick(driver.payStatus,       driver.PayStatus,       driver.status,  driver.Status),
        totalHours:     pick(driver.workHours,       driver.WorkHours),
        grossPay:       pick(driver.grossPay,        driver.GrossPay),
        netSalary:      pick(driver.netSalary,       driver.NetSalary),
        federalTax:     pick(driver.federalTax,      driver.FederalTax),
        stateTax:       pick(driver.stateTax,        driver.StateTax),
        localTax:       pick(driver.localTax,        driver.LocalTax),
        federalTaxRate: pick(driver.federalTaxRate,  driver.FederalTaxRate),
        stateTaxRate:   pick(driver.stateTaxRate,    driver.StateTaxRate),
        localTaxRate:   pick(driver.localTaxRate,    driver.LocalTaxRate),
        medicare:       pick(driver.medicare,        driver.Medicare),
        socialSecurity: pick(driver.socialSecurity,  driver.SocialSecurity),
        periodStart:    pick(driver.periodStart,     driver.PeriodStart),
        periodEnd:      pick(driver.periodEnd,       driver.PeriodEnd),
      },
      benefits: {
        plan401K:        pick(benefits.plan401K,        benefits.Plan401K),
        companyMatch:    pick(benefits.companyMatch,    benefits.CompanyMatch),
        healthInsurance: pick(benefits.healthInsurance, benefits.HealthInsurance),
        savingsAccount:  pick(benefits.savingsAccount,  benefits.SavingsAccount),
        reimbursement:   pick(benefits.reimbursement,   benefits.Reimbursement),
      },
    };
  });

  const totalPages = Math.max(1, Math.ceil(drivers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDrivers = drivers.slice(startIndex, startIndex + itemsPerPage);

  const firstDriver = drivers[0];
  const routeRateValue = pick(normalizedRates?.routeRate, detail?.settings?.routeRate, detail?.settings?.RouteRate, detail?.routeRate, firstDriver?.routeRate);
  const tripRateValueDisplay = pick(normalizedRates?.tripRate, detail?.settings?.tripRate, detail?.settings?.TripRate, detail?.tripRate, firstDriver?.tripRate);
  const routeRateDisplay = routeRateValue != null ? `$${Number(routeRateValue).toFixed(2)}/hr` : '—';
  const tripRateDisplay = tripRateValueDisplay != null ? `$${Number(tripRateValueDisplay).toFixed(2)}/hr` : '—';
  const payPeriodDisplay = detail?.periodStart ? MONTHS[(new Date(detail.periodStart).getMonth())] : MONTHS[month - 1];
  const displayYear = detail?.year ?? year;

  const startEditRates = () => {
    setTempValue(routeRateValue ?? '');
    setTripRateValue(tripRateValueDisplay ?? '');
    setEditingField('rates');
  };

  const saveRates = async () => {
    const rr = parseFloat(tempValue);
    const tr = parseFloat(tripRateValue);
    if (isNaN(rr) || isNaN(tr)) { toast.error('Enter valid numbers'); return; }
    try {
      await dispatch(updateTerminalRates({ terminalId, routeRate: rr, tripRate: tr })).unwrap();
      dispatch(fetchTerminalRates(terminalId));
      toast.success('Rates updated');
      setEditingField(null);
      dispatch(fetchTerminalDetail({ terminalId, month, year }));
    } catch (err) {
      toast.error(err || 'Failed to update rates');
    }
  };

  const startEditPeriod = () => {
    setTempValue(month);
    setTripRateValue(year);
    setEditingField('period');
  };

  const savePeriod = () => {
    const m = parseInt(tempValue);
    const y = parseInt(tripRateValue);
    if (m >= 1 && m <= 12 && y >= 2020) {
      setMonth(m);
      setYear(y);
    }
    setEditingField(null);
  };

  const cancelEdit = () => setEditingField(null);

  const openGenerateModal = (driver) => {
    const start = detail?.periodStart || '';
    const end = detail?.periodEnd || '';
    setGenForm({ periodStart: start, periodEnd: end, federalTaxRate: 22, stateTaxRate: 5, localTaxRate: 0 });
    setGenerateModal(driver);
    setActiveDropdown(null);
  };

  const handleGeneratePayroll = async () => {
    if (!genForm.periodStart || !genForm.periodEnd) { toast.error('Period dates required'); return; }
    setGenLoading(true);
    try {
      await dispatch(generateDriverPayroll({
        employeeId: generateModal.employeeId,
        periodStart: genForm.periodStart,
        periodEnd: genForm.periodEnd,
        federalTaxRate: Number(genForm.federalTaxRate) / 100,
        stateTaxRate: Number(genForm.stateTaxRate) / 100,
        localTaxRate: Number(genForm.localTaxRate) / 100,
      })).unwrap();
      toast.success(`Payroll generated for ${generateModal.name}`);
      setGenerateModal(null);
      dispatch(fetchTerminalDetail({ terminalId, month, year }));
    } catch (err) {
      toast.error(err || 'Failed to generate payroll');
    } finally {
      setGenLoading(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!bulkForm.periodStart || !bulkForm.periodEnd) { toast.error('Period dates required'); return; }
    setBulkLoading(true);
    try {
      await dispatch(bulkGenerateTerminalPayroll({
        terminalId,
        periodStart: bulkForm.periodStart,
        periodEnd: bulkForm.periodEnd,
        federalTaxRate: Number(bulkForm.federalTaxRate) / 100,
        stateTaxRate: Number(bulkForm.stateTaxRate) / 100,
        localTaxRate: Number(bulkForm.localTaxRate) / 100,
        notes: bulkForm.notes,
      })).unwrap();
      toast.success('Payroll generated for all drivers');
      setBulkModal(false);
      dispatch(fetchTerminalDetail({ terminalId, month, year }));
    } catch (err) {
      toast.error(err || 'Failed to bulk generate payroll');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleStatusUpdate = async (payrollId, status, driverName) => {
    try {
      await dispatch(updatePayrollStatus({ payrollId, status })).unwrap();
      toast.success(`${driverName}: marked as ${status}`);
      dispatch(fetchTerminalDetail({ terminalId, month, year }));
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  const toggleDropdown = (id) => setActiveDropdown((prev) => (prev === id ? null : id));
  const closeDropdown = () => setActiveDropdown(null);
  const openRequestModal = (employeeId) => { if (employeeId) setRequestModalEmployeeId(employeeId); };
  const closeRequestModal = () => setRequestModalEmployeeId(null);

  const renderPageNumbers = () => {
    const pages = [];
    pages.push(
      <button key="prev" className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
        <FaAngleLeft />
      </button>
    );
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button key={i}
          className={`flex items-center justify-center bg-white h-8 w-8 rounded mx-1 ${currentPage === i ? 'text-[#C01824] border border-[#C01824]' : 'border border-[#C4C6C9] text-black'}`}
          onClick={() => setCurrentPage(i)}>
          {i}
        </button>
      );
    }
    pages.push(
      <button key="next" className="flex items-center justify-center h-8 w-8 rounded bg-[#919EAB] text-[#C4CDD5]"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
        <FaAngleRight />
      </button>
    );
    return pages;
  };

  if (!terminalId) return null;

  return (
    <div className="w-full mx-auto p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4" ref={editRef}>
        <button
          onClick={() => { setBulkForm({ periodStart: detail?.periodStart || '', periodEnd: detail?.periodEnd || '', federalTaxRate: 22, stateTaxRate: 5, localTaxRate: 0, notes: '' }); setBulkModal(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#C01824] text-white text-sm font-semibold rounded-lg hover:bg-[#a3131e] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Bulk Generate Payroll
        </button>
        <div className="flex flex-wrap justify-end gap-2">
        {/* Route Rate */}
        <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2 gap-1">
          <span className="text-sm text-gray-600">Route Rate :</span>
          {editingField === 'rates' ? (
            <input type="number" step="0.01" className="w-20 border border-gray-300 rounded px-1 py-0.5 text-sm" value={tempValue}
              onChange={(e) => setTempValue(e.target.value)} autoFocus />
          ) : (
            <>
              <span className="mr-1">{routeRateDisplay}</span>
              <button className="text-gray-500" onClick={startEditRates}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Trip Rate */}
        <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2 gap-1">
          <span className="text-sm text-gray-600">Trip Rate :</span>
          {editingField === 'rates' ? (
            <input type="number" step="0.01" className="w-20 border border-gray-300 rounded px-1 py-0.5 text-sm" value={tripRateValue}
              onChange={(e) => setTripRateValue(e.target.value)} />
          ) : (
            <span className="mr-1">{tripRateDisplay}</span>
          )}
          {editingField === 'rates' ? (
            <div className="flex gap-1">
              <button onClick={saveRates} className="text-xs bg-[#C01824] text-white px-2 py-0.5 rounded">Save</button>
              <button onClick={cancelEdit} className="text-xs border border-gray-400 px-2 py-0.5 rounded">✕</button>
            </div>
          ) : (
            <button className="text-gray-500" onClick={startEditRates}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>

        {/* Pay Period */}
        <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2 gap-1">
          <span className="text-sm text-gray-600">Pay Period :</span>
          {editingField === 'period' ? (
            <select className="border border-gray-300 rounded px-1 py-0.5 text-sm" value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          ) : (
            <>
              <span className="mr-1">{payPeriodDisplay}</span>
              <button className="text-gray-500" onClick={startEditPeriod}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Year */}
        <div className="flex items-center rounded-lg bg-[#F9FBFF] border border-[#D9D9D9] p-2 gap-1">
          <span className="text-sm text-gray-600">Year :</span>
          {editingField === 'period' ? (
            <input type="number" className="w-20 border border-gray-300 rounded px-1 py-0.5 text-sm" value={tripRateValue}
              onChange={(e) => setTripRateValue(e.target.value)} />
          ) : (
            <span className="mr-1">{displayYear}</span>
          )}
          {editingField === 'period' ? (
            <div className="flex gap-1">
              <button onClick={savePeriod} className="text-xs bg-[#C01824] text-white px-2 py-0.5 rounded">Save</button>
              <button onClick={cancelEdit} className="text-xs border border-gray-400 px-2 py-0.5 rounded">✕</button>
            </div>
          ) : (
            <button className="text-gray-500" onClick={startEditPeriod}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
        </div>{/* end inner flex */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        {loading.terminalDetail ? (
          <div className="flex justify-center py-12 text-gray-500">Loading drivers...</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                {["Title","Name","Requests","Work Hours","Terminal assigned","Pay Cycle","Pay Type","Job","Fedral Tax",
                  "State Tax","Local Tax","SSN","Pay Status","YTD","Current Pay Period","Current Pay Period Time","Pay Stub","401K","Company Match",
                  "Health Insurance","Savings Account","Reimbursement","Action"
                ].map((head) => (
                  <th key={head} className="px-10 py-1 border whitespace-nowrap">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700" onClick={closeDropdown}>
              {currentDrivers.length === 0 ? (
                <tr>
                  <td colSpan={23} className="px-10 py-8 text-center text-gray-500">No drivers found.</td>
                </tr>
              ) : currentDrivers.map((driver, idx) => {
                const p = driver.payroll || {};
                const b = driver.benefits || {};
                const status = p.status || 'Pending';
                return (
                  <tr key={driver.employeeId ?? `d-${startIndex + idx}`} className="border-t border-gray-200 relative">
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {driver.job || '—'}
                    </td>
                    <td className="px-10 py-1 border text-center">
                      <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full mr-2 object-cover" src={defaultAvatar} alt="Driver" />
                        <h2 className="text-[#141516] w-40">{driver.name || '—'}</h2>
                      </div>
                    </td>
                    <td className="px-10 py-1 border text-center"
                      onClick={(e) => e.stopPropagation()}>
                      <button
                        className="text-[#C01824] font-bold cursor-pointer"
                        onClick={() => openRequestModal(driver.employeeId)}>
                        View
                      </button>
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{p.totalHours ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{detail?.terminalName ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{driver.payCycle ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{driver.payType ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {driver.job || '—'}
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {p.federalTax != null ? `$${Number(p.federalTax).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {p.stateTax != null ? `$${Number(p.stateTax).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {p.localTax != null ? `$${Number(p.localTax).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{driver.ssn ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {status === 'Processed' || status === 'Paid' ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{status}</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">{status}</span>
                      )}
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {driver.ytd != null ? `$${Number(driver.ytd).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      {driver.currentPayPeriod != null ? `$${Number(driver.currentPayPeriod).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{driver.currentPayPeriodTime ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">
                      <span className="text-[#C01824] font-bold cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setPaySlip(driver); }}>
                        View
                      </span>
                    </td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{b.plan401K ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{b.companyMatch ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{b.healthInsurance ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{b.savingsAccount ?? '—'}</td>
                    <td className="px-10 py-1 border text-center text-[#141516]">{b.reimbursement ?? '—'}</td>
                    <td className="px-10 py-1 border text-center relative">
                      <button className="text-[#141516]"
                        onClick={(e) => { e.stopPropagation(); toggleDropdown(driver.employeeId); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      {activeDropdown === driver.employeeId && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
                          <ul className="py-1">
                            <li className="py-2 px-4 text-black hover:bg-gray-100 cursor-pointer text-sm text-left" onClick={() => handleEdit(driver)}>Edit</li>
                            <li className="py-2 px-4 text-blue-700 hover:bg-blue-50 cursor-pointer text-sm text-left font-medium" onClick={() => openGenerateModal(driver)}>
                              Generate Payroll
                            </li>
                            {status === 'Pending' && p.payrollId && (
                              <li className="py-2 px-4 text-orange-700 hover:bg-orange-50 cursor-pointer text-sm text-left font-medium"
                                onClick={() => { handleStatusUpdate(p.payrollId, 'Processed', driver.name); closeDropdown(); }}>
                                Mark as Processed
                              </li>
                            )}
                            {status === 'Processed' && p.payrollId && (
                              <li className="py-2 px-4 text-green-700 hover:bg-green-50 cursor-pointer text-sm text-left font-medium"
                                onClick={() => { handleStatusUpdate(p.payrollId, 'Paid', driver.name); closeDropdown(); }}>
                                Mark as Paid
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {drivers.length > 0 && (
        <div className="mt-4 flex justify-center">{renderPageNumbers()}</div>
      )}

      {/* Modals — fixed inset-0 positions relative to viewport, no portal needed */}
      {requestModalEmployeeId && (
        <RequestModal employeeId={requestModalEmployeeId} closeModal={closeRequestModal} />
      )}

      {paySlip && (
        <PayStubModal employeeId={paySlip.employeeId} payrollId={paySlip.payroll?.payrollId} driver={paySlip} onClose={() => setPaySlip(null)} />
      )}

      {/* ── Generate Payroll Modal (single driver) ── */}
      {generateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setGenerateModal(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Generate Payroll</h2>
              <button className="text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setGenerateModal(null)}>×</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Driver: <span className="font-semibold text-gray-800">{generateModal.name}</span></p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Period Start</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={genForm.periodStart}
                    onChange={(e) => setGenForm((f) => ({ ...f, periodStart: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Period End</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={genForm.periodEnd}
                    onChange={(e) => setGenForm((f) => ({ ...f, periodEnd: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Federal Tax %</label>
                  <input type="number" min="0" max="100" step="0.1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={genForm.federalTaxRate}
                    onChange={(e) => setGenForm((f) => ({ ...f, federalTaxRate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">State Tax %</label>
                  <input type="number" min="0" max="100" step="0.1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={genForm.stateTaxRate}
                    onChange={(e) => setGenForm((f) => ({ ...f, stateTaxRate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Local Tax %</label>
                  <input type="number" min="0" max="100" step="0.1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={genForm.localTaxRate}
                    onChange={(e) => setGenForm((f) => ({ ...f, localTaxRate: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setGenerateModal(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleGeneratePayroll} disabled={genLoading}
                className="flex-1 py-2 bg-[#C01824] text-white rounded-lg text-sm font-semibold hover:bg-[#a3131e] disabled:opacity-60">
                {genLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Generate Modal ── */}
      {bulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setBulkModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Bulk Generate Payroll</h2>
              <button className="text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setBulkModal(false)}>×</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Generate payroll for <span className="font-semibold text-gray-800">all drivers</span> in this terminal.</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Period Start</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={bulkForm.periodStart}
                    onChange={(e) => setBulkForm((f) => ({ ...f, periodStart: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Period End</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={bulkForm.periodEnd}
                    onChange={(e) => setBulkForm((f) => ({ ...f, periodEnd: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Federal Tax %</label>
                  <input type="number" min="0" max="100" step="0.1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={bulkForm.federalTaxRate}
                    onChange={(e) => setBulkForm((f) => ({ ...f, federalTaxRate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">State Tax %</label>
                  <input type="number" min="0" max="100" step="0.1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={bulkForm.stateTaxRate}
                    onChange={(e) => setBulkForm((f) => ({ ...f, stateTaxRate: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Local Tax %</label>
                  <input type="number" min="0" max="100" step="0.1" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={bulkForm.localTaxRate}
                    onChange={(e) => setBulkForm((f) => ({ ...f, localTaxRate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Notes (optional)</label>
                <input type="text" placeholder="e.g. March 2026" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={bulkForm.notes}
                  onChange={(e) => setBulkForm((f) => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setBulkModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleBulkGenerate} disabled={bulkLoading}
                className="flex-1 py-2 bg-[#C01824] text-white rounded-lg text-sm font-semibold hover:bg-[#a3131e] disabled:opacity-60">
                {bulkLoading ? 'Generating...' : 'Generate All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PayStubModal({ employeeId, payrollId, driver, onClose }) {
  const dispatch = useDispatch();
  const { driverPaystub, loading } = useSelector((s) => s.payroll);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!employeeId) return;
    setLoaded(false);
    dispatch(fetchDriverPaystub({ employeeId, payrollId })).finally(() => setLoaded(true));
  }, [dispatch, employeeId, payrollId]);

  const fmt = (v) => (v != null && v !== '' ? Number(v).toFixed(2) : '0.00');

  const toWords = (amount) => {
    if (!amount) return 'Zero And 00/100 Dollars';
    const [dollars, cents] = Number(amount).toFixed(2).split('.');
    return `${Number(dollars).toLocaleString()} And ${cents}/100 Dollars`;
  };

  const p = driverPaystub;
  const s = p?.summary || {};
  const emp = p?.employee || {};
  const company = p?.company || {};
  const period = p?.period || {};
  const earnings = p?.earnings || [];
  const taxes = p?.taxes || {};
  const deductions = p?.deductions || [];
  const pto = p?.benefits?.pto || {};

  // Fallbacks from driver row data
  const empName = emp.name || driver?.name || '—';
  const empNumber = emp.empNumber || emp.employeeId || employeeId || '—';
  const empDept = emp.dept || company.dept || '—';
  const empPayBasis = emp.payBasis || driver?.payType || '—';
  const empAddress = emp.address || '—';
  const empCity = emp.city || '—';
  const companyName = company.name || 'ROUTE IQ';
  const companyAddress = company.address || '1235 Taylor St';
  const companyCity = company.city || 'Lorem Ipsum dolor';
  const companyPhone = company.phone || '';
  const periodStart = period.start || driver?.periodStart || '—';
  const periodEnd = period.end || driver?.periodEnd || '—';
  const payDate = period.payDate || '—';
  const totalHours = period.totalHours ?? driver?.payroll?.totalHours ?? '—';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl relative max-h-[90vh] overflow-y-auto rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-4 text-gray-500 text-xl font-bold z-10" onClick={onClose}>✕</button>

        {loading.paystub ? (
          <div className="py-12 text-center text-gray-500">Loading paystub...</div>
        ) : p ? (
          <div className="font-sans text-xs text-gray-800">

            {/* ── Header ── */}
            <div className="flex items-start justify-between px-6 pt-6 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img src={routeiqFav} alt="Route IQ" className="w-8 h-8 object-contain" />
                  <span className="font-bold text-base text-gray-800">Route IQ</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Earning Statement</h2>
              </div>
              <p className="text-base font-bold text-gray-900 text-right mt-1">{empName}</p>
            </div>

            {/* ── Info Grid ── */}
            <div className="px-6 pb-3 grid grid-cols-3 gap-x-6">
              <div className="space-y-0.5">
                <div className="flex gap-1"><span className="font-semibold w-20 shrink-0">Pay Date:</span><span>{payDate}</span></div>
                <div className="flex gap-1"><span className="font-semibold w-20 shrink-0">Period Start:</span><span>{periodStart}</span></div>
                <div className="flex gap-1"><span className="font-semibold w-20 shrink-0">Period End:</span><span>{periodEnd}</span></div>
              </div>
              <div className="space-y-0.5">
                <div><span className="font-semibold">Company:</span> {companyName}</div>
                <div>{companyAddress}</div>
                <div>{companyCity}</div>
              </div>
              <div className="space-y-0.5 text-right">
                <div><span className="font-semibold">Emp #:</span> {empNumber}</div>
                <div><span className="font-semibold">Dept:</span> {empDept}</div>
                <div><span className="font-semibold">Pay Basis:</span> {empPayBasis}</div>
              </div>
            </div>

            <hr className="border-gray-400 mx-6 mb-3" />

            {/* ── Earnings ── */}
            <div className="px-6 mb-3">
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="py-1 font-semibold">Earnings</th>
                    <th className="py-1 font-semibold text-right">Rate</th>
                    <th className="py-1 font-semibold text-right">Hours/Units</th>
                    <th className="py-1 font-semibold text-right">Current Period</th>
                    <th className="py-1 font-semibold text-right">Year To Date</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.length > 0 ? earnings.map((e, i) => (
                    <tr key={i}>
                      <td className="py-0.5">{e.type || e.description || 'Route Pay'}</td>
                      <td className="py-0.5 text-right">{fmt(e.rate)}</td>
                      <td className="py-0.5 text-right">{fmt(e.hours ?? e.units)}</td>
                      <td className="py-0.5 text-right">{fmt(e.currentPeriod)}</td>
                      <td className="py-0.5 text-right">{fmt(e.ytd)}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="py-0.5">Route Pay</td>
                      <td className="py-0.5 text-right">{fmt(driver?.routeRate)}</td>
                      <td className="py-0.5 text-right">{totalHours}</td>
                      <td className="py-0.5 text-right">{fmt(s.grossPay)}</td>
                      <td className="py-0.5 text-right">{fmt(s.grossPay)}</td>
                    </tr>
                  )}
                  <tr className="border-t border-gray-300 font-semibold">
                    <td className="py-1 text-right pr-2" colSpan={2}>Gross</td>
                    <td className="py-1 text-right">{totalHours}</td>
                    <td className="py-1 text-right">{fmt(s.grossPay)}</td>
                    <td className="py-1 text-right">{fmt(s.grossPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── W/H Taxes ── */}
            <div className="px-6 mb-3">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-1 font-semibold text-left">W/H Taxes</th>
                    <th colSpan={3}></th>
                    <th className="py-1 font-semibold text-right">Current Period</th>
                    <th className="py-1 font-semibold text-right">Year To Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-0.5" colSpan={4}>Federal W/H (M)</td>
                    <td className="py-0.5 text-right">{fmt(taxes.federalWH?.currentPeriod ?? taxes.federal ?? driver?.payroll?.federalTax)}</td>
                    <td className="py-0.5 text-right">{fmt(taxes.federalWH?.ytd ?? taxes.federal ?? driver?.payroll?.federalTax)}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5" colSpan={4}>Medicare</td>
                    <td className="py-0.5 text-right">{fmt(taxes.medicare?.currentPeriod ?? taxes.medicare ?? driver?.payroll?.medicare)}</td>
                    <td className="py-0.5 text-right">{fmt(taxes.medicare?.ytd ?? taxes.medicare ?? driver?.payroll?.medicare)}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5" colSpan={4}>Social Security</td>
                    <td className="py-0.5 text-right">{fmt(taxes.socialSecurity?.currentPeriod ?? taxes.socialSecurity ?? driver?.payroll?.socialSecurity)}</td>
                    <td className="py-0.5 text-right">{fmt(taxes.socialSecurity?.ytd ?? taxes.socialSecurity ?? driver?.payroll?.socialSecurity)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Deductions + Net Pay ── */}
            <div className="px-6 mb-3">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-1 font-semibold text-left">Deductions</th>
                    <th colSpan={3}></th>
                    <th className="py-1 font-semibold text-right">Current Period</th>
                    <th className="py-1 font-semibold text-right">Year To Date</th>
                  </tr>
                </thead>
                <tbody>
                  {deductions.length > 0 ? deductions.map((d, i) => (
                    <tr key={i}>
                      <td className="py-0.5" colSpan={4}>{d.type || d.description}</td>
                      <td className="py-0.5 text-right">{fmt(d.currentPeriod)}</td>
                      <td className="py-0.5 text-right">{fmt(d.ytd)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} className="border-b border-gray-300 py-1"></td></tr>
                  )}
                  <tr className="border-t border-gray-300 font-semibold">
                    <td className="py-1.5" colSpan={4}>Net Pay</td>
                    <td className="py-1.5 text-right">{fmt(s.netPay)}</td>
                    <td className="py-1.5 text-right">{fmt(s.netPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Net Pay Distribution ── */}
            <div className="px-6 mb-3">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-1 font-semibold text-left">Net Pay Distribution</th>
                    <th colSpan={3}></th>
                    <th className="py-1 font-semibold text-right">Current Period</th>
                    <th className="py-1 font-semibold text-right">Year To Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-0.5" colSpan={4}>{s.paymentMethod || 'Direct Deposit Net Check'}</td>
                    <td className="py-0.5 text-right">{fmt(s.netPay)}</td>
                    <td className="py-0.5 text-right">{fmt(s.netPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Benefits ── */}
            <div className="px-6 mb-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-1 font-semibold text-left">Employee Benefits, Allowances, and Others</th>
                    <th className="py-1 font-semibold text-right">Current Period</th>
                    <th className="py-1 font-semibold text-right">Year To Date</th>
                    <th className="py-1 font-semibold text-right">YTD Taken</th>
                    <th className="py-1 font-semibold text-right">Available</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-0.5">Hourly Paid Time Off Hours</td>
                    <td className="py-0.5 text-right">{fmt(pto.currentPeriod ?? 0)}</td>
                    <td className="py-0.5 text-right">{fmt(pto.ytd ?? 0)}</td>
                    <td className="py-0.5 text-right">{fmt(pto.ytdTaken ?? 0)}</td>
                    <td className="py-0.5 text-right">{fmt(pto.available ?? 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Check Stub (pink section) ── */}
            <div className="mx-4 mb-4 border-2 border-red-400 rounded bg-red-50 p-4">
              <div>
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-0.5">
                  <p className="font-bold text-sm">ROUTE IQ</p>
                  <p>{companyAddress}</p>
                  <p>{companyCity}</p>
                  {companyPhone && <p>{companyPhone}</p>}
                  <p>Dept: {empDept}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p>Voucher No. <span className="font-semibold">{p.voucherNo || '—'}</span></p>
                  <p>DATE: {payDate}</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-red-300 pt-2 mb-1">
                <span className="font-bold text-sm">Net Pay</span>
                <span className="font-bold text-sm">{fmt(s.netPay)}</span>
              </div>
              <p className="italic mb-3">{toWords(s.netPay)}</p>
              <div className="flex justify-between items-end">
                <div className="space-y-0.5">
                  <p className="font-semibold">{empName}</p>
                  <p>{empAddress}</p>
                  <p>{empCity}</p>
                </div>
                <div className="text-right">
                  <p>For Record Purpose Only</p>
                  <p className="font-bold">**NON-NEGOTIABLE**</p>
                </div>
              </div>
              </div>
            </div>

          </div>
        ) : loaded ? (
          <p className="text-gray-500 py-8 text-center">No paystub found.</p>
        ) : null}
      </div>
    </div>
  );
}
