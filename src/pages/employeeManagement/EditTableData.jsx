import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveDriverDetails } from '@/redux/slices/payrollSlice';
import toast from 'react-hot-toast';

const cn = (c) => "outline-none border border-[#D5D5D5] rounded-[6px] py-3 px-6 w-full bg-[#F5F6FA]";

export default function EditTableData({ handleClose, driver }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    positionType: 1,
    payCycleId: 1,
    payTypeId: 1,
    payGrade: '',
    routeRate: '',
    tripRate: '',
    ssn: '',
    totalHours: '',
    federalTaxRate: '',
    stateTaxRate: '',
    localTaxRate: '',
    holidayPay: '',
    allowances: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!driver) return;
    const p = driver.payroll || {};
    setFormData({
      name: driver.name ?? '',
      positionType: driver.positionType ?? 1,
      payCycleId: driver.payCycleId ?? 1,
      payTypeId: driver.payTypeId ?? 1,
      payGrade: driver.payGrade ?? '',
      routeRate: driver.routeRate ?? '',
      tripRate: driver.tripRate ?? '',
      ssn: driver.ssn ?? '',
      totalHours: p.totalHours ?? '',
      federalTaxRate: p.federalTaxRate ?? '',
      stateTaxRate: p.stateTaxRate ?? '',
      localTaxRate: p.localTaxRate ?? '',
      holidayPay: '',
      allowances: '',
    });
  }, [driver]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driver?.employeeId) return;
    setSaving(true);
    try {
      const payload = {};
      if (formData.name) payload.name = formData.name;
      if (formData.positionType != null) payload.positionType = Number(formData.positionType);
      if (formData.payCycleId != null) payload.payCycleId = Number(formData.payCycleId);
      if (formData.payTypeId != null) payload.payTypeId = Number(formData.payTypeId);
      if (formData.payGrade) payload.payGrade = String(formData.payGrade);
      if (formData.routeRate !== '') payload.routeRate = Number(formData.routeRate);
      if (formData.tripRate !== '') payload.tripRate = Number(formData.tripRate);
      if (formData.ssn) payload.ssn = String(formData.ssn);
      if (formData.totalHours !== '') payload.totalHours = Number(formData.totalHours);
      if (formData.federalTaxRate !== '') payload.federalTaxRate = Number(formData.federalTaxRate);
      if (formData.stateTaxRate !== '') payload.stateTaxRate = Number(formData.stateTaxRate);
      if (formData.localTaxRate !== '') payload.localTaxRate = Number(formData.localTaxRate);
      if (formData.holidayPay !== '') payload.holidayPay = Number(formData.holidayPay);
      if (formData.allowances !== '') payload.allowances = Number(formData.allowances);

      await dispatch(saveDriverDetails({ employeeId: driver.employeeId, data: payload })).unwrap();
      toast.success('Driver details updated.');
      handleClose();
    } catch (err) {
      toast.error(err?.message || err || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (!driver) return null;

  return (
    <>
      <h3 className="text-[24px] font-bold text-[#2C2F32] mt-4 mb-4 w-[100%]">Edit</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white w-full rounded-lg">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-row w-full gap-6 p-6">
            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Title</label>
                <select className={cn()} value={formData.positionType} onChange={(e) => handleChange('positionType', e.target.value)}>
                  <option value={1}>Driver</option>
                  <option value={2}>Mechanic</option>
                  <option value={3}>Accountant</option>
                  <option value={4}>Manager</option>
                  <option value={5}>Terminal Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Pay Cycle</label>
                <select className={cn()} value={formData.payCycleId} onChange={(e) => handleChange('payCycleId', e.target.value)}>
                  <option value={1}>Weekly</option>
                  <option value={2}>Bi-weekly</option>
                  <option value={3}>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Federal Tax Rate</label>
                <input type="number" step="0.01" className={cn()} value={formData.federalTaxRate} onChange={(e) => handleChange('federalTaxRate', e.target.value)} placeholder="e.g. 0.22" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">SSN</label>
                <input type="text" className={cn()} value={formData.ssn} onChange={(e) => handleChange('ssn', e.target.value)} />
              </div>
            </div>
            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Name</label>
                <input type="text" className={cn()} value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Pay Type</label>
                <select className={cn()} value={formData.payTypeId} onChange={(e) => handleChange('payTypeId', e.target.value)}>
                  <option value={1}>Hourly</option>
                  <option value={2}>Salary</option>
                  <option value={3}>Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">State Tax Rate</label>
                <input type="number" step="0.01" className={cn()} value={formData.stateTaxRate} onChange={(e) => handleChange('stateTaxRate', e.target.value)} placeholder="e.g. 0.05" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">YTD</label>
                <input type="text" className={cn()} value={driver.ytd != null ? `$${Number(driver.ytd).toFixed(2)}` : '—'} readOnly disabled />
              </div>
            </div>
            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Work Hours</label>
                <input type="number" step="0.1" className={cn()} value={formData.totalHours} onChange={(e) => handleChange('totalHours', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Pay Grade</label>
                <input type="text" className={cn()} value={formData.payGrade} onChange={(e) => handleChange('payGrade', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Local Tax Rate</label>
                <input type="number" step="0.001" className={cn()} value={formData.localTaxRate} onChange={(e) => handleChange('localTaxRate', e.target.value)} placeholder="e.g. 0.015" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Holiday Pay</label>
                <input type="number" step="0.01" className={cn()} value={formData.holidayPay} onChange={(e) => handleChange('holidayPay', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="px-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Route Rate</label>
              <input type="number" step="0.01" className={cn()} value={formData.routeRate} onChange={(e) => handleChange('routeRate', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Trip Rate</label>
              <input type="number" step="0.01" className={cn()} value={formData.tripRate} onChange={(e) => handleChange('tripRate', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Allowances</label>
              <input type="number" step="0.01" className={cn()} value={formData.allowances} onChange={(e) => handleChange('allowances', e.target.value)} />
            </div>
          </div>
          <div className="mt-6 flex justify-start space-x-4 p-6">
            <button type="button" onClick={handleClose} className="px-8 py-2 border border-[#C01824] w-[45%] text-red-600 rounded">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-8 py-2 bg-[#C01824] w-[45%] text-white rounded hover:bg-red-700 disabled:opacity-60">
              {saving ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
