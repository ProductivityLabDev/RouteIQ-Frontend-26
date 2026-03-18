import { useMemo } from 'react';
import routeiqFav from '@/assets/routeiq-fav.png';

function SharedPayStubModal({ paystub, fallbackDriver, onClose, loading = false }) {
  if (!paystub && !loading) return null;

  const fmt = (v) => (v != null && v !== '' ? Number(v).toFixed(2) : '0.00');

  const toWords = (amount) => {
    if (!amount) return 'Zero And 00/100 Dollars';
    const [dollars, cents] = Number(amount).toFixed(2).split('.');
    return `${Number(dollars).toLocaleString()} And ${cents}/100 Dollars`;
  };

  const fallback = fallbackDriver || {};
  const p = paystub;

  const derived = useMemo(() => {
    if (!p) return null;

    if (p.summary || p.company || p.earnings || p.taxes || p.deductions) {
      return p;
    }

    return {
      voucherNo: p.voucherNo,
      employee: {
        employeeId: p.employee?.employeeId,
        name: p.employee?.name,
        payBasis: p.employee?.payType,
        dept: p.employee?.terminal,
      },
      company: {
        name: 'ROUTE IQ',
        dept: p.employee?.terminal,
      },
      period: {
        start: p.period?.start,
        end: p.period?.end,
        totalHours: p.period?.totalHours,
      },
      summary: {
        grossPay: p.summary?.grossPay,
        netPay: p.summary?.netPay,
        paymentMethod: p.summary?.paymentMethod,
      },
      earnings: [
        {
          type: 'Route Pay',
          rate: p.earnings?.routeRate,
          hours: p.period?.totalHours,
          currentPeriod: p.summary?.grossPay,
          ytd: p.summary?.grossPay,
        },
      ],
      taxes: {
        federalWH: { currentPeriod: p.withholdings?.federal?.amount, ytd: p.withholdings?.federal?.amount },
        medicare: { currentPeriod: p.withholdings?.medicare?.amount, ytd: p.withholdings?.medicare?.amount },
        socialSecurity: { currentPeriod: p.withholdings?.socialSecurity?.amount, ytd: p.withholdings?.socialSecurity?.amount },
      },
      deductions: p.summary?.totalDeductions
        ? [{ type: 'Deductions', currentPeriod: p.summary.totalDeductions, ytd: p.summary.totalDeductions }]
        : [],
      benefits: {
        pto: { currentPeriod: 0, ytd: 0, ytdTaken: 0, available: p.benefits?.ptoAllowanceDays ?? 0 },
      },
    };
  }, [p]);

  const data = derived;
  const s = data?.summary || {};
  const emp = data?.employee || {};
  const company = data?.company || {};
  const period = data?.period || {};
  const earnings = data?.earnings || [];
  const taxes = data?.taxes || {};
  const deductions = data?.deductions || [];
  const pto = data?.benefits?.pto || {};

  const empName = emp.name || fallback?.name || '--';
  const empNumber = emp.empNumber || emp.employeeId || fallback?.employeeId || '--';
  const empDept = emp.dept || company.dept || '--';
  const empPayBasis = emp.payBasis || fallback?.payType || '--';
  const empAddress = emp.address || '--';
  const empCity = emp.city || '--';
  const companyName = company.name || 'ROUTE IQ';
  const companyAddress = company.address || '1235 Taylor St';
  const companyCity = company.city || 'Lorem Ipsum dolor';
  const companyPhone = company.phone || '';
  const periodStart = period.start || fallback?.periodStart || '--';
  const periodEnd = period.end || fallback?.periodEnd || '--';
  const payDate = period.payDate || '--';
  const totalHours = period.totalHours ?? fallback?.payroll?.totalHours ?? '--';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl relative max-h-[90vh] overflow-y-auto rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-3 right-4 text-gray-500 text-xl font-bold z-10" onClick={onClose}>×</button>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading paystub...</div>
        ) : data ? (
          <div className="font-sans text-xs text-gray-800">
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
                  )) : null}
                  <tr className="border-t border-gray-300 font-semibold">
                    <td className="py-1 text-right pr-2" colSpan={2}>Gross</td>
                    <td className="py-1 text-right">{totalHours}</td>
                    <td className="py-1 text-right">{fmt(s.grossPay)}</td>
                    <td className="py-1 text-right">{fmt(s.grossPay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
                    <td className="py-0.5 text-right">{fmt(taxes.federalWH?.currentPeriod ?? taxes.federal)}</td>
                    <td className="py-0.5 text-right">{fmt(taxes.federalWH?.ytd ?? taxes.federal)}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5" colSpan={4}>Medicare</td>
                    <td className="py-0.5 text-right">{fmt(taxes.medicare?.currentPeriod ?? taxes.medicare)}</td>
                    <td className="py-0.5 text-right">{fmt(taxes.medicare?.ytd ?? taxes.medicare)}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5" colSpan={4}>Social Security</td>
                    <td className="py-0.5 text-right">{fmt(taxes.socialSecurity?.currentPeriod ?? taxes.socialSecurity)}</td>
                    <td className="py-0.5 text-right">{fmt(taxes.socialSecurity?.ytd ?? taxes.socialSecurity)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
                    <p>Voucher No. <span className="font-semibold">{data?.voucherNo || '--'}</span></p>
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
        ) : (
          <p className="text-gray-500 py-8 text-center">No paystub found.</p>
        )}
      </div>
    </div>
  );
}

export default SharedPayStubModal;
